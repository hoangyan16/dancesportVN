"use strict"
const models                 = require("../../models");


//create
exports.create = async (obj,user,t) => {
    console.log(user)
    const comment = {};
        comment.content= obj.content,
        comment.id_tournament= obj.id_tournament,
        comment.id_news= obj.id_news,
        comment.id_user= user.id,
        comment.created_by= user.user_name,
        comment.status= 1,
        comment.deleted= 0;
    return models.comment.create(comment,t);
};


//find all
exports.getAll = (req) => {
    models.users.belongsTo(models.comment,{foreignKey:'id'});
    models.comment.belongsTo(models.users,{foreignKey:'id_user'});
if(req.type==1){
        return models.comment.findAll({        
         where: {deleted:false,id_tournament:req.id}, 
         attributes:['id','content','id_tournament','created_date','created_by','updated_date','updated_by'],
         order:[['created_date','DESC']],  
         include:[{
             model: models.users,
             attributes:['id','user_name','name']
         }] 
    });
}else {
    return models.comment.findAll({        
        where: {deleted:false,id_news:req.id},   
        attributes:['id','content','id_news','created_date','created_by','updated_date','updated_by'],
         order:[['created_date','DESC']],  
         include:[{
             model: models.users,
             attributes:['id','user_name','name']
         }] 
   });
};
};

//find all paging
exports.getAllByPaging = (searchViewModel) => {
    const limit = searchViewModel.limit;
    const offset = searchViewModel.offset;
    return models.comment.findAndCountAll({
        where:{deleted: false},
        limit: limit,
        offset: offset
    });
};

//find by id
exports.getById = async (id) => {
    models.users.belongsTo(models.comment,{foreignKey:'id'});
    models.comment.belongsTo(models.users,{foreignKey:'id_user'});
        return models.comment.findOne({        
         where: {deleted:false,id:id}, 
         attributes:['id','content','id_tournament','id_news','created_date','created_by','updated_date','updated_by'],
         order:[['created_date','DESC']],  
         include:[{
             model: models.users,
             attributes:['id','user_name','name']
         }] 
    });
};

//update
exports.update = async (id, options,user) => {
    return models.comment.update(options,{where: user.role===1?{deleted:false,id:id}:{deleted:false,id:id,id_user:user.id}});
};

//delete
exports.delete =async (id, options,user) => {
    return models.comment.update(options, 
    {where: user.role===1?{deleted:false,id:id}:{deleted:false,id:id,id_user:user.id}});
};

//restore
exports.restore = async (id, options) => {
    return models.comment.update(options, {where: {id: id, deleted: 1}});
};