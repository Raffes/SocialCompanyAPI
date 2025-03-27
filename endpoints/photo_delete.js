const sharp = require("sharp/");
const { admin } = require("../auth/auth-admin.js");
const cloudinary = require('cloudinary/').v2;
const cloudinaryConfig = require('../cloudinary-key.json');
const user_get = require("./user_get.js");

const db = admin.firestore();
cloudinary.config(cloudinaryConfig);

const deleteImage = async (id) => {
  try {
    const result = await cloudinary.uploader.destroy(id);
    return result;
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { id } = req.query;

    const user = await user_get(token);
    
    const postRef = db.collection("posts").doc(id);
    const postDoc = await postRef.get();

    if(!postDoc.exists) {
      throw new Error("Post não encontrado");
    }

    if(postDoc.data().userId != user.id){
      throw new Error("Sem permissão para fazer essa ação");
    }
    await deleteImage(postDoc.data().imageInfo.id);
    await postRef.delete();

    res.status("200").json({
      message: "Post excluido com sucesso"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

module.exports = deletePost;
