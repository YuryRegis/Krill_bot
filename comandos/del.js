const getID            = require('../funcoes/ids.json'),
      { verificaPerm } = require('../funcoes/members');


//comando para apagar multiplas mensagens
exports.run = async (client, message, args) => {
    
    const salaAtual = await message.channel;
    const salaLogs  = await client.channels.cache.get(getID.sala.LOGS),
          permissao = await verificaPerm(message.member);

    if(!permissao)
        return message.reply("te falta **poderes** para usar este comando!");

    else {
        try {
            let num = 2;
            if(!isNaN(args[0]))
                num = parseInt(args[0]) + 1;

            let captura = await salaAtual.messages.fetch({limit: num});
            
            salaAtual.bulkDelete(parseInt(captura.size), true)
                .then(async messages => {
                    console.log(`${(messages.size - 1)} deletadas por ${message.author.username}`);
                    salaLogs.send(`${(messages.size - 1)} deletadas por ${message.author.username}`);
                    const m = await salaAtual.send(`${num} mensagens apagadas...`);
                    await m.delete({ timeout: 3000 });
                })
                .catch(err => { 
                    salaLogs.send(`Terminal \`!del\` \`\`\`${err}\`\`\``);
                    console.log("BulkDelete error -> ",err);
                });
        } 
        catch(err) {
            console.log(err);
            salaLogs.send("MessageDelete error:\n"+`\`\`\`${err.code}\`\`\``);
        }
    }
}

exports.help = {
    name: "del"
}
