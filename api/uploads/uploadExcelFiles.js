const util                             = require("util");
const multer                           = require ('multer');
const fs                               = require("fs");
const path                             = require("path")

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __basedir + "/resources/files/exceltojson");
  },
  filename: function (req, files, callback) {
    const new_name= `${files.originalname}`
    .replace(/[,*;()]/g,"");
    callback(null,`${new_name}`);
    },
  });
  const upload = multer({ 
    storage: storage ,
    fileFilter(res, file, cb){
      if(!file.originalname.match(/\.(xls|xlsx)$/)){
        return cb(new Error('Please upload a excel file'));
      }
      cb(null, true)
    }
  }).single("file");
var uploadFilesMiddleware = util.promisify(upload);
module.exports = uploadFilesMiddleware;
