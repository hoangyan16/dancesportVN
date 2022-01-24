const ResourcesService                        = require('../services/resourceService');
const { validationResult }                    = require('express-validator');
const Paginator                               = require('../commons/paginators');
const messageContants                         = require('../constants/messageContants');
const upload                                  = require('../uploads/upload');
const uploadImageInResources                  = require('../uploads/uploadImageInResources');
const uploadExcelFiles                        = require('../uploads/uploadExcelFiles');
const fs                                 = require('fs');

// RESOURCES

// Lấy thông tin đã được tạo 
exports.getAll= async(req,res)=>{
  ResourcesService.getAll(req.query.tournament_id).then(data=>{
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
// Lấy thông tin đã được tạo 
exports.getAllResourcesIntoTour= async(req,res)=>{
  ResourcesService.getAll(req.body.id).then(data=>{
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

// Lấy thông tin đã được tạo bằng paging
exports.getAllByPaging= async(req,res)=>{
  const page = parseInt(req.query.page_index) ||1;
  const size = parseInt(req.query.page_size);
  const {limit,offset}= Paginator.getPagination(page,size);
  const data= {limit,offset};
  ResourcesService.getAllByPaging(data).then(data=>{
      const response= Paginator.getPagingData(data,page,limit);
     res.status(200).json({
    success: true,
    message: messageContants.RESOURCES_FOUND,
    data:response
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
exports.getbyId= (req,res)=>{
  ResourcesService.getbyId(req.params.id).then(data=>{
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

// Create Url
exports.uploadFiles=async (req,res,next) => {
  try{ 
        await upload(req,res);
        ResourcesService.ConvertExcelFilesToJSON(req);
        await  ResourcesService.uploadFiles(req).then((result)=>{
        const url= [];
            for(var i=0; i<result.length;i++){
              if(result[i].urljson){
                result[i].url="http://"+ req.headers.host+result[i].url;
                result[i].urljson="http://"+ req.headers.host+result[i].urljson;
                url.push(result[i]);
              }else{
                result[i].url = "http://"+ req.headers.host+ result[i].url;
                json= null;
                let urlNoJson={
                  url: result[i].url,
                  urljson: json
                }
                url.push(urlNoJson);
              }
            };
            res.status(200).json({
              success: true,
              message:messageContants.UPLOAD_SUSSCESS,
              url: url,
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
exports.create=async (req,res,next) => {
  try{ 
    const url= [];
    for(var i=0; i<req.body.url.length;i++){
      url[i]=req.body.url[i].replace(`http://${req.headers.host}`,"");
    };
    const options={
      tournament_id: req.body.tournament_id,
      url: url,
    };
      ResourcesService.create(options).then(result=>{
            for(var i=0; i<result.length;i++){
              const url = "http://"+ req.headers.host+ result[i].url;
              result[i].url= url;
            };
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
  ResourcesService.update(req.params.id,req.files,req.body).then(result=>{
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
    ResourcesService.delete(Id,options).then(data=>{
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
  ResourcesService.getAllImages().then(data=>{
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
  ResourcesService.getbyIdImage(req.params.id).then(data=>{
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
      ResourcesService.uploadImage(req).then(result=>{
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
      ResourcesService.createImage(options).then(result=>{
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
  ResourcesService.updateImage(req.params.id,options).then(result=>{
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
  ResourcesService.deleteImage(Id,options).then(data=>{
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