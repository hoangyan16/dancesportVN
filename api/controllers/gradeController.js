const gradesService                                 = require("../services/gradeService");
const { validationResult }                          = require("express-validator");
const messageConstants                              = require("../constants/messageContants");
const Paginator                                     = require("../commons/paginators");
const ContentCompetitionService                     = require('../services/contentCompetitionService');
const TournamentDetailService                       = require('../services/tournamentDetailService');

//Get All
exports.getAll =async (req, res) => {
      gradesService.getAll().then(async(result)=>{
      res.status(200).json({
        success: true,
        message: messageConstants.GRADES_FOUND,
        data:result
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


//Get All
exports.sort=async (req, res) => {
  gradesService.sort(req.query).then(async(result)=>{
      const options=[];
      for(var i=0; i<result.length;i++){
          options[i]= result[i].id;
      };
      const data= await gradesService.SaveOrder(options);
      if(data==true){
        res.status(200).json({
          success: true,
          message: messageConstants.GRADES_FOUND,
          data:result
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
//get all dance, dance-types
exports.getAllPreparedData = async (req,res) => {
  gradesService.getAllPreparedData().then(data => {
    if(data){
      res.status(200).json({
        success: true,
        message: messageConstants.GRADES_FOUND,
        data: data
      });
    }else{
      res.status(400).json({
        success: false,
        message: messageConstants.GRADES_NOT_FOUND
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
    gradesService.getAllByPaging(data).then((result) => {
        const response = Paginator.getPagingData(result, page, limit);
        res.status(200).json({
          success: true,
          message: messageConstants.GRADES_FOUND,
          data: response,
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

//getbyid
exports.getById = (req, res) => {
  const id = req.params.id;
  gradesService
    .getById(id)
    .then((grades) => {
      if (grades === null) {
        res.status(200).json({
          message: messageConstants.GRADES_ID_NOT_FOUND,
        });
      } else {
        res.status(200).json({
          success: true,
          message: messageConstants.GRADES_FOUND,
          grades: grades,
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
      res.status(400).json({ errors: errors.array() });
      return;
    }
    gradesService.create(req.body).then(async(result) => {
       const options= {index: result.id};
       await gradesService.update(result.id,options);
        res.status(200).json({
          success: true,
          message: messageConstants.GRADES_CREATE_SUSSCESS,
          grades: result,
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
    const options= {field: "deleted",deleted:1,updated_date: new Date()};
    const id = req.params.id;
    const id_content= await ContentCompetitionService.getContentIdByGradeId(id); 
    if(id_content.length>0){
        const Id_contents= await TournamentDetailService.getByContentId(id_content);  
        if(Id_contents.length>0){
            await ContentCompetitionService.deleteWhenUpdate(Id_contents,options).then(async(success)=>{
            const result= await gradesService.create(req.body);
            ContentCompetitionService.createContentFromGrade(Id_contents,result.id);
            gradesService.delete(id,options);
            res.status(200).json({
              success: true,
              message: messageConstants.AGES_UPDATE_SUSSCESS,
        });
    }).catch((err) => {
        res.send({
          error: {
            status: err.status || 500,
            message: err.message,
            },
        });
    });
}else{
    const grade= await gradesService.update(id,req.body);
    const options2={
        grade_id: grade.id
    };
    await ContentCompetitionService.updateFromGrades(Id_contents,options2).then(async(result) => {
        res.status(200).json({
          success: true,
          message: messageConstants.GRADES_UPDATE_SUSSCESS,
    });
  }).catch((err) => {
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
        },
    });
});
}
}else{
    return  gradesService.update(id,req.body).then(()=>{
        res.status(200).json({
            success: true,
            message: messageConstants.GRADES_UPDATE_SUSSCESS,
          });
    }).catch((err) => {
        res.send({
          error: {
            status: err.status || 500,
            message: err.message,
            },
        });
    });
}
} catch (err) {
return next(err);
}
};

//delete
exports.delete =async (req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 1, updated_date: new Date() };
  const contents= await ContentCompetitionService.getByGradeId();
  const grade_id_in_content=[];
  for(var i= 0; i<contents.count;i++){
    grade_id_in_content[i]= contents.rows[i].grade_id;
};
const id_compared = grade_id_in_content.some(item => item == id)
    if(id_compared){
        return res.json({
          success: false,
            error: {
                status: 403,
                message: messageConstants.GRADES_ID_EXIST
            }
        });
    };
  gradesService.delete(id, options).then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.GRADES_DELETED,
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message,
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
  gradesService
    .restore(id, options)
    .then((result) => {
      if (result == true) {
        res.status(200).json({
          success: true,
          message: messageConstants.GRADES_RESTORE_SUSSCESS,
        });
      } else {
        res.status(402).json({
          success:false,
          message: result.message,
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
