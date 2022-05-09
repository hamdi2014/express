const multer = require("multer");

const uploadTools={};

const storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files')
      },
      filename: function (req, file, cb) {
        console.log(file);
        cb(null,file.originalname)
      }
})

uploadTools.upload=multer({
    storage,
    limits:{
        fileSize:1000
    },
    fileFilter:function (req,file,cb) {
        console.log(file.originalname.split('.')[file.originalname.split('.').length-1])
        if(file.originalname.split('.')[file.originalname.split('.').length-1]==='jpg'){
            cb(new Error("incorrect format"))
        }else{
            cb(null,true)
        }
    }
})

module.exports=uploadTools