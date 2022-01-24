const models                              = require('../../models');
const messageContants                     = require('../constants/messageContants');
const agesService                         = require("../services/ageService");
const gradesService                       = require("../services/gradeService");
const dancesService                       = require("../services/danceService");
const messageConstants                    = require('../constants/messageContants');
const sequelize                           = require('../../models').sequelize;
const QueryTypes                          = require('sequelize');


// Lấy thông tin nội dung các cuộc thi đã được tạo 
exports.getAll=async(filter)=>{
  let condition= `content_competitions.deleted = false`;
    if(filter){
      condition= `content_competitions.deleted = false AND content_competitions.is_closed = ${filter}`;
    }
    const query= `SELECT 
    content_competitions.id,content_competitions.index, content_competitions.grade_id, content_competitions.symbol, content_competitions.fee_id, content_competitions.name, content_competitions.is_closed, content_competitions.minimum_athletes, content_competitions.sub_ages,
    age.id AS age_id, age.name AS age_name,age.start_age AS age_start_age, age.end_age AS age_end_age, age.start_ages AS age_start_ages, age.end_ages AS age_end_ages, age.total_age AS age_total_age, 
    formality.id AS formality_id,formality.name AS formality_name, 
    unit.id AS unit_id, unit.name AS unit_name 
    
    FROM content_competitions AS content_competitions 

    LEFT OUTER JOIN ages AS age ON content_competitions.age_id = age.id AND age.deleted = false 
    LEFT OUTER JOIN formalities AS formality ON content_competitions.formality_id = formality.id AND formality.deleted = false   
    LEFT OUTER JOIN units AS unit ON content_competitions.unit_id = unit.id AND unit.deleted = false  
    
    WHERE ${condition}
    
    ORDER BY content_competitions.index ASC`;
    const result= await sequelize.query(query.trim(),{
    nest: true,
    type: QueryTypes.SELECT,
  });
    let grades=await gradesService.getAll();
    var agesdata= await agesService.getAll();
    // Lấy ages from list ages id
    var ages=[];
    var age_id=[];
    var new_age_id=[];
    const response_raw=[];
    for(var i=0;i<agesdata.length;i++){
        ages[i]=agesdata[i];
    };
    for(var i=0;i<result.length;i++){
      age_id[i]= result[i].sub_ages;
    };
    
    for(var i=0;i<age_id.length;i++){
    new_age_id[i]= JSON.parse('['+age_id[i].toString()+']');
    let new_ages= ages.filter((age) => {   //tìm những phần từ trong mảng thoả mãn điều kiện bên dưới
    if(new_age_id[i].some((item) => (   //điều kiện là id của phần tử = 1 trong số những id trong dãy dance_id mà client gửi lên 
      age.id === item
    ))) {
      return age   //trả ra 1 mảng mới bảo gồm những phần tử dance thỏa mãn điều kiện
    }
    })
    if(new_ages.length==1){
      new_ages= new_ages[0]
    }
    response_raw.push(new_ages);
};
    const format_grades= grades.map(item=>{
        return {
            id: item.id,
            name: item.name,
            dance :  item.dance_id,
            dance_type: {
                id: item.dance_type.id,
                name: item.dance_type.name,
              }
        }
    });
    const data=[]
    for(var j=0; j<result.length;j++){
      for(var i=0; i<format_grades.length;i++){
        if(result[j].grade_id==format_grades[i].id){
          let res={}
          res= {
            id: result[j].id,
            index: result[j].index,
            symbol: result[j].symbol,
            grade: format_grades[i],
            name: result[j].name,
            is_closed: result[j].is_closed,
            minimum_athletes: result[j].minimum_athletes,
            sub_ages:(response_raw[j].length==0)? null: response_raw[j] ,
            age :{
              id: result[j].age_id,
              name:result[j].age_name,
              start_age: result[j].age_start_age,
              end_age:  result[j].age_end_age,
              start_ages: result[j].age_start_ages,
              end_ages:result[j].age_end_ages,
              total_age: result[j].age_total_age,
            },
            formality: {
              id: result[j].formality_id,
              name: result[j].formality_name
            },
            unit:(result[j].unit_id===null) ? null: 
            {
              id: result[j].unit_id,
              name: result[j].unit_name
            }
          }
          data.push(res);
        };
    };
  };
  return data
};

