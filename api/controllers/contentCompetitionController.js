const ContentCompetitionService                                   = require('../services/contentCompetitionService');
const Paginator                                                   = require('../commons/paginators');
const { validationResult }                                        = require('express-validator');
const messageConstants                                            = require('../constants/messageContants');
const TournamentDetailsService                                    = require('../services/tournamentDetailService');
const gradesService                                               = require("../services/gradeService");

// Lấy thông tin nội dung các cuộc thi đã được tạo 
exports.getAll= async(req,res)=>{
   ContentCompetitionService.getAll().then(async(data)=>{ 
      res.status(200).json({
      success: true,
      message: messageConstants.CONTENTCOMPETITION_FOUND,
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


// Lấy thông tin nội dung các cuộc thi đã được tạo 
exports.sort= async(req,res)=>{
  if(req.query.columnName==='dance_type_id'){
        const orders= await gradesService.sortFromContent(req.query);
        const success= await ContentCompetitionService.SaveOrderFromGrades(orders);
        if(success==true){
          ContentCompetitionService.getAll().then(async(data)=>{
          res.status(200).json({
          success: true,
          message: messageConstants.CONTENTCOMPETITION_FOUND,
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
        }
  }else{
    ContentCompetitionService.sort(req.query).then(async(result)=>{ 
      const options=[];
      for(var i=0; i<result.length;i++){
          options[i]= result[i].id;
      };
      const data= await ContentCompetitionService.SaveOrder(options);
      if(data==true){
        res.status(200).json({
        success: true,
        message: messageConstants.CONTENTCOMPETITION_FOUND,
        data:result
        }); 
      }else{
        res.status(200).json({
          success: true,
          message: messageConstants.CONTENTCOMPETITION_UPDATE_FAIL,
        })
      }
  }).catch(err =>{
    res.send({
      error:{
        status: err.status ||500,
        message: err.message
      },
    })
  });

  }
};


exports.getAllByTournaments= async(req,res)=>{
  const is_closed= req.query.is_closed;
  ContentCompetitionService.getAllByTournaments(is_closed).then(async(data)=>{ 
     res.status(200).json({
     success: true,
     message: messageConstants.CONTENTCOMPETITION_FOUND,
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


// Lấy thông tin nội dung các cuộc thi đã được tạo 
exports.getAllPreparedData= async(req,res)=>{
  ContentCompetitionService.getAllPreparedData().then(data=>{
    if(data){
     res.status(200).json({
     success: true,
     message: messageConstants.CONTENTCOMPETITION_FOUND,
     data:data
     }); 
    }else{
      res.status(404).json({
      success: false,
      message: messageConstants.CONTENTCOMPETITION_NOT_FOUND,
    })
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


// Lấy thông tin nội dung các cuộc thi đã được tạo bằng paging
exports.getAllByPaging= async(req,res)=>{
  const page = parseInt(req.query.page_index) ||1;
  const size = parseInt(req.query.page_size);
  const sortColumn= req.body.sortColumn;
  const {limit,offset}= Paginator.getPagination(page,size);
  const data= {limit,offset,sortColumn};
  ContentCompetitionService.getAllByPaging(data).then(data=>{
      const response= Paginator.getPagingData(data,page,limit);
     res.status(200).json({
     success: true,
     message: messageConstants.CONTENTCOMPETITION_FOUND,
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

// Lấy thông tin nội dung cuộc thi đã được tạo 
exports.getbyId= async(req,res)=>{
  const Id= req.params.id
  ContentCompetitionService.getbyId(Id).then(data=>{
     if(data.message){
      res.status(404).json({
        success: false,
        message: data.message
      });
      }else{
        res.status(200).json({
          success: true,
          message: messageConstants.CONTENTCOMPETITION_FOUND,
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

// Tạo thông tin nội dung cuộc thi 
exports.create=async (req, res, next)=>{ 
  try{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
        } 
        const data= {
          symbol: req.body.symbol,
          fee_id: req.body.fee_id,
          minimum_athletes: req.body.minimum_athletes,
          age_id: req.body.age_id,
          sub_ages: req.body.sub_ages,
          grade_id: req.body.grade_id,
          name: req.body.name,
          is_closed:req.body.is_closed,
          is_register:req.body.is_register,
          formality_id: req.body.formality_id,
          unit_id: req.body.unit_id,
        }
        
ContentCompetitionService.create(data).then(async(result)=>{
   if(result.message){
      res.json({
      success: false,
      error:{
        status:404,
        message: result.message
      }
    });
    }else{
      const options= {
        index: result.id
      };
      await ContentCompetitionService.update(result.id,options);
      res.status(200).json({
        success: true,
        message: messageConstants.CONTENTCOMPETITION_CREATE_SUSSCESS,
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

// Tạo thông tin nội dung cuộc thi 
exports.update=async (req, res, next)=>{  
  try{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
  };
  const Id= req.params.id;
  const options = {field: 'deleted', deleted: 1, updated_date:new Date()};
  const data= {
    symbol: req.body.symbol,
    fee_id: req.body.fee_id,
    minimum_athletes: req.body.minimum_athletes,
    age_id: req.body.age_id,
    sub_ages: req.body.sub_ages,
    grade_id: req.body.grade_id,
    name: req.body.name,
    is_closed:req.body.is_closed,
    formality_id: req.body.formality_id,
    unit_id: req.body.unit_id,
  };
  const details= await  TournamentDetailsService.get(); 
  const content_id_in_detail=[];
  for(var i= 0; i<details.count;i++){
    content_id_in_detail[i]= details.rows[i].content_competition_id;
};
const id_compared = content_id_in_detail.some(item => item == Id);
    if(id_compared){
      await ContentCompetitionService.deleteWhenUpdate(Id,options);
      ContentCompetitionService.create(data).then(result=>{
        if(result.message){
         res.status(404).json({
           success: false,
           message: result.message
         });
         }else{
           res.status(200).json({
             success: true,
             message: messageConstants.CONTENTCOMPETITION_UPDATE_SUSSCESS,
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
    }else{
         await ContentCompetitionService.update(Id,data).then(result=>{
          if(result.message){
           res.status(404).json({
             success: false,
             message: result.message
           });
           }else{
             res.status(200).json({
               success: true,
               message: messageConstants.CONTENTCOMPETITION_UPDATE_SUSSCESS,
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
      }
  }catch(err){
    return next(err);
  }
};


// Tạo thông tin nội dung cuộc thi 
exports.updateFromTour=async (req, res, next)=>{  
  try{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
  };
  const Id= req.params.id;
  const data= {
    symbol: req.body.symbol,
    fee_id: req.body.fee_id,
    minimum_athletes: req.body.minimum_athletes,
    age_id: req.body.age_id,
    sub_ages: req.body.sub_ages,
    grade_id: req.body.grade_id,
    name: req.body.name,
    is_closed:req.body.is_closed,
    formality_id: req.body.formality_id,
    unit_id: req.body.unit_id,
    is_register: req.body.is_register
  };
    await ContentCompetitionService.update(Id,data).then(result=>{
       if(result.message){
        res.status(404).json({
          success: false,
          message: result.message
        });
        }else{
          res.status(200).json({
            success: true,
            message: messageConstants.CONTENTCOMPETITION_UPDATE_SUSSCESS,
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
    const options = {field: 'deleted', deleted: 1, updated_date:new Date()};
    ContentCompetitionService.deleteFromContent(Id,options).then(data=>{
        if(data==true){
            res.status(200).json({
              success:true,
              message: messageConstants.CONTENTCOMPETITION_DELETED,
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

exports.restore= async(req,res)=>{
    const Id= req.params.id
    const options = {field: 'Deleted', deleted: 0,updated_date:new Date()}
    ContentCompetitionService.restore(Id,options).then(data=>{
        if(data==true){
            res.status(200).json({
            success:true,
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


// Khóa

exports.lock= async(req,res)=>{
    const Id= req.params.id
    const options = {field: 'is_closed', is_closed: 1, updated_date:new Date()}
    ContentCompetitionService.lock(Id,options).then(data=>{
        if(data==true){
            res.status(200).json({
              success:true,
              message: messageConstants.CONTENTCOMPETITION_LOCK_SUSSCESS,
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


// Mở khóa

exports.unlock= async(req,res)=>{
    const Id= req.params.id
    const options = {field: 'is_closed', is_closed: 0, updated_date:new Date()}
    ContentCompetitionService.unlock(Id,options).then(data=>{
        if(data==true){
            res.status(200).json({
              success:true,
              message: messageConstants.CONTENTCOMPETITION_UNLOCK_SUSSCESS,
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