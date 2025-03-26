const { auth } = require("../auth/auth-admin.js");

const getUser = async (req, res) => {
  try {
    const idToken = req.headers ? req.headers.authorization : req;

    const user = await auth.verifyIdToken(idToken);

    const result = {
      id: user.uid, 
      username: user.name,
      email: user.email,
    }
    return res?.status ? res.status(200).json(result) : result;
  } catch (error) {
    res.status(401).json({ success: false, error: "Token inválido!" });
  }
};

module.exports = getUser;
