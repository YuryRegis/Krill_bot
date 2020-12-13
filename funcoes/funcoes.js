const regex = /p[\doòóôõö]+(rr|h)[\daàáâãä]|p[\doòóôõö](rr|h)[\S]+nh[\S]|(c|k)[\S]+r[\S]+lh[\S]+|(c|k)[\duùúüû]+(\s|\n|$|!|\.|\?)|(c|k)[\duùúüû]+[sz][\S]+|b[\duùúüûoòóõôö]+(c|s)[\S]+t[\S]+|p[\diìíïî]+(c|k|ck)+[\daàáäâ]|p[\diìíïî]+r[\doóòöô]+[ck][\S]+|p[\duùúüû]+t[\daàáäâãoóòôõôeêéèë]+[\S]*|[ck][\daàáâãä][cs][\S]+t[\S]|[ck][\daàáâãä]7|p[\S]+r[\S]+r[\S]+[ck][\s\S]{1}|f[\doòóôõöuùúüû]+d[\S]+r|(x|ch)[\S]+(x|ch)[\S]+t[\S]+|(x|ch)[\doòóôõö]+t[\daáàãâä]+|b[\doòóõôö]+(qu|k)[\S]+t[\S]+|p[\deéèêë]+n+[\diíìîï]+s|\b[\daàáâãä]+n+[\daàáâãä]+(u|l)+\b|[\daàáâãä]+n+[\duùúûü]+s|[\doòóôõö]+t+[\daàáâãä]+r+[\S]+|b[\S]b[\S](c|K)(\S|$|\s)|pr[\S]+(x|ch)[\S]+(c|k)(\S|$|\s|\n)|p[\S]+s+y|(x|ch)[\S]+b+[\S]+(c|k)|(x|ch)[\daàáâãä]+n+[\daàáâãä]+|b[\doòóôõö]+g+[\daàáâãä]+|m[\deèéêë]+r+d+[\S]+|f[\doóòõôöuúùûü]+d+[\S]+|f[\S]+ck|d[\S]+ck|\bv?tnc\b|\bpqp\b|\bvsf\b|\bkct\b|\bpnc\b|\bfdp\b|\b(c|k)rlh?\b/gi

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

        if(data.d.game !== null) {            
            let state = data.d.game.state;
            if (state === undefined) return null;
            if(regex.test(state.toLowerCase())) {
                let alvoID   = data.d.user.id,
                    alvo     = await client.users.cache.get(data.d.user.id),
                    palavrao = await state.match(regex),
                    msg      = `Pessoal, encontrei uma ** *RichPresence* **suspeita, poderiam verificar?\n`,
                    terminal = msg + `\`\`\`Membro:   ${alvo.tag}\nNome:     ${alvo.username}\nID:       ${alvoID}\nSuspeita: ${palavrao}\nPresence: ${state}\`\`\``;
                
                return terminal;
            }
        }   
        return null;
    }, 


    // status update (alteração de status do membro)
    mbrUPD: async function(data){

        let nome = data.d.user.username,
            id   = data.d.user.id,
            nick = data.d.nick,
            msg  = `Pessoal, encontrei um **nome** ou** *nick* **suspeito, poderiam verificar?\n`;
        
        if( regex.test(nome.toLowerCase()) ) {
            let palavrao = await nome.toLowerCase().match(regex),
                terminal = msg + `\`\`\`Membro:    ${nome}\nID:        ${id}\nSuspeita:  ${palavrao}\nVerificar: ${nick}\`\`\``;
            return terminal;
        }
        if( nick !== undefined ) {
            if( regex.test(nick.toLowerCase()) ){
                let palavrao = await regex.exec(nick.toLowerCase())[0],
                    terminal = msg + `\`\`\`Membro:    ${nome}\nID:        ${id}\nSuspeita:  ${palavrao}\nVerificar: ${nick}\`\`\``;
                return terminal;
            }
        }
        return null;
    },

    // retorna lista de palavões ou falso para caso de não encontrar palavrões
    verificaPalavrao: async function(message) {
        listaPalavrao = await message.toString().match(regex); 
        if(listaPalavrao === null)
            return false;
        return listaPalavrao;
    },

    // retorna data em formato PT-BR
    formatDate: function(date) {
        return new Intl.DateTimeFormat('pt-BR').format(date)
    },


    // retorna um numero inteiro (aleatoriamente)
    getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
};
