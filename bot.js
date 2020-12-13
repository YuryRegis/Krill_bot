const queue = new Map();
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const getID = require('./funcoes/ids.json');
const config = require("./config.json");
const { verificaRoles } = require('./funcoes/roles'); 
const messageHandler = require("./messageHandler.cjs");
const { verificaPalavrao } = require('./funcoes/funcoes');
const { setRole, rmvAddLog, mbrUPD, prsUPD } = require("./funcoes/funcoes");



client.commands = new Discord.Collection(); //Cria coleção de comandos

//carregando arquivos de comandos para coleção criada
fs.readdir("./comandos/",(erro, arquivo) => {
	if(erro) console.error(erro);
	let arquivojs = arquivo.filter(f => f.split(".").pop() == "js");
	arquivojs.forEach((arq, i) => {
		let prop = require(`./comandos/${arq}`);
		console.log(`Comando ${arq} carregado com sucesso.`);
		client.commands.set(prop.help.name, prop);
	});
});


client.on("ready", () => {
    console.log(`Bot iniciado! ${client.users.size} usuários, ${client.channels.size} canais e ${client.guilds.size} servidores.`);
	client.user.setActivity(`Sky: Filhos da luz`);
})


client.on("guildCreate", guild => {
    console.log(`O bot entrou no servidor ${guild.name} id:${guild.id} com ${guild.memberCount} membros.`);
    client.user.setActivity(`Estou em ${guilds.size} servidores!`);
})


client.on("guildDelete", guild => {
    console.log(`Bot removido do servidor ${guild.name} id: ${guild.id}`);
    client.user.setActivity(`Estou em ${guilds.size} servidores.`);
})


client.on("raw", async data => {
	let regrasID   = getID.sala.REGRAS,
	    servidorID = getID.SERVIDOR;

	if(data.t === "MESSAGE_REACTION_ADD" || data.t === "MESSAGE_REACTION_REMOVE") {
		if(data.d.message_id !== regrasID) return
		setRole(client, data, servidorID);
		return;
	}

	let salaLogs = await client.channels.cache.get(getID.sala.LOGS);
	
	if(data.t === 'GUILD_MEMBER_REMOVE' || data.t === 'GUILD_MEMBER_ADD') {
		let resposta = "";
		(data.t === 'GUILD_MEMBER_REMOVE') ? resposta = await rmvAddLog(data, false) : resposta = await rmvAddLog(data, true);   
		salaLogs.send(resposta);
	}

	if(data.t === 'PRESENCE_UPDATE') {
		if(data.d===undefined) return;
		
		let resposta = await prsUPD(data, client);

		if(resposta!==null) return salaLogs.send(resposta);
	}


	if(data.t === 'GUILD_MEMBER_UPDATE') {
		let resposta = await mbrUPD(data, client);

		if(resposta!==null) return salaLogs.send(resposta);
	}
})


client.on("message", async message => {
	let bemVindo = getID.sala.BEMVINDO,
		mais18   = getID.sala.MAIS18,
		salatual = message.channel.id,
		mbr      = message.member;
	    
	if (salatual === bemVindo) { 
		let verificacao = await (verificaRoles(mbr, [getID.cargo.ANDROID, getID.cargo.APPLE, getID.cargo.BETA, getID.cargo.GLOBAL]));
		if(!verificacao) {
			let salaRegras = await message.guild.channels.cache.get(getID.sala.REGRAS);
			
			message.reply(`para ter acesso ao servidor, você precisa **aceitar** nossos termos e ${salaRegras}.`,
				{ file:"https://i.ibb.co/GVwYx24/regras.png" });
			return;
		}
	}

	if(salatual !== mais18) {
		let palavroes = await verificaPalavrao(message),
		    permissao = await verificaRoles(mbr, [getID.cargo.ADMIN]);

		if(palavroes && !permissao) {
			let salaAviso = await message.guild.channels.cache.get(getID.sala.LOGS),
				origem    = await message.guild.channels.cache.get(salatual);
				
			message.delete();

			salaAviso.send(`\`\`\`Detectei uma palavra de baixo calão ou na sala ${origem}
			Autor: ${mbr.user.tag} (${mbr.user.username})
			Detectado: ${palavroes}\`\`\``);

			return message.reply(`\`\`\`Detectei uma ou mais palavras de baixo calão ou intenção de ofensa.\n
			Seja gentil e respeitoso, sujeito à ficar silenciado em caso de reincidência.\`\`\``);

		}
	}

	if(message.channel.type === "dm") return; //ignora mensagens diretas
	
	messageHandler.run(message, queue, client);
	return undefined;
});


client.on("guildMemberAdd", async member => {
	newmember.run(member, client);
});

client.on('messageReactionAdd', (reaction, user) => {
	if (user.bot) return;
	//reactionHandler.run(reaction, user);
})

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('Conectado no canal de voz'));

client.on('disconnect', () => console.log('Desconectado do canal de voz, até breve!'));

client.on('reconnecting', () => console.log('Reconectando...'));


client.login(config.token);
