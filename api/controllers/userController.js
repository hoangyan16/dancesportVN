const userService                         = require("../services/userService");
const { validationResult }                = require("express-validator");
const messageConstants                    = require("../constants/messageContants");
const Paginator                           = require("../commons/paginators");
const crypto                              = require('crypto');
const jwt                                 = require('jsonwebtoken');
const nodemailer                          = require('nodemailer');
const transporter                         = require('../helper/nodeMailer');
const jwt_token                           = require("../middlewares/jwt_token");

//getall
exports.getAll = async (req, res) => {
    await  userService.getAll().then((result) => {
      res.status(200).json({
          success: true,
          message: messageConstants.USER_FOUND,
          data: result
      });
  }).catch((err) => {
      console.log(err.message);
      res.send({
          error: {
              status: err.status ||500,
              message: err.message
          }
      });
  });
};

//get all paging
exports.getAllByPaging = async (req, res) => {
    const page = parseInt(req.query.page_index) ||1;
    const size = parseInt(req.query.page_size);
    const { limit, offset } = await Paginator.getPagination(page, size);
    const data = { limit, offset };
    userService.getAllByPaging(data).then((result) => {
        const response = Paginator.getPagingData(result, page, limit);
        res.status(200).json({
            success: true,
            message: messageConstants.USER_FOUND,
            data: response
        });
    }).catch((err) => {
        res.send({
            error: {
                status: err.status ||500,
                message: err.message
            }
        });
    });
};

