//  const { verificaVIP }   = require('./comandos/assets/loto/ticket');
const { verificaRole, verificaRoles } = require('./funcoes/roles');
const errorLog = require('./funcoes/errorHandler');
const logMessage = require('./funcoes/logHandler');
const {channelsCollection} = require('./models/channels');
const {rolesCollection} = require('./models/roles');


exports.run = async (message, queue, client) => {
	try {
		const channelsIds = await channelsCollection();
		const rolesIds = await rolesCollection();

		if (!message || !queue || !client) return;

		const 	config         = require("./config.json"),
				serverQueue    = queue?.get(message?.guild?.id),
				args           = message?.content?.slice(config.prefix.length).trim().split(/ +/g);
			
		let sender  = message?.author, //Captura autor da mensagem
			user    = message?.member?.user?.username,
			comando = args?.shift()?.toLowerCase(),
			ch      = message?.channel?.name?.toString();
		
		//Restringindo canal comandos_bot
		if(message?.channel?.id === channelsIds.CMDBOT) {
			
			let permissao = await verificaRole(message?.member, rolesIds.ADMIN);
			if(!permissao) {
				console.log(`usuário não permitido. Apagando mensagem de ${sender}...`)	
				message.delete();
				return;	
			}
		}

		//restringindo chat nos canais de imagens e vídeos	
		if(message?.channel?.id === channelsIds.FOTOS || message?.channel?.id === channelsIds.FOTOSBETA) {
			let permissao = await verificaRoles(message?.member, [rolesIds.ADMIN, rolesIds.STAFF, rolesIds.MODERADOR]);
			if(!permissao && !message?.author?.bot) { //verifica roles
				if(message?.embeds?.length > 0) return;
				if(message?.attachments?.size == 0) { 	//verificando se é um link válido
					let extensions = ["jpg","png","gif","mp4","mov","mkv","bmp"]
					var splited = message?.content?.split(".")
					for(e in extensions) {
						console.log(extensions[e], splited[splited.length-1])
						if(extensions[e] == splited[splited.length-1]) return console.log("link valido");
					}
					const r = await message.reply("este canal só permite postagens de vídeos ou imagens.\n" +
					"Textos só serão permitidos na descrição da imagem ou vídeo postado.\n" +
					"Use os canais de chat para iniciar uma discussão, elogiar ou comentar.\n" +
					"Conto com sua compreensão e colaboração. :abraco:");
					r.delete(60000);
					return message.delete();				
				} //fim verifcação link valido
				else return;	
			} //fim verificação de roles
		}
		const serverCommand = client.commands.get(comando);
		if(serverCommand) {  //Comando === comandos previamente carregados?
			if (message?.content[0] === config.prefix) {
				//verificaVIP(message);
				
				const warningMessage = `Comando ${comando} usado por ${user} no canal ${ch}.`;
				console.log(warningMessage);

				if(comando !== 'denuncia')
					logMessage.run({message: warningMessage, client});
					
				serverCommand.run(client, message, args, queue, serverQueue);
			} else return;
		} 
		
		//filtrar menções here e everyone
		if(message?.mentions?.everyone) {
			//verifica se é Admin ou Staff e notifica no cosole quem e onde usou @Everyone
			let permissao = await verificaRoles(message?.member, [rolesIds.ADMIN, rolesIds.STAFF, rolesIds.MODERADOR]);
			if(permissao || sender.bot)
				return console.log(`${usuario} notificou todos em uma mensagem em ${ch}.`);        
			
			const reply = await message.reply(` você não tem permissão para marcar todos nesta mensagem.`);
			reply.delete(30000);
			await message.delete();
		}
	} catch (error) {
		errorLog.run({message: 'COMMAND_HANDLER_ERROR:', client, error});
	}	
}