// Get by order when sort by dance_type_id from grades
exports.getAllOrder=async(filter)=>{
  let condition= `content_competitions.status = true`;
    if(filter){
      condition= `content_competitions.status = true AND content_competitions.is_closed = ${filter}`;
    }
    const query= `SELECT 
    content_competitions.id, content_competitions.grade_id, content_competitions.symbol,content_competitions.index_of_detail, content_competitions.fee_id, content_competitions.name, content_competitions.is_closed, content_competitions.minimum_athletes, content_competitions.sub_ages,
    age.id AS age_id, age.name AS age_name,age.start_age AS age_start_age, age.end_age AS age_end_age, age.start_ages AS age_start_ages, age.end_ages AS age_end_ages, age.total_age AS age_total_age, 
    formality.id AS formality_id,formality.name AS formality_name, 
    unit.id AS unit_id, unit.name AS unit_name 
    
    FROM content_competitions AS content_competitions 

    LEFT OUTER JOIN ages AS age ON content_competitions.age_id = age.id AND age.deleted = false 
    LEFT OUTER JOIN formalities AS formality ON content_competitions.formality_id = formality.id AND formality.deleted = false   
    LEFT OUTER JOIN units AS unit ON content_competitions.unit_id = unit.id AND unit.deleted = false  
    
    WHERE ${condition}
    
    ORDER BY content_competitions.index_of_detail ASC`;
    const result= await sequelize.query(query.trim(),{
    nest: true,
    type: QueryTypes.SELECT,
  });
  const data= result.map(item=>{
        return {
          id: item.id,
          index: item.index_of_detail
        }
  });
  return data
};

