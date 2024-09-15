const Discord = require("discord.js");

module.exports = {
    embedSimples: function (cor, titulo, thumb, descricao, imagem) {
        try {
            let embed = new Discord.EmbedBuilder()
                .setColor(cor)
                .setTitle(titulo)
                .setThumbnail(thumb)
                .setDescription(descricao)
                .setImage(imagem);
            
            return embed;
        } catch (error) {
            console.error(`Erro ao criar embed simples: ${error}`);
        }
    }
}
