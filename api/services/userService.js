const models                              = require("../../models");
const messageConstants                    = require("../constants/messageContants");
const jwt                                 = require('jsonwebtoken');
const bcrypt                              = require('bcryptjs');
const { Op }                              = require("sequelize");
const jwt_token                           = require("../middlewares/jwt_token");
const UnitService                         = require("../services/unitService");
const unit = require("../../models/unit");
const messageContants = require("../constants/messageContants");


//create
exports.create = async (obj,user) => {
  const data={
    role:obj.role,
    name: obj.name,
    email: obj.email,
    mobile: obj.mobile,
    unit_id: obj.unit_id,
    type: obj.type,
    address: obj.address,
    user_name: obj.user_name,
    password: obj.password,
    created_by: user.user_name
  }
  const email = await models.users.findOne({where:{email:data.email,deleted:false}});
  if(!email){
    const userName= await models.users.findOne({where:{user_name:data.user_name,deleted:false}})
      if(!userName){
        const salt= await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(data.password,salt);
        data.password= hashPassword;
        const user= await models.users.create(data);
        return user;
  }else{
    return Promise.resolve({
      message:  messageConstants.USER_EXIST_NAME,
    });
  };
}else{
    return Promise.resolve({
       message:  messageConstants.USER_MAIL_EXIST,
       });
    };
};

//create
exports.register = async (obj) => {
  const data={
    name: obj.name,
    email: obj.email,
    mobile: obj.mobile,
    unit_id: obj.unit_id,
    address: obj.address,
    user_name: obj.user_name,
    password: obj.password,
    status: 0
  }
  const email = await models.users.findOne({where:{email:data.email,deleted:false}});
  if(!email){
    const userName= await models.users.findOne({where:{user_name:data.user_name,deleted:false}});
    if(!userName){
        const salt= await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(data.password,salt);
        data.password= hashPassword;
        return  models.users.create(data);
      }else{
        return Promise.resolve({
          message:  messageConstants.USER_USERNAME_EXIST,
        });
      }
}else{
    return Promise.resolve({
       message:  messageConstants.USER_MAIL_EXIST,
       });
    };
};

//findall
exports.getAll =async () => {
  const units=await UnitService.getAll();
  const result= await models.users.findAll({where:{status:1,deleted: false },
  order:[['created_date','DESC']],
});
const res=[];
for(var i=0; i<result.length;i++){
  let unit_id={};
    for(var j=0; j<units.length;j++){
      if(result[i].unit_id===null){
        unit_id= null
      }
      if(result[i].unit_id===units[j].id){
        unit_id= {
          id: units[j].id,
          name:units[j].name
        }
      }
    };
        let data= {
          id: result[i].id,
          name: result[i].name,
          role: result[i].role,
          email: result[i].email,
          mobile: result[i].mobile,
          unit: unit_id,
          type: result[i].type,
          address: result[i].address,
          user_name: result[i].user_name
        }
        res.push(data);
      }
  return res
};


//find all
exports.getAllByPaging = (searchViewModel) => {
  limit = searchViewModel.limit;
  offset = searchViewModel.offset;
  return models.users.findAndCountAll({
    where:{deleted: false},
    limit: limit,
    offset: offset,
  });
};

//find by id
exports.getByID = async (id) => {
  const result = await models.users.findOne({where:{id:id,deleted: false }});
  if(!result){
    return Promise.resolve({
      message: messageContants.USER_ID_NOT_FOUND
    })
  }else{
    let unit= {};
    if(!result.unit_id){
      unit= null
    }else{
      const units=await UnitService.getById(result.unit_id);
      unit= {
        id: units.id,
        name:units.name
    };
  }
      return {
        id: result.id,
        name: result.name,
        role: result.role,
        email: result.email,
        mobile: result.mobile,
        unit: unit,
        type: result.type,
        address: result.address,
        user_name: result.user_name
      }
  }
};

//find by email
exports.getByEmail = async (email) => {
  const user = await models.users.findOne({where:{email:email,deleted:false}});
  if(user){
      return user;
    }else{
      return Promise.resolve({
         message:  messageConstants.USER_MAIL_EXIST,
         });
      };
  };

//update
exports.update = async (id, options) => {
  return models.users.update(options, { where: { id:id} });
}