// Lấy thông tin nội dung các cuộc thi đã được tạo 
exports.sort=async(req)=>{
  var sortColumn = req;
  let orderby =`content_competitions.index ASC`;
  if (sortColumn && sortColumn.columnName != null) {
      if(sortColumn.columnName==='formality_id'){
        if (sortColumn.columnName && sortColumn.isDesc) {
            orderby = `content_competitions.${sortColumn.columnName} DESC, name ASC `;
        } else {
            orderby = `content_competitions.${sortColumn.columnName} ASC, name ASC `;
      }
    }else{
      if (sortColumn.columnName && sortColumn.isDesc) {
        orderby = `content_competitions.${sortColumn.columnName} DESC`;
    } else {
        orderby =`content_competitions.${sortColumn.columnName} ASC`;
  }
    }
  };
  
      const query= `SELECT 
      content_competitions.id, content_competitions.grade_id, content_competitions.symbol, content_competitions.fee_id, content_competitions.name, content_competitions.is_closed, content_competitions.minimum_athletes, content_competitions.sub_ages,
      age.id AS age_id, age.name AS age_name,age.start_age AS age_start_age, age.end_age AS age_end_age, age.start_ages AS age_start_ages, age.end_ages AS age_end_ages, age.total_age AS age_total_age, 
      formality.id AS formality_id,formality.name AS formality_name, 
      unit.id AS unit_id, unit.name AS unit_name 
      
      FROM content_competitions AS content_competitions 
  
      LEFT OUTER JOIN ages AS age ON content_competitions.age_id = age.id AND age.deleted = false 
      LEFT OUTER JOIN formalities AS formality ON content_competitions.formality_id = formality.id AND formality.deleted = false   
      LEFT OUTER JOIN units AS unit ON content_competitions.unit_id = unit.id AND unit.deleted = false  
      
      WHERE content_competitions.deleted = false
      
      ORDER BY ${orderby}`;
      const result= await sequelize.query(query.trim(),{
      nest: true,
      type: QueryTypes.SELECT,
    });
    let grades=await gradesService.getAll();
    var agesdata= await agesService.getAll();
    // Lấy ages from list ages id
    var ages=[];
    var age_id=[];
    var new_age_id=[];
    const response_raw=[];
    for(var i=0;i<agesdata.length;i++){
        ages[i]=agesdata[i];
    };
    for(var i=0;i<result.length;i++){
      age_id[i]= result[i].sub_ages;
    };
    
    for(var i=0;i<age_id.length;i++){
    new_age_id[i]= JSON.parse('['+age_id[i].toString()+']');
    let new_ages= ages.filter((age) => {   //tìm những phần từ trong mảng thoả mãn điều kiện bên dưới
    if(new_age_id[i].some((item) => (   //điều kiện là id của phần tử = 1 trong số những id trong dãy dance_id mà client gửi lên 
      age.id === item
    ))) {
      return age   //trả ra 1 mảng mới bảo gồm những phần tử dance thỏa mãn điều kiện
    }
    })
    if(new_ages.length==1){
      new_ages= new_ages[0]
    }
    response_raw.push(new_ages);
  };
    const format_grades= grades.map(item=>{
        return {
            id: item.id,
            name: item.name,
            dance :  item.dance_id,
            dance_type: {
                id: item.dance_type.id,
                name: item.dance_type.name,
              }
        }
    });
    const data=[]
    for(var j=0; j<result.length;j++){
      for(var i=0; i<format_grades.length;i++){
        if(result[j].grade_id==format_grades[i].id){
          let res={}
          res= {
            id: result[j].id,
            index: result[j].index,
            symbol: result[j].symbol,
            grade: format_grades[i],
            name: result[j].name,
            is_closed: result[j].is_closed,
            minimum_athletes: result[j].minimum_athletes,
            sub_ages:(response_raw[j].length==0)? null: response_raw[j] ,
            age :{
              id: result[j].age_id,
              name:result[j].age_name,
              start_age: result[j].age_start_age,
              end_age:  result[j].age_end_age,
              start_ages: result[j].age_start_ages,
              end_ages:result[j].age_end_ages,
              total_age: result[j].age_total_age,
            },
            formality: {
              id: result[j].formality_id,
              name: result[j].formality_name
            },
            unit:(result[j].unit_id===null) ? null: 
              {
                id: result[j].unit_id,
                name: result[j].unit_name
              }
          }
          data.push(res);
        };
    };
  };
  return data
};

