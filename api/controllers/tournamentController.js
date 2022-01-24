const TournamentsService                      = require("../services/tournamentService");
const McService                               = require("../services/mcService");
const FeeDetailService                        = require("../services/feeDetailService");
const ResourcesService                        = require("../services/resourceService");
const TournamentDetailsService                = require("../services/tournamentDetailService");
const { validationResult }                    = require("express-validator");
const Paginator                               = require("../commons/paginators");
const sequelize                               = require("../../models").sequelize;
const messageContants                         = require("../constants/messageContants");
const checkAuthentication                     = require("../middlewares/jwt_token");




// Lấy thông tin  đã được tạo
exports.getAll = async (req, res,next) => {
  try{
    let user;
    if(req.headers.authorization){
       user =await checkAuthentication.checkAccessTokenorNot(req);
    }else{
        user= null
    };
  TournamentsService.getAll(user).then((data) => {
      res.status(200).json({
        success: true,
        message: messageContants.TOURNAMENTS_FOUND,
        data: data,
      });
    })
    .catch((err) => {
      res.send({
        error: {
          status: err.status || 500,
          message: err.message,
        },
      });
    });
  }catch(err){
    return next(err);
  }
};


// Lấy thông tin  đã được tạo
exports.uploadExcelFiles = async (req, res) => {
  TournamentsService.getAll().then((data) => {
      res.status(200).json({
        success: true,
        message: messageContants.TOURNAMENTS_FOUND,
        data: data,
      });
    })
    .catch((err) => {
      res.send({
        error: {
          status: err.status || 500,
          message: err.message,
        },
      });
    });
};

// Lấy thông tin nội dung các cuộc thi đã được tạo
exports.getAllPreparedData = async (req, res) => {
  TournamentsService.getAllPreparedData().then((data) => {
      res.status(200).json({
        success: true,
        message: messageContants.TOURNAMENTS_FOUND,
        data: data,
      });
    })
    .catch((err) => {
      res.send({
        error: {
          status: err.status || 500,
          message: err.message,
        },
      });
    });
};

// Lấy thông tin đã được tạo bằng paging
exports.getAllByPaging = async (req, res) => {
  const page = parseInt(req.query.page_index) || 1;
  const size = parseInt(req.query.page_size);
  const { limit, offset } = Paginator.getPagination(page, size);
  const data = { limit, offset };
  TournamentsService.getAllByPaging(data).then((data) => {
      const response = Paginator.getPagingData(data, page, limit);
      res.status(200).json({
        success: true,
        message: messageContants.TOURNAMENTS_FOUND,
        data: response,
      });
    })
    .catch((err) => {
      res.send({
        error: {
          status: err.status || 500,
          message: err.message,
        },
      });
    });
  };
  
  // Lấy thông tin
  exports.getbyId =async (req, res) => {
    TournamentsService.getbyIdWithResource(req.params.id).then((data) => {
      if(data==null){
        TournamentsService.getbyId(req.params.id).then((data) => {
          if (data.message) {
            res.status(404).json({
              success: false,
              message: data.message,
            });
          } else {
            res.status(200).json({
              success: true,
              message: messageContants.TOURNAMENTS_FOUND,
              data: data,
            });
          }
        })
        .catch((err) => {
          res.send({
            error: {
              status: err.status || 500,
              message: err.message,
            },
          });
        });
        
      }else{
        res.status(200).json({
          success: true,
          message: messageContants.TOURNAMENTS_FOUND,
          data: data,
        });
      }
    }).catch((err) => {
      res.send({
        error: {
          status: err.status || 500,
          message: err.message,
        },
      });
    });
};

