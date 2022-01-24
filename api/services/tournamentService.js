const models                       = require('../../models');
const FeeDetailService                        = require('../services/feeDetailService');
const messageContants              = require('../constants/messageContants');



exports.getTourName= async ()=>{
    return models.tournaments.findAll({
        where:{deleted: false},
        attributes:['id','name']
    })
};
exports.getActiveTour= async (id)=>{
    return models.tournaments.findOne({ where:{id: id,is_active:1,deleted: false},  attributes:['id','name']});
};
// Lấy thông tin nội dung các giải đấu đã được tạo 
exports.getAll=async(user)=>{
models.tournaments.hasMany(models.resource,{foreignKey:'tournament_id'});
models.resource.belongsTo(models.tournaments,{foreignKey:'id'});
models.tournaments.hasMany(models.fee_details,{foreignKey:"tournament_id"});
models.fee_details.belongsTo(models.tournaments,{foreignKey:"id"});
const tournament=[];
if(user){
    var data= await models.tournaments.findAll({    
        where:user.role===1?{deleted: false}:{deleted:false,is_active:true},
        order: [
            ['created_date', 'DESC']
        ],
        attributes:['id','name','address','start_date','end_date','currency_name','content','is_active','is_comment','created_date']});
    var data1= await models.tournaments.findAll({
            where:{deleted: false},
            order: [
                ['created_date', 'DESC']
            ],
            attributes:['id','name','address','start_date','end_date','currency_name','content','is_active','is_comment','created_date'],
            include:[{
                model: models.resource,
                where:{deleted:false},
                attributes:['id','url','link','title']
            },
        ]
        });
        for(var i=0; i<data.length;i++){
            const fee_details= await FeeDetailService.getAll(data[i].id);
            if(fee_details.length>0){
                let new_tournament={
                          id: data[i].id,
                          name:data[i].name,
                          address:data[i].address,
                          start_date: data[i].start_date,
                          end_date:data[i].end_date,
                          currency_name:data[i].currency_name,
                          content:data[i].content,
                          is_active:data[i].is_active,
                          is_comment:data[i].is_comment,
                          created_date:data[i].created_date,
                          fee_details: fee_details  
                };
                tournament[i]= new_tournament;
                for(var j=0; j<data1.length;j++){
                    if(tournament[i].id==data1[j].id){
                        tournament[i]= {
                                id: tournament[i].id,
                                name:tournament[i].name,
                                address:tournament[i].address,
                                start_date: tournament[i].start_date,
                                end_date:tournament[i].end_date,
                                currency_name:tournament[i].currency_name,
                                content:tournament[i].content,
                                is_active:tournament[i].is_active,
                                is_comment:tournament[i].is_comment,
                                created_date:tournament[i].created_date,
                                fee_details:tournament[i].fee_details ,
                                resources: data1[j].resources
                             };
                          };
                    };
                }else{
                    tournament[i]= data[i];
                    for(var j=0; j<data1.length;j++){
                        if(tournament[i].id==data1[j].id)
                        tournament[i]= {
                            id: tournament[i].id,
                            name:tournament[i].name,
                            address:tournament[i].address,
                            start_date: tournament[i].start_date,
                            end_date:tournament[i].end_date,
                            currency_name:tournament[i].currency_name,
                            content:tournament[i].content,
                            is_active:tournament[i].is_active,
                            is_comment:tournament[i].is_comment,
                            created_date:tournament[i].created_date,
                            fee_details:null ,
                }
        }
    };
}

        return tournament
}else{
    var data= await models.tournaments.findAll({    
        where:{deleted:false,is_active:true},
        order: [
            ['created_date', 'DESC']
        ],
        attributes:['id','name','address','start_date','end_date','currency_name','content','is_active','is_comment','created_date']});
    var data1= await models.tournaments.findAll({
            where:{deleted: false},
            order: [
                ['created_date', 'DESC']
            ],
            attributes:['id','name','address','start_date','end_date','currency_name','content','is_active','is_comment','created_date'],
            include:[{
                model: models.resource,
                where:{deleted:false},
                attributes:['id','url','link','title']
            }]
        });
        for(var i=0; i<data.length;i++){
            tournament[i]=data[i]
            for(var j=0; j<data1.length;j++){
                if(tournament[i].id==data1[j].id)
                    tournament[i]=data1[j]
            };
        }
        return tournament
    }
};

// Lấy thông tin nội dung các giải đấu đã được tạo 
exports.getFileForMC=async(tournament_id)=>{
    models.tournaments.hasMany(models.resource,{foreignKey:'tournament_id'});
    models.resource.belongsTo(models.tournaments,{foreignKey:'id'});
        var data= await models.tournaments.findOne({
                where:{deleted: false,id:tournament_id},
                order: [
                    ['created_date', 'DESC']
                ],
                attributes:['id','name'],
                include:[{
                    model: models.resource,
                    where:{deleted:false},
                    attributes:['id','url','link','title']
                }]
            });
            return data
    };
    



