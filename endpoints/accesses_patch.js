const { admin } = require("../auth/auth-admin.js");

const db = admin.firestore();

const updateAccessesPost = async (req, res) => {
  try {
    const { user, postId } = req.query;
    
    const postRef = db.collection("posts").doc(postId);
    const postDoc = await postRef.get();

    if(!postDoc.exists) {
      throw new Error("Post não encontrado!")
    }

    if(postDoc.data().userId !== user) {
      throw new Error("Sem permissão para fazer essa ação")
    }

    await postRef.update({
      acessos: postDoc.data().acessos + 1,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    })

    const postUpdated = await postRef.get();

    res.status(200).json({
      posts: { ...postUpdated.data(), id: postId }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

module.exports = updateAccessesPost;
