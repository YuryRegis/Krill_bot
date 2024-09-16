const queue = new Map();
const fs = require("fs");
const path = require('node:path');
const Discord = require("discord.js");
const client = new Discord.Client({intents: [53608447]});
const getID = require('./funcoes/ids.json');
const {run: errorLog} = require('./funcoes/errorHandler');
const config = require("./config.json");
const { verificaRoles } = require('./funcoes/roles')
const messageHandler = require("./messageHandler.cjs");
const {run: interactionHandler} = require("./interactionHandler.cjs");
const {run: buttonHandler} = require("./buttonHandler.cjs");
const { verificaPalavrao } = require('./funcoes/funcoes');
const { setRole, rmvAddLog, mbrUPD, prsUPD } = require("./funcoes/funcoes");
const { channelsCollection, updatechannels } = require("./models/channels");
const { rolesCollection } = require("./models/roles");
const {configIdHandler} = require("./funcoes/configIdHandler.cjs");


client.commands = new Discord.Collection(); //Cria coleção de comandos

//carregando arquivos de comandos para coleção criada
fs.readdir("./comandos/",(erro, arquivo) => {
	if(erro) errorLog({message: '[ReadDir] Erro ao carregar lista de comandos.', client, erro});
	let arquivojs = arquivo.filter(f => f.split(".").pop() == "js");
	arquivojs.forEach((arq, i) => {
		let prop = require(`./comandos/${arq}`);
		console.log(`Comando ${arq} carregado com sucesso.`);
		client.commands.set(prop.help.name, prop);
	});
});

//carregando arquivos de comandos slash para coleção criada
const slashCommands = [];
const foldersPath = path.join(__dirname, 'slash');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(foldersPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		slashCommands.push(command.data.toJSON());
		client.commands.set(command.data.name, command);
		console.log(`Slash command ${command.data.name} carregado com sucesso.`);
	} else {
		errorLog({message: `[WARNING] The command at ${command.data.name} is missing a required "data" or "execute" property.`, client});
	}
}
const rest = new Discord.REST().setToken(config.token);
(async () => {
	try {
		console.log(`Started refreshing ${slashCommands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Discord.Routes.applicationCommands(config.id),
			{ body: slashCommands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		errorLog({message: '[REST] Erro ao carregar lista slash commands.', client, error});
	}
})();


client.on("ready", () => {
	try {
		console.log(`Bot iniciado! ${client.users.cache.size} usuários, ${client.channels.cache.size} canais e ${client.guilds.cache.size} servidores.`);
		client.user.setActivity(`Sky: Filhos da luz`);
	} catch (error) {
		errorLog({message: 'READY_EVENT_ERROR:', client, error});
	}
});


client.on(Discord.Events.InteractionCreate, async interaction => {
	try {
		if (interaction.isStringSelectMenu()) {
			return interactionHandler(client, interaction);
		};
		if (interaction.isButton()) {
			return buttonHandler(client, interaction);
		}
		if (interaction.isModalSubmit()) {
			return configIdHandler(client, interaction);
		}
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			return errorLog({
				client, 
				message: 'INTERACTION_CREATE_EVENT_ERROR:', 
				error: `No command matching ${interaction.commandName} was found.`
			});
		}
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		errorLog({message: 'INTERACTION_CREATE_EVENT_ERROR:', client, error});
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: false });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: false });
		}
	}
});


client.on("guildCreate", guild => {
	try {
		console.log(`O bot entrou no servidor ${guild.name} id:${guild.id} com ${guild.memberCount} membros.`);
	}
	catch (error) {
		errorLog({message: 'GUILD_CREATE_ERROR:', client, error});
	}
})


client.on("guildDelete", guild => {
	try {
		console.log(`Bot removido do servidor ${guild.name} id: ${guild.id}`);
	} catch (error) {
		errorLog({message: 'GUILD_DELETE_ERROR:', client, error});
	}
})


client.on("raw", async data => {
	try {
		const channelsIds = await channelsCollection();
		let regrasID   = channelsIds.REGRAS,
			servidorID = getID.SERVIDOR;

		if(data.t === "MESSAGE_REACTION_ADD" || data.t === "MESSAGE_REACTION_REMOVE") {
			if(data.d.message_id !== regrasID) return
			setRole(client, data, servidorID);
			return;
		}

		let salaLogs = await client.channels.cache.get(channelsIds.LOGS);
		
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
	} catch (error) {
		errorLog({message: 'RAW_EVENT_ERROR:', client, error});
	}
})


client.on("messageCreate", async message => {
	try {
		const rolesIds = await rolesCollection();
		const channelsIds = await channelsCollection();

		// verifica se é uma mensagem do bot
		if (message.author.bot) return;
		
		//ignora mensagens diretas
		if(message.channel.type === "dm") return; 

		// console.log('MENSAGEM >>>>', message);
		let mais18   = channelsIds.MAIS18,
			salatual = message.channel.id,
			mbr      = message.member;
		
		if(salatual !== mais18) {
			const palavroes = await verificaPalavrao(message);
			const permissao = await verificaRoles(mbr, [rolesIds.ADMIN, rolesIds.STAFF, rolesIds.MODERADOR]);
			
			if(palavroes && !permissao) {
				let salaAviso = await message.guild.channels.cache.get(channelsIds.LOGS),
					origem    = await message.guild.channels.cache.get(salatual);

				salaAviso.send(`Detectei uma palavra de baixo calão ou na sala ${origem}\`\`\`
	Autor:     ${mbr.user.tag} (${mbr.user.username})
	Detectado: ${palavroes}
	Conteúdo:  ${message.toString()}\`\`\``);

				const embed = new Discord.EmbedBuilder()
					.setColor("#237feb")
					.setTitle('SEM CONTEÚDO INAPROPRIADO (NSFW E OUTROS)')
					.setThumbnail('https://i.ibb.co/6RKGTjC/LogoTSGB.png')
					.setDescription('Sky trata-se de um jogo para toda a família. Pedimos que você filtre todos os tópicos obscenos e adultos neste espaço compartilhado da comunidade. Observe que isso inclui nomes de usuários e escolhas de avatar.')
					.addFields(
						{
							name: 'Atenção',
							value: `Sua mensagem foi bloqueada por conteúdo inapropriado.` 
						},
						{
							name: 'Observação',
							value: `Caso não seja um palavrão, reporte para a nossa equipe abrindo um Ticket usando o comando \`/Ticket\` ou \`!privado\`.\n\nPor favor, verifique novamente nossas https://discord.com/channels/603720312911167622/603728556262031365`
						}
					).setFooter({text:`${message.guild.name} - Tudo sobre Sky`});
				
				const reply = await message.reply({embeds: [embed]});
				await message.delete();
				setTimeout(() => {
					reply.delete();
				}, 300000);
				return;
			}
		}
		
		messageHandler.run(message, queue, client);
		return;
	} catch (error) {
		errorLog({message: 'MESSAGE_HANDLER_ERROR:', client, error});
	}
});

client.on("guildMemberAdd", async member => {
	try { 
		newmember.run(member, client);
	} catch (error) {
		errorLog({message: 'GUILD_MEMBER_ADD_ERROR:', client, error});
	}
});


client.on('messageReactionAdd', (reaction, user) => {
	try {
		if (user.bot) return;
		//reactionHandler.run(reaction, user);
	} catch (error) {
		errorLog({message: 'REACTION_ADD_ERROR:', client, error});
	}
})


client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('Conectado no canal de voz'));

client.on('disconnect', () => console.log('Desconectado do canal de voz, até breve!'));

client.on('reconnecting', () => console.log('Reconectando...'));


client.login(config.token);
