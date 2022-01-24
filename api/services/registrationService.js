const models                                  = require('../../models');
const messageContants                         = require('../constants/messageContants');
const TournamentsService                      = require("../services/tournamentService");

// Lấy thông tin nội dung các cuộc thi đã được tạo 
exports.getAll=async()=>{
    return  models.registration.findAndCountAll({
        where:{deleted: false},
        order: [['created_date', 'DESC']],
    });
};

// Lấy thông tin nội dung các cuộc thi đã được tạo bằng paging
exports.getAllByPaging=async(searchViewModel)=>{
const limit= searchViewModel.limit;
const offset= searchViewModel.offset;
return models.registration.findAndCountAll({
    where:{deleted: false},
    order: [
      ['created_date', 'DESC']
  ],
    limit:limit,
    offset:offset
});
};

// Lấy thông tin nội dung cuộc thi đã được tạo 
exports.getbyId=async (Id)=>{
    const id= await models.registration.findOne({where:{id:Id,deleted: false}});
    if (!id){
        return Promise.resolve({
            message: messageContants.REGISTRATION_ID_NOT_FOUND,
        });
    }else{    
return models.registration.findOne({where:{id:Id}});
    }
};
// Tạo thông tin nội dung của cuộc thi
exports.create1= async(options)=>{        
    return  models.registration.create(options);
};
// Tạo thông tin nội dung của cuộc thi
exports.create= async(options)=>{
        var arr=[];
        const detail_id=JSON.parse("[" + options.tournament_detail_id + "]");
        for(var i=0; i<detail_id.length;i++){
            options.tournament_detail_id= detail_id[i];
            const b= await models.registration.create(options);
            arr.push(b);
        }
        return arr;
};

exports.getDetailsByAthletesID=async (id)=>{
    const result=await  models.registration.findAll({where:{athlete_id:id,deleted:false}});
    const tournament_detail_id= result.map(res=>{
       return res.tournament_detail_id 
    });
    return tournament_detail_id
};

exports.getDetailsByAthletesIDForSubtract=async (id)=>{
    const result=await  models.registration.findAll({where:{athlete_id:id,deleted:true}});
    const data= result.map(res=>{
        return res.tournament_detail_id 
    });
    return data
};
// Chỉnh sửa thông tin nội dung của cuộc thi
exports.update= async(Id,options)=>{
    return models.registration.update(options,{where:{id:Id,deleted:0}});
};

// Xóa thông tin nội dung của cuộc thi
exports.delete= async(Id,options)=>{
    return models.registration.update(options,{where:{id:Id,deleted:0}});
};

// Xóa thông tin nội dung của cuộc thi
exports.delete2= async(Id)=>{
    return models.registration.destroy({where:{deleted:0,athlete_id:Id}});
};

exports.deleteAthletes= async(Id,options)=>{
    await models.registration.update(options,{where:{athlete_id:Id,deleted:0}});
    return true
};

// Xóa nhiều vđv 
exports.deleteAllAthletes= async(Id,options)=>{
    for(var i=0; i<Id.length;i++){
        await models.registration.update(options,{where:{athlete_id:Id[i],deleted:0}});
    }
    return true
};

// Xóa thông tin nội dung của cuộc thi
exports.restore= async(Id,options)=>{
return models.registration.update(options,{where:{id:Id,deleted:1}});
};

// Lấy thông tin nội dung các cuộc thi đã được tạo 
exports.getAllAthletesByTournamentId=async(tournament_id)=>{
    const athelete= await models.registration.findAll({
        where:{tournament_id:tournament_id,deleted: false},
    });
    const athletes_id=athelete.map(ath=>{
        return ath.athlete_id
    });
    // Lọc các phần tử trùng
    for (i=0;i<athletes_id.length;i++)
    {
        j=i+1;
        while (j<athletes_id.length)
        if (athletes_id[i]==athletes_id[j])
        {
        for (k=j;k<athletes_id.length;k++) 
        athletes_id[k]=athletes_id[k+1];
        athletes_id.length=athletes_id.length-1;
        }
    else j=j+1;
        // athletes_id.length--;
    };
    const option= {updated_date: new Date()};
    await models.tournaments.update(option,{where:{id:tournament_id}});
    const tournament= await TournamentsService.getbyId(tournament_id);
    return {athletes_id,tournament}
};


// Khóa 
exports.lock= async(Id,options)=>{
const isclosed = await models.registration.findOne({where:{id:Id,is_closed:false}});
            if (!isclosed){
                return Promise.resolve({
                    message:messageContants.REGISTRATION_LOCKED,
                });
            }else{
                return models.registration.update(options,{where:{id:Id}});
        }
};

// Mở khóa 
exports.unlock= async(Id,options)=>{
            const isclosed = await models.registration.findOne({where:{id:Id,is_closed:true}});
            if (!isclosed){
                return Promise.resolve({
                    message:messageContants.REGISTRATION_UNLOCKED,
                });
            }else{
                return models.registration.update(options,{where:{id:Id}});
    }
};
