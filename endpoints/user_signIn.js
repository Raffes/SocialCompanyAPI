const config = require("../auth/auth-app.js");

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email || password) {
      const userCredential = await config.authConfig.signInWithEmailAndPassword(config.auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const uid = await userCredential.user.uid;

      res.status(201).json({
        message: "Usuário logado com sucesso!",
        user_id: uid,
        token: idToken
      });
      
    } else {
      res.status(406).json({
        message: "Dados incompletos!",
      });
    }

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).send(error.message);
  }
};

module.exports = signIn;

