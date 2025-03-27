const sharp = require("sharp");
const { admin } = require("../auth/auth-admin.js");
const cloudinary = require('cloudinary/').v2;
const cloudinaryConfig = require('../cloudinary-key.json');
const user_get = require("./user_get.js");

const db = admin.firestore();
cloudinary.config(cloudinaryConfig);

const validate = (user, description, imageFile) => {
  const valid = {
    message: "Post criado com sucesso!",
    success: true,
    status: 200,
  };

  if (!user) {
    valid.message = "Usuário não autenticado";
    valid.success = false;
    valid.status = 401;
    return valid;
  }

  if (!(description || imageFile)) {
    valid.message = "Escreva uma descrição ou adicione uma imagem";
    valid.success = false;
    valid.status = 406;
    return valid;
  }

  return valid;
};

const cropImage = async (fileBuffer) => {
  try {
    const croppedImageBuffer = await sharp(fileBuffer)
      .resize(1000, 1000)
      .toBuffer();
    return croppedImageBuffer;
  } catch (error) {
    throw new Error("Erro ao fazer upload da imagem", error);
  }
};

const uploadImage = async (file) => {
  try {
    const croppedImageBuffer = await cropImage(file.buffer); 
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'posts' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({id: result.public_id, src: result.secure_url});
          }
        }
      );

      uploadStream.end(croppedImageBuffer);
    });
  } catch (error) {
    throw new Error("Erro ao fazer upload da imagem", error);
  }
};

const createPost = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { description } = req.body;
    const imageFile = req.file;

    const user = await user_get(token);
    
    const valid = validate(user, description, imageFile);

    if (valid.success) {
      let imageUrl = null;

      if(imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const postRef = db.collection("posts").doc();
      await postRef.set({
        userId: user.id,
        author: user.username,
        description: description,
        imageInfo: imageUrl,
        acessos: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    res.status(valid.status).json({
      message: valid.message
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

module.exports = createPost;
