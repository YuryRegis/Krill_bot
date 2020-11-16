
const { verificaRole, verificaRoles } = require('../funcoes/roles'),
      getID            = require('../funcoes/ids.json');


exports.help = {
    name: "desmutar"
}

exports.run = async (client, message, args) => {
    console.log("desmutando")
    if(await verificaRoles(message.member, [getID.cargo.ADMIN, getID.cargo.STAFF])) {
        let canal = await client.channels.cache.get(getID.sala.LOGS);
        
        // Captura pessoa mencionada na mensagem
        var rebelde = await message.guild.members.cache.get(`${message.mentions.users.first().id}`);
        
        // Verifica se ela foi silenciada
        let id = getID.cargo.SILENCIADOS;
        if (await verificaRole(rebelde, id)) {
            await rebelde.roles.remove(id);
            
            // notificando rebelde desmutado
            await rebelde.send(`Você não está mais silenciado.\n`+
            `Cuide para ter um bom relacionamento com seus colegas.\n`+
            `Vamos fazer, juntos, o **nosso servidor** ser um lugar **agradavel para todos.** `)
                .then()
                .catch(err => {
                    console.log(err);
                    canal.send(`!desmutar error\nNão é possível enviar mensagem privada\n\`\`\`${err}\`\`\``);
                });
            
            await message.delete(); 
            return canal.send(`\`${message.author}\` removeu silenciar de ${rebelde.displayName}.`);
        } 
        else return message.reply(`o usuário ${rebelde.displayName} precisa estar silenciado para usar !desmutar.`);       
    } 
}