//create
exports.create = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(422).json({errors: errors.array()});
            return;
        }
         userService.create(req.body,req.user).then(result => {
            if(result.message){
                res.json({
                    success: false,
                    error: {
                        status:404,
                        message: result.message
                    }
                });
            }else{
                res.status(200).json({
                    success: true,
                    message: messageConstants.USER_CREATE_SUSSCESS,
                    data_user: result
                });
            };
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

//Register
exports.register= (req, res, next) => {
    console.log(req.body);
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(422).json({errors: errors.array()});
            return;
        }
        userService.register(req.body).then(result => {
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
                    message: messageConstants.USER_CREATE_SUSSCESS,
                    data_user: result
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

//get by id
exports.getById = (req, res) => {
  const id = req.params.id;
  userService.getByID(id).then((result) => {
          res.status(200).json({
              success: true,
              message: messageConstants.USER_FOUND,
              data:result
          });
  }).catch((err) => {
      res.send({
          error: {
              status: err.status ||500,
              message: err.message
          }
      });
  });
};

//update
exports.update = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    id= req.params.id;
    userService.update(id, req.body).then((result) => {
        if(result.message&&result==false){
            res.status(404).json({
              success: false,
              message: result.message
            });
            }else{
              res.status(200).json({
                success: true,
                message: messageConstants.USER_UPDATE_SUSSCESS,
                data: result
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

//delete
exports.delete = (req, res) => {
  const id = req.params.id;
  const options = {field: "deleted", deleted: 1, updated_date: new Date()};
  userService.delete(id, options).then((result) => {
      if(result == true){
          res.status(200).json({
              success: true,
              message: messageConstants.USER_DELETED
          });
      }else{
          res.status(400).json({
            success: false,
              message: result.message,
          });
      }
  }).catch((err) => {
      res.json({
          error: {
              status: err.status ||500,
              message: err.message
          }
      });
  });
};

//restore
exports.restore = (req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 0, updated_date: new Date() };
  userService.restore(id, options).then((result) => {
      if(result == true){
          res.status(200).json({
              success: true,
               message: messageConstants.USER_RESTORE_SUSSCESS
          });
      }else{
          res.status(404).json({
              message: result.message
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
};


  //Login
exports.login = (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }
    userService.login(req.body).then((result) => {
        if(result.message){
            res.json({
                success: false,
                error: {
                    status:404,
                    message: result.message
                }
            })
            }
            else{
               res.status(200).json({
                 success:true,
                 message:messageConstants.USER_LOGIN_SUSSCESS,
                 data_user: {id:result.user.id,name:result.user.name,user_name:result.user.user_name,email:result.user.email,mobile:result.user.mobile,unit: result.unit,type:result.user.type,address:result.user.address,role:result.user.role,},
                 accessToken: result.accessToken,
                 refreshToken: result.refreshToken
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
//Log Out
exports.logout = (req, res) => {
    const refreshToken = req.params.refreshToken;
    userService.delete(id, options).then((result) => {
        if(result == true){
            res.status(200).json({
                success: true,
                message: messageConstants.USER_DELETED
            });
        }else{
            res.status(400).json({
              success: false,
                message: result.message,
            });
        }
    }).catch((err) => {
        res.json({
            error: {
                status: err.status ||500,
                message: err.message
            }
        });
    });
  };
  
  //Reset_password
  exports.resetPassword = (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }
      const request={
          user_name: req.body.user_name,
          password: req.body.password,
          new_password: req.body.new_password
      }
    userService.resetPassword(request).then((result) => {
        if(result.message){
            res.json({
                success: false,
                error: {
                    status:404,
                    message: result.message
                }
            })
            }
            else{
               res.status(200).json({
                 success:true,
                 message:messageConstants.USER_UPDATE_SUSSCESS,
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

// Forget_password
exports.forgetPassword =async (req, res, next) => {
    const request={
        token: req.body.token,
        password: req.body.password,
    }
    userService.forgetPassword(request).then((result) => {
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
            success:true,
            message:messageConstants.USER_UPDATE_SUSSCESS,
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
};


// Refresh Token
exports.refreshToken =async (req, res, next) => {  
    const refreshToken=req.body.refreshToken;
    if(!refreshToken){
        res.json({
            success: false,
            error: {
                status:407,
                message: "REFRESH_TOKEN_IS_INVALID"
            }
        });
    }else{
            const user              = await jwt_token.checkRefreshToken(refreshToken);
            const new_accessToken   = await jwt_token.signAccessToken(user);
            res.status(200).json({
                success:true,
                message:messageConstants.USER_REFRESH_TOKEN_SUSSCESS,
                accessToken:new_accessToken,
                });;
        };
};




exports.sendVerify =async function(req, res) {
    const email = req.body.email;
     await userService.getByEmail(email).then(async(user)=>{
            const  tokenObject = {
                    email: user.email,
                    id: user.id
                };
            var secret = user.id + '_' + user.email + '_' +new Date();
            var token = jwt.sign(tokenObject, secret);
            const options= {
                token: token,
                updated_date:new Date()
            };
            userService.update(user.id,options).then(()=>{
                res.status(200).json({
                    success:true,
                    verify_data: email
                   });
            });
              const from_email = 'hoanganlxt666666@gmail.com';
              const to_email = `${email}`;
              var url = "http://" + req.body.url + "/forgot-pass/"+token ;
              var mailOptions = {
                  from: from_email,
                  to: to_email,
                  subject: 'Password help has arrived!',
                  text: `Click to verify: ${url}`,
                  html: `<div style="text-align: center">
  <h2 style="font-size: 24px; margin-bottom: 16px">Chào: <span style="font-weight: 600; color: #09B1BA">${user.user_name}</span> !</h2>
  <h2 style="font-size: 22px; margin-bottom: 24px">Nhấn vào đường dẫn bên dưới để xác nhận !</h2>
  <button style="padding: 10px 26px; background: #ffffff; border: 1px solid #09B1BA; border-radius:8px"><a style="text-decoration: none; color: #09B1BA; font-size: 22px; font-weight: 600" href="${url}">Xác nhận</a></button>
</div>`,
              };
              const contentMail=await   transporter.sendMail(mailOptions);
              if (contentMail.accepted.length<1) {
               res.json({
                   success: false,
                   error: {
                       status:404,
                       message: contentMail
                   }
               });
              };
     }).catch((err) => {
        res.send({
            error: {
                status: err.status ||500,
                message: err.message
            }
        });
    });
};

exports.sendEmailToVerifyAccount =async function(req, res) {
    const email = req.body.email;
     await userService.getByEmail(email).then(async(user)=>{
            const  tokenObject = {
                    email: user.email,
                    id: user.id
                };
            var secret = user.id + '_' + user.email + '_' +new Date();
            var token = jwt.sign(tokenObject, secret);
            const options= {
                token: token,
                updated_date:new Date()
            };
            userService.update(user.id,options).then(()=>{
                res.status(200).json({
                    success:true,
                    verify_data: email
                });
            });
              const from_email = 'hoanganlxt666666@gmail.com';
              const to_email = `${email}`;
              var url = "http://" + req.body.url + "/verify-email/"+token ;
              var mailOptions = {
                  from: from_email,
                  to: to_email,
                  subject: 'Password help has arrived!',
                  text: `Click to verify: ${url}`,
                  html: `<div style="text-align: center">
  <h2 style="font-size: 24px; margin-bottom: 16px">Chào: <span style="font-weight: 600; color: #09B1BA">${user.user_name}</span> !</h2>
  <h2 style="font-size: 22px; margin-bottom: 24px">Nhấn vào đường dẫn bên dưới để xác nhận !</h2>
  <button style="padding: 10px 26px; background: #ffffff; border: 1px solid #09B1BA; border-radius:8px"><a style="text-decoration: none; color: #09B1BA; font-size: 22px; font-weight: 600" href="${url}">Xác nhận</a></button>
</div>`,
            };
              const contentMail=await transporter.sendMail(mailOptions);
              if (contentMail.accepted.length<1) {
               res.json({
                   success: false,
                   error: {
                       status:404,
                       message: contentMail
                   }
               });
              };
     }).catch((err) => {
        res.send({
            error: {
                status: err.status ||500,
                message: err.message
            }
        });
    });
};

// Forget_password
exports.verifyForRegister =async (req, res, next) => {
    userService.verifyForRegister(req.body).then((result) => {
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
            success:true,
            message:messageConstants.USER_UPDATE_SUSSCESS,
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
};
