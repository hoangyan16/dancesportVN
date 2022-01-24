const contactService                               = require("../services/contactService");
const { validationResult }                        = require("express-validator");
const messageConstants                            = require("../constants/messageContants");
const Paginator                                   = require("../commons/paginators");

//get all
exports.getAll = (req, res) => {
  contactService.getAll().then((data) => {
      res.status(200).json({
        message: messageConstants.CONTACT_FOUND,
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
  contactService.getAllPreparedData().then(data => {
    if(data){
      res.status(200).json({
        success: true,
        message: messageConstants.DANCES_FOUND,
        data: data
      });
    }else{
      res.status(400).json({
        success: false,
        message: messageConstants.CONTACT_NOT_FOUND,
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
  contactService.getAllPaging(data).then((result) => {
      const reponse = Paginator.getPagingData(result, page, limit);
      res.status(200).json({
        success: true,
        message: messageConstants.CONTACT_FOUND,
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
  contactService.getById(id).then((dances) => {
      if (dances === null) {
        res.status(200).json({
          message: messageConstants.CONTACT_FOUND,
        });
      } else {
        res.status(200).json({
          message: messageConstants.CONTACT_ID_NOT_FOUND,
          dances: dances,
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
exports.create = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    return contactService.create(req.body).then((result) => {
        res.status(200).json({
          success: true,
          message: messageConstants.CONTACT_CREATE_SUSSCESS,
          dances: result,
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
exports.update = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const id = req.params.id;
    const options = {
      name: req.body.name,
      title: req.body.title,
      email: req.body.email,
      mobile: req.body.mobile,
      content_summary: req.body.content_summary,
      updated_by: req.body.updated_by,
      updated_date: new Date(),
    };
    contactService.update(id, options).then((result) => {
        if(result.message){
          res.status(404).json({
            success: false,
            message: result.message
          });
          }else{
            res.status(200).json({
            success: true,
            message: messageConstants.CONTACT_UPDATE_SUSSCESS,
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
  console.log(req.body);
  const options = { field: "deleted", deleted: 1 ,updated_date: new Date()};
  contactService.delete(req.body.id, options).then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.CONTACT_DELETED,
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

//delete-all
exports.deleteAll =async (req, res) => {
  const options = { field: "deleted", deleted: 1 ,updated_date: new Date()};
  await contactService.getAll().then((result)=>{
    const _id=[];
    for(var i=0; i<result.rows.length;i++){
      _id[i]= result.rows[i].id;
    };
    contactService.deleteAll(_id, options).then((result) => {
        if (result == true) {
          res.status(200).json({
            success: true,
            message: messageConstants.CONTACT_DELETED,
          });
        }else{
          res.status(404).json({
          success: false,
          message: data.message,
      });
    }; 
      }).catch((err) => {
        res.send({
          error: {
            status: err.status || 500,
            message: err.message,
          },
        });
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
  const _id=[];
  for(var i=0; i<result.rows.length;i++){
    _id[i]= result.rows[i].id;
  };
  contactService.restore(id, options).then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.CONTACT_RESTORE_SUSSCESS,
        });
      } else {
        res.status(404).json({
          message: messageConstants.CONTACT_RESTORE_FAIL,
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

//restore
exports.restoreAll = (req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 0, updated_date: new Date() };
  contactService.restore(id, options).then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.CONTACT_RESTORE_SUSSCESS,
        });
      } else {
        res.status(404).json({
          message: messageConstants.CONTACT_RESTORE_FAIL,
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

