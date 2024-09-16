var admin = require("firebase-admin");
var serviceAccount = require("../firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = {
  serverDb: db.collection("server"),
};