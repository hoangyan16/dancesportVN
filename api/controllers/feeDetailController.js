const FeeDetailService                        = require('../services/feeDetailService');
const { validationResult }                    = require('express-validator');
const Paginator                               = require('../commons/paginators');
const messageContants                         = require('../constants/messageContants');
const upload                                  = require('../uploads/upload');
const uploadImageInResources                  = require('../uploads/uploadImageInResources');
const uploadExcelFiles                        = require('../uploads/uploadExcelFiles');
const fs                                      = require('fs');

// RESOURCES

// Lấy thông tin đã được tạo 
exports.getAll= async(req,res)=>{
  FeeDetailService.getAll(req.query.tournament_id).then(data=>{
      res.status(200).json({
      success: true,
      message: messageContants.RESOURCES_FOUND,
      data:data
      }); 
 }).catch(err =>{
   res.send({
     error:{
       status: err.status ||500,
       message: err.message
     },
   })
 });
};

// Tạo thông tin
exports.create=async (req,res,next) => {
  try{ 
    FeeDetailService.create(req.body.fee_details,req.body.tournament_id).then(result=>{
            res.status(200).json({
              success: true,
              message:messageContants.RESOURCES_CREATE_SUSSCESS,
              data: result
            }); 
      }).catch(err =>{
        res.send({
          error:{
            status: err.status ||500,
            message: err.message
            },
          })
        });
    }catch(err){
    return next(err);
  }
};

// Chỉnh sửa thông tin
exports.update=async (req, res, next) => {
  try{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
        };
  FeeDetailService.update(req.params.id,req.files,req.body).then(result=>{
  if(result.message){
    res.status(404).json({
      success: false,
      message: result.message
    });
    }else{
      res.status(200).json({
        success: true,
        message: messageContants.RESOURCES_UPDATE_SUSSCESS,
      }); 
  }
}).catch(err =>{
  res.send({
    error:{
      status: err.status ||500,
      message: err.message
      },
    })
  });
}catch(err){
  return next(err);
}
};

// Xóa

exports.delete= async(req,res)=>{
    const Id= req.params.id
    const options = {field: 'Deleted',deleted: 1, updated_date:new Date()}
    FeeDetailService.delete(Id,options).then(data=>{
        if(data==true){
            res.status(200).json({
              success:true,
              message: messageContants.RESOURCES_DELETED,
              });
            }else{
            res.status(404).json({
            success: false,
            message: data.message,
        });
      } 
  }).catch(err =>{
    res.send({
      error:{
        status: err.status ||500,
        message: err.message
        },
      })
    });
};




// IMAGES FOR LOGO,IMAGES,ADs

// Lấy thông tin đã được tạo 

exports.getAllImages= async(req,res)=>{
  FeeDetailService.getAllImages().then(data=>{
    const url=[];
    for(var i=0; i<data.rows.length;i++){
      if(data.rows[i].url===null){
        data.rows[i].url= null;
      }else{
        url[i] = "http://" + req.headers.host + data.rows[i].url;
        data.rows[i].url= url[i];
      }
    };
      res.status(200).json({
      success: true,
      message: messageContants.RESOURCES_FOUND,
      data:data.rows
      }); 
 }).catch(err =>{
   res.send({
     error:{
       status: err.status ||500,
       message: err.message
     },
   })
 });
};

// Lấy thông tin đã được tạo bằng Id
exports.getbyIdImage= (req,res)=>{
  FeeDetailService.getbyIdImage(req.params.id).then(data=>{
    const url = "http://" + req.headers.host + data.url;
    data.url= url;
    if(data.message){
      res.status(404).json({
        success: false,
        message: data.message
      });
      }else{
        res.status(200).json({
          success: true,
          message:messageContants.RESOURCES_FOUND,
          data:data
      });
    } 
}).catch(err =>{
  res.send({
    error:{
      status: err.status ||500,
      message: err.message
      },
    })
  });
};

// Update Url
exports.uploadImage=async (req,res,next) => {
  try{ 
      await uploadImageInResources(req,res);
      FeeDetailService.uploadImage(req).then(result=>{
            const url = "http://"+ req.headers.host+ result;
            res.status(200).json({
              success: true,
              message:messageContants.UPLOAD_SUSSCESS,
              url: url
          }); 
      }).catch(err =>{
        res.send({
          error:{
            status: err.status ||500,
            message: err.message
            },
          })
        });
    }catch(err){
    return next(err);
  }
};

// Tạo thông tin
exports.createImage=async (req,res,next) => {
  try{ 
    var url= req.body.url.replace(`http://${req.headers.host}`,"");
    const options={
          url: url,
          title: req.body.title,
          type: req.body.type,
          link: req.body.link,
          is_image_4_logo_and_ads: 1
    };
      FeeDetailService.createImage(options).then(result=>{
            const url = "http://"+ req.headers.host+ result.url;
            result.url= url;
            res.status(200).json({
              success: true,
              message:messageContants.RESOURCES_CREATE_SUSSCESS,
              data: result
            }); 
      }).catch(err =>{
        res.send({
          error:{
            status: err.status ||500,
            message: err.message
            },
          })
        });
    }catch(err){
    return next(err);
  }
};
// Chỉnh sửa thông tin
exports.updateImage=async (req, res, next) => {
  try{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
        };
    var url= req.body.url.replace(`http://${req.headers.host}`,"");
        const options={
              url: url,
              title: req.body.title,
              type: req.body.type,
              link: req.body.link,
              is_image_4_logo_and_ads: 1,
              updated_date:new Date(),
        };
  FeeDetailService.updateImage(req.params.id,options).then(result=>{
  if(result.message){
    res.status(404).json({
      success: false,
      message: result.message
    });
    }else{
      res.status(200).json({
        success: true,
        message: messageContants.RESOURCES_UPDATE_SUSSCESS,
      }); 
  }
}).catch(err =>{
  res.send({
    error:{
      status: err.status ||500,
      message: err.message
      },
    })
  });
}catch(err){
  return next(err);
}
};

// Xóa

exports.deleteImage= async(req,res)=>{
  const Id= req.params.id
  const options = {field: 'Deleted',deleted: 1, updated_date:new Date()}
  FeeDetailService.deleteImage(Id,options).then(data=>{
      if(data==true){
          res.status(200).json({
            success:true,
            message: messageContants.RESOURCES_DELETED,
            });
          }else{
          res.status(404).json({
          success: false,
          message: data.message,
      });
    } 
}).catch(err =>{
  res.send({
    error:{
      status: err.status ||500,
      message: err.message
      },
    })
  });
};