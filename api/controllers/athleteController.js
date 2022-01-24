'use strict'
const AthletesService                           = require('../services/athleteService');
const TournamentsService                        = require("../services/tournamentService");
const UnitsService                              = require('../services/unitService');
const RegistrationService                       = require('../services/registrationService');
const { validationResult }                      = require('express-validator');
const Paginator                                 = require('../commons/paginators');
const messageContants                           = require('../constants/messageContants');
const TournamentDetailsService                  = require('../services/tournamentDetailService');
const transporter                               = require('../helper/nodeMailer');
const fs                                        = require("fs");

// Lấy thông tin người tham đã được tạo 
exports.getAll= async(req,res)=>{
    if(req.query.columnName==='unit_id'){
    const index=  await UnitsService.sortFromAthlete(req.query);
    const success= await AthletesService.SaveOrderFromUnit(index);
    if(success==true){
      await AthletesService.getAll(req.user).then(data=>{
        res.status(200).json({
        success: true,
        message: messageContants.ATHLETE_FOUND,
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
    await AthletesService.getAll(req.user,req.query).then(async(data)=>{
      let i=0;
      const index= data.map(item=>{
              i++
        return {
              id: item.id,
              index:i
        }
      });
      const success= await AthletesService.SaveOrder(index);
      if(success==true){
        res.status(200).json({
        success: true,
        message: messageContants.ATHLETE_FOUND,
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
  }
};



// Lấy thông tin người tham đã được tạo 
exports.getAllNotActive= async(req,res)=>{
  // var data = JSON.stringify(req.body.data);
  // var sort = JSON.stringify(req.body.sortColumn);
  // var condition= {data,sort};
  if(req.query.columnName==='unit_id'){
    const index=  await UnitsService.sortFromAthlete(req.query);
    const success= await AthletesService.SaveOrderFromUnit(index);
    if(success==true){
      await AthletesService.getAllNotActive(req.user).then(data=>{
        res.status(200).json({
        success: true,
        message: messageContants.ATHLETE_FOUND,
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
  await AthletesService.getAllNotActive(req.user,req.query).then(async(data)=>{
    let i=0;
    const index= data.map(item=>{
            i++
      return {
            id: item.id,
            index:i
      }
    });
    const success= await AthletesService.SaveOrder(index);
    if(success==true){
      res.status(200).json({
      success: true,
      message: messageContants.ATHLETE_FOUND,
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
  }
};
// Lấy thông tin người tham gia đã được tạo bằng paging
exports.getAllByPaging= async(req,res)=>{
  const page = parseInt(req.query.page_index) ||1;
  const size = parseInt(req.query.page_size);
  const user= req.user;
  const {limit,offset}= Paginator.getPagination(page,size);
  const data= {limit,offset,user};
  AthletesService.getAllByPaging(data).then(data=>{
      const response= Paginator.getPagingData(data,page,limit);
    res.status(200).json({
    success: true,
    message: messageContants.ATHLETE_FOUND,
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

// Lấy thông tin người tham gia
exports.getbyId= (req,res)=>{
  AthletesService.getbyId(req.params.id).then(data=>{
    if(data.message){
      res.json({
        success: false,
        error: {
            status:404,
            message: result.message
        }
    })
      }else{
        res.status(200).json({
          success: true,
          message: messageContants.ATHLETE_FOUND,
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

// Lấy thông tin vận động viên trong một giải đấu
exports.getbyTournamnetId=async (req,res)=>{
  if(req.query.columnName==='unit_id'){
    const index=  await UnitsService.sortFromAthlete(req.query);
    const success= await AthletesService.SaveOrderFromUnit(index);
    if(success==true){
      await AthletesService.getbyTournamnetId(req.query.tournament_id,req.user).then(data=>{
        res.status(200).json({
        success: true,
        message: messageContants.ATHLETE_FOUND,
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
  AthletesService.getbyTournamnetId(req.query.tournament_id,req.user,req.query).then(async(data)=>{
    let i=0;
    const index= data.map(item=>{
            i++
      return {
            id: item.id,
            index:i
      }
    });
    const success= await AthletesService.SaveOrder(index);
    if(success==true){
      res.status(200).json({
      success: true,
      message: messageContants.ATHLETE_FOUND,
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
};

// Lấy thông tin vận động viên chưa kích hoạt trong một giải đấu
exports.getbyTournamnetIdNoActive= async(req,res)=>{
  if(req.query.columnName==='unit_id'){
    const index=  await UnitsService.sortFromAthlete(req.query);
    const success= await AthletesService.SaveOrderFromUnit(index);
    if(success==true){
      await AthletesService.getbyTournamnetIdNoActive(req.query.tournament_id,req.user).then(async(data)=>{
        res.status(200).json({
        success: true,
        message: messageContants.ATHLETE_FOUND,
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
  AthletesService.getbyTournamnetIdNoActive(req.query.tournament_id,req.user,req.query).then(async(data)=>{
    let i=0;
    const index= data.map(item=>{
            i++
      return {
            id: item.id,
            index:i
      }
    });
    const success= await AthletesService.SaveOrder(index);
    if(success==true){
      res.status(200).json({
      success: true,
      message: messageContants.ATHLETE_FOUND,
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
};
// Tạo thông tin người tham gia
exports.create=async (req,res,next)=>{  
  try{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
        }
 AthletesService.create(req.body,req.user).then(async(result)=>{
  if(result.message){
    res.json({
      success: false,
      error: {
          status:404,
          message: result.message
      }
  })
    }else{
      res.status(200).json({
        success: true,
        message: messageContants.ATHLETE_CREATE_SUSSCESS,
        data: result
         }); 
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
    return next(err);
  }
};

// UPDATE
exports.update=async (req, res, next)=>{  
  try{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
    }
  const Id= req.params.id;
  const details_id= await RegistrationService.getDetailsByAthletesID(Id);
  const quantityForSubtract=await AthletesService.getAthleteForEdit(Id);
  if(quantityForSubtract!==0){
    await TournamentDetailsService.SubtractQuantityAthletesFromActiveAthletes(details_id,quantityForSubtract);
  };
    await  RegistrationService.delete2(Id);
    let tournament_detail_id= req.body.tournament_detail_id? req.body.tournament_detail_id: null;
      if(tournament_detail_id===null){
        let option={
          tournament_detail_id: null,
          tournament_id: req.body.tournament_id,
          athlete_id: Id
        }
        RegistrationService.create1(option);
        }else{  
          let option={
            tournament_detail_id: tournament_detail_id,
            tournament_id: req.body.tournament_id,
            athlete_id: Id
          }
         RegistrationService.create(option);
        };
  
        if(tournament_detail_id===null){
          req.body.fee_amount= 0;
        }else{
          const detail_ids =JSON.parse("["+tournament_detail_id+"]");
          if(req.body.is_flashmob===1){
            const fee_amount= await TournamentDetailsService.CalculateFeeAmount(detail_ids,req.body.date_of_birth_one);
            req.body.fee_amount= fee_amount;
          }else{
            const fee_amount= await TournamentDetailsService.CalculateFeeAmount(detail_ids);
            req.body.fee_amount= fee_amount;
          }
        }
        const dataAthlete= {
          full_name_one: req.body.full_name_one,
          date_of_birth_one: req.body.date_of_birth_one,
          full_name_two: req.body.full_name_two,
          date_of_birth_two: req.body.date_of_birth_two,
          number:req.body.number,
          number_of_couple: req.body.number_of_couple,
          email: req.body.email,
          mobile: req.body.mobile,
          name: req.body.name,
          unit_id:req.body.unit_id,
          is_flashmob:req.body.is_flashmob,
          fee_amount: req.body.fee_amount,
          is_pay: req.body.is_pay,
          is_group:req.body. is_group,
          user_name:req.body.user_name,
          updated_date:new Date()
        };
        AthletesService.update(Id,dataAthlete).then(async(result)=>{
        if(result.message){
          res.json({
            success: false,
            error: {
                status:404,
                message: result.message
            }
        })
          }else{
            res.status(200).json({
              success: true,
              message: messageContants.ATHLETE_UPDATE_SUSSCESS,
               }); 
              };
            const quantityForAdd=parseInt(await AthletesService.getAthleteForEdit(Id));
            const detail_id= await RegistrationService.getDetailsByAthletesID(Id);
            TournamentDetailsService.AddQuantityAthletesFromActiveAthletes(detail_id,quantityForAdd);
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


// XÓA 1 VĐV
exports.delete= async(req,res)=>{
    const Id= req.params.id
    const options = { deleted: 1, updated_date:new Date()};
        await RegistrationService.deleteAthletes(Id,options);
        await AthletesService.delete(Id,options).then(async(data)=>{
            const details_id= await RegistrationService.getDetailsByAthletesIDForSubtract(data.id);
          // return  res.send(details_id);
            await TournamentDetailsService.SubtractQuantityAthletesFromActiveAthletes(details_id,data.date_of_birth_one);
              res.status(200).json({
                success:true,
                message: messageContants.ATHLETE_DELETED,
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

// ACTIVE 1 VĐV
exports.activeAthletes= async(req,res)=>{
  const Id= req.params.id;
  const options = {field: 'status',status: 1, updated_date:new Date()};
  AthletesService.activeAthletes(Id,options).then(async(data)=>{
      if(data){
        const details_id= await RegistrationService.getDetailsByAthletesID(Id);
        await TournamentDetailsService.AddQuantityAthletesFromActiveAthletes(details_id,data.date_of_birth_one);
         res.status(200).json({
         success: true,
         message: messageContants.REGISTRATION_CREATE_SUSSCESS,
         data: data
        }); 
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

//ACTIVE CÁC VĐV
exports.activeAllAthletes= async(req,res)=>{
  console.log(req.body.id);
  const Id=JSON.parse("[" + req.body.id + "]");
  const options = {field: 'status',status: 1, updated_date:new Date()};
  await AthletesService.activeAllAthletes(Id,options).then(async(data)=>{
    //  console.log(data.length);
    //  return res.send({number:data.length});
     for(var i=0; i<data.length;i++){
       const details_id= await RegistrationService.getDetailsByAthletesID(data[i].id);
        await  TournamentDetailsService.AddQuantityAthletesFromActiveAthletes(details_id,data[i].date_of_birth_one);
      };
    res.status(200).json({
      success: true,
      message: messageContants.REGISTRATION_CREATE_SUSSCESS,
      // data: data
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

// XÓA CÁC VĐV ACTIVE
exports.deleteAllAthletes= async(req,res)=>{
  const Id= JSON.parse("[" +req.body.id+ "]");
  const options = {field: 'deleted', deleted: 1, updated_date:new Date()};
     await RegistrationService.deleteAllAthletes(Id,options);
     await AthletesService.deleteAll(Id,options).then(async(data)=>{
        if(data.length>0){
          for(var i=0;i<Id.length;i++){
            let details_id= await RegistrationService.getDetailsByAthletesIDForSubtract(data[i].id);
            await TournamentDetailsService.SubtractQuantityAthletesFromActiveAthletes(details_id,data[i].date_of_birth_one);
          };
        };
        res.status(200).json({
          success: true,
          message: messageContants.REGISTRATION_CREATE_SUSSCESS,
          // data: data
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


// XÓA CÁC VĐV CHƯA ACTIVE
exports.deleteNotActiveAthletes= async(req,res)=>{
      const Id= JSON.parse("[" +req.body.id+ "]");
      const options = {field: 'deleted', deleted: 1, updated_date:new Date()};
          await RegistrationService.deleteAllAthletes(Id,options);
          await AthletesService.deleteAllNotActive(Id,options).then(async(data)=>{
            res.status(200).json({
              success: true,
              message: messageContants.REGISTRATION_CREATE_SUSSCESS,
              // data: data
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


// DECIDE ATHLETE NUMBER
exports.decideAthletesNumbers =async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const Athletes= await RegistrationService.getAllAthletesByTournamentId(req.body.tournament_id);
    await AthletesService.decideAthletesNumbers(Athletes.athletes_id,req.body.atheletes_number_start).then((result) => {
        if(result.message&&result==false){
            res.status(404).json({
              success: false,
              message: result.message
            });
            }else{
              res.status(200).json({
                success: true,
                message: messageContants.ATHLETE_UPDATE_SUSSCESS,
            });
        }
    }).catch((err) => {
        res.send({
            error: {
                status: err.status ||500,
                message: err.message
            }
        });
    });
  } catch (err) {
    return next(err);
  }
};

// Khôi phục vđv
exports.restore= async(req,res)=>{
    const Id= req.params.id
    const options = {field: 'Deleted',deleted: 0, updated_date:new Date()}
    AthletesService.restore(Id,options).then(data=>{
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
  AthletesService.lock(Id,options).then(data=>{
      if(data==true){
          res.status(200).json({
            success:true,
            message: messageContants.ATHLETE_LOCK_SUSSCESS,
            });
          }else{
            res.json({
              success: false,
              error: {
                  status:404,
                  message: result.message
              }
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


// Check is_pay
exports.CheckIsPay= async(req,res)=>{
  const Id= req.params.id
  const option1 = {field: 'is_pay', is_pay:true, updated_date:new Date()};
  const option2 = {field: 'is_pay', is_pay:false, updated_date:new Date()};
   await AthletesService.CheckIsPay(Id,option1,option2).then(()=>{
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
};

// Send Mail cho vđv theo giải đấu
exports.sendMail= async(req,res)=>{
  const Athletes= await RegistrationService.getAllAthletesByTournamentId(req.body.tournament_id);
  res.status(200).json({
  data_sendmail_athletes: Athletes,
  success: true,
  message: messageContants.REGISTRATION_CREATE_SUSSCESS,
 });
  AthletesService.getAthletesWithContentInTournament(req.body.tournament_id).then(async(data)=>{
    if(data){     
        let count= 0;
        for(var i=0;i<data.length;i++){
          let filename = `VSKSystemOnlineConfirmRegister.xlsx`;
          let buffer=  AthletesService.createExcelFileForAthletesActived(data[i],Athletes.tournament,filename);
          let to_email = `${data[i].email}`;
           let mailOptions = {
              from: process.env.EMAIL,
              to: to_email,
              subject: 'Your registration successfully!',
              html: `<div >
              <p>Xác nhận đăng ký thành công</p>
              <p>VKSystem Online xác nhận bạn đã đăng ký thành công, chi tiết các nội dung thi đấu vui lòng xem ở file đính kèm.</p>
              <br>
              <p>Trân trọng cảm ơn và hẹn gặp lại,</p>
              <br>
              <p>VKSystem Administrator,</p>
              <p>Email: itcvn2005@gmail.com</p>
              <p>Hotline 24/7: 0906071919</p>
              </div>`,
              attachments:[
                {
                filename: filename,
                path: `${__basedir}/resources/files/jsontoexcel/${filename}`,
                content: buffer,
              },
            ]
          };
        const contentMail= await transporter.sendMail(mailOptions);
        if(contentMail.accepted.length>0){
            count++;
          }
        }
        console.log("Đã gửi được " +count+ " email" );
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



// Send Mail cho vđv theo giải đấu
exports.exportAthletesExcelFiles= async(req,res)=>{
  const Athletes= await RegistrationService.getAllAthletesByTournamentId(req.body.tournament_id);
  const contentSymbol= await TournamentDetailsService.getAllContentOfTournament(req.body.tournament_id);
  AthletesService.getAthletesForExcel(req.body.tournament_id).then(async(data)=>{
    if(data){     
      let filename = `DSRegData_FINAL${Athletes.tournament.id}.xlsx`;
      let buffer= await AthletesService.createExcelFileForAthletes(data,Athletes.tournament,filename,contentSymbol);
      if(buffer){
        const path=  `http://${req.headers.host}${buffer.link}`
      res.status(200).json({
        success: true,
        link :data,
        message: messageContants.REGISTRATION_CREATE_SUSSCESS,
     });
    }
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
