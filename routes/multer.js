const multer = require("multer");
const path = require("path");

const {v4 :uuidv4} = require("uuid");

const Storage = multer.diskStorage({
    destination:function(req,file,cd){
        cd(null,'./public/images/uploads')
    },
    filename:function(req,file,cd){
        const uniqueFilename = uuidv4()
        cd(null,uniqueFilename + path.extname(file.originalname))
    }
});

const upload = multer({ storage : Storage });

module.exports = upload;