const {run: errorLog} = require('../funcoes/errorHandler');
const {rolesCollection} = require('../models/roles');


module.exports = {

    // defjne o cargo ao reagir mensagem no canal de regras
    setRole: async function(client, data, servidorID) {
        try {
            const rolesIds = await rolesCollection();

            let servidor = await client.guilds.cache.get(servidorID);
            let membro   = await servidor.members.cache.get(data.d.user_id);

            let android  = await servidor.roles.cache.get(rolesIds.ANDROID),
                nintendo = await servidor.roles.cache.get(rolesIds.SWITCH),
                apple    = await servidor.roles.cache.get(rolesIds.APPLE),
                beta     = await servidor.roles.cache.get(rolesIds.BETA),
                skyG     = await servidor.roles.cache.get(rolesIds.GLOBAL);

            if(data.t === "MESSAGE_REACTION_ADD" || data.t === "MESSAGE_REACTION_REMOVE") {
                if(data.d.emoji.id === "698184753848778883") { 
                    if(membro.roles.cache.has(android)) return
                    (data.t === "MESSAGE_REACTION_ADD") ? membro.roles.add(android) : membro.roles.remove(android);
                } 
                else if(data.d.emoji.id === "698184635724857445") {
                    if(membro.roles.cache.has(apple)) return
                    (data.t === "MESSAGE_REACTION_ADD") ? membro.roles.add(apple) : membro.roles.remove(apple);
                }
                else if(data.d.emoji.name === "🛠️") {
                    if(membro.roles.cache.has(beta)) return
                    (data.t === "MESSAGE_REACTION_ADD") ? membro.roles.add(beta) : membro.roles.remove(beta);
                }
                else if(data.d.emoji.name === "🌐") {
                    if(membro.roles.cache.has(skyG)) return
                    (data.t === "MESSAGE_REACTION_ADD") ? membro.roles.add(skyG) : membro.roles.remove(skyG);
                }
                else if(data.d.emoji.name === "🎮") {
                    if(membro.roles.cache.has(skyG)) return
                    (data.t === "MESSAGE_REACTION_ADD") ? membro.roles.add(nintendo) : membro.roles.remove(nintendo);
                }
            }
        } catch(error) {
            errorLog({message: 'SET_ROLE_ERROR:', client, error});
        }
    },


    // Verifica se membro possui uma role
    verificaRole: async function(member, role) {
        try {
            const roles = await member?.roles?.cache;
            
            if(!roles) return false;

            const hasRole = roles.some(r => {
                console.log(`Procurando por ${role} --> `,r.name, r.id);
                return (r.name === role || r.id === role)
            })
            return Boolean(hasRole);
        } catch(error) {
            errorLog({message: 'VERIFICA_ROLE_ERROR:', client, error});
            return false;
        }
    },

    // Verifica se membro possui uma role a partir de uma lista de roles
    verificaRoles: async function(member, roles=Array()) {
        try {
            const mbrRoles = await member?.roles?.cache;
            if (!mbrRoles) return false;

            for (let role of roles) {
                console.log("Verificando role ",role);
                if (mbrRoles.some(r => (r.name === role || r.id === role)))
                    return true;
            }
            return false;
        } catch(error) {
            errorLog({message: 'VERIFICA_ROLES_ERROR:', client, error});
            return false;
        }
    }
}
