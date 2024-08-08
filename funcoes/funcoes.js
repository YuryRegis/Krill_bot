const regex = /\bp[\doòóôõö@]+(r+|h+)[\daàáâãä@iìíïî]+n*h*[\S]*|\b[\deèéêëê]+s+p+[oòóôö@]+r+[\deèéêë@aàáâãä]+[\S]*|\b(c|k)[\daáàâãä@]+r[\daáàâãä@]+lh[\S]+|\b(c|k)[uùúüû]+(\s|\n|$|!|\.|\?)\b|\b(c|k)[uùúüû]+[sz]+[\diìíïaâãàáä@]+[\S]+|b[\duùúüûoòóõôö]+(c|s)+[\deèéêë]+t+[\diìíîïaâãàá@]+[\S]+|\bp+[\diìíïî]+(c|k|ck)+[\daàáäâ@]\b|\bp[\diìíïî]+r[\doóòöô@]+(c|k)+[\S]*|\bp[uùúüû#@]+t[\daàáäâãiìíîïoóòôõôeêéèë@]+(r|n)*[\S]*|\b(c|k)[\daàáâãä@](c|s)[\deèéêë&]+t[\S]|\b(c|k)[\daàáâãä@]7\b|\bp[\deèéêë]*r[\deèéêë]+r[\deèéêë]+(c|k)[\s\S]{1}|\bf[\doòóôõöuùúüû@]+d[\S]+r|\b(x|ch|sh)+[\doòóôõö]+(x|ch|sh)*[\doòóôõö]*t+[\daàáâãäiìíïî]+[\S]*|\bb[\doòóõôö@]+(qu|k)[\S]+t[\S]+|\bp[\deéèêë&]+n+[\diíìîï]+s+|\b[\daàáâãä@]+n+[\daàáâãä@]+(u|l|o)+\b|\b[\daàáâãä@]+n+[uùúûü]+s+\s|\b[\doòóôõö@]+t+[\daàáâãä@]+r+[\diíìîï]+[\doóòôõö@]+|\bb[\daâãàá@]+b[\daâãàá@]+(c|K)+[\daâãàá@]*(\S|$|\s)|\bpr[\deéèêë]+(x|ch|sh)+[\deéèêë]+(c|k)+[\daâãàá@iìíïî]*n*h*[\daâãàá@]*\b|\bp[uúùûü]+s+y\b|\b(x|ch)[\daàáâãä@]+b+[\S]+(c|k)|\b(x|ch|sh)+[\daàáâãä@]+n+[\daàáâãä@iìíïî]+n*h*[\daàáâãä@]*|\bb[\doòóôõö@]+g+[\daàáâãä@]+|\bf[\doóòõôöuúùûü@]+d+[\S]+|\bf[\duúùüûoòóôöõ@]+ck|\bd[\diìíîïi]+ck|\bv?tnc\b|\bpqp\b|\bvsf\b|\bkct\b|\bpnc\b|\bfdp\b|\b(c|k)rlh?\b/gi

module.exports = {

    // retorna membro mencionado em uma mensagem ou por ID
    getMember: function(message, toFind = '') {
        try {
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
        } catch (error) {
            console.error('GET_MEMBER_ERROR:', JSON.stringify(error));
            return null;
        }
    },


    // verifica se membro saiu ou entrou no servidor
    rmvAddLog: function(data, addBool) {
        try {
            let acao = "";
            addBool ? acao = "entrou" : acao = "saiu";

            const nome = data.d.user.username,
                id   = data.d.user.id;
            let   log  = `\`\`\`Nome:  ${nome}\nID:    ${id}\`\`\``,
                msg  = `Um membro **${acao}** do servidor:\n` + log;

            return msg;
        } catch (error) { 
            console.error('RMV_ADD_LOG_ERROR:', JSON.stringify(error)); 
        }
    },


    // verifica presence update (status de presença)
    prsUPD: async function(data, client){
        try {
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
        } catch (error) { 
            console.error('PRS_UPD_ERROR:', JSON.stringify(error)); 
        }
        finally {
            return null;
        }
    }, 


    // status update (alteração de status do membro)
    mbrUPD: async function(data){
        try {
            let nome = data.d.user.username,
                id   = data.d.user.id,
                nick = data.d.nick,
                msg  = `Pessoal, encontrei um **nome** ou** *nick* **suspeito, poderiam verificar?\n`;
            
            if( regex.test(nome.toLowerCase()) ) {
                let palavrao = await nome.toLowerCase().match(regex),
                    terminal = msg + `\`\`\`Membro:    ${nome}\nID:        ${id}\nSuspeita:  ${palavrao}\nVerificar: ${nick}\`\`\``;
                return terminal;
            }
            if( Boolean(nick) ) {
                if( regex.test(nick.toLowerCase()) ){
                    let palavrao = await regex.exec(nick.toLowerCase())[0],
                        terminal = msg + `\`\`\`Membro:    ${nome}\nID:        ${id}\nSuspeita:  ${palavrao}\nVerificar: ${nick}\`\`\``;
                    return terminal;
                }
            }
        } catch (error) { 
            console.error('MBR_UPD_ERROR:', JSON.stringify(error)); 
        }
        finally {
            return null;
        }
    },

    // retorna lista de palavões ou falso para caso de não encontrar palavrões
    verificaPalavrao: async function(message) {
        try {
            listaPalavrao = await message.toString().match(regex); 
            if(listaPalavrao === null)
                return false;
            return listaPalavrao;
        } catch (error) { 
            console.error('VERIFICA_PALAVRAO_ERROR:', JSON.stringify(error)); 
        }
        finally {
            return null;
        }
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
