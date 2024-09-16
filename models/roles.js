const { serverDb } = require('../services/firebase');
const getID = require('../funcoes/ids.json');


const docRef = serverDb.doc('rolesConfig');

module.exports = {
    rolesCollection: async () => {
        try {
            const doc = await docRef.get();
            const roles = doc.data() || getID.cargo;
            return roles;
        } catch (error) {
            console.error('Erro ao obter a coleção de roles:', error);
            throw error;
        }
    },
    updateRoles: async (roles) => {
        try {
            if (!roles) {
                console.log('UPDATE_ROLES_ERROR: roles não pode ser vazio.');
                return;
            }
            await docRef.update(roles);
            console.log('Roles atualizadas com sucesso.');
        } catch (error) {
            console.error('Erro ao atualizar as roles:', error);
            throw error;
        }
    }
}
