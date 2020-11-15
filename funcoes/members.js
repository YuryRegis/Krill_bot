const { verificaRole } = require('../funcoes/roles');


module.exports = {

    verificaPerm: function(member) {
        
        if(verificaRole(member, "Admin") || verificaRole(member, "Staff") || verificaRole(member, "Moderador"))
             return true;
        else
            return false;
    },


    // recebe um tipo User e retorna um guildMember.
    userToMember: async function (user, message) {  
        const member = await message.guild.members.cache.get(user.id);
        return member;
    }
}