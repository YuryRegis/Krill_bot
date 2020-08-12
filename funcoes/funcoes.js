module.exports = {

    // retorna membro mencionado em uma mensagem ou por ID
    getMember: function(message, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.cache.get(toFind);
        
        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                       member.user.tag.toLowerCase().includes(toFind);
            });
        }
            
        if (!target) 
            target = message.member;
            
        return target;
    },


    // verifica se membro saiu ou entrou no servidor
    rmvAddLog: function(data, addBool) {
        let acao = "";
        addBool ? acao = "entrou" : acao = "saiu";

        const nome = data.d.user.username,
              id   = data.d.user.id;
        let   log  = `\`\`\`Nome:  ${nome}\nID:    ${id}\`\`\``,
              msg  = `Um membro **${acao}** do servidor:\n` + log;

        return msg;
    },


    // verifica presence update (status de presença)
    prsUPD: async function(data, client){
        let regex   = /b[u,ù,ú,o,ô,0-9][c,s][e,ê,0-9]t[a,ã,0-9]|b[u,ù,ú,o,ô,0-9]ss[e,ê,0-9]t[a,ã,0-9]|p[a,à,á,0-9][u,ù,ú,l,0-9]|[c,k][u,ú,ù]|[c,k][u,ú,ù][z,s][a,à,á,ã,0-9]|x[u,ò,ó,0-9]x[u,ò,ó,0-9]t[a,à,á,ã,0-9]|m[a,à,á]m[a,à,á]|p[e,ê,é,è,0-9]n[i,ì,í,0-9][s,z]|p[i,ì,í,0-9][n,m]t[o,a,ã,0-9]|[c,k][y,i][u,ù,ú,0-9]|x[u,ú,ù,0-9]p[a,à,á,ã,0-9]|ch[u,ú,ù,0-9]p[a,á,à,ã,0-9]|p[u,ù,ú,0-9][n,m,0-9]h[e,ê,0-9]t[a,ã,e,ê,0-9]|ch[o,ó,ò,0-9]ch[o,ó,ò,0-9]t[a,ã,à,á0-9]|ch[o,ó,ò,0-9]t[a,ã,à,á0-9]|[0-9]cm|x[o,ó,ò,0-9]t[a,ã,à,á0-9]|r[o,ò,ó,ô,0-9]l[a,à,á,â,0-9]|p[i,í,ì,0-9][c,k][a,ã,0-9]|π[c,k]|π[c,k][a,ã,0-9]|[c,k][o,ó,ò,ô,0-9]m[e,ê,è,é,0-9]d[o,ó,ò,ô,0-9]|m[a,ã,0-9][e,0-9]|p[a,à,á,0-9][i,ì,í,0-9]|t[e,ê,0-9]t[a,à,á,0-9]|g[o,u,ô,0-9]z[a,e,ê,à,á,0-9]|l[a,â,ã,à,á,0-9]mb[o,ô,u,e,ê,i,í,ì,0-9]|b[o,u,ò,ó,ô,0-9][q,k,c][u,e,è,é,0-9][t,c]|r[a,à,á,0-9]b[a,ã,0-9]|s[a,à,á,0-9]p[e,è,é,ê,0-9][c,k][a,à,á,0-9]|l[e,ê,è,é,0-9][i,ì,í,0-9]t[e,ê,i,ã,0-9]|[e,i,0-9]ng[u,ô,ò,ó,0-9]l[a,i,o,ô,0-9]|[e,i,0-9]str[u,o,ô,0-9]p[a,à,á,0-9]d[a,o,ô,u,0-9]|[e,i,0-9]st[u,o,ô,0-9]p[a,0-9]d[u,o,a,ô,0-9]|b[u,o,0-9]nd[a,ã,0-9]|f[o,ò,ó,0-9]d[a,i,ì,í,e,ã,0-9]|bct[a,u,o,i,ã,0-9]|bct|v[a,à,á,0-9][g,j][i,e,ì,í,0-9][n,m][a,à,á,0-9]|p[i,ì,í,0-9]r[o,ó,ò,ô,0-9][c,k][a,à,á,u,ú,o,ã,0-9]|p[o,ó,ò,ô,õ,0-9]rr[a,à,á,ã,0-9]|p[o,ô,õ,0-9][r,h][a,à,á,ã,0-9]|[e,ê,i,0-9]sp[o,ô,õ,0-9][r,h][o,ô,a,e,ê,ã,0-9]|[e,i,0-9]sp[o,ô,õ,0-9]rr[o,ô,a,e,ê,ã,0-9]|f[u,ú,o,0-9][c,k][c,k]|[e,i,0-9][n,m][r,h][a,á,à,0-9]b[e,ê,o,ô,a,à,á,0-9]/

        if(data.d.game !== null) {            
            let state = data.d.game.state;
            if (state === undefined) return null;
            if(regex.test(state.toLowerCase())) {
                let alvoID   = data.d.user.id,
                    alvo     = await client.users.get(data.d.user.id),
                    palavrao = await regex.exec(state.toLowerCase())[0],
                    msg      = `Pessoal, encontrei uma ** *RichPresence* **suspeita, poderiam verificar?\n`,
                    terminal = msg + `\`\`\`Membro:   ${alvo.tag}\nNome:     ${alvo.username}\nID:       ${alvoID}\nSuspeita: ${palavrao}\nPresence: ${state}\`\`\``;
                
                return terminal;
            }
        }   
        return null;
    }, 


    // status update (alteração de status do membro)
    mbrUPD: async function(data){
        let regex   = /b[u,ù,ú,o,ô,0-9][c,s][e,ê,0-9]t[a,ã,0-9]|b[u,ù,ú,o,ô,0-9]ss[e,ê,0-9]t[a,ã,0-9]|p[a,à,á,0-9][u,ù,ú,l,0-9]|[c,k][u,ú,ù]|[c,k][u,ú,ù][z,s][a,à,á,ã,0-9]|x[u,ò,ó,0-9]x[u,ò,ó,0-9]t[a,à,á,ã,0-9]|m[a,à,á]m[a,à,á]|p[e,ê,é,è,0-9]n[i,ì,í,0-9][s,z]|p[i,ì,í,0-9][n,m]t[o,a,ã,0-9]|[c,k][y,i][u,ù,ú,0-9]|x[u,ú,ù,0-9]p[a,à,á,ã,0-9]|ch[u,ú,ù,0-9]p[a,á,à,ã,0-9]|p[u,ù,ú,0-9][n,m,0-9]h[e,ê,0-9]t[a,ã,e,ê,0-9]|ch[o,ó,ò,0-9]ch[o,ó,ò,0-9]t[a,ã,à,á0-9]|ch[o,ó,ò,0-9]t[a,ã,à,á0-9]|[0-9]cm|x[o,ó,ò,0-9]t[a,ã,à,á0-9]|r[o,ò,ó,ô,0-9]l[a,à,á,â,0-9]|p[i,í,ì,0-9][c,k][a,ã,0-9]|π[c,k]|π[c,k][a,ã,0-9]|[c,k][o,ó,ò,ô,0-9]m[e,ê,è,é,0-9]d[o,ó,ò,ô,0-9]|m[a,ã,0-9][e,0-9]|p[a,à,á,0-9][i,ì,í,0-9]|t[e,ê,0-9]t[a,à,á,0-9]|g[o,u,ô,0-9]z[a,e,ê,à,á,0-9]|l[a,â,ã,à,á,0-9]mb[o,ô,u,e,ê,i,í,ì,0-9]|b[o,u,ò,ó,ô,0-9][q,k,c][u,e,è,é,0-9][t,c]|r[a,à,á,0-9]b[a,ã,0-9]|s[a,à,á,0-9]p[e,è,é,ê,0-9][c,k][a,à,á,0-9]|l[e,ê,è,é,0-9][i,ì,í,0-9]t[e,ê,i,ã,0-9]|[e,i,0-9]ng[u,ô,ò,ó,0-9]l[a,i,o,ô,0-9]|[e,i,0-9]str[u,o,ô,0-9]p[a,à,á,0-9]d[a,o,ô,u,0-9]|[e,i,0-9]st[u,o,ô,0-9]p[a,0-9]d[u,o,a,ô,0-9]|b[u,o,0-9]nd[a,ã,0-9]|f[o,ò,ó,0-9]d[a,i,ì,í,e,ã,0-9]|bct[a,u,o,i,ã,0-9]|bct|v[a,à,á,0-9][g,j][i,e,ì,í,0-9][n,m][a,à,á,0-9]|p[i,ì,í,0-9]r[o,ó,ò,ô,0-9][c,k][a,à,á,u,ú,o,ã,0-9]|p[o,ó,ò,ô,õ,0-9]rr[a,à,á,ã,0-9]|p[o,ô,õ,0-9][r,h][a,à,á,ã,0-9]|[e,ê,i,0-9]sp[o,ô,õ,0-9][r,h][o,ô,a,e,ê,ã,0-9]|[e,i,0-9]sp[o,ô,õ,0-9]rr[o,ô,a,e,ê,ã,0-9]|f[u,ú,o,0-9][c,k][c,k]|[e,i,0-9][n,m][r,h][a,á,à,0-9]b[e,ê,o,ô,a,à,á,0-9]/

        let nome = data.d.user.username,
            id   = data.d.user.id,
            nick = data.d.nick,
            msg  = `Pessoal, encontrei um **nome** ou** *nick* **suspeito, poderiam verificar?\n`;
        
        if( regex.test(nome.toLowerCase()) ) {
            let palavrao = await regex.exec(nome.toLowerCase())[0],
                terminal = msg + `\`\`\`Membro:    ${nome}\nID:        ${id}\nSuspeita:  ${palavrao}\nVerificar: ${nick}\`\`\``;
            return terminal;
        }
        if( nick !== null ) {
            if( regex.test(nick.toLowerCase()) ){
                let palavrao = await regex.exec(nick.toLowerCase())[0],
                    terminal = msg + `\`\`\`Membro:    ${nome}\nID:        ${id}\nSuspeita:  ${palavrao}\nVerificar: ${nick}\`\`\``;
                return terminal;
            }
        }
        return null;
    },


    // retorna data em formato PT-BR
    formatDate: function(date) {
        return new Intl.DateTimeFormat('pt-BR').format(date)
    },


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


    // retorna um numero inteiro (aleatoriamente)
    getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
};
