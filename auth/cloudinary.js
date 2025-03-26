const cloudinary = require('cloudinary').v2;
const cloudinaryConfig = require('../cloudinary-key.json');

cloudinary.config(cloudinaryConfig);

module.exports = { cloudinary };