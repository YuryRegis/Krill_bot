
module.exports = {

    // defjne o cargo ao reagir mensagem no canal de regras
    setRole: async function(client, data, servidorID) {
        let servidor = await client.guilds.cache.get(servidorID);
        let membro   = await servidor.members.cache.get(data.d.user_id);

        let android = await servidor.roles.cache.get('627270660271374387'),
            apple   = await servidor.roles.cache.get('627275771710406673'),
            beta    = await servidor.roles.cache.get('627273901197492244'),
            skyG    = await servidor.roles.cache.get('653331984420175903');

        if(data.t === "MESSAGE_REACTION_ADD" || data.t === "MESSAGE_REACTION_REMOVE") {
            if(data.d.emoji.id === "698184753848778883") { 
                if(membro.roles.cache.has(android)) return
                (data.t === "MESSAGE_REACTION_ADD") ? membro.addRole(android) : membro.removeRole(android);
            } 
            else if(data.d.emoji.id === "698184635724857445") {
                if(membro.roles.cache.has(apple)) return
                (data.t === "MESSAGE_REACTION_ADD") ? membro.addRole(apple) : membro.removeRole(apple);
            }
            else if(data.d.emoji.name === "🛠️") {
                if(membro.roles.cache.has(beta)) return
                (data.t === "MESSAGE_REACTION_ADD") ? membro.addRole(beta) : membro.removeRole(beta);
            }
            else if(data.d.emoji.name === "🌐") {
                if(membro.roles.cache.has(skyG)) return
                (data.t === "MESSAGE_REACTION_ADD") ? membro.addRole(skyG) : membro.removeRole(skyG);
            }
        }
    },


    // Verifica se membro possui uma role
    verificaRole: async function(member, role) {
        const roles = await member.roles.cache;
        
        if(roles.some(r => r.name === role))
            return true;
        else
            return false;
    }

}