// Lấy thông tin nội dung các giải đấu đã được tạo 
exports.getAllWithContent=async()=>{
    models.tournaments.hasMany(models.resource,{foreignKey:'tournament_id'});
    models.resource.belongsTo(models.tournaments,{foreignKey:'id'});
    return models.tournaments.findAndCountAll({
            where:{deleted: false},
            order: [ ['created_date', 'DESC']  ],
            attributes:['id','name','address','start_date','end_date','currency_name','content','is_active','is_comment','created_date'],
            include:[{
                model: models.resource,
                where:{deleted:false},
                attributes:['id','url','link']
            }]
        });
    };
// Lấy thông tin nội dung để tạo các giải đấu
exports.getAllPreparedData=async()=>{
    const fees=await models.fees.findAll({where:{deleted: false},attributes:['currency_name']});
    const tournaments=await models.tournaments.findAll({where:{deleted: false},attributes:['name']});
    return Promise.resolve({
            fees: fees,
            tournaments:tournaments
    })
};

// Lấy thông tin nội dung các giải đấu đã được tạo bằng paging
exports.getAllByPaging=async(searchViewModel)=>{
const limit= searchViewModel.limit;
const offset= searchViewModel.offset;
return models.tournaments.findAndCountAll({
    where:{deleted: false},
    order: [
      ['created_date', 'DESC']
  ],
    limit:limit,
    offset:offset
});
};

// Lấy thông tin nội dung giải đấu đã được tạo 
exports.getbyIdWithResource=async(Id)=>{ 
models.tournaments.hasMany(models.resource,{foreignKey:'tournament_id'});
models.resource.belongsTo(models.tournaments,{foreignKey:'id'});
const fee_details= await FeeDetailService.getAll(Id);
const result= await models.tournaments.findOne({where:{
            id:Id,
            deleted: false},
            attributes:['id','name','address','start_date','end_date','currency_name','content','is_active','is_comment','created_date'],
            include:[{
                model: models.resource,
                where:{deleted:false},
                attributes:['id','url','title','link']
            }]
    });
    return {
        id:result.id,
        name: result.name,
        address:result.address,
        start_date: result.start_date,
        end_date:result.end_date,
        currency_name: result.currency_name,
        content:result.content,
        is_active: result.is_active,
        is_comment: result.is_comment,
        created_date: result.created_date,
        resources: result.resources,
        fee_details: (fee_details.length>0)?fee_details : null
    }
};

// Lấy thông tin nội dung giải đấu đã được tạo 
exports.getbyId=async(Id,formality_id)=>{ 
    const fee_details= await FeeDetailService.getAll(Id);
        const result= await models.tournaments.findOne({where:{
                id:Id,
                deleted: false},
                attributes:['id','name','address','start_date','end_date','currency_name','content','is_active','is_comment','created_date','updated_date']
            });
            let data={};
            data= {
                id:result.id,
                name: result.name,
                address:result.address,
                start_date: result.start_date,
                end_date:result.end_date,
                currency_name: result.currency_name,
                content:result.content,
                is_active: result.is_active,
                is_comment: result.is_comment,
                created_date: result.created_date,
                updated_date: result.updated_date,
                fee_details: (fee_details.length>0)?fee_details : null
            }
            if(data.fee_details.length>0){
                if(formality_id){
                   let fetch=  data.fee_details.filter(item=>item.formality.id===formality_id);
                   if(fetch){
                        data= {
                            id:result.id,
                            name: result.name,
                            address:result.address,
                            start_date: result.start_date,
                            end_date:result.end_date,
                            currency_name: result.currency_name,
                            content:result.content,
                            is_active: result.is_active,
                            is_comment: result.is_comment,
                            created_date: result.created_date,
                            updated_date: result.updated_date,
                            fee_details: fetch[0]
                        }
                   }
                }
            }
        return data
        };
// // Tạo thông tin nội dung của giải đấu
exports.create= async(req,t)=>{
    const data= {
        start_date:req.start_date,
        end_date:req.end_date,
        currency_name:req.currency_name,
        content:req.content,
        is_active:req.is_active,
        is_comment:req.is_comment,
        name:req.name,
        address:req.address
      }
    return models.tournaments.create(data,t);
};

// Chỉnh sửa thông tin nội dung của giải đấu
exports.update= async(Id,options)=>{
        const result= await  models.tournaments.update(options,{where:{id:Id}});
        const data= await  models.tournaments.findOne({where:{id:Id}});
        return Promise.resolve({
                    result: result,
                    data: data
    })
};

// Xóa thông tin nội dung của giải đấu
exports.delete= async(Id,options)=>{
    return models.tournaments.update(options,{where:{id:Id}});
};



// Khôi phục 
exports.restore= async(Id,options)=>{
return models.tournaments.update(options,{where:{id:Id,deleted:1}});
};


// Khóa 
exports.lock= async(Id,options)=>{
    const isclosed = await models.tournaments.findOne({where:{id:Id,is_closed:false}});
    if (!isclosed){
        return Promise.resolve({
                message: messageContants.TOURNAMENTS_LOCKED,
            });
        }else{
        return models.tournaments.update(options,{where:{id:Id}});
    }
};

// Mở khóa 
exports.unlock= async(Id,options)=>{
            const isclosed = await models.tournaments.findOne({where:{id:Id,is_closed:true}});
            if (!isclosed){
                return Promise.resolve({
                    message: messageContants.TOURNAMENTS_UNLOCKED,
                });
            }else{
                return models.tournaments.update(options,{where:{id:Id}});
        }
};