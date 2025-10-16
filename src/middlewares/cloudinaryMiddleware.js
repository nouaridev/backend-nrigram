const cloudinary = require('../config/cloudinary')
const stream = require('stream')
const appError = require('../utils/apiError')

const uploadPfp = async (req ,res ,next)=>{
    console.log(req.file)
    if(!req.file) return next(new appError('no ptofile pic is provided' , 400))
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

const sendMessagePic = async (req ,res ,next)=>{
    if(!req.file) return next()
    let file = req.file; 
    try{
        let clousdStream =  cloudinary.uploader.upload_stream(
            {folder: 'NRIGRAM/messageImages'}, 
            (err  , res)=>{
                if(err){
                    return next(err)
                } 
                req.img = res.secure_url ; 
                next(); 
            }
        )
        stream.Readable.from(file.buffer).pipe(clousdStream) ; 
    }catch(err){
        return next(err) ; 
    }
}

const updatePfp = async( req ,res ,next)=>{
    if(!req.file){return next()}
    try {
        let cloudStram = cloudinary.uploader.upload_stream({folder: 'NRIGRAM/pfps'} , (err ,res)=>{
            if(err){
                return next(err)
            }
            req.pfpUrl = res.secure_url ; 
            next()
        })

        stream.Readable.from(req.file.buffer).pipe(cloudStram)

    } catch (error) {
        return next(error)
    }
}

module.exports = {uploadPfp , updatePfp ,sendMessagePic} ; 