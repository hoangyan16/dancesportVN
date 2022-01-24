const danceTypeService                             = require("../services/danceTypeService");
const { validationResult }                         = require("express-validator");
const Paginator                                    = require("../commons/paginators");
const messageConstants                             = require("../constants/messageContants");
const danceService                                 = require("../services/danceService");

//getall
exports.getAll =async (req, res) => {
  danceTypeService.getAll().then(async(result) => {
      res.status(200).json({
        success: true,
        message: messageConstants.DANCE_TYPES_FOUND,
        data: result.rows,
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

//get all paging
exports.getAllByPaging = async (req, res) => {
  const page = parseInt(req.query.page_index) ||1;
  const size = parseInt(req.query.page_size);
  const { limit, offset } = await Paginator.getPagination(page, size);
  const data = { limit, offset };
  danceTypeService.getAllByPaging(data).then((result) => {
      const reponse = Paginator.getPagingData(result, page, limit);
      res.status(200).json({
        success: true,
        message: messageConstants.DANCE_TYPES_FOUND,
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

//create
exports.create = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(402).json({ errors: errors.array() });
      return;
    }
    const options = {
      name: req.body.name,
      created_by: req.body.created_by,
    };
    return danceTypeService.create(options).then((result) => {
        res.status(200).json({
          success: true,
          message: messageConstants.DANCE_TYPES_CREATE_SUSSCESS,
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

//getbyid
exports.getById = (req, res) => {
  const id = req.params.id;
  danceTypeService.getById(id).then((options) => {
      if(data.message){
        res.status(404).json({
          success: false,
          message: data.message
        });
        }else{
          res.status(200).json({
            success: true,
              message: messageConstants.DANCE_TYPES_NOT_FOUND,
              data: options,
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

//update
exports.update = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(402).json({ errors: errors.array() });
      return;
    }
    const id = req.params.id;
    const options = {
      name: req.body.name,
      updated_by: req.body.updated_by,
      updated_date: new Date(),
    };
    danceTypeService.update(id, options).then((result) => {
        if(result.message){
          res.status(404).json({
            success: false,
            message: result.message
          });
          }else{
            res.status(200).json({
              success: true,
            message: messageConstants.DANCE_TYPES_UPDATE_SUSSCESS,
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
  } catch (err) {
    return next(err);
  }
};

//delete
exports.delete = async(req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 1, updated_date: new Date() };
  const dances= await danceService.getAll(); 
  const dancetype_id_in_dance=[];
  for(var i= 0; i<dances.length;i++){
    dancetype_id_in_dance[i]= dances[i].dance_type.id;
};
const id_compared = dancetype_id_in_dance.some(item => item == id)
    if(id_compared){
        return res.json({
          success: false,
            error: {
                status: 403,
                message: messageConstants.DANCE_TYPES_ID_EXIST
            }
        });
    };
  danceTypeService.delete(id, options).then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.DANCE_TYPES_DELETED,
        });
      }else{
        res.status(404).json({
        success: false,
        message: data.message,
    });
  } 
    })
    .catch((err) => {
      res.json({
        error: {
          status: er.status || 500,
          message: err.message,
        },
      });
    });
};
//restore
exports.restore = (req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 0, updated_date: new Date() };
  danceTypeService.restore(id, options).then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.DANCE_TYPES_RESTORE_SUSSCESS,
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
