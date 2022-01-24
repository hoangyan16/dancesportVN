const TournamentDetailsService                      = require('../services/tournamentDetailService');
const ContentCompetitionService                     = require('../services/contentCompetitionService');
const { validationResult }                          = require('express-validator');
const Paginator                                     = require('../commons/paginators');
const sequelize                                     = require("../../models").sequelize;
const messageContants                               = require('../constants/messageContants');
const checkAuthentication                           = require('../middlewares/jwt_token');
const gradesService                                 = require("../services/gradeService");

// Lấy thông tin chi tiết nội dung các giải đấu đã được tạo 
exports.getAll= async(req,res)=>{
  TournamentDetailsService.getAll().then(async(data)=>{
      res.status(200).json({
      success: true,
      message: messageContants.TOURMAMENT_DETAILS_FOUND,
      data: data
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

//SẮP XẾP
exports.sort= async(req,res)=>{
  if(req.query.columnName==='quantity'){
    TournamentDetailsService.sort(req.query).then(async(result)=>{ 
      const options=[];
      for(var i=0; i<result.length;i++){
          options[i]= result[i].id;
      };
      const data= await TournamentDetailsService.SaveOrder(options);
      if(data==true){
        res.status(200).json({
        success: true,
        message: messageContants.CONTENTCOMPETITION_FOUND,
        data:result
        }); 
      }else{
        res.status(200).json({
          success: true,
          message: messageContants.CONTENTCOMPETITION_UPDATE_FAIL,
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
  }else{
    if(req.query.columnName==='dance_type_id'){
      const orders= await gradesService.sortFromContent(req.query);
      let success= await ContentCompetitionService.SaveOrderFromDetails(orders);
      if(success==true){
      const order_contents= await ContentCompetitionService.getAllOrder();
       success=  await TournamentDetailsService.SaveOrderFromCompetition(order_contents);
      if(success){
        TournamentDetailsService.getAll(req.query.tournament_id).then(async(data)=>{
          res.status(200).json({
          success: true,
          message: messageContants.CONTENTCOMPETITION_FOUND,
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
      }
    }else{
    const orders= await  ContentCompetitionService.sortFromDetail(req.query);
    const success=  await TournamentDetailsService.SaveOrderFromCompetition(orders);
    if(success==true){
      TournamentDetailsService.getAll(req.query.tournament_id).then(async(data)=>{
      res.status(200).json({
      success: true,
      message: messageContants.CONTENTCOMPETITION_FOUND,
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

  }
  };
};

// Lấy thông tin chi tiết nội dung các giải đấu đã được tạo theo tên giải đấu
exports.getAllBelongsTo= async(req,res)=>{
  TournamentDetailsService.getAllBelongsTo().then(data=>{
      res.status(200).json({
      success: true,
      message: messageContants.TOURMAMENT_DETAILS_FOUND,
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

// Lấy thông tin để gắn thì các mẫu nội dung có sẵn
exports.getAllPreparedData= async(req,res)=>{
  TournamentDetailsService.getAllPreparedData().then(data=>{
      res.status(200).json({
      success: true,
      message: messageContants.TOURMAMENT_DETAILS_FOUND,
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

// Lấy thông tin để gắn thì các mẫu nội dung có sẵn
exports.getAllContentData= async(req,res)=>{
  TournamentDetailsService.getAllContentData().then(data=>{
      res.status(200).json({
      success: true,
      message: messageContants.TOURMAMENT_DETAILS_FOUND,
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


// Lấy thông tin chi tiết nội dung các giải đấu bằng paging
exports.getAllByPaging= async(req,res)=>{
  const page = parseInt(req.query.page_index) ||1;
  const size = parseInt(req.query.page_size);
  const {limit,offset}= Paginator.getPagination(page,size);
  const data= {limit,offset};
  TournamentDetailsService.getAllByPaging(data).then(data=>{
    const response= Paginator.getPagingData(data,page,limit);
    res.status(200).json({
    success: true,
    message: messageContants.TOURMAMENT_DETAILS_FOUND,
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

// Lấy thông tin chi tiết nội dung giải đấu đã được tạo bằng tournament_id
exports.getbyId=async (req,res,next)=>{
  try{
    let user;
    if(req.headers.authorization){
       user =await checkAuthentication.checkAccessTokenorNot(req);
    }else{
        user= null
    };
    const Id  = req.query.tournament_id;
    const is_closed= req.query.is_closed;
    const condition= {Id,is_closed};
    TournamentDetailsService.getByTournamentId(condition,user).then(async(data)=>{
    res.status(200).json({
            success: true,
            message: messageContants.TOURMAMENT_DETAILS_FOUND,
            data: data
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



// Tạo thông tin chi tiết nội dung các giải đấu 
exports.createwithcontent=async (req,res,next) => {
  try{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
        }
        const datacontent= {
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
          tournament_id: req.body.tournament_id,
          deleted: false
        };
  const contentadd= await ContentCompetitionService.create(datacontent);
  const data={
          tournament_id: datacontent.tournament_id,
          content_competition_id: contentadd.id,
          is_register: req.body.is_register
        }
        console.log(data);
TournamentDetailsService.createwithcontent(data).then(result=>{
  if(result.message){
    res.status(404).json({
      success: false,
      message: result.message
    });
    }else{
      res.status(200).json({
      success: true,
      message: messageContants.TOURMAMENT_DETAILS_CREATE_SUSSCESS,
    });
  } 
}).catch(err =>{
  res.send({
    error:{
      status: err.status ||500,
      message: err.message
        }
        })
      });
    }catch(err){
    return next(err);
  }
};
// Tạo thông tin chi tiết nội dung các giải đấu bằng cách làm thủ công
exports.create=async (req,res,next) => {
  try{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
  };
  const transaction = await sequelize.transaction({ autocommit: false });
    try {
    const data= req.body;
    const result= await TournamentDetailsService.create(data,{transaction});
    if (transaction) {
      await transaction.commit();
         res.status(200).json({
         success: true,
         message: messageContants.TOURMAMENT_DETAILS_CREATE_SUSSCESS,
         data: result
       });
      }
    } catch (err) {
      if (transaction) await transaction.rollback();
      next(err);
      if (result.message) {
        return res.status(404).json({
          success: false,
          message: result.message,
        });
    }
  }
  }catch(err){
    return next(err);
  }
};

// Chỉnh sửa thông tin chi tiết nội dung các giải đấu
exports.update=async (req, res, next) => {
  try{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
    }
  const optionsCreate= {
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
      tournament_id: req.body.tournament_id,
      deleted: false
    };
    const optionsUpdate= {
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
      tournament_id: req.body.tournament_id,
      deleted: true
    };
  const Id = req.params.id;
  if(req.body.deleted==0){
    var contentadd= await ContentCompetitionService.create(optionsCreate);
    var data= {
      content_competition_id: contentadd.id,
      is_register: req.body.is_register,
      updated_date: new Date()
    }
  }else{
    var contentupdate= await ContentCompetitionService.update(req.body.content_competition_id,optionsUpdate);
    var data= {
      content_competition_id: contentupdate.id,
      is_register: req.body.is_register,
      updated_date: new Date()
    }
  }
 TournamentDetailsService.updateDetails(Id,data).then(result=>{
  if(result.message){
    res.status(404).json({
      success: false,
      message: result.message
    });
    }else{
      res.status(200).json({
      success: true,
      message: messageContants.TOURMAMENT_DETAILS_UPDATE_SUSSCESS,
    });
  } 
}).catch(err =>{
  res.send({
    error:{
      status: err.status ||500,
      message: err.message
        }
        })
    });
  }catch(err){
    return next(err);
  }
};

// REGISTER PERMISSION
exports.registerPermission= async(req,res)=>{
  const Id= req.params.id
  const options = {is_register: req.body.is_register, updated_date:new Date()}
  TournamentDetailsService.updateDetails(Id,options).then(data=>{
      if(data==true){
          res.status(200).json({
            success:true,
            message: messageContants.TOURMAMENT_DETAILS_DELETED,
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
// Xóa
exports.delete= async(req,res)=>{
    const Id= req.params.id
    const options = {field: 'deleted',deleted: 1, updated_date:new Date()}
    TournamentDetailsService.delete(Id,options).then(data=>{
        if(data==true){
            res.status(200).json({
              success:true,
              message: messageContants.TOURMAMENT_DETAILS_DELETED,
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
    const options = {field: 'deleted',deleted: 0, updated_date:new Date()}
    TournamentDetailsService.restore(Id,options).then(data=>{
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
  TournamentDetailsService.lock(Id,options).then(data=>{
      if(data==true){
          res.status(200).json({
            success:true,
            message: messageContants.TOURNAMENTS_DETAILS_LOCK_SUSSCESS,
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
  const options = {field: 'is_closed', is_closed: 0,updated_date:new Date()}
  TournamentDetailsService.unlock(Id,options).then(data=>{
      if(data==true){
          res.status(200).json({
            success:true,
            message: messageContants.TOURNAMENTS_DETAILS_UNLOCK_SUSSCESS,
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