const models                         = require("../../models");
const messageConstants               = require("../constants/messageContants");
const TournamentService              = require("../services/tournamentService");


//findall
exports.getAll =async (tournament_id) => {
    models.tournaments.belongsTo(models.mc,{foreignKey:'id'});
    models.mc.belongsTo(models.tournaments,{foreignKey:'tournament_id'});
    const response= await  models.mc.findOne({        
        where:{deleted: false,tournament_id:tournament_id},
        attributes:['id','current_event','next_event','tournament_id'],
        include:[{
            model: models.tournaments,
            where: {deleted: false},
            attributes:['id']
        }]
    });
    const resources=await TournamentService.getFileForMC(tournament_id);
    if(response.tournament.id==resources.id)
    Object.assign(response.tournament,resources);
    return response
}

//FIND TV
exports.getTV =async () => {
    models.tournaments.belongsTo(models.mc,{foreignKey:'id'});
    models.mc.belongsTo(models.tournaments,{foreignKey:'tournament_id'});
    const response= await  models.mc.findOne({        
        where:{deleted: false,status:2},
        attributes:['id','current_event','next_event','tournament_id'],
        include:[{
            model: models.tournaments,
            where: {deleted: false},
            attributes:['id']
        }]
    });
    const resources=await TournamentService.getFileForMC(response.tournament_id);
    if(response.tournament.id==resources.id)
    Object.assign(response.tournament,resources);
    return response
};

exports.getNextEvent =async (Id) => {
    const response= await  models.mc.findOne({        
        where:{deleted: false,id:Id},
        attributes:['id','current_event','next_event']
    });
    const options= {
        id: Id,
        current_event: response.next_event,
        next_event: response.next_event +1
    };
    await models.mc.update(options,{where:{id:Id}});
    return options
}

//find all paging
exports.getAllByPaging = (searchviewModel) => {
    models.tournaments.belongsTo(models.mc,{foreignKey:'id'});
    models.mc.belongsTo(models.formality,{foreignKey:'tournament_id'});
    limit = searchviewModel.limit;
    offset = searchviewModel.offset;
    return models.mc.findAndCountAll({
        where:{deleted: false},
        limit: limit,
        offset: offset,
        attributes:['id','current_event','next_event'],
        include:[{
            model: models.tournaments,
            where: {deleted: false},
            attributes:['id']
        }]
    });
}
// Save order
exports.SaveOrder = async (order) => {
    for(var i=0; i<order.length;i++){
      const options={
        index: i
      };
    const result= await  models.mc.update(options, { where: { id: order[i] }});
    if(!result){
      return Promise.resolve({
        status: 0,
        message: messageConstants.FEES_UPDATE_FAIL
      });
    }
}
  return true
  };
//find by id
exports.getById = async (id) => {
    return models.mc.findOne({where: {tournament_id:id}});
};

//create
exports.create = async (data,t) => {
      const options={
            current_event: 1,
            next_event: 2,
            tournament_id: data.id
      }
    return models.mc.create(options,t);
};

//update
exports.update= async(Id,options)=>{
    return  models.mc.update(options,{where:{id:Id}});
};

//updateStatus
exports.updateStatus= async(Id,options,optionStatus)=>{
    await models.mc.update(optionStatus,{where:{status:2}});
    return  models.mc.update(options,{where:{tournament_id:Id}});
};


//delete
exports.delete = async (id, options) => {
    return models.mc.update(options, {where: {id:id, deleted : 0}});
};

//restore
exports.restore = async (id, options) => {
    return models.mc.update(options, {where: {id:id, deleted : 1}});
};

//find by id
exports.getByFormality = async () => {
    return models.mc.findAndCountAll({where: {deleted:false}});
};
