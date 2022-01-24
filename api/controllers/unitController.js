const unitService                           = require("../services/unitService");
const { validationResult }                  = require("express-validator");
const messageConstants                      = require("../constants/messageContants");
const ContentCompetitionService             = require('../services/contentCompetitionService');
const AthleteService                        = require('../services/athleteService');
const UserService                           = require('../services/userService');
const sequelize                             = require('../../models').sequelize;

//getall
exports.getAll = async (req, res) => {
    unitService.getAll(req.query).then(async(result) => {
        res.status(200).json({
            success: true,
            message: messageConstants.UNITS_FOUND,
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
    unitService.getSortColumn(req.query).then(async(result) => {
        const options=[];
        for(var i=0; i<result.length;i++){
            options[i]= result[i].id;
        };
        const data= await unitService.SaveOrder(options);
        if(data==true){
            res.status(200).json({
                success: true,
                message: messageConstants.UNITS_FOUND,
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
    unitService.getOrder(req.body.dataOrder).then((result) => {
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
            const options = {
                name: req.body.name,
                created_by: req.user.user_name,
        };
            const result= await unitService.create(options,{transaction:t});
            res.status(200).json({
                success: true,
                message: messageConstants.AGES_CREATE_SUSSCESS,
                data: result
            });
            const options1= {index: result.id};
            await unitService.update(result.id,options1);
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
  unitService.getByID(id).then((options) => {
      if(options === null){
          res.status(200).json({
              message: messageConstants.UNITS_ID_NOT_FOUND
          });
      }else{
          res.status(200).json({
              success: true,
              message: messageConstants.UNITS_FOUND,
              options: options
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
        // const options= {updated_date: new Date()};
        const id = req.params.id;
        const options = {
            name: req.body.name,
            updated_by : req.user.username,
            updated_date: new Date()
    };
        const id_content= await ContentCompetitionService.getContentIdByUnitId(id); 
        const id_athlete= await AthleteService.getAthleteIdByUnitId(id); 
        const id_user= await UserService.getUserIdByUnitId(id); 
            if(id_content.length>0){
                    await ContentCompetitionService.updateUnitForContent(id).then(async(success)=>{
                        if(success===true){
                            await unitService.update(id,options);
                            res.status(200).json({
                              success: true,
                              message: messageConstants.UNITS_UPDATE_SUSSCESS,
                    });
                }
            }).catch((err) => {
                res.send({
                  error: {
                    status: err.status || 500,
                    message: err.message,
                    },
                });
            });
        }else if(id_athlete.length>0){
            await AthleteService.updateUnitForAthlete(id).then(async(success)=>{
                if(success===true){
                    await unitService.update(id,options);
                    res.status(200).json({
                      success: true,
                      message: messageConstants.UNITS_UPDATE_SUSSCESS,
            });
        }
    }).catch((err) => {
        res.send({
          error: {
            status: err.status || 500,
            message: err.message,
            },
        });
    });
        }else if (id_user.length>0){
            await UserService.updateUnitForUser(id).then(async(success)=>{
                if(success===true){
                    await unitService.update(id,options);
                    res.status(200).json({
                      success: true,
                      message: messageConstants.UNITS_UPDATE_SUSSCESS,
            });
        }
    }).catch((err) => {
        res.send({
          error: {
            status: err.status || 500,
            message: err.message,
            },
        });
    });
        }else{
            return  unitService.update(id,options).then(()=>{
                res.status(200).json({
                    success: true,
                    message:  messageConstants.UNITS_UPDATE_SUSSCESS,
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
    const unit_id_in_content= await ContentCompetitionService.getByUnitId(); 
    const unit_id_in_athlete= await AthleteService.getByUnitId(); 
    const unit_id_in_user= await UserService.getByUnitId(); 
    const id_compared_content = unit_id_in_content.some(item => item == id);
    const id_compared_athlete = unit_id_in_athlete.some(item => item == id);
    const id_compared_user = unit_id_in_user.some(item => item == id);
    // console.log( unit_id_in_content,unit_id_in_athlete,unit_id_in_user);

    if(id_compared_content){
            return res.json({
                success: false,
                error: {
                status: 403,
                message: messageConstants.UNITS_ID_EXIST
            }
        });
    }else if (id_compared_athlete){
        return res.json({
            success: false,
            error: {
            status: 403,
            message: messageConstants.UNITS_ID_EXIST
        }
    });
}else if(id_compared_user){
        return res.json({
            success: false,
            error: {
            status: 403,
            message: messageConstants.UNITS_ID_EXIST
        }
    });
}else{
        unitService.delete(id, options).then((result) => {
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
    }
};

