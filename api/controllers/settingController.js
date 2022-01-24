const settingService                               = require("../services/settingService");
const { validationResult }                        = require("express-validator");
const messageConstants                            = require("../constants/messageContants");
const Paginator                                   = require("../commons/paginators");
const upload                                      = require("../uploads/uploadImagesInSettings");

//get all
exports.getAll = (req, res) => {
  settingService.getAll().then((data) => {
      res.status(200).json({
        message: messageConstants.SETTING_FOUND,
        data: data.rows,
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
  settingService.getAllPreparedData().then(data => {
    if(data){
      res.status(200).json({
        success: true,
        message: messageConstants.SETTING_FOUND,
        data: data
      });
    }else{
      res.status(400).json({
        success: false,
        message: messageConstants.SETTING_NOT_FOUND,
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
  settingService.getAllPaging(data).then((result) => {
      const reponse = Paginator.getPagingData(result, page, limit);
      res.status(200).json({
        success: true,
        message: messageConstants.SETTING_FOUND,
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
  settingService.getById(id).then((data) => {
        res.status(200).json({
        success: true,
        message: messageConstants.SETTING_FOUND,
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
};

//create
exports.create = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    return settingService.create(req.body).then((result) => {
        res.status(200).json({
          success: true,
          message: messageConstants.SETTING_CREATE_SUSSCESS,
          data: result,
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
  } catch (err) {
    return next(err);
  }
};


//Upload Images
exports.uploadImages =async (req, res, next) => {
    await upload(req,res);
    return settingService.uploadImages(req.file).then((result) => {
        const url = "http://"+ req.headers.host+ result;
        res.status(200).json({
          success: true,
          message: messageConstants.SETTING_CREATE_SUSSCESS,
          url: url,
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
    	contact_nofi:req.body.contact_nofi,
      event_calendar: req.body.event_calendar,
      about_us:req.body.about_us,
      dashboard:req.body.dashboard,
      updated_by: req.body.updated_by,
      updated_date: new Date(),
    };
    settingService.update(id, options).then((result) => {
        if(result.message){
          res.status(404).json({
            success: false,
            message: result.message
          });
          }else{
            res.status(200).json({
            success: true,
            message: messageConstants.SETTING_UPDATE_SUSSCESS,
            data: result
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
  const options = { field: "deletd", deleted: 1 ,updated_date:new Date()};
  settingService.delete(id, options).then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.SETTING_DELETED,
        });
      }else{
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

//restore
exports.restore = (req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 0, updated_date: new Date() };
  settingService
    .restore(id, options)
    .then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.SETTING_RESTORE_SUSSCESS,
        });
      } else {
        res.status(404).json({
          message: messageConstants.SETTING_RESTORE_FAIL,
          messageError: result.message,
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
