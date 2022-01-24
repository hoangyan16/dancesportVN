"use strict"
const models                              = require("../../models");
const messageConstants                    = require("../constants/messageContants");


//create
exports.create = async (obj) => {
    const dances = {};
        dances.name= obj.name,
        dances.symbol=obj.symbol,
        dances.dance_type_id= obj.dance_type_id,
        dances.created_by=obj.created_by,
        dances.status= 1,
        dances.deleted= 0;
    return models.dances.create(dances);
};

//find all
exports.getDances = () => {
   return models.dances.findAll({        
    where:{deleted: false},
    attributes:['id','name','symbol','dance_type_id']
});
};


//find all
exports.getAll = (searchViewModel) => {
    models.dance_types.hasMany(models.dances, {foreignKey: 'id'});
    models.dances.belongsTo(models.dance_types,{foreignKey: 'dance_type_id'});
    // Sắp xếp theo cột
    let  orderby = [['index' ,'ASC']];
   return models.dances.findAll({        
    where:{deleted: false},
    attributes:['id','name','symbol'],
    include:[{
        model: models.dance_types,
        as: 'dance_type',
        attributes:['id','name']
    }],
    order: orderby,
});
};

//find all
exports.sort = (searchViewModel) => {
    models.dance_types.hasMany(models.dances, {foreignKey: 'id'});
    models.dances.belongsTo(models.dance_types,{foreignKey: 'dance_type_id'});
    var sortColumn = searchViewModel;
    // Sắp xếp theo cột
    let orderby = [['index']];
    if (sortColumn && sortColumn.columnName != null) {
        if (sortColumn.columnName && sortColumn.isDesc) {
            orderby = [[(sortColumn.columnName) ,'DESC']];
        } else {
            orderby = [[(sortColumn.columnName) ,'ASC']];
        }
    };
   return models.dances.findAll({        
    where:{deleted: false},
    order: orderby,
    attributes:['id','name','symbol'],
    include:[{
        model: models.dance_types,
        as: 'dance_type',
        attributes:['id','name']
    }],
});
};

// Save order
exports.SaveOrder = async (order) => {
    for(var i=0; i<order.length;i++){
      const options={
        index: i
      };
    const result= await  models.dances.update(options, { where: { id: order[i] }});
    if(!result){
      return Promise.resolve({
        status: 0,
        message: messageConstants.DANCES_UPDATE_FAIL
      });
    }
  }
  return true
  };
//find by dance-types
exports.getAllPreparedData = async () => {
    const danceTypes = await models.dance_types.findAll({where:{deleted:0},attributes: ['name']});
    return Promise.resolve({
        danceTypes: danceTypes
    })
};

//find all paging
exports.getAllByPaging = (searchViewModel) => {
    const limit = searchViewModel.limit;
    const offset = searchViewModel.offset;
    return models.dances.findAndCountAll({
        where:{deleted:0},
        limit: limit,
        offset: offset
    });
};

//find by id
exports.getById = async (id,dance_type_id) => {
    let condition={deleted:0,id: id};
    if(dance_type_id){
      condition={deleted:0,id: id,dance_type_id:dance_type_id}
    };
    return models.dances.findOne({where: condition});
};

//update
exports.update = async (id, options) => {
    return models.dances.update(options, {where: {id: id}});
};

//delete
exports.delete =async (id, options) => {
    return models.dances.update(options, {where: {id:id, deleted: 0}});
};

//restore
exports.restore = async (id, options) => {
    return models.dances.update(options, {where: {id: id, deleted: 1}});
};
