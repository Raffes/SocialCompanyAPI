const admin = require("firebase/app");
const authConfig = require("firebase/auth");
const firebaseConfig = require("../firebase-key-app.json");

const app = admin.initializeApp(firebaseConfig);
const auth = authConfig.getAuth(app);

module.exports = { app, auth,  authConfig };