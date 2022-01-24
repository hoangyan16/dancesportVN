const feesService                              = require("../services/feeService");
const { validationResult }                     = require("express-validator");
const messageConstants                         = require("../constants/messageContants");
const Paginator                                = require("../commons/paginators");
const FeeDetailService                         = require('../services/feeDetailService');

//get all
exports.getAll = async (req, res) => {
  feesService.getAll(req.query).then(async(result) => {
    const options=[];
        for(var i=0; i<result.length;i++){
            options[i]= result[i].id;
        };
      const data= await feesService.SaveOrder(options);
      if(data){
        res.status(200).json({
          success: true,
          message: messageConstants.FEES_FOUND,
          data: result,
        });
      }else{
        res.status(400).json({
          success: true,
          message: data.message,
          })
        };
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
  feesService.getAllByPaging(data).then((result) => {
      const reponse = Paginator.getPagingData(result, page, limit);
      res.status(200).json({
        success: true,
        message: messageConstants.FEES_FOUND,
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
    const fees = {
      name: req.body.name,
      amount: req.body.amount,
      currency_name: req.body.currency_name,
      formality_id: req.body.formality_id,
      currency_id: req.body.currency_id,
      created_by: req.body.created_by,
      status: 1,
      deleted: 0,
    };
    return feesService.create(fees).then(async(result) => {
        res.status(200).json({
          success: true,
          message: messageConstants.FEES_CREATE_SUSSCESS,
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
  feesService.getById(id).then((fees) => {
      if (fees === null) {
        res.status(200).json({
          message: messageConstants.FEES_ID_NOT_FOUND,
        });
      } else {
        res.status(200).json({
          success: true,
          message: messageConstants.FEES_FOUND,
          data: fees,
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
      name: req.body.name,
      amount: req.body.amount,
      currency_name: req.body.currency_name,
      formality_id: req.body.formality_id,
      currency_id: req.body.currency_id,
      updated_by: req.body.updated_by,
      updated_date: new Date(),
    };
    feesService.update(id, options).then((result) => {
        if (result == true) {
          res.status(200).json({
            success: true,
            message: messageConstants.FEES_UPDATE_SUSSCESS,
            data: options,
          });
        } else {
          res.status(400).json({
            message: messageConstants.FEES_UPDATE_FAIL,
            messageError: result.message,
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
//delete
exports.delete = (req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 1, updated_date: new Date() };
  feesService.delete(id, options).then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.FEES_DELETED,
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

//restore
exports.restore = (req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 0, updated_date: new Date() };
  feesService.restore(id, options).then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.FEES_RESTORE_SUSSCESS,
        });
      } else {
        res.status(404).json({
          message: messageConstants.FEES_RESTORE_FAIL,
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
