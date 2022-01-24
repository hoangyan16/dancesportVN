const util                             = require("util");
const multer                           = require ('multer');
const fs                               = require("fs");
const path                             = require("path")
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __basedir + "/resources/images/resources");
  },
  filename: function (req, files, callback) {
    const new_name= `${files.originalname}`.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/ /g, '_')
    .replace(/[,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    callback(null,Date.now()+''+`${new_name}`);
    },
});
// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb({message: "Images Only!"});
    }
  }
  const upload = multer({ 
    storage: storage ,
    limits:{fileSize: 1024*1024*5},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single("file");
  var uploadFilesMiddleware = util.promisify(upload);
  module.exports = uploadFilesMiddleware;