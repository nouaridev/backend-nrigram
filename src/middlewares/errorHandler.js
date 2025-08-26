const appError = require('../utils/apiError')
const errHandler = (err , req, res , next)=>{
    console.error(err) ;
    if(err instanceof appError){
        return res.status(err.status).json({success: false , error: err.message});
    }
    
    // mongodb errors : 
    else if(err.name == 'MongoServerError' && err.code==11000){
        if(err.keyPattern){
            let thing = Object.keys(err.keyPattern)[0] ;
            return res.status(400).json({success: false , error: `${thing} already been used`})
        }
    }


    // jwt errors 
    else if(err.name == 'JsonWebTokenError'){
        res.status(401).json({success: false , error: 'Invalid token , please login again'})
    }else if(err.name == 'TokenExpiredError'){
        res.status(401).json({success: false , error: 'Session expired, please login again.'})
    }

    // cloudinary errors : 
    else if(err.http_code && err.message){
        return res.status(err.http_code).json({success: false , error: `cloudinary: ${err.message}`})
    }
    
res.status(500).json({success: false , error: err.message || 'Internal Server Error'})
}

module.exports = errHandler; 