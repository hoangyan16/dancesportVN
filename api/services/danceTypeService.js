
const models                                 = require("../../models");
const messageConstants                       = require("../constants/messageContants");

//create
exports.create = async (danceTypes) => {
    return models.dance_types.create(danceTypes);
};

// Save order
exports.SaveOrder = async (order) => {
    for(var i=0; i<order.length;i++){
      const options={
        index: i
      };
    const result= await  models.dance_types.update(options, { where: { id: order[i] }});
    if(!result){
      return Promise.resolve({
        status: 0,
        message: messageConstants.DANCE_TYPES_UPDATE_FAIL
      });
    }
  }
  return true
  };
//find all
exports.getAll = async() => {
  return models.dance_types.findAndCountAll({where: { deleted: false },
    attributes: ['id','name']
});
};

//find all
exports.getAllByPaging = (searchViewModel) => {
    limit = searchViewModel.limit;
    offset = searchViewModel.offset;
    return models.dance_types.findAndCountAll({
        limit: limit,
        offset: offset
    });
};

//find by id
exports.getById = async (id) => {
    return models.dance_types.findOne({ where: {id: id} });
};

//update
exports.update = async (id, danceTypesUpdate) => {
    return models.dance_types.update(danceTypesUpdate, {where: {id: id}});
};

//delete
exports.delete = async (id, options) => {
    return models.dance_types.update(options, {where: {id: id, deleted: 0}});
};

//restore
exports.restore = async (id, options) => {
    return models.dance_types.update(options,{where: {id : id, deleted: 1}});
};
