import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname) //new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
        // cb(null, new Date().toLocaleString().replace(/\\/g, "_").replace(/:/g, '-') + '-' + file.originalname)
    }
})

export const upload = multer({storage: storage})