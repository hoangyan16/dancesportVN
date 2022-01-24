const themeService                                     = require("../services/themeService");
const { validationResult }                             = require("express-validator");
const messageConstants                                 = require("../constants/messageContants");
const Paginator                                        = require("../commons/paginators");
const messageContants                                  = require("../constants/messageContants");

//get all
exports.getAll = (req, res) => {
  themeService.getAll().then((data) => {
      res.status(200).json({
        success: true,
        message: messageConstants.THEME_FOUND,
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
  themeService.getAllPreparedData().then(data => {
    if(data){
      res.status(200).json({
        success: true,
        message: messageConstants.THEME_FOUND,
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
  themeService.getAllByPaging(data).then((result) => {
      const reponse = Paginator.getPagingData(result, page, limit);
      res.status(200).json({
        success: true,
        message: messageConstants.THEME_FOUND,
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
  themeService.getById(id).then((data) => {
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
          success: true,
        message: messageConstants.THEME_FOUND,
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
    await themeService.create(req.body).then(async (result) => {
        if (result.message) {
          res.json({
            success: false,
            error: {
                status:404,
                message: result.message
            }
        })
        } else {
          return res.status(200).json({
            success: true,
            message: messageContants.THEME_CREATE_SUSSCESS,
            data: result,
          });
        }
      })
      .catch((err) => {
        res.send({
          erorr: {
            status: err.status || 500,
            message: err.message,
          },
        });
      });
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
    themeService.update(id, data).then((result) => {
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
            message: messageConstants.THEME_UPDATE_SUSSCESS,
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
  const options = { field: "deletd", deleted: 1 };
  themeService.delete(id, options).then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.THEME_DELETED,
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
};

//restore
exports.restore = (req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 0, updated_date: new Date() };
  themeService.restore(id, options).then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.THEME_RESTORE_SUSSCESS,
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
