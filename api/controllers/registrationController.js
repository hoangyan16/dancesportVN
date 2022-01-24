const RegistrationService                             = require('../services/registrationService');
const userService                                     = require('../services/userService');
const AthleteService                                  = require('../services/athleteService');
const messageContants                                 = require('../constants/messageContants');
const Paginator                                       = require('../commons/paginators');
const { validationResult }                            = require('express-validator');
const TournamentDetailService                         = require('../services/tournamentDetailService');
const UnitService                                     = require('../services/unitService');
const transporter                                     = require('../helper/nodeMailer');
const util                                            = require('util');

// Lấy thông tin đã được tạo 
exports.getAll= async(req,res)=>{
  RegistrationService.getAll().then(data=>{
      res.status(200).json({
      success: true,
      message: messageContants.REGISTRATION_FOUND,
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


// Lấy thông tin đã được tạo bằng paging
exports.getAllByPaging= async(req,res)=>{
  const page = parseInt(req.query.page_index) ||1;
  const size = parseInt(req.query.page_size);
  const {limit,offset}= Paginator.getPagination(page,size);
  const data= {limit,offset};
  RegistrationService.getAllByPaging(data).then(data=>{
      const response= Paginator.getPagingData(data,page,limit);
     res.status(200).json({
    success: true,
    message: messageContants.REGISTRATION_FOUND,
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

// Lấy thông tin chi tiết
exports.getbyId= (req,res)=>{
  RegistrationService.getbyId(req.params.id).then(data=>{
    if(data.message){
      res.status(404).json({
        success: false,
        message: data.message
      });
      }else{
        res.status(200).json({
          success: true,
          message: messageContants.REGISTRATION_FOUND,
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

// Tạo 
exports.create=async(req,res,next) => {
  try{
    const errors = validationResult(req.body);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
}  
        const user_name= req.user.user_name;
        req.body.created_by= user_name;
        let tournament_detail_id= req.body.tournament_detail_id? req.body.tournament_detail_id: null;
        if(tournament_detail_id===null){
          req.body.fee_amount= 0;
        }else{
          const detail_ids =JSON.parse("["+tournament_detail_id+"]");
          if(req.body.is_flashmob===1){
            const fee_amount= await TournamentDetailService.CalculateFeeAmount(detail_ids,req.body.date_of_birth_one);
            req.body.fee_amount= fee_amount;
          }else{
            const fee_amount= await TournamentDetailService.CalculateFeeAmount(detail_ids);
            req.body.fee_amount= fee_amount;
          }
        };
        const detail_ids =JSON.parse("["+tournament_detail_id+"]");
        const AthId= await AthleteService.create(req.body);
        const data= {
          athlete_id: AthId.id,
          tournament_id: req.body.tournament_id,
          tournament_detail_id: tournament_detail_id,
          name_of_competition: req.body.name_of_competition,
      };
        if(tournament_detail_id===null){
          RegistrationService.create1(data).then(async(result)=>{
               res.status(200).json({
                 success: true,
                 message: messageContants.REGISTRATION_CREATE_SUSSCESS,
               }); 
          }).catch(err =>{
             res.send({
               error:{
                 status: err.status ||500,
                 message: err.message
                 },
               })
             });
        }else{
          RegistrationService.create(data).then(async(result)=>{
          await TournamentDetailService.AddQuantityAthletesFromActiveAthletes(detail_ids,req.body.date_of_birth_one);
             res.status(200).json({
               success: true,
               message: messageContants.REGISTRATION_CREATE_SUSSCESS,
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
  }catch(err){
    return next(err);
  }
};
// Chỉnh sửa
exports.update=async (req,res, next)=>{ 
  try{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
        } 
  const Id= req.body.id;
  const data= {
    athlete_id: req.body.id,
    tournament_id: req.body.tournament_id,
    tournament_detail_id: req.body.tournament_detail_id,
    name_of_competition: req.body.name_of_competition,
  }
 RegistrationService.update(Id,data).then(async(result)=>{
  if(result.message){
    res.status(404).json({
      success: false,
      message: result.message
    });
    }else{
      const details_id= await RegistrationService.getDetailsByAthletesID(req.body.id);
      await TournamentDetailService.AddQuantityAthletesFromActiveAthletes(details_id)
      res.status(200).json({
        success: true,
        message: messageContants.REGISTRATION_CREATE_SUSSCESS,
        data: result
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


//Đăng kí tự do 
exports.freeRegistration =async(req,res,next) => { 
  let tournament_detail_id= req.body.tournament_detail_id? req.body.tournament_detail_id: null;
  if(tournament_detail_id===null){
    req.body.fee_amount= 0;
  }else{
    const detail_ids =JSON.parse("["+tournament_detail_id+"]");
    if(req.body.is_flashmob===1){
      const fee_amount= await TournamentDetailService.CalculateFeeAmount(detail_ids,req.body.date_of_birth_one);
      req.body.fee_amount= fee_amount;
    }else{
      const fee_amount= await TournamentDetailService.CalculateFeeAmount(detail_ids);
      req.body.fee_amount= fee_amount;
    }
  }
  if(typeof req.body.unit_id=="string"){
    let unit_id= await UnitService.createFromRegistration(req.body.unit_id);
    req.body.unit_id= unit_id.id;
  }
  const Ath= await AthleteService.freeCreate(req.body);
  const units= await UnitService.getById(Ath.unit_id);
  const data= {
    athlete_id: Ath.id,
    tournament_id: req.body.tournament_id,
    tournament_detail_id: tournament_detail_id
  };
  RegistrationService.create(data).then(async(result)=>{
   if(result){
    res.status(200).json({
      success: true,
      message: messageContants.REGISTRATION_CREATE_SUSSCESS,
      }); 
      const to_email = `${req.body.email}`;
      let mailOptions={};
      if(!Ath.full_name_two&&!Ath.date_of_birth_two){
       mailOptions = {
         from: process.env.EMAIL,
         to: to_email,
         subject: 'Your registration successfully!',
         html:
         `<div>
         <p>VKSystem Online xác nhận bạn đã đăng ký thành công !</p>
             <p>Họ tên nam :${Ath.full_name_one}</p>
             <p>Năm sinh :${Ath.date_of_birth_one}</p>
             <p>Số điện thoại: ${Ath.mobile}</p>
             <p>Đơn vị: ${units.name}</p>
             <br>
             <p>Trân trọng cảm ơn và hẹn gặp lại,</p>
             <br>
             <p>VKSystem Administrator,</p>
             <p>Email: itcvn2005@gmail.com</p>
             <p>Hotline 24/7: 0906071919</p>
      </div>`,
   };
}else if(Ath.date_of_birth_two){
 mailOptions = {
   from: process.env.EMAIL,
   to: to_email,
   subject: 'Your registration successfully!',
   html:  
   `<div>
   <p>VKSystem Online xác nhận bạn đã đăng ký thành công!</p>
       <p>Họ tên nam :${Ath.full_name_one}</p>
       <p>Năm sinh :${Ath.date_of_birth_one}</p>
       <p>Họ và tên :${Ath.full_name_two}</p>
       <p>Năm sinh: ${Ath.date_of_birth_two}</p>
       <p>Số điện thoại: ${Ath.mobile}</p>
       <p>Đơn vị: ${units.name}</p>
       <br>
       <p>Trân trọng cảm ơn và hẹn gặp lại,</p>
       <br>
       <p>VKSystem Administrator,</p>
       <p>Email: itcvn2005@gmail.com</p>
       <p>Hotline 24/7: 0906071919</p>
</div>`,
  };
}else{
  mailOptions = {
    from: process.env.EMAIL,
    to: to_email,
    subject: 'Your registration successfully!',
    html:  
    `<div>
    <p>VKSystem Online xác nhận bạn đã đăng ký thành công!</p>
        <p>Họ tên nam :${Ath.full_name_one}</p>
        <p>Năm sinh :${Ath.date_of_birth_one}</p>
        <p>Họ tên nữ :${Ath.full_name_two}</p>
        <p>Năm sinh: ${Ath.date_of_birth_two}</p>
        <p>Số điện thoại: ${Ath.mobile}</p>
        <p>Đơn vị: ${units.name}</p>
        <br>
        <p>Trân trọng cảm ơn và hẹn gặp lại,</p>
        <br>
        <p>VKSystem Administrator,</p>
        <p>Email: itcvn2005@gmail.com</p>
        <p>Hotline 24/7: 0906071919</p>
 </div>`,
   };
}
const contentMail=await  transporter.sendMail(mailOptions);
if (contentMail.accepted.length<1) {
 res.json({
     success: false,
     error: {
         status:404,
         message: contentMail
      }
     });
  };
};
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
    const options = {field: 'deleted', Deleted: 1, updated_date:new Date()}
    RegistrationService.delete(Id,options).then(data=>{
        if(data==true){
            res.status(200).json({
              success:true,
              message: messageContants.REGISTRATION_DELETED,
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
    const options = {field: 'Deleted',deleted: 0, updated_date:new Date()}
    RegistrationService.restore(Id,options).then(data=>{
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
  const options = {field: 'is_closed', is_closed: 1,updated_date:new Date()}
  RegistrationService.lock(Id,options).then(data=>{
      if(data==true){
          res.status(200).json({
            success:true,
            message: messageContants.REGISTRATION_LOCK_SUSSCESS,
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
  RegistrationService.unlock(Id,options).then(data=>{
      if(data==true){
          res.status(200).json({
            success:true,
            message: messageContants.REGISTRATION_UNLOCK_SUSSCESS,
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