const models                         = require("../../models");
const messageConstants               = require("../constants/messageContants");


//findall
exports.getAll =async (searchViewModel) => {
    models.formality.belongsTo(models.fees,{foreignKey:'id'});
    models.fees.belongsTo(models.formality,{foreignKey:'formality_id'});
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
    return  models.fees.findAll({        
        where:{deleted: false},
        order: orderby,
        attributes:['id','name','amount','currency_name'],
        include:[{
            model: models.formality,
            where: {deleted: false},
            attributes:['id','name']
        }]
    });

}

//find all paging
exports.getAllByPaging = (searchviewModel) => {
    limit = searchviewModel.limit;
    offset = searchviewModel.offset;
    return models.fees.findAndCountAll({
        where:{deleted: false},
        limit: limit,
        offset: offset
    });
};
// Save order
exports.SaveOrder = async (order) => {
    for(var i=0; i<order.length;i++){
      const options={
        index: i
      };
    const result= await  models.fees.update(options, { where: { id: order[i] }});
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
    models.formality.belongsTo(models.fees,{foreignKey:'id'});
    models.fees.belongsTo(models.formality,{foreignKey:'formality_id'});
    return models.fees.findOne({where: {id:id} ,
        include:[{
        model: models.formality,
        where: {deleted: false},
        attributes:['id','name']
    }]
});
};

//create
exports.create = async (fees) => {
    return models.fees.create(fees);
};

//update
exports.update= async(Id,options)=>{
    return  models.fees.update(options,{where:{id:Id}});
};

//delete
exports.delete = async (id, options) => {
    return models.fees.update(options, {where: {id:id, deleted : 0}});
};

//restore
exports.restore = async (id, options) => {
    return models.fees.update(options, {where: {id:id, deleted : 1}});
};

//find by id
exports.getByFormality = async () => {
    return models.fees.findAndCountAll({where: {deleted:false}});
};
