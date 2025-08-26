const cloudinary = require('../config/cloudinary')
const stream = require('stream')
const appError = require('../utils/apiError')
const uploadPfp = async (req ,res ,next)=>{
    if(!req.file) return next(new appError('no file uploaded' , 400))
    let file = req.file ; 
    try{
        let clousdStream =  cloudinary.uploader.upload_stream(
            {folder: 'NRIGRAM/pfps'}, 
            (err  , res)=>{
                if(err){
                    return next(err)
                } 
                req.pfpUrl = res.secure_url ; 
                next(); 
            }
        )
        stream.Readable.from(file.buffer).pipe(clousdStream) ; 
    }catch(err){
        return next(err) ; 
    }
}

module.exports = uploadPfp ; 