exports.sortFromDetail=async(req)=>{
  var sortColumn = req;
  let orderby =`content_competitions.index ASC`;
  if (sortColumn && sortColumn.columnName != null) {
    if(sortColumn.columnName==='formality_id'){
      if (sortColumn.columnName && sortColumn.isDesc) {
          orderby = `content_competitions.${sortColumn.columnName} DESC, name ASC `;
      } else {
          orderby = `content_competitions.${sortColumn.columnName} ASC, name ASC `;
    }
  }else{
    if (sortColumn.columnName && sortColumn.isDesc) {
      orderby = `content_competitions.${sortColumn.columnName} DESC`;
  } else {
      orderby =`content_competitions.${sortColumn.columnName} ASC`;
}
  }
};
    const query= `SELECT 
    content_competitions.id, content_competitions.grade_id, content_competitions.symbol, content_competitions.fee_id, content_competitions.name, content_competitions.is_closed, content_competitions.minimum_athletes, content_competitions.sub_ages,
    age.id AS age_id, age.name AS age_name,age.start_age AS age_start_age, age.end_age AS age_end_age, age.start_ages AS age_start_ages, age.end_ages AS age_end_ages, age.total_age AS age_total_age, 
    formality.id AS formality_id,formality.name AS formality_name, 
    unit.id AS unit_id, unit.name AS unit_name 
    
    FROM content_competitions AS content_competitions 

    LEFT OUTER JOIN ages AS age ON content_competitions.age_id = age.id AND age.deleted = false 
    LEFT OUTER JOIN formalities AS formality ON content_competitions.formality_id = formality.id AND formality.deleted = false   
    LEFT OUTER JOIN units AS unit ON content_competitions.unit_id = unit.id AND unit.deleted = false  
    
    WHERE content_competitions.status = true
    
    ORDER BY ${orderby}`;
    const result= await sequelize.query(query.trim(),{
    nest: true,
    type: QueryTypes.SELECT,
  });

  let index= 0;
  const order_for_details= result.map(item=>{
      index++ 
     return{
       id: item.id,
       index: index,
       formality: item.formality_id,
       name: item.name,
       age: item.age_id
    };
})
return order_for_details
};
// Lấy thông tin nội dung các cuộc thi đã được tạo bằng tournament
exports.getAllByTournaments=async(filter)=>{
  let condition= `content_competitions.status= true`
  if( filter){
     condition= `content_competitions.status= true AND content_competitions.is_closed= ${filter}`
  }
  const query= `SELECT 
  content_competitions.id, content_competitions.grade_id, content_competitions.symbol, content_competitions.fee_id, content_competitions.name, content_competitions.is_closed, content_competitions.minimum_athletes, content_competitions.sub_ages,
  age.id AS age_id, age.name AS age_name,age.start_age AS age_start_age, age.end_age AS age_end_age, age.start_ages AS age_start_ages, age.end_ages AS age_end_ages, age.total_age AS age_total_age, 
  formality.id AS formality_id,formality.name AS formality_name, 
  unit.id AS unit_id, unit.name AS unit_name 
  
  FROM content_competitions AS content_competitions 

  LEFT OUTER JOIN ages AS age ON content_competitions.age_id = age.id  
  LEFT OUTER JOIN formalities AS formality ON content_competitions.formality_id = formality.id AND formality.deleted = false   
  LEFT OUTER JOIN units AS unit ON content_competitions.unit_id = unit.id AND unit.deleted = false  
  
  WHERE ${condition}

  ORDER BY content_competitions.index ASC`;
  const result= await sequelize.query(query.trim(),{
  nest: true,
  type: QueryTypes.SELECT,
});
let grades=await gradesService.getAllForDetails();
var agesdata= await agesService.getAllAgeForDetails();
// Lấy ages from list ages id
var ages=[];
var age_id=[];
var new_age_id=[];
const response_raw=[];
for(var i=0;i<agesdata.length;i++){
    ages[i]=agesdata[i];
};
for(var i=0;i<result.length;i++){
  age_id[i]= result[i].sub_ages;
};
for(var i=0;i<age_id.length;i++){
new_age_id[i]= JSON.parse('['+age_id[i].toString()+']');
new_ages= ages.filter((age) => {   //tìm những phần từ trong mảng thoả mãn điều kiện bên dưới
if(new_age_id[i].some((item) => (   //điều kiện là id của phần tử = 1 trong số những id trong dãy dance_id mà client gửi lên 
  age.id === item
))) {
  return age   //trả ra 1 mảng mới bảo gồm những phần tử dance thỏa mãn điều kiện
}
})
if(new_ages.length==1){
  new_ages= new_ages[0]
}
response_raw.push(new_ages);
};
const format_grades= grades.map(item=>{
    return {
        id: item.id,
        name: item.name,
        dance :  item.dance_id,
        dance_type: {
            id: item.dance_type.id,
            name: item.dance_type.name,
          }
    }
});
const data=[]
for(var j=0; j<result.length;j++){
  for(var i=0; i<format_grades.length;i++){
    if(result[j].grade_id==format_grades[i].id){
      let res={}
      res= {
        id: result[j].id,
        symbol: result[j].symbol,
        grade: format_grades[i],
        name: result[j].name,
        is_closed: result[j].is_closed,
        minimum_athletes: result[j].minimum_athletes,
        sub_ages: (response_raw[j].length==0)? null: response_raw[j] ,
        age :{
          id: result[j].age_id,
          name:result[j].age_name,
          start_age: result[j].age_start_age,
          end_age:  result[j].age_end_age,
          start_ages: result[j].age_start_ages,
          end_ages:result[j].age_end_ages,
          total_age: result[j].age_total_age,
        },
        formality: {
          id: result[j].formality_id,
          name: result[j].formality_name
        },
        unit:(result[j].unit_id===null) ? null: 
        {
          id: result[j].unit_id,
          name: result[j].unit_name
        }
      }
      data.push(res);
    };
};
};
return data
};

