const jwt                           = require('jsonwebtoken');
const models                        = require('../../models'); 

exports.checkAccessToken = async(req,res,next)=>{
    try{
        const token= req.headers.authorization.split(" ")[1];
        const decodedToken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET );
        req.user= decodedToken;
        await  models.users.findOne({where:{user_name:req.user.user_name},attributes:['id','name','email','type','role','user_name']}).then(data=>{
            if(data){
                req.user= data;
                next();
            }else{
                res.status(403).json({message: "Not Allowed!"})
            };
        }).catch(err =>{
            res.send({
              error:{
                status: err.status ||500,
                message: err.message
              },
            })
          });
}catch(err){
    return res.status(401).json({
        message: "Invalid or expired token provided!",
        error: err.message
        })
    }
};


exports.checkAccessTokenorNot = async(req,res,next)=>{
    try{
        const token= req.headers.authorization.split(" ")[1];
        const decodedToken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET );
        if(!decodedToken){
            console.log("1");
        }
            req.user= decodedToken;
            const data=  await  models.users.findOne({where:{user_name:req.user.user_name},attributes:['id','name','email','type','role','user_name']});
            return data;
}catch(err){
    return res.status(500).json({
        message: "Invalid or expired token provided!",
        error: err.message
        })
    }
};

exports.checkAdmin= (req,res,next)=>{
    try{ 
        var role= req.user.role;
       if(role==1){
        next();  
       }else{
        res.status(403).json({message: "Not Allowed!"})
       }
}catch(err){
    return res.status(401).json({
        message: "Invalid or expired token provided!",
        error: err.message
        })
    }
};
exports.checkAdminAndUser =(req,res,next)=>{
    try {
        var role= req.user.role;
        if(role==1||role==0){
            next();  
        }else{
         res.status(403).json({message: "Not Allowed!"})
        }
    }catch(err){
        return res.status(401).json({
            message: "Invalid or expired token provided!",
            error: err.message
            })
        }
};

exports.checkUser =(req,res,next)=>{
    try {
        var role= req.user.role;
     if(role==0){
         next();
     }else{
        res.status(403).json({message: "Not Allowed!"})
     }
    } catch(err){
        return res.status(401).json({
            message: "Invalid or expired token provided!",
            error: err.message
            })
        }
     
};

exports.checkRefreshToken= (req,res,next)=>{
try{
     const decodedToken= jwt.verify(req, process.env.REFRESH_TOKEN_SECRET );
    if(decodedToken){
    return decodedToken;
    }else{
        res.status(403).json({message: "RefreshToken is invalid!"});
    }
}catch(err){
    return res.status(401).json({
        message: "Invalid or expired token provided!",
        error: err.message
        })
    }
};
exports.signAccessToken = (req,res,next)=>{
try{
    const payload={
        user_name:req.user_name,
        address: req.address,
    }
    return  jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1d' });
    }catch(err){
        return res.status(401).json({
            error: err
        })
    }
};
exports.signRefreshToken= (req,res,next)=> { 
try{
    const payload={
        user_name:req.user_name,
        address: req.address,
    }
    return jwt.sign( payload,process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '7d' });
}catch(err){
    return res.status(401).json({
        error: err
        })
    };
};