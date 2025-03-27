const { admin } = require("../auth/auth-admin.js");
const user_get = require("./user_get.js");

const db = admin.firestore();

const validate = (user, comment) => {
  const valid = {
    message: "Comentário criado com sucesso!",
    success: true,
    status: 200,
  };

  if (!user) {
    valid.message = "Usuário não autenticado";
    valid.success = false;
    valid.status = 401;
    return valid;
  }

  if (!comment) {
    valid.message = "Adicione um comentário";
    valid.success = false;
    valid.status = 422;
    return valid;
  }

  return valid;
};

const createComment = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { id } = req.query;
    const { comment } = req.body;

    const user = await user_get(token);
    const userId = user.id;
    const author = user.username;
    
    const valid = validate(user, comment);
    let commentDoc = null;
    if (valid.success) {
      const commentRef = db.collection("posts").doc(id).collection("comments").doc();

      const newComment = {
        userId,
        author,
        comment,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await commentRef.set(newComment);

      commentDoc = await commentRef.get();
    }
    
    res.status(valid.status).json({
      id: commentDoc.id,
      ...commentDoc.data()
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

module.exports = createComment;