// Lấy thông tin nội dung các cuộc thi đã được tạo 
exports.getAllPreparedData=async()=>{
  models.dance_types.hasMany(models.dances, {foreignKey: 'id'});
  models.dances.belongsTo(models.dance_types,{foreignKey: 'dance_type_id'});
  // Sắp xếp theo cột
  let  orderby = [['dance_type_id' ,'ASC'],['symbol','ASC']];
  const dances=await models.dances.findAll({        
  where:{deleted: false},
  attributes:['id','name','symbol'],
  include:[{
      model: models.dance_types,
      as: 'dance_type',
      attributes:['id','name']
  }],
  order: orderby,
});
    const dance_types= await models.dance_types.findAll({where:{deleted: false},attributes:['id','name']});
    const ages=await models.ages.findAll({where:{deleted: false},attributes:['id','name','ages_more']});
    const formality=await models.formality.findAll({where:{deleted: false},attributes:['id','name']});
    const unit=await models.units.findAll({where:{deleted: false},attributes:['id','name']});
    models.grades.belongsTo(models.dance_types,{foreignKey:'dance_type_id'});
    models.dance_types.belongsTo(models.grades,{foreignKey:'id'});
    const grades= await models.grades.findAll({
    where:{deleted: false},
    attributes:['id','name','dance_id'],
    include:[{
      where:{'deleted': false},
      model: models.dance_types,
      as: 'dance_type',
      attributes:['id','name']
  }],
  order:[['index','ASC']],
  });
            const _dances = await dancesService.getDances();
            var dance_ids=[];
            for(var i=0;i<grades.length;i++){
                  dance_ids[i]=grades[i].dance_id;
            };
            const response=[];
            const dance_id=[];
              for(var i=0;i<dance_ids.length;i++){
                dance_id[i]= JSON.parse('['+dance_ids[i]+']');
              };
                dance_id.forEach(element=>{
                let new_dances=[];
                element.forEach(el=>{
                  _dances.filter((dance) => {    
                  if(dance.id===el){
                   new_dances.push(dance);
                  }
                })
              })
              response.push(new_dances)
            })
for(var i=0;i<grades.length;i++){
  grades[i].dance_id= response[i]; 
};
    return Promise.resolve({
        dances: dances,
        dance_types: dance_types,
        ages: ages,
        grades: grades,
        formality: formality,
        unit: unit
    })
};
// Lấy thông tin nội dung các cuộc thi đã được tạo bằng paging
exports.getAllByPaging=async(searchViewModel)=>{
    const limit= searchViewModel.limit;
    const offset= searchViewModel.offset;
    var sortColumn = searchViewModel.sortColumn;

    let orderby = 'id';
    if (sortColumn && sortColumn.columnName != null) {
        if (sortColumn.columnName && sortColumn.isAsc) {
            orderby = sortColumn.columnName + ' ASC';
        } else {
            orderby = sortColumn.columnName + ' DESC';
        }
    }
    return models.content_competitions.findAndCountAll({
        where:{deleted: false},
        limit:limit,
        offset:offset,
        order: [[orderby]],
    });
};

