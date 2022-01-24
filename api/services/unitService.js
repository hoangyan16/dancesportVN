const models                             = require('../../models');
const messageContants = require('../constants/messageContants');



// Get-all
exports.getAll=async()=>{
    return  models.units.findAll({
        where:{deleted: 0},
        order:[['index', 'ASC']],
        attributes:['id','name']
    });
};
exports.getSortColumn =async (searchViewModel) => {
    var sortColumn = searchViewModel;
    // Sắp xếp theo cột
    let orderby = [['index']];
    if (sortColumn && sortColumn.columnName != null) {
        if (sortColumn.columnName && sortColumn.isDesc) {
            orderby = [[(sortColumn.columnName) ,'DESC']];
        } else {
            orderby = [[(sortColumn.columnName) ,'ASC']];
      }
  }
  return  models.units.findAll({
    where:{deleted: 0},
    order:orderby,
    attributes:['id','name']
});
};

exports.sortFromAthlete =async (searchViewModel) => {
  var sortColumn = searchViewModel;
  // Sắp xếp theo cột
  let orderby = [['name']];
  if (sortColumn && sortColumn.columnName != null) {
      if (sortColumn.columnName && sortColumn.isAsc) {
          orderby = [['name' ,'ASC']];
      } else {
          orderby = [['name' ,'DESC']];
    }
}
console.log(orderby);
const res= await models.units.findAll({
    where:{deleted: false},
    order:orderby,
    attributes:['id','name','index_of_athletes']
});
  let index= 0; 
  const data= res.map(item=>{
      index++;
      return {
        name: item.name,
        id: item.id,
        index: index
      }
  });
  return data
};
// Get-by-id
exports.getById=async(id)=>{
    let condition= {deleted:0,id:id};
    return  models.units.findOne({
        where:condition,
        attributes:['id','name']
    });
};

// Save order
exports.SaveOrder = async (order) => {
    for(var i=0; i<order.length;i++){
      const options={
        index: i
      };
    const result= await  models.units.update(options, { where: { id: order[i] }});
    if(!result){
      return Promise.resolve({
        status: 0,
        message: messageContants.UNITS_UPDATE_FAIL
      });
    }
  }
  return true
  };

//Create
exports.create=async(data)=>{
    return models.units.create(data);
};

//Create
exports.createFromRegistration=async(data)=>{
    let option={
      name: data
    }
  return models.units.create(option);
};

//Update
exports.update=async(id,options)=>{
    return  models.units.update(options,{where:{id:id}});
};

//Dalete
exports.delete=async(id,options)=>{

    return  models.units.update(options,{where:{id:id}});
};
