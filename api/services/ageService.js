const models                              = require("../../models");
const messageConstants                    = require("../constants/messageContants");
const sequelize                           = require('../../models').sequelize;
// const Sequelize                           = require("sequelize");
// const op = models.Sequelize.Op;
// const operatorsAliases = {
//     $and: op.and,
//     $like: op.like,
// }


//create
exports.create = async (ages) => {
  return models.ages.create(ages);
};

//findall
exports.getAll =async () => {
  // Sắp xếp theo cột
  let orderby = [['index','ASC']];
  const data= await models.ages.findAll({
    where:{deleted:false},
    order:orderby,
    attributes:['id',"name","start_age","end_age","start_ages","end_ages","total_age","ages_more"]});
    const data1= await models.ages.findAll({where:{deleted: false },attributes:['id',"name","start_age","end_age","start_ages","end_ages","total_age"]});

    const result=[];
    for(var i=0;i<data.length;i++){
        const age_id=JSON.parse("[" + data[i].ages_more + "]");
        new_ages=  data1.filter(age => age_id.some(item => age.id === item));
          data[i].ages_more=new_ages; 
    result.push(data[i])
  }
    return result
};


exports.getAllForDetails =async () => {
  // Sắp xếp theo cột
  let orderby = [['index','ASC']];
  const data= await models.ages.findAll({
    order:orderby,
    attributes:['id',"name","start_age","end_age","start_ages","end_ages","total_age","ages_more"]});
    const data1= await models.ages.findAll({where:{deleted: false },attributes:['id',"name","start_age","end_age","start_ages","end_ages","total_age"]});

    const result=[];
    for(var i=0;i<data.length;i++){
      if(data[i].ages_more==="undefined"||data[i].ages_more==null||data[i].ages_more==""){
      data[i].ages_more=null;
    }else{
        const age_id=JSON.parse("[" + data[i].ages_more + "]");
        new_ages=  data1.filter(age => age_id.some(item => age.id === item));
        data[i].ages_more=new_ages;
    }
    result.push(data[i])
  }
    return result
};
//findall
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
  const data= await models.ages.findAll({
    where:{deleted:false},
    order:orderby,
    attributes:['id',"name","start_age","end_age","start_ages","end_ages","total_age","ages_more"]});
    const data1= await models.ages.findAll({where:{deleted: false },attributes:['id',"name","start_age","end_age","start_ages","end_ages","total_age"]});


    const result=[];
    for(var i=0;i<data.length;i++){
        const age_id=JSON.parse("[" + data[i].ages_more + "]");
        new_ages=  data1.filter(age => age_id.some(item => age.id === item));
        data[i].ages_more=new_ages;
    result.push(data[i])
  }
    return result
};

//find all
exports.getAllByPaging = (searchViewModel) => {
  limit = searchViewModel.limit;
  offset = searchViewModel.offset;
  return models.ages.findAndCountAll({
    where:{deleted: false},
    limit: limit,
    offset: offset,
  });
};

//find by id
exports.getByID = async (id) => {
  const data1= await models.ages.findAndCountAll({where:{deleted: false },
    attributes:['id',"name","start_age","end_age","start_ages","end_ages","total_age"]});
  const data= await models.ages.findOne({ where: { id: id } });    
  const age_id=JSON.parse("[" + data.ages_more + "]");
    new_ages=  data1.rows.filter(age => age_id.some(item => age.id === item))
  data.ages_more=new_ages;
  return data
};

//update
exports.update = async (id,options) => {
      return models.ages.update(options, { where: { id: id } });
};

// Save order
exports.SaveOrder = async (order) => {
  for(var i=0; i<order.length;i++){
    const options={
      index: i
    };
  const result= await  models.ages.update(options, { where: { id: order[i] }});
  if(!result){
    return Promise.resolve({
      status: 0,
      message: messageConstants.AGES_UPDATE_FAIL
    });
  }
}
return true
};

//update
exports.getOrder = async (order) => {
  let t;
  try{
  t = await sequelize.transaction();
  for(var i=0; i<order.length;i++){
    const options={
      index: i
    };
  const result= await  models.ages.update(options, { where: { id: order[i] }},{transaction:t});
  if(!result){
    return Promise.resolve({
      status: 0,
      message: messageConstants.AGES_UPDATE_FAIL
    });
  }
}
await t.commit();
const data= await models.ages.findAll();
return data
}catch(error){
  await t.rollback();
}
};
//delete
exports.delete = async (id, options) => {
  return models.ages.update(options, { where: { id:id} });
}
//restore
exports.restore = async(id, options) => {
      return models.ages.update(options, { where: { id: id, deleted: 1 } });
};

//findall
exports.getAllAgeForDetails =async () => {
  // Sắp xếp theo cột
  let orderby = [['index','ASC']];
  const data= await models.ages.findAll({
    order:orderby,
    attributes:['id',"name","start_age","end_age","start_ages","end_ages","total_age","ages_more"]});
    const data1= await models.ages.findAll({where:{deleted: false },attributes:['id',"name","start_age","end_age","start_ages","end_ages","total_age"]});

    const result=[];
    for(var i=0;i<data.length;i++){
        const age_id=JSON.parse("[" + data[i].ages_more + "]");
        new_ages=  data1.filter(age => age_id.some(item => age.id === item));
          data[i].ages_more=new_ages; 
    result.push(data[i])
  }
    return result
};