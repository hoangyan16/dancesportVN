const util                             = require("util");
const multer                           = require ('multer');
const fs                               = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __basedir + "/resources/files/resources");
  },
  filename: function (req, files, callback) {
    const new_name= `${files.originalname}`.replace(/[,*;()]/g,"");
    callback(null,`${new_name}`);
    },
  });
const upload = multer({ 
  storage: storage,
}).array("files");
var uploadFilesMiddleware = util.promisify(upload);
module.exports = uploadFilesMiddleware;