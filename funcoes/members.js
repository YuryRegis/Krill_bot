const { verificaRole } = require('../funcoes/roles'),
      getID            = require('../funcoes/ids.json');


module.exports = {

    verificaPerm: function(member) {
        
        if( verificaRole(member, getID.cargo.ADMIN) || 
            verificaRole(member, getID.cargo.STAFF) ||
            verificaRole(member, getID.cargo.MODERADOR) )
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