//update to reset password
exports.updateResetPassword = async (id, options) => {
  const data= { token: options, password_expires:new Date() +60 };
  return models.users.update(data, { where: { id:id, deleted: 0 } });
}


//delete
exports.delete = async (id, options) => {
  return models.users.update(options, { where: { id:id, deleted: 0 } });
}

//restore
exports.restore = async (id, options) => {
      return models.users.update(options, { where: { id: id, deleted: 1 } });
};

// Login
exports.login =async (account)=>{
 const user= await models.users.findOne({where:{deleted:0,user_name:account.user_name}});
      if(user){
        const unit=await UnitService.getById(user.unit_id);
        const isMatch = await bcrypt.compare(account.password, user.password)
        if(isMatch){
            if(user.status==1){
             const accessToken = jwt_token.signAccessToken(user);
             const refreshToken = jwt_token.signRefreshToken(user);
             return {accessToken,refreshToken,user,unit};
            }else{
              return Promise.resolve({
                message: messageConstants.USER_NOT_ACTIVE,
          });
            }
          }
          else{
             return Promise.resolve({
                message: messageConstants.USER_PASS_INVALID,
          });
       }
   }else{
         return Promise.resolve({
            message: messageConstants.USER_USERNAME_NOT_EXIST,
        });
    } 
};

// Reset
exports.resetPassword =async (account)=>{
  const user= await models.users.findOne({where:{deleted:0,user_name:account.user_name}});
       if(user){
          const isMatch = await bcrypt.compare(account.password, user.password)
          if(isMatch){
              const isMatch2 = await bcrypt.compare(account.new_password, user.password);
              if(!isMatch2){
                const salt= await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(account.new_password,salt);
                account.new_password= hashPassword;
                const options= {password: account.new_password, updated_date:new Date()};
              return models.users.update(options,{where:{id:user.id}});
              }else{
                return Promise.resolve({
                  message: messageConstants.USER_PASS_EXIST,
              });
            }
          }else{
           return Promise.resolve({
              message: messageConstants.USER_PASS_INVALID,
          });
       }
    }else{
          return Promise.resolve({
             message: messageConstants.USER_USERNAME_NOT_EXIST,
         });
     } 
 };
 
// Forget-Password
exports.forgetPassword =async (account)=>{
  const user= await models.users.findOne({where:{token:account.token}});    
    if(user){
      const date= await models.users.findOne({where:{password_expires: {[Op.lt]: new Date()}}});
      if(date){
          const salt= await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(account.password,salt);
          account.password= hashPassword;
          const options= {password: account.password, update_date:new Date()};
          return models.users.update(options,{where:{id:user.id}});
    }else{
          return Promise.resolve({
             message: messageConstants.EMAIL_DATE_EXPIRED,
         });
     } 
    }else{
      return Promise.resolve({
         message: messageConstants.USER_USERNAME_NOT_EXIST,
     });
    } 
 };


 // verifyForRegister
exports.verifyForRegister =async (account)=>{
  const user= await models.users.findOne({where:{token:account.token}});    
    if(user){
      const options={
        status: 1
      }
          return models.users.update(options,{where:{id:user.id}});
    }else{
      return Promise.resolve({
         message: messageConstants.USER_EMAIL_NOT_EXIST,
     });
 } 
 };

  // Get User_id by unit_id 
  exports.getUserIdByUnitId= async(Id)=>{
    const contents= await models.users.findAndCountAll({where:{unit_id:Id,deleted: false}});
    const id_content=[];
    for(var i= 0; i<contents.count;i++){
      id_content[i]= contents.rows[i].id;
    };
    return id_content;
};

// Get content by age_id 
exports.updateUnitForAthlete= async(Id,options)=>{
  await models.content_competitions.update(options,{where:{unit_id:Id,deleted: false}});
  return true;
};

// Get athlete by unit_id 
exports.updateUnitForUser= async(Id)=>{
  const option= {
    unit_id: Id,
    updated_date: new Date()
  }
  await models.users.update(option,{where:{unit_id:Id,deleted: false}});
  return true;
};

// Get athlete by unit_id 
exports.getByUnitId=async()=>{
  const contents= await models.users.findAndCountAll({where:{deleted: false}});
  const unit_id_in_content=[];
  for(var i= 0; i<contents.count;i++){
    unit_id_in_content[i]= contents.rows[i].unit_id;
};
return unit_id_in_content
};
