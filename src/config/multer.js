const multer = require('multer')
const multerUpload = multer({Storage: multer.memoryStorage()}); 
module.exports = multerUpload ; 