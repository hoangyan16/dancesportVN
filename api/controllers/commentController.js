const commentService                                 = require("../services/commentService");
const { validationResult }                             = require("express-validator");
const messageConstants                                 = require("../constants/messageContants");
const Paginator                                        = require("../commons/paginators");
const messageContants                                  = require("../constants/messageContants");
const sequelize                                        = require('../../models').sequelize;


//get all
exports.getAll = (req, res) => {
  commentService.getAll(req.query,req.user).then((data) => {
      res.status(200).json({
        message: messageConstants.COMMENT_FOUND,
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
  commentService.getAllPreparedData().then(data => {
    if(data){
      res.status(200).json({
        success: true,
        message: messageConstants.COMMENT_FOUND,
        data: data
      });
    }else{
        res.json({
          success: false,
          error: {
            status:404,
            message: messageConstants.COMMENT_NOT_FOUND,
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
  commentService.getAllByPaging(data).then((result) => {
      const reponse = Paginator.getPagingData(result, page, limit);
      res.status(200).json({
        success: true,
        message: messageConstants.COMMENT_FOUND,
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
  commentService.getById(id).then((data) => {
        res.status(200).json({
        message: messageConstants.COMMENT_FOUND,
        data: data
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
}

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
var result=  await commentService.create(req.body,req.user,{transaction});
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
    message: messageContants.COMMENT_CREATE_SUSSCESS,
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
    const options = {
      content: req.body.content,
      id_tournament: req.body.id_tournament,
      id_news: req.body.id_news,
      id_user: req.user.id,
      updated_by: req.user.user_name,
      updated_date: new Date(),
    };
    commentService.update(id,options,req.user).then((result) => {
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
            message: messageConstants.COMMENT_UPDATE_SUSSCESS,
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
exports.delete = (req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 1 };
  commentService.delete(id, options,req.user).then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.COMMENT_DELETED,
        });
      }else{
        res.json({
          success: false,
          error: {
              status:404,
              message: messageConstants.COMMENT_DELETE_FAIL
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

//restore
exports.restore = (req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 0, updated_date: new Date() };
  commentService.restore(id, options).then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.COMMENT_RESTORE_SUSSCESS,
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