// Tạo
exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      res.status(422).json({
        errors: errors.array(),
      });
      return;
    };
    const transaction = await sequelize.transaction({ autocommit: false });
    try {
      var result= await  TournamentsService.create(req.body,{transaction});
          await ResourcesService.create(req,result,{transaction});
          await McService.create(result,{transaction});
          await FeeDetailService.create(req.body.fee_details,result.id,{transaction});
          if (transaction) {
            await transaction.commit();
            return res.status(200).json({
              success: true,
              message: messageContants.TOURNAMENTS_CREATE_SUSSCESS,
              data: result,
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
  } catch (err) {
    return next(err);
  }
};
// Update
exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    };

    const Id = req.params.id;
    const options = { field: "deleted", deleted: 1, updated_date: new Date() };
    const data = {
      start_date: req.body.start_date,    
      end_date: req.body.end_date,
      currency_name: req.body.currency_name,
      content: req.body.content,
      is_active: req.body.is_active,
      is_comment: req.body.is_comment,
      name: req.body.name,
      address: req.body.address,
      updated_date: new Date()
};
await FeeDetailService.update(req.body.fee_details,Id);
await TournamentsService.update(Id,data).then(async(result) => {
  ResourcesService.destroy(Id,options);
  if (result.message) {
    res.status(404).json({
      success: false,
      message: result.message,
    });
  }else {
        await ResourcesService.update(req,Id).then(result=>{
          res.status(200).json({
            success: true,
            message: messageContants.TOURNAMENTS_UPDATE_SUSSCESS,
            data: result.data,
          });
        }).catch((err) => {
          res.send({
            erorr: {
              status: err.status || 500,
              message: err.message,
            },
          });
        });
      }
      }).catch((err) => {
        res.send({
          error: {
            status: err.status || 500,
            message: err.message,
          },
        });
      });
  } catch (err) {
    return next(err);
  }
};

// Xóa

exports.delete = async (req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 1, updated_date: new Date() };
   const tour_id= await TournamentsService.getActiveTour(id);
   if(tour_id){
     return res.json({
       success: false,
       error: {
         status: 403,
         message: messageContants.TOURNAMENTS_ID_EXIST
        }
      });
    }else{
      const data= await TournamentsService.delete(id, options);
       if (data == true) {
         await TournamentDetailsService.deleteWhenTourDeleted(id,options);
         res.status(200).json({
           success: true,
           message: messageContants.TOURNAMENTS_DELETED,
         });
       } else {
           res.status(404).json({
             success: false,
             message: data.message,
           });
      };
    };
};

exports.restore = async (req, res) => {
  const Id = req.params.id;
  const options = { field: "deleted", deleted: 0, updated_date: new Date() };
  TournamentsService.restore(Id, options)
    .then((data) => {
      if (data == true) {
        res.status(200).json({
          success: true,
        });
      }
    })
    .catch((err) => {
      res.send({
        error: {
          status: err.status || 500,
          message: err.message,
        },
      });
    });
};

// Khóa

exports.lock = async (req, res) => {
  const Id = req.params.id;
  const options = { field: "is_closed", is_closed: 1, updated_date: new Date() };
  TournamentsService.lock(Id, options)
    .then((data) => {
      if (data == true) {
        res.status(200).json({
          success: true,
          message: messageContants.TOURNAMENTS_LOCK_SUSSCESS,
        });
      } else {
        res.status(404).json({
          success: false,
          message: data.message,
        });
      }
    })
    .catch((err) => {
      res.send({
        error: {
          status: err.status || 500,
          message: err.message,
        },
      });
    });
};

// Mở khóa

exports.unlock = async (req, res) => {
  const Id = req.params.id;
  const options = { field: "is_closed", is_closed: 0, updated_date: new Date() };
  TournamentsService.unlock(Id, options)
    .then((data) => {
      if (data == true) {
        res.status(200).json({
          success: true,
          message: messageContants.TOURNAMENTS_UNLOCK_SUSSCESS,
        });
      } else {
        res.status(404).json({
          success: false,
          message: data.message,
        });
      }
    })
    .catch((err) => {
      res.send({
        error: {
          status: err.status || 500,
          message: err.message,
        },
      });
    });
};
