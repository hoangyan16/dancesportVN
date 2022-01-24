const newsService                             = require("../services/newsService");
const { validationResult }                    = require("express-validator");
const messageConstants                        = require("../constants/messageContants");
const Paginator                               = require("../commons/paginators");
const upload                                  = require("../uploads/uploadImagesNews");


//get all
exports.getAll = async (req, res) => {
  newsService.getAll().then((data) => {
    const url=[];
    for(var i=0; i<data.rows.length;i++){
      if(data.rows[i].image===null){
        data.rows[i].image= null;
      }else{
        url[i] = "http://" + req.headers.host + data.rows[i].image;
        data.rows[i].image= url[i];
      }
    };
      res.status(200).json({
        success: true,
        message: messageConstants.NEWS_FOUND,
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

//get all paging
exports.getAllByPaging = async (req, res) => {
  const page = parseInt(req.query.page_index) ||1;
  const size = parseInt(req.query.page_size);
  const { limit, offset } = await Paginator.getPagination(page, size);
  const data = { limit, offset };
  newsService.getAllByPaging(data).then((result) => {
      const reponse = Paginator.getPagingData(result, page, limit);
      res.status(200).json({
        success: true,
        message: messageConstants.NEWS_FOUND,
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
exports.create =async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    var image= req.body.image.replace(`http://${req.headers.host}`,"");
        const data = {
          name: req.body.name,
          image: image,
          theme_id: req.body.theme_id,
          content_summary: req.body.content_summary,
          content_detail: req.body.content_detail
        };
        return newsService.create(data).then((result) => {
          res.status(200).json({
            success: true,
            message: messageConstants.NEWS_CREATE_SUSSCESS,
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

//Create Image
exports.createUrl =async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    await upload(req,res).then(()=>{
      return newsService.createUrl(req.file).then((result) => {
        const url = "http://"+ req.headers.host+ result;
          res.status(200).json({
            success: true,
            message: messageConstants.UPLOAD_SUSSCESS,
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

//get byid
exports.getById = (req, res) => {
  const id = req.params.id;
  newsService.getById(id).then((data) => {
    if(data.image===null){
      data.image= null;
    }else{
      const url = "http://" + req.headers.host + data.image;
      data.image= url;
    };
        res.status(200).json({
          success: true,
          message: messageConstants.NEWS_FOUND,
          data: data,
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

//update

exports.update=async (req, res, next)=>{  
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    };
    var image= req.body.image.replace(`http://${req.headers.host}`,"");
        const data = {
          name: req.body.name,
          image: image,
          theme_id: req.body.theme_id,
          content_summary: req.body.content_summary,
          content_detail: req.body.content_detail,
          updated_date: new Date()
        };
        return newsService.update(req.params.id,data).then((result) => {
          res.status(200).json({
            success: true,
            message: messageConstants.NEWS_CREATE_SUSSCESS,
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
  }catch(err){
    return next(err);
  }
};
//delete
exports.delete = (req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 1, updated_date: new Date() };
  newsService
    .delete(id, options)
    .then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.NEWS_DELETED,
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
  newsService
    .restore(id, options)
    .then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.NEWS_RESTORE_SUSSCESS,
        });
      } else {
        res.status(404).json({
          message: messageConstants.NEWS_RESTORE_FAIL,
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