// Save order
exports.SaveOrder = async (order) => {
  for(var i=0; i<order.length;i++){
    const options={
      index: i
    };
  const result= await  models.content_competitions.update(options, { where: { id: order[i] }});
  if(!result){
    return Promise.resolve({
      status: 0,
      message: messageContants.CONTENTCOMPETITION_UPDATE_FAIL
    });
  }
}
return true
};

// Save order
exports.SaveOrderFromGrades = async (order) => {
  for(var i=0; i<order.length;i++){
    const options={
      index: order[i].index
    };
  const result= await  models.content_competitions.update(options, { where: { deleted:false, grade_id: order[i].id }});
  if(!result){
    return Promise.resolve({
      status: 0,
      message: messageContants.CONTENTCOMPETITION_UPDATE_FAIL
    });
  }
}
return true
};

// Save order
exports.SaveOrderFromDetails = async (order) => {
  for(var i=0; i<order.length;i++){
    const options={
      index_of_detail: order[i].index
    };
  const result= await  models.content_competitions.update(options, { where: { grade_id: order[i].id }});
  if(!result){
    return Promise.resolve({
      status: 0,
      message: messageContants.CONTENTCOMPETITION_UPDATE_FAIL
    });
  }
}
return true
};
// Lấy thông tin nội dung cuộc thi đã được tạo 
exports.getbyId= async(Id)=>{
    return models.content_competitions.findOne({where:{id:Id}});
};

// Tạo thông tin nội dung của cuộc thi
exports.create= async(obj)=>{
  let content= await models.content_competitions.findOne({where:{symbol: obj.symbol,deleted:false}});
  if(content){
        return Promise.resolve({
          message:  messageConstants.CONTENTCOMPETITION_EXIST_SYMBOL
        })
  }else{
    return models.content_competitions.create(obj);
  }
};

// Tạo thông tin nội dung của cuộc thi
exports.createContentFromGrade= async(id,grade_id)=>{
  const result=[];
  for(var i= 0; i<id.length;i++){
    let data= await models.content_competitions.findOne({where:{id:id[i]}});
    let options= {
      symbol: data.symbol,
      fee_id: data.fee_id,
      minimum_athletes: data.minimum_athletes,
      age_id: data.age_id,
      sub_ages: data.sub_ages,
      grade_id: grade_id,
      formality_id: data.formality_id,
      name: data.name,
      is_closed: data.is_closed,
      unit_id: data.unit_id,
      status: data.status,
      deleted: 0
    };
    let b= await models.content_competitions.create(options);
    result.push(b);
  };
  return result
};


// Tạo thông tin nội dung của cuộc thi
exports.createContentFormAge= async(id,age_id)=>{
  const result=[];
  for(var i= 0; i<id.length;i++){
    let data= await models.content_competitions.findOne({where:{id:id[i]}});
    let options= {
      symbol: data.symbol,
      fee_id: data.fee_id,
      minimum_athletes: data.minimum_athletes,
      age_id: age_id,
      sub_ages: data.sub_ages,
      grade_id: data.grade_id,
      formality_id: data.formality_id,
      name: data.name,
      is_closed: data.is_closed,
      unit_id: data.unit_id,
      status: data.status,
      deleted: 0
    };
    let b= await models.content_competitions.create(options);
    result.push(b);
  };
  return result
};
// Chỉnh sửa thông tin nội dung của cuộc thi
exports.update= async(Id,options)=>{
  return  models.content_competitions.update(options,{where:{id:Id}});
};
// Chỉnh sửa thông tin nội dung của cuộc thi
exports.updateFromGrade= async(Id,options)=>{
    return  models.content_competitions.update(options,{where:{grade_id:Id}});
};

// Chỉnh sửa thông tin nội dung của cuộc thi
exports.updateFromAges= async(Id,options)=>{
      Id.forEach(async(item)=>{
        await models.content_competitions.update(options,{where:{age_id:item}});
      })
  return  models.content_competitions.update(options,{where:{age_id:Id}});
};

