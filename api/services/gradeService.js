const models                            = require("../../models");
const messageConstants                  = require("../constants/messageContants");
const { Sequelize, DataTypes }          = require('sequelize');
const sequelize                         = new Sequelize('mysql::memory');
const dancesService                     = require("../services/danceService");

//create
exports.create = async (obj) => {
  const grades = {};
  grades.name= obj.name,
  grades.dance_id=obj.dance_id,
  grades.dance_type_id= obj.dance_type_id,
  grades.created_by=obj.created_by,
  grades.status= 1,
  grades.deleted= 0;
  return models.grades.create(grades);
};

//Find all details in grades
exports.getAll =async (searchViewModel) => {
  models.grades.belongsTo(models.dance_types,{foreignKey:'dance_type_id'});
  models.dance_types.belongsTo(models.grades,{foreignKey:'id'});
  const result= await models.grades.findAll({
    where:{deleted: false},
    order:[['index','ASC']],
    attributes:['id','name','dance_id'],
    include:[{
      where:{'deleted': false},
      model: models.dance_types,
      as: 'dance_type',
      attributes:['id','name']
  }],
  });
            const dances = await dancesService.getDances();
            var dance_ids=[];
            for(var i=0;i<result.length;i++){
                  dance_ids[i]= result[i].dance_id;
            };
            const response=[];
            const dance_id=[];
              for(var i=0;i<dance_ids.length;i++){
                dance_id[i]= JSON.parse('['+dance_ids[i]+']');
              };
                dance_id.forEach(element=>{
                let new_dances=[];
                element.forEach(el=>{
                  dances.filter((dance) => {    
                  if(dance.id===el){
                   new_dances.push(dance);
                  }
                })
              })
              response.push(new_dances)
            })
for(var i=0;i<result.length;i++){
  result[i].dance_id= response[i]; 
};
 return result
};

//Find all details in grades
exports.getAllForDetails =async (searchViewModel) => {
  models.grades.belongsTo(models.dance_types,{foreignKey:'dance_type_id'});
  models.dance_types.belongsTo(models.grades,{foreignKey:'id'});
  const result= await models.grades.findAll({
    attributes:['id','name','dance_id'],
    include:[{
      where:{'deleted': false},
      model: models.dance_types,
      as: 'dance_type',
      attributes:['id','name']
  }],
  order:[['index','ASC']],
  });
            const dances = await dancesService.getDances();
            var dance_ids=[];
            for(var i=0;i<result.length;i++){
                  dance_ids[i]= result[i].dance_id;
            };
            const response=[];
            const dance_id=[];
              for(var i=0;i<dance_ids.length;i++){
                dance_id[i]= JSON.parse('['+dance_ids[i]+']');
              };
                dance_id.forEach(element=>{
                let new_dances=[];
                element.forEach(el=>{
                  dances.filter((dance) => {    
                  if(dance.id===el){
                   new_dances.push(dance);
                  }
                })
              })
              response.push(new_dances)
            })
for(var i=0;i<result.length;i++){
  result[i].dance_id= response[i]; 
};
 return result
};


//Find all details in grades
exports.sort =async (searchViewModel) => {
  models.grades.belongsTo(models.dance_types,{foreignKey:'dance_type_id'});
  models.dance_types.belongsTo(models.grades,{foreignKey:'id'});
  var sortColumn = searchViewModel;
  let orderby = [['index']];
  if (sortColumn && sortColumn.columnName != null) {
    if(sortColumn.columnName==='dance_type_id'){
      if (sortColumn.columnName && sortColumn.isDesc) {
        orderby = [[(sortColumn.columnName) ,'DESC'],['name','DESC']];
    } else {
        orderby = [[(sortColumn.columnName) ,'ASC'],['name','ASC']];
  }
    }else{
      if (sortColumn.columnName && sortColumn.isDesc) {
          orderby = [[(sortColumn.columnName) ,'DESC']];
      } else {
          orderby = [[(sortColumn.columnName) ,'ASC']];
      }
    }
}
    // Sắp xếp theo cột
  const result= await models.grades.findAll({
    where:{deleted: false},
    attributes:['id','name','dance_id'],
    include:[{
      where:{'deleted': false},
      model: models.dance_types,
      as: 'dance_type',
      attributes:['id','name']
  }],
  order:orderby,
  });
  const dances = await dancesService.getDances();
  var dance_ids=[];
  for(var i=0;i<result.length;i++){
        dance_ids[i]= result[i].dance_id;
  };
  const response=[];
  const dance_id=[];
    for(var i=0;i<dance_ids.length;i++){
      dance_id[i]= JSON.parse('['+dance_ids[i]+']');
    };
      dance_id.forEach(element=>{
      let new_dances=[];
      element.forEach(el=>{
        dances.filter((dance) => {    
        if(dance.id===el){
         new_dances.push(dance);
        }
      })
    })
    response.push(new_dances)
  })
for(var i=0;i<result.length;i++){
result[i].dance_id= response[i]; 
};
return result
};


