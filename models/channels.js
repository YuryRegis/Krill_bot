const { serverDb } = require('../services/firebase');
const getID = require('../funcoes/ids.json');


const docRef = serverDb.doc('channelsConfig');

module.exports = {
    channelsCollection: async () => {
        try {
            const doc = await docRef.get();
            const channels = doc.data() || getID.sala;
            return channels;
        } catch (error) {
            console.error('Erro ao obter a coleção de channels:', error);
        }
    },
    updatechannels: async (channels) => {
        try {
            if (!channels) {
                console.log('UPDATE_CHANNELS_ERROR: channels não pode ser vazio.');
                return;
            }
            await docRef.update(channels);
            console.log('channels atualizados com sucesso.');
        } catch (error) {
            console.error('Erro ao atualizar channels:', error);
        }
    }
}
