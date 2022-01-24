const formalityService                                 = require("../services/formalityService");
const { validationResult }                             = require("express-validator");
const messageConstants                                 = require("../constants/messageContants");
const Paginator                                        = require("../commons/paginators");
const messageContants                                  = require("../constants/messageContants");
const sequelize                                        = require('../../models').sequelize;
const ContentCompetitionService                        = require("../services/contentCompetitionService");
const feesService                                      = require("../services/feeService");


//get all
exports.getAll = (req, res) => {
  formalityService.getAll().then((data) => {
      res.status(200).json({
        message: messageConstants.FORMALITY_FOUND,
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

//get by dance-types
exports.getAllPreparedData = async (req,res) => {
  formalityService.getAllPreparedData().then(data => {
    if(data){
      res.status(200).json({
        success: true,
        message: messageConstants.FORMALITY_FOUND,
        data: data
      });
    }else{
        res.json({
          success: false,
          error: {
            status:404,
            message: messageConstants.THEME_NOT_FOUND,
          }
        })
    }
  }).catch(err => {
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
  formalityService.getAllByPaging(data).then((result) => {
      const reponse = Paginator.getPagingData(result, page, limit);
      res.status(200).json({
        success: true,
        message: messageConstants.FORMALITY_FOUND,
        data: reponse,
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

//get by id
exports.getById = (req, res) => {
  const id = req.params.id;
  formalityService.getById(id).then((data) => {
      if (data === null) {
        res.json({
          success: false,
          error: {
            status:404,
            message: result.message
          }
        })
      } else {
        res.status(200).json({
        message: messageConstants.FORMALITY_FOUND,
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

//create
exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      res.status(422).json({
        errors: errors.array(),
      });
      return;
    }
    
const transaction = await sequelize.transaction({ autocommit: false });
try {
var result=  await formalityService.create(req.body,{transaction});
} catch (err) {
  if (transaction) await transaction.rollback();
  next(err);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
}
if (transaction) {
  await transaction.commit();
  return res.status(200).json({
    success: true,
    message: messageContants.FORMALITY_CREATE_SUSSCESS,
    data: result,
  });
}
  } catch (err) {
    return next(err);
  }
}

//update
exports.update = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const id = req.params.id;
    const data = {
      name: req.body.name,
      symbol: req.body.symbol,
      dance_type_id: req.body.dance_type_id,
      updated_by: req.body.updated_by,
      updated_date: new Date(),
    };
    formalityService.update(id, data).then((result) => {
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
            message: messageConstants.FORMALITY_UPDATE_SUSSCESS,
        })
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
  } catch (err) {
    return next(err);
  }
};

//delete
exports.delete = async(req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 1 };
   await ContentCompetitionService.getByAgeId().then(async(contents)=>{
     const formality_id_in_content=[];
     for(var i= 0; i<contents.count;i++){
       formality_id_in_content[i]= contents.rows[i].formality_id;
   };
   const id_compared = formality_id_in_content.some(item => item == id)
       if(id_compared){
           return res.json({
               success: false,
               error: {
                   status: 403,
                   message: messageConstants.FEES_ID_EXIST
               }
           });
       }else{
        const fees= await feesService.getByFormality();
        const formality_id_in_fee=[];
        for(var i= 0; i<fees.count;i++){
          formality_id_in_fee[i]= fees.rows[i].formality_id;
      };
      const id2_compared = formality_id_in_fee.some(item => item == id)
          if(id2_compared){
              return res.json({
                  success: false,
                  error: {
                      status: 403,
                      message: messageConstants.FEES_ID_EXIST
                  }
              });
          };
      formalityService.delete(id, options).then((result) => {
          if (result == true) {
            res.status(200).json({
              success: true,
              message: messageConstants.FORMALITY_DELETED,
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
        })
        .catch((err) => {
          res.send({
            error: {
              status: err.status || 500,
              message: err.message,
            },
          });
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

//restore
exports.restore = (req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 0, updated_date: new Date() };
  formalityService.restore(id, options).then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.FORMALITY_RESTORE_SUSSCESS,
        });
      } else {
        res.json({
          success: false,
          error: {
              status:404,
              message: result.message
          }
      })
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