//sort dance_type in grades
exports.sortFromContent =async (searchViewModel) => {
  models.grades.belongsTo(models.dance_types,{foreignKey:'dance_type_id'});
  models.dance_types.belongsTo(models.grades,{foreignKey:'id'});
  var sortColumn = searchViewModel;
  let orderby = [['dance_type_id']];
      if (sortColumn.columnName && sortColumn.isDesc) {
        orderby = [['dance_type_id' ,'DESC'],['name','DESC']];
    } else {
        orderby = [['dance_type_id' ,'ASC'],['name','ASC']];
    }
    // Sắp xếp theo cột
  const result= await models.grades.findAll({
    where:{deleted: false},
    attributes:['id','name','dance_id','index'],
    include:[{
      where:{'deleted': false},
      model: models.dance_types,
      as: 'dance_type',
      attributes:['id','name']
  }],
  order:orderby,
  });
  let index=0;
  const data= result.map(item=>{
    index++;
    return {
      id: item.id,
      index: index
    }
  })
return data
};




// Save order
exports.SaveOrder = async (order) => {
  for(var i=0; i<order.length;i++){
    const options={
      index: i
    };
  const result= await  models.grades.update(options, { where: { id: order[i] }});
  if(!result){
    return Promise.resolve({
      status: 0,
      message: messageConstants.AGES_UPDATE_FAIL
    });
  }
}
return true
};
//find all dance, dance-types
exports.getAllPreparedData = async () => {
  const danceTypes = await models.dance_types.findAll({where:{deleted: false},attributes:['id','name']});
  const dances = await models.dances.findAll({where:{deleted: false},attributes:['id','name','symbol','dance_type_id']});
  return Promise.resolve({
    danceTypes: danceTypes,
    dances : dances
  })
};

//find by id
exports.getById = async (id) => {
  const result= await models.grades.findOne({ where: { id: id } });
  const dances = await dancesService.getDances();
                const new_dances=[];
                const dance_id= JSON.parse('['+result.dance_id+']');
                dance_id.forEach(ele=>{
                dances.filter((dance) => {    
                if(dance.id===ele){
                 new_dances.push(dance);
                }
              })
          });
  result.dance_id=new_dances; 
return result
};

//find all paging
exports.getAllByPaging = (searchViewModel) => {
  limit = searchViewModel.limit;
  offset = searchViewModel.offset;
  return models.grades.findAndCountAll({
    where:{deleted: false},
    order: [
      ['created_date', 'DESC']
  ],
    limit: limit,
    offset: offset
  });
};

//update
exports.update = async (id, options) => {
      return models.grades.update(options, { where: { id: id } });
};
// Chỉnh sửa thông tin nội dung của cuộc thi
exports.updateFromDances= async(Id,options)=>{
  return  models.grades.update(options,{where:{age_id:Id}});
};
//delete
exports.delete = async (id, options) => {
    return models.grades.update(options, { where: { id: id, deleted: 0 } });
};

//restore
exports.restore = async (id, options) => {
      return models.grades.update(options, { where: { id: id, deleted: 1 } });
};

// Get all grade to check dance_id
exports.getByGradeId = async (id) => {
let condition={deleted: false};
if(id){
  condition={deleted: false,dance_type_id:id};
}
return models.grades.findAll({where:condition,attributes:['id','name','dance_id']});
};


