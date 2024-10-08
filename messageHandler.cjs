const getID             = require('./funcoes/ids.json'),
    //   { verificaVIP }   = require('./comandos/assets/loto/ticket'),
      { verificaRole, verificaRoles } = require('./funcoes/roles');

exports.run = async (message, queue, client) => {
	try {
		if (!message || !queue || !client) return;

		const 	config         = require("./config.json"),
				serverQueue    = queue?.get(message?.guild?.id),
				salaLogs       = await client?.channels?.cache?.get(getID.sala.LOGS),
				//   radio          = await client.channels.cache.get(getID.sala.RADIO),
				args           = message?.content?.slice(config.prefix.length).trim().split(/ +/g);
			
		let sender  = message?.author, //Captura autor da mensagem
			user    = message?.member?.user?.tag,
			comando = args?.shift()?.toLowerCase(),
			ch      = message?.channel?.name?.toString();
		
		
		//Restringindo canal comandos_bot
		if(message?.channel?.id === getID.sala.CMDBOT) {
			
			let permissao = await verificaRole(message?.member, getID.cargo.ADMIN);
			if(!permissao) {
				console.log(`usuário não permitido. Apagando mensagem de ${sender}...`)	
				message.delete();
				return;	
			}
		}

		//restringindo chat nos canais de imagens e vídeos	
		if(message?.channel?.id === getID.sala.FOTOS || message?.channel?.id === getID.sala.FOTOSBETA) {
			let permissao = await verificaRoles(message?.member, [getID.cargo.ADMIN, getID.cargo.STAFF, getID.cargo.MODERADOR]);
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


		if(client?.commands?.get(comando)) {  //Comando === comandos previamente carregados?
			
			if (message?.content[0] === config.prefix) {
				//verificaVIP(message);
				
				console.log(`${comando} digitado por ${user} no canal ${ch}.`);

				if(comando !== 'denuncia')
					salaLogs.send(`${comando} digitado por ${user} no canal ${ch}.`);
					
				client.commands.get(comando).run(client, message, args, queue, serverQueue);
			} else return;
		} 
		
		//filtrar menções here e everyone
		if(message?.mentions?.everyone) {
			//verifica se é Admin ou Staff e notifica no cosole quem e onde usou @Everyone
			let permissao = await verificaRoles(message?.member, [getID.cargo.ADMIN, getID.cargo.STAFF, getID.cargo.MODERADOR]);
			if(permissao || sender.bot)
				return console.log(`${usuario} notificou todos em uma mensagem em ${ch}.`);        
			
			const reply = await message.reply(` você não tem permissão para marcar todos nesta mensagem.`);
			reply.delete(30000);
			await message.delete();
		}
	} catch (error) {
		console.log(`COMMAND_HANDLER_ERROR: ${error}`);
	}	
}