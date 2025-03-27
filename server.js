const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fileLimit = require("./functions/fileLimit.js");
const createUser = require("./endpoints/user_post.js");
const signIn = require("./endpoints/user_signIn.js");
const signOut = require("./endpoints/user_signOut.js");
const getUser = require("./endpoints/user_get.js");
const createPost = require("./endpoints/photo_post.js");
const listPostsById = require("./endpoints/photo_get.js");
const updateAccessesPost = require("./endpoints/accesses_patch.js");
const deletePost = require("./endpoints/photo_delete.js");

const expressApp = express();
expressApp.use(cors());
expressApp.use(express.json());

const upload = multer({
    fileFilter: fileLimit,
    // limits: { fileSize: 5 * 1024 * 1024 }
}); 

// Endpoint de criar usuário
expressApp.post("/api/createUser", createUser);

// Endpoint de login do usuário
expressApp.post("/api/signIn", signIn);

// Endpoint de logout do usuário
expressApp.post("/api/signOut", signOut);

// Endpoint de validação do token do usuário logado e traz o usuário
expressApp.get("/api/getUser", getUser);

// Endpoint de criar post
expressApp.post("/api/createPost", upload.single("imageFile"), createPost);

// Endpoint de exluir post
expressApp.delete("/api/deletePost", deletePost);

// Endpoint de pegar post do usuário
expressApp.get("/api/listPostsById", listPostsById);

// Endpoint de atualizar acessos do post
expressApp.patch("/api/updateAccessesPost", updateAccessesPost);

expressApp.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
