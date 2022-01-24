const danceService                                 = require("../services/danceService");
const {validationResult }                          = require("express-validator");
const messageConstants                             = require("../constants/messageContants");
const Paginator                                    = require("../commons/paginators");
const GradeService                                 = require('../services/gradeService');


//get all
exports.getAll = (req, res) => {
  danceService.getAll().then(async(result) => { 
        res.status(200).json({
          message:messageConstants.DANCES_FOUND,
          data: result
        })
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
exports.sort = (req, res) => {
  danceService.sort(req.query).then(async(result) => { 
    const options=[];
      for(var i=0; i<result.length;i++){
          options[i]= result[i].id;
      };
      const data= await danceService.SaveOrder(options);
      if(data==true){
        res.status(200).json({
          message:messageConstants.DANCES_FOUND,
          data: result
        })
      }else{
        res.status(400).json({
          success: false,
          message: data.message,
        })
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
//get by dance-types
exports.getAllPreparedData = async (req,res) => {
  danceService.getAllPreparedData().then(data => {
    if(data){
      res.sta(200).json({
        success: true,
        message: messageConstants.DANCES_FOUND,
        data: data
      });
    }else{
      res.status(400).json({
        success: false,
        message: messageConstants.DANCES_NOT_FOUND,
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
  danceService.getAllPaging(data).then((result) => {  
    const reponse = Paginator.getPagingData(result, page, limit);
      res.sta(200).json({
        success: true,
        message: messageConstants.DANCES_FOUND,
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
  danceService.getById(id).then((data) => {
        res.status(200).json({
        message: messageConstants.DANCES_FOUND,
        data:data
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
    return danceService.create(req.body).then(async(result) => {
      const options={
        index: result.id
      };
      await danceService.update(result.id,options);
        res.status(200).json({
          success: true,
          message: messageConstants.DANCES_CREATE_SUSSCESS,
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

//update
exports.update =async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const id = req.params.id;
    const options = {
      name: req.body.name,
      symbol: req.body.symbol,
      dance_type_id: req.body.dance_type_id,
      updated_by: req.body.updated_by,
      updated_date: new Date(),
    };
      danceService.update(id, options).then((result) => {
            if(result.message){
                    res.status(404).json({
                      success: false,
                      message: result.message
                    });
                    }else{
                      res.status(200).json({
                      success: true,
                      message: messageConstants.DANCES_UPDATE_SUSSCESS,
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
exports.delete =async (req, res) => {
  const id = req.params.id;
  const options = { deleted: true,updated_date: new Date() };
  const contents= await GradeService.getByGradeId();
  const dance_id_in_grade=[];
  for(var i=0;i<contents.length;i++){
    dance_id_in_grade[i]= JSON.parse("["+contents[i].dance_id+"]");
  };
  for(var i= 0; i<dance_id_in_grade.length;i++){
        const id_compared = dance_id_in_grade[i].some(item => item == id)
            if(id_compared){
                return res.json({
                    success: false,
                    error: {
                        status: 403,
                        message: messageConstants.AGES_ID_EXIST
                    }
                });
            };
    };
  danceService.delete(id, options).then((result) => {
        res.status(200).json({
          success: true,
          message: messageConstants.DANCES_DELETED,
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

//restore
exports.restore = (req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 0, updated_date: new Date() };
  danceService.restore(id, options).then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.DANCES_RESTORE_SUSSCESS,
        });
      } else {
        res.status(404).json({
          message: messageConstants.DANCES_RESTORE_FAIL,
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
