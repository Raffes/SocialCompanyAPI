const config = require("../auth/auth-app.js");

const signOut = async (_req, res) => {
  try {
    await config.authConfig.signOut(config.auth);
    res.status(201).json({
      message: "Usuário deslogado com sucesso!"
    });

  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    res.status(500).send(error.message);
  }
};

module.exports = signOut;

