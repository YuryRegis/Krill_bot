const { verificaRoles } = require('../funcoes/roles');
const {rolesCollection} = require('../models/roles');


module.exports = {
    verificaPerm: async function(member) {
        const rolesIds = await rolesCollection();

        if( await verificaRoles(member, [rolesIds.ADMIN, rolesIds.STAFF, rolesIds.MODERADOR]) )
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