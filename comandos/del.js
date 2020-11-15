const getID            = require('../funcoes/ids.json'),
      { verificaPerm } = require('../funcoes/members');


//comando para apagar multiplas mensagens
exports.run = async (client, message, args) => {
    
    const salaAtual = message.channel;
    const salaLogs  = client.channels.cache.get(getID.sala.LOGS2);

    if(verificaPerm(message.member)) {
        try {
            let num = 2;
            if(!isNaN(args[0]))
                num = parseInt(args[0]) + 1;

            let captura = await salaAtual.messages.fetch({limit: num});
            await salaAtual.bulkDelete(captura);
                             
            const m = await salaAtual.send(`${num} mensagens apagadas...`);
            
            m.delete(30000)
                .catch(err => { salaLogs.send(`Terminal \`!del\` \`\`\`${err}\`\`\``) });
        } 
        catch(err) {
            console.log(err);
            salaLogs.send("MessageDelete error:\n"+`\`\`\`${err.code}\`\`\``);
        }
    } else { message.reply(` você não possui permissão para usar este comando.`) }
}

exports.help = {
    name: "del"
}
