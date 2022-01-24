'use strict';
const ageService                            = require("../services/ageService");
const { validationResult }                  = require("express-validator");
const messageConstants                      = require("../constants/messageContants");
const Paginator                             = require("../commons/paginators");
const ContentCompetitionService             = require('../services/contentCompetitionService');
const TournamentDetailService               = require('../services/tournamentDetailService');
const sequelize                             = require('../../models').sequelize;

//getall
exports.getAll = async (req, res) => {
    ageService.getAll().then(async(result) => {
        res.status(200).json({
            success: true,
            message: messageConstants.AGES_FOUND,
            data: result
        });
  }).catch((err) => {
      res.send({
          error: {
              status: err.status ||500,
              message: err.message
          }
      });
  });
}


//getall
exports.getSortColumn = async (req, res) => {
    ageService.getSortColumn(req.query).then(async(result) => {
        const options=[];
        for(var i=0; i<result.length;i++){
            options[i]= result[i].id;
        };
        const data= await ageService.SaveOrder(options);
        if(data==true){
            res.status(200).json({
                success: true,
                message: messageConstants.AGES_FOUND,
                data: result
            });
        }
  }).catch((err) => {
      res.send({
          error: {
              status: err.status ||500,
              message: err.message
          }
      });
  });
}

//getall
exports.getOrder = async (req, res) => {
    ageService.getOrder(req.body.dataOrder).then((result) => {
        res.status(200).json({
            success: true,
            message: messageConstants.AGES_FOUND,
            data: result
        });
    }).catch((err) => {
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
    ageService.getAllByPaging(data).then((result) => {
        const reponse = Paginator.getPagingData(result, page, limit);
        res.status(200).json({
            success: true,
            message: messageConstants.AGES_FOUND,
            data: reponse
        });
    }).catch((err) => {
        res.send({
            error: {
                status: err.status ||500,
                message: err.message
            }
        });
    });
};

//create
exports.create =async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(422).json({errors: errors.array()});
            return;
        }
        let t;
        try{
            t = await sequelize.transaction();
            const ages = {
                name: req.body.name,
                start_age: req.body.start_age,
                end_age: req.body.end_age,
                start_ages: req.body.start_ages,
                ages_more: req.body.ages_more,
                end_ages: req.body.end_ages,
                total_age: req.body.total_age,
                created_by: req.body.created_by,
        };
            const result= await ageService.create(ages,{transaction:t});
            const options= {index: result.id};
            const data= await ageService.update(result.id,options);
            res.status(200).json({
                success: true,
                message: messageConstants.AGES_CREATE_SUSSCESS,
                ages: data
            });
        await t.commit();
        }catch(error){
           await t.rollback();
        }
    } catch (err) {
        return next(err);
    }
};

//get by id
exports.getById = (req, res) => {
  const id = req.params.id;
  ageService.getByID(id).then((ages) => {
      if(ages === null){
          res.status(200).json({
              message: messageConstants.AGES_ID_NOT_FOUND
          });
      }else{
          res.status(200).json({
              success: true,
              message: messageConstants.AGES_FOUND,
              ages: ages
          });
      }
  }).catch((err) => {
      res.send({
          error: {
              status: err.status ||500,
              message: err.message
          }
      });
  });
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
    const options1 = {
        name: req.body.name,
        start_age: req.body.start_age,
        end_age: req.body.end_age,
        start_ages: req.body.start_ages,
        end_ages: req.body.end_ages,
        ages_more: req.body.ages_more,
        total_age: req.body.total_age,
        updated_by : req.body.updated_by,
        updated_date: new Date()
};
    const id_content= await ContentCompetitionService.getContentIdByAgeId(id); 
        if(id_content.length>0){
            const Id_contents= await TournamentDetailService.getByContentId(id_content);  
            if(Id_contents.length>0){
                await ContentCompetitionService.deleteWhenUpdate(Id_contents,options).then(async(success)=>{
                const result= await ageService.create(options1);
                ContentCompetitionService.createContentFormAge(Id_contents,result.id);
                ageService.delete(id,options);
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
        const age= await ageService.update(id,options1);
        const options2={
            age_id: age.id
        };
        await ContentCompetitionService.updateFromAges(Id_contents,options2).then(async(result) => {
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
}
    }else{
        return  ageService.update(id,options1).then(()=>{
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
    }
  } catch (err) {
    return next(err);
  }
};

//delete
exports.delete =async (req, res) => {
    const id = req.params.id;
    const options = {field: "deleted", deleted: 1, updated_date: new Date()};
      const age_id_in_content= await ContentCompetitionService.getByAgeId(); 
    const id_compared = age_id_in_content.some(item => item == id)
        if(id_compared){
            return res.json({
                success: false,
                error: {
                status: 403,
                message: messageConstants.AGES_ID_EXIST
            }
        });
    };
    
    ageService.delete(id, options).then((result) => {
        if(result == true){
            res.status(200).json({
                success: true,
                message: messageConstants.AGES_DELETED
            });
        }else{
            res.status(400).json({
              success: false,
              message: messageConstants.AGES_DELETE_FAIL,
            });
        }
    }).catch((err) => {
        res.json({
            error: {
                status: err.status ||500,
                message: err.message
            }
        });
    });
  };
//restore
exports.restore = async(req, res) => {
  const id = req.params.id;
  const options = { field: "deleted", deleted: 0, updated_date:new Date() };
  const contents= await ContentCompetitionService.getByAgeId(id);
  var content_id=[];
  for(var i=0;i<contents.count;i++){
    content_id[i]= contents.rows[i].id;
};

  ageService.restore(id, options).then((result) => {
      if(result == true){
          res.status(200).json({
              success: true,
               message: messageConstants.AGES_RESTORE_SUSSCESS
          });
      }else{
          res.status(404).json({
              message: messageConstants.AGES_RESTORE_FAIL,
              messageError: result.message
          });
      }
  }).catch((err) => {
      res.send({
          error: {
              status: err.status ||500,
              message: err.message
          }
      });
  });
};
