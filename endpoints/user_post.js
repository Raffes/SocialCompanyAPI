const { auth } = require("../auth/auth-admin.js");

const validate = (email, password, username) => {
  const valid = {
    message: "Usuário criado com sucesso!",
    success: true,
    status: 201,
  };

  if (!(email || password || username)) {
    valid.message = "Dados incompletos!";
    valid.success = false;
    valid.status = 406;
    return valid;
  }

  if (password.length < 6) {
    valid.message = "A senha deve ter mais de 6 caracteres!";
    valid.success = false;
    valid.status = 406;
    return valid;
  }

  return valid;
};

const createUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    // const email = "teste2@dominio.com";
    // const password = "senha123";
    // const displayName = "Usuário teste";

    const valid = validate(email, password, username);

    if (valid.success) {
      const user = await auth.createUser({
        email: email,
        password: password,
        displayName: username,
        emailVerified: true,
      });
    }

    res.status(valid.status).json({
      message: valid.message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

module.exports = createUser;
