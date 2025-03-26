const fileLimit = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(file.originalname);
    
    if(mimetype && extname) {
        return cb(null, true);
    } else {
        cb("Erro: Apenas imagens (JPEG, PNG, GIF) são permitidas!")
    }
}

module.exports = fileLimit;