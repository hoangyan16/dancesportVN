const mcService                                = require("../services/mcService");
const { validationResult }                     = require("express-validator");
const messageConstants                         = require("../constants/messageContants");
const Paginator                                = require("../commons/paginators");

//get all
exports.getAll = async (req, res) => {
  const options={
    status: 2
  };
  const optionStatus={
    status: 1
  };
    await mcService.updateStatus(req.params.tournament_id,options,optionStatus);
    mcService.getAll(req.params.tournament_id).then(async(result) => {
          res.status(200).json({
            success: true,
            message: messageConstants.EVENTS_FOUND,
            data: result,
          });
        }).catch((err) => {
        res.send({
          error: {
            status: err.status || 500,
            message: err.message,
          },
        });
      });
};
exports.getNextEvent = async (req, res) => {
  mcService.getNextEvent(req.body.id).then(async(result) => {
        res.status(200).json({
          success: true,
          message: messageConstants.EVENTS_FOUND,
          dataMc: result,
        });
      }).catch((err) => {
      res.send({
        error: {
          status: err.status || 500,
          message: err.message,
        },
      });
    });
};

//get all
exports.getTV = async (req, res) => {
    mcService.getTV().then(async(result) => {
          res.status(200).json({
            success: true,
            message: messageConstants.EVENTS_FOUND,
            data: result,
          });
        }).catch((err) => {
        res.send({
          error: {
            status: err.status || 500,
            message: err.message,
          },
        });
      });
};

// GET NEXT EVENT
exports.getNextEvent = async (req, res) => {
  mcService.getNextEvent(req.body.id).then(async(result) => {
        res.status(200).json({
          success: true,
          message: messageConstants.EVENTS_FOUND,
          dataMc: result,
        });
      }).catch((err) => {
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
  mcService.getAllByPaging(data).then((result) => {
      const reponse = Paginator.getPagingData(result, page, limit);
      res.status(200).json({
        success: true,
        message: messageConstants.EVENTS_FOUND,
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
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const data = {
     current_event: req.body.current_event,
     next_event: req.body.next_event,
      status: 1,
      deleted: 0,
    };
    return mcService.create(data).then(async(result) => {
        res.status(200).json({
          success: true,
          message: messageConstants.EVENTS_CREATE_SUSSCESS,
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

//get byid
exports.getById = (req, res) => {
  const id = req.params.id;
  mcService.getById(id).then((data) => {
      if (data === null) {
        res.status(200).json({
          message: messageConstants.EVENTS_ID_NOT_FOUND,
        });
      } else {
        res.status(200).json({
          success: true,
          message: messageConstants.EVENTS_FOUND,
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
};

//update

exports.update=async (req, res, next)=>{  
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const id = req.params.id;
    const options = {
      current_event: req.body.current_event,
      next_event: req.body.next_event,
     };
    mcService.update(id, options).then((result) => {
          res.status(200).json({
            success: true,
            message: messageConstants.EVENTS_UPDATE_SUSSCESS,
            dataMc: options,
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
//delete
exports.delete = (req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 1, updated_date: new Date() };
  mcService.delete(id, options).then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.EVENTS_DELETED,
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
          status: err.status || 500,
          message: err.message,
        },
      });
    });
};

