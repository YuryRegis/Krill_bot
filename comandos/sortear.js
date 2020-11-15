

exports.help = {
    name: "sortear"
}


exports.run = async (client, message, args) => {

    if(isNaN(args[0]))
        return message.reply(`${args[0]} não é um ID de mensagem válido.`);
    
    const msgID   = args[0],
          msgAlvo = await message.channel.messages.fetch(msgID);

    console.log(`MESSAGE--> ${msgAlvo}`)
}   