// Chỉnh sửa thông tin nội dung của cuộc thi
exports.updateFromGrades= async(Id,options)=>{
  Id.forEach(async(item)=>{
    await models.content_competitions.update(options,{where:{grade_id:item}});
  })
return  models.content_competitions.update(options,{where:{grade_id:Id}});
};

// Xóa thông tin nội dung của cuộc thi khi update nd có liên quan đến detail
exports.deleteWhenUpdate= async(Id,options)=>{
  const success=[];
  for(var i=0;i<Id.length;i++){
    let b= await models.content_competitions.update(options,{where:{id:Id[i],deleted:0}});
    if(b==true){
      i=i+1;
      success.push(b);
    }else{
    return Promise.resolve({success:false})
  }
}
  return success
};

// Xóa thông tin nội dung của cuộc thi
exports.deleteFromContent= async(Id,options)=>{
  return models.content_competitions.update(options,{where:{id:Id,deleted:0}});
};
//Khôi phục thông tin nội dung của cuộc thi
exports.restore= async(Id,options)=>{
  return models.content_competitions.update(options,{where:{id:Id,deleted:1}});
};


// Khóa thông tin nội dung của cuộc thi
exports.lock= async(Id,options)=>{
            const isclosed = await models.content_competitions.findOne({where:{id:Id,is_closed:false}});
            if (!isclosed){
                return Promise.resolve({
                    message: messageContants.CONTENTCOMPETITION_LOCKED,
                });
            }else{
                return models.content_competitions.update(options,{where:{id:Id}});
     }
};

// Mở khóa 
exports.unlock= async(Id,options)=>{
            const isclosed = await models.content_competitions.findOne({where:{id:Id,is_closed:true}});
            if (!isclosed){
                return Promise.resolve({
                    message: messageContants.CONTENTCOMPETITION_UNLOCKED,
                });
            }else{
                return models.content_competitions.update(options,{where:{id:Id}});
     }
};

// Get content by age_id 
exports.getByAgeId=async()=>{
    const contents= await models.content_competitions.findAndCountAll({where:{deleted: false}});
    const age_id_in_content=[];
    for(var i= 0; i<contents.count;i++){
      age_id_in_content[i]= contents.rows[i].age_id;
  };
  return age_id_in_content
};

// Get content by unit_id 
exports.getByUnitId=async()=>{
  const contents= await models.content_competitions.findAndCountAll({where:{deleted: false}});
  const unit_id_in_content=[];
  for(var i= 0; i<contents.count;i++){
    unit_id_in_content[i]= contents.rows[i].unit_id;
};
return unit_id_in_content
};


// Get content by age_id 
exports.getByGradeId=async()=>{
    return models.content_competitions.findAndCountAll({where:{deleted: false}});
};

    // Get content by age_id 
exports.getContentIdByAgeId= async(Id)=>{
      const contents= await models.content_competitions.findAndCountAll({where:{age_id:Id,deleted: false}});
      const id_content=[];
      for(var i= 0; i<contents.count;i++){
        id_content[i]= contents.rows[i].id;
      };
      return id_content;
    };
// Get content by age_id 
    exports.getContentIdByGradeId= async(Id)=>{
      const contents= await models.content_competitions.findAndCountAll({where:{grade_id:Id,deleted: false}});
      const id_content=[];
      for(var i= 0; i<contents.count;i++){
        id_content[i]= contents.rows[i].id;
      };
      return id_content;
};

// Get content by age_id 
exports.getContentIdByUnitId= async(Id)=>{
  const contents= await models.content_competitions.findAndCountAll({where:{unit_id:Id,deleted: false}});
  const id_content=[];
  for(var i= 0; i<contents.count;i++){
    id_content[i]= contents.rows[i].id;
  };
  return id_content;
};


// Get content by age_id 
exports.updateUnitForContent= async(Id)=>{
  const option= {
    unit_id: Id,
    updated_date: new Date()
  }
  await models.content_competitions.update(option,{where:{unit_id:Id,deleted: false}});
  return true;
};