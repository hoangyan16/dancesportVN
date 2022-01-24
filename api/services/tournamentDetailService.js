const { response } = require('express');
const models                                  = require('../../models');
const messageContants                         = require('../constants/messageContants');
const ContentCompetitionService               = require('../services/contentCompetitionService');
const RegistrationService                     = require('../services/registrationService');
const TournamentService                     = require('../services/tournamentService');


// Lấy thông tin chi tiết nội dung các giải đấu đã được tạo 
exports.getAll= async(tournament_id)=>{
    console.log(tournament_id);
    let condition={deleted:false};
    if(tournament_id){
        condition= {deleted:false,id:tournament_id}
    }
    models.tournaments.hasMany(models.tournament_details,{where:{deleted:false},foreignKey:'id'});
    models.tournament_details.belongsTo(models.tournaments,{where:{deleted:false},foreignKey:'tournament_id'});
    models.tournament_details.belongsTo(models.content_competitions,{where:{deleted:false},foreignKey:'content_competition_id'});
    models.content_competitions.hasMany(models.tournament_details,{where:{deleted:false},foreignKey:'id'});
    const contents= await ContentCompetitionService.getAllByTournaments();
    const details= await  models.tournament_details.findAll({
        where:{deleted: false},
        order: [
            ['index', 'ASC']
        ],
        attributes:['id','is_register','quantity','index'],
        include:[{
            where:condition,
            model: models.tournaments,
            attributes:['id','name']
        },
        {
            model: models.content_competitions,
            attributes:['id']
        }
    ]
    });
        const data=[];
        details.map(item=>{
        let detail= {};
        let content=  contents.filter(content => content.id=== item.content_competition.id );
            detail= {
                id:item.id,
                index: item.index,
                is_register: item.is_register,
                quantity: item.quantity,
			    tournament: {
				id:     item.tournament.id,
				name:   item.tournament.name
			                },
                content_competition:content[0]
            }
        data.push(detail);
});
    // const index= data.map(item=>{
    //     return {
    //         index: item.index,
    //         content_id: item.content_competition.id
    //     }
    // })
    return data
}

// Lấy thông tin chi tiết nội dung các giải đấu đã được tạo theo tên giải đấu
exports.getAllBelongsTo=async()=>{
    const data= await  models.tournaments.findAndCountAll({
        where:{deleted: false},
        order: [
          ['index', 'ASC']
      ],
        attributes:['id','name'],
        include:[{
            model: models.tournament_details,
        }]
    });
};
// Lấy thông tin để tạo nội dung giải đấu thủ công
exports.get=async()=>{
return models.tournament_details.findAndCountAll();
};


// Lấy thông tin để gắn các mẫu nội dung có sẵn
exports.getAllContentData=async()=>{
    models.tournaments.hasMany(models.tournament_details,{where:{deleted:false},foreignKey:'id'});
    models.tournament_details.belongsTo(models.tournaments,{where:{deleted:false},foreignKey:'tournament_id'});
    models.tournament_details.belongsTo(models.content_competitions,{where:{deleted:false},foreignKey:'content_competition_id'});
    models.content_competitions.hasMany(models.tournament_details,{where:{deleted:false},foreignKey:'id'});
    const contents= await ContentCompetitionService.getAllByTournaments();
    const details= await  models.tournament_details.findAll({
        where:{deleted: false},
        order: [
            ['index', 'ASC']
        ],
        attributes:['id','is_register','index'],
        include:[{
            model: models.tournaments,
            where:{deleted:false},
            attributes:['id','name']
        },
        {
            model: models.content_competitions,
            attributes:['id']
        }
    ]
    });
        const data=[];
        details.map(item=>{
        let detail= {};
        let content=  contents.filter(content => content.id=== item.content_competition.id );
        detail= {
            id:item.id,
            index:item.index,
            is_register: item.is_register,
            quantity: item.quantity,
            tournament: {
            id:     item.tournament.id,
            name:   item.tournament.name
                        },
            content_competition:content[0]
        }
        data.push(detail);
})
    return data;
}



// Lấy thông tin chi tiết nội dung các giải đấu bằng paging
exports.getAllByPaging=async(searchViewModel)=>{
const limit= searchViewModel.limit;
const offset= searchViewModel.offset;
return models.tournament_details.findAndCountAll({
    where:{deleted: false},
    limit:limit,
    offset:offset
    });
};


// Lấy thông tin chi tiết nội dung giải đấu đã được tạo 
exports.getbyId= async (Id)=>{
    models.tournament_details.belongsTo(models.tournaments,{foreignKey:'tournament_id'});
    models.tournaments.hasMany(models.tournament_details,{foreignKey:'id'});
    models.tournament_details.belongsTo(models.content_competitions,{foreignKey:'content_competition_id'});
    models.content_competitions.hasMany(models.tournament_details,{foreignKey:'id'});
    const contents= await ContentCompetitionService.getAllByTournaments();
    const details= await  models.tournament_details.findAll({
                    where:{id:Id },
                    order: [
                        ['index', 'ASC']
                    ],
                    attributes:['id','is_register','quantity','index'],
                    include:[{
                        model: models.tournaments,
                        where:filter1,
                        attributes:['id','name']
                    }
                    ,{
                        model: models.content_competitions,
                        where:filter2,
                        attributes:['id']
                    }
                ]
                });
                const data=[];
                details.map(item=>{
                let detail= {};
                let content=  contents.filter(content => content.id=== item.content_competition.id );
                detail= {
                    id:item.id,
                    index:item.index,
                    is_register: item.is_register,
                    quantity: item.quantity,
                    tournament: {
                    id:     item.tournament.id,
                    name:   item.tournament.name
                                },
                                content_competition:content[0]
                }
                data.push(detail);
        })
            return data;
};

// Lấy thông tin chi tiết nội dung giải đấu đã được tạo 
exports.getByTournamentId= async (condition,user)=>{
    models.tournament_details.belongsTo(models.tournaments,{foreignKey:'tournament_id'});
    models.tournaments.hasMany(models.tournament_details,{foreignKey:'id'});
    models.tournament_details.belongsTo(models.content_competitions,{foreignKey:'content_competition_id'});
    models.content_competitions.hasMany(models.tournament_details,{foreignKey:'id'});
    let filter1,filter2;
    if(condition.Id){
        filter1={id:condition.Id}
    };
    if(condition.is_closed){
        filter2={is_closed:condition.is_closed}
    };
    const contents= await ContentCompetitionService.getAllByTournaments(condition.is_closed);
    if(user){
    const details= await  models.tournament_details.findAll({
                    where:user.role===1?{deleted:false}:{deleted:false, is_register:true},
                    order: [
                        ['index', 'ASC']
                    ],
                    attributes:['id','is_register','quantity','index'],
                    include:[{
                        model: models.tournaments,
                        where:filter1,
                        attributes:['id','name']
                    }
                    ,{
                        model: models.content_competitions,
                        where:filter2,
                        attributes:['id']
                    }
                ]
                });
                const data=[];
                details.map(item=>{
                let detail= {};
                let content=  contents.filter(content => content.id=== item.content_competition.id );
                detail= {
                    id:item.id,
                    index:item.index,
                    is_register: item.is_register,
                    quantity: item.quantity,
                    tournament: {
                    id:     item.tournament.id,
                    name:   item.tournament.name
                                },
                                content_competition:content[0]
                }
                data.push(detail);
            });
            return data;
    }else{
        const details= await  models.tournament_details.findAll({
            where:{deleted:false,is_register:true},
            order: [
                ['index', 'ASC']
            ],
            attributes:['id','is_register','quantity'],
            include:[{
                model: models.tournaments,
                where:filter1,
                attributes:['id','name']
            }
            ,{
                model: models.content_competitions,
                where:filter2,
                attributes:['id']
            }
        ]
        });
        const data=[];
                details.map(item=>{
                let detail= {};
                let content=  contents.filter(content => content.id=== item.content_competition.id );
                detail= {
                    id:item.id,
                    index:item.index,
                    is_register: item.is_register,
                    quantity: item.quantity,
                    tournament: {
                    id:     item.tournament.id,
                    name:   item.tournament.name
                                },
                    content_competition:content[0]
                }
                data.push(detail);
            });
        return data;
    }
};
// Lấy thông tin chi tiết nội dung giải đấu đã được tạo 
exports.getbyContentId=async (condition)=>{
    return  models.tournament_details.findAndCountAll({where:{content_competition_id:condition,deleted: false}});
};



// Lấy thông tin chi tiết nội dung giải đấu đã được tạo 
exports.getbyTourId=async (id)=>{
    return  models.tournament_details.findAll({where:{tournament_id:id,is_active: 1,deleted: false}});
};

// Tạo thông tin chi tiết nội dung các giải đấu bằng cách gắn với tên và nội dung có sẵn
exports.createwithcontent= async(data)=>{
    return models.tournament_details.create(data);
};

// Tạo thông tin chi tiết nội dung các giải đấu 
exports.create= async(data,t)=>{
    var a=[];
    const content_id=JSON.parse("[" + data.content_competition_id + "]");
    for(var i=0; i<content_id.length;i++){
        data.content_competition_id= content_id[i];
        let b= await models.tournament_details.create(data,t);
        a.push(b);
    }
    return a;
};

// Chỉnh sửa thông tin chi tiết nội dung các giải đấu
exports.update= async(Id)=>{
    var arr=[];
    const detail_id=JSON.parse("["+Id+"]");
    for(var i=0; i<detail_id.length;i++){
    let details=await models.tournament_details.findOne({where:{id:detail_id[i]}});
    let content= await models.content_competitions.findOne({where:{id:details.content_competition_id}});
    if(content.formality_id==1){
        let options={quantity: details.quantity + 1};
        let b=await  models.tournament_details.update(options,{where:{id:detail_id[i]}});
        arr.push(b);
    }
    if(content.formality_id==2){
        let options={quantity: details.quantity + 2};
        let b=await  models.tournament_details.update(options,{where:{id:detail_id[i]}});
        arr.push(b);
        }
    if(content.formality_id==3){
        let options={quantity: details.quantity + quantity};
        let b=await  models.tournament_details.update(options,{where:{id:Id[i]}});
        arr.push(b);
        }
    }

    return arr
};

// Chỉnh sửa thông tin chi tiết nội dung các giải đấu
exports.AddQuantityAthletesFromActiveAthletes= async(Id,quantity)=>{
    var arr=[];
    for(var i=0; i<Id.length;i++){
    if(Id[i]===null){
        i++;
        return 
    }else{
        let details=await models.tournament_details.findOne({where:{id:Id[i]}});
        let content= await models.content_competitions.findOne({where:{id:details.content_competition_id}});
        if(content.formality_id===1){
            const options={quantity: details.quantity + 1};
            let b=await  models.tournament_details.update(options,{where:{id:Id[i]}});
            arr.push(b);
        }
         if(content.formality_id===2){
            const options={quantity: details.quantity + 2};
            let b=await  models.tournament_details.update(options,{where:{id:Id[i]}});
            arr.push(b);
        }
        if(content.formality_id===3){
            const options={quantity: details.quantity +quantity};
            let b=await  models.tournament_details.update(options,{where:{id:Id[i]}});
            arr.push(b);
            }
        }
    }

    return arr
};

// Trừ số VĐV đăng kí khi xóa VĐV
exports.SubtractQuantityAthletesFromActiveAthletes= async(Id,quantity)=>{
    var arr=[];
    for(var i=0; i<Id.length;i++){
    if(Id[i]===null){
        i++;
        return
    }else{
        let details=await models.tournament_details.findOne({where:{id:Id[i]}});
        let content= await models.content_competitions.findOne({where:{id:details.content_competition_id}});
        let options= {quantity: 0};
        if(content.formality_id==1){
            if(details.quantity>0){
                options={quantity: details.quantity - 1};
            };
            let b=await  models.tournament_details.update(options,{where:{id:Id[i]}});
            arr.push(b);
        }
        if(content.formality_id==2){
            if(details.quantity>1){
                 options={quantity: details.quantity - 2};
            };
            let b=await  models.tournament_details.update(options,{where:{id:Id[i]}});
            arr.push(b);
        }
        if(content.formality_id===3){
            if(details.quantity>quantity){
                    options={quantity: details.quantity -quantity};
            }else {
                options={quantity: 0};
            };
            let b=await  models.tournament_details.update(options,{where:{id:Id[i]}});
            arr.push(b);
            }
        }
    }
    return arr
};
// Chỉnh sửa thông tin chi tiết nội dung các giải đấu từ tournament-details
exports.updateDetails= async(Id,options)=>{
    return  models.tournament_details.update(options,{where:{id:Id}});
};


// Xóa chi tiết giải đấu
exports.delete= async(Id,options)=>{
    return models.tournament_details.update(options,{where:{id:Id,deleted:0}});
};

// Xóa chi tiết giải đấu từ giải đấu
exports.deleteWhenTourDeleted= async(Id,options)=>{
    return models.tournament_details.update(options,{where:{tournament_id:Id,deleted:0}});
};

// Xóa thông tin detail bằng content_competition
exports.deleteFromAge= async(Id,options)=>{
    const data=[];
    for(var i=0; i<Id.length;i++){
    var b=await models.tournament_details.update(options,{where:{content_competition_id:Id[i],deleted:0}});
    data.push(b);
    }
    return data
};

// Lấy thông tin detail bằng grade id
exports.getByGradeId= async(id)=>{
    return  models.content_competitions.findAll({where:{grade_id:id}});
};


// Lấy thông tin detail bằng content_competition
exports.getByContentId= async(Id)=>{
    const data=[];
    for(var i=0; i<Id.length;i++){
    const b= await models.tournament_details.findAll({where:{content_competition_id:Id[i],deleted:0}});
    b.map(item=>{
        data.push(item.content_competition_id);
        });
    };
    if (data.length>0){
        for (i=0;i<data.length;i++)
        {
            j=i+1;
            while (j<data.length)
            if (data[i]==data[j])
            {
            for (k=j;k<data.length;k++) 
            data[k]=data[k+1];
            data.length=data.length-1;
            }
        else j=j+1;
        }
        data.length--;
        return data
    }else{
        return data
    }
};

// Lấy thông tin detail bằng content_competition
exports.restore= async(Id,options)=>{
    return models.tournament_details.update(options,{where:{id:Id,deleted:1}});
};


// Khóa thông tin nội dung của cuộc thi
exports.lock= async(Id,options)=>{
const isclosed = await models.tournament_details.findOne({where:{id:Id,is_closed:false}});
    if (!isclosed){
    return Promise.resolve({
    message: messageContants.TOURNAMENT_DETAILS_LOCKED,
        });
    }else{
    return models.tournament_details.update(options,{where:{id:Id}});
    }
};

// Mở khóa 
exports.unlock= async(Id,options)=>{
            const isclosed = await models.tournament_details.findOne({where:{id:Id,is_closed:true}});
            if (!isclosed){
                return Promise.resolve({
                    message: messageContants.TOURNAMENT_DETAILS_UNLOCKED,
                });
            }else{
                return models.tournament_details.update(options,{where:{id:Id}});
    }
};

exports.sort=async(req)=>{
    models.tournaments.hasMany(models.tournament_details,{where:{deleted:false},foreignKey:'id'});
    models.tournament_details.belongsTo(models.tournaments,{where:{deleted:false},foreignKey:'tournament_id'});
    models.tournament_details.belongsTo(models.content_competitions,{where:{deleted:false},foreignKey:'content_competition_id'});
    models.content_competitions.hasMany(models.tournament_details,{where:{deleted:false},foreignKey:'id'});
    var sortColumn = req;
    let orderby = [['index']];
    if (sortColumn && sortColumn.columnName != null) {
        if (sortColumn.columnName && sortColumn.isDesc) {
            orderby = [[(sortColumn.columnName) ,'DESC']];
        } else {
            orderby = [[(sortColumn.columnName) ,'ASC']];
      }
    }
      const contents= await ContentCompetitionService.getAllByTournaments();
      const details= await  models.tournament_details.findAll({
          where:{deleted: false},
          order: orderby,
          attributes:['id','is_register','quantity','index'],
          include:[{
              model: models.tournaments,
              where:{deleted:false,id:req.tournament_id},
              attributes:['id','name']
          },
          {
              model: models.content_competitions,
              attributes:['id']
          }
      ]
      });
          const data=[];
          details.map(item=>{
          let detail= {};
          let content=  contents.filter(content => content.id=== item.content_competition.id );
              detail= {
                  id:item.id,
                  index:item.index,
                  is_register: item.is_register,
                  quantity: item.quantity,
                  tournament: {
                  id:     item.tournament.id,
                  name:   item.tournament.name
                              },
                  content_competition:content[0]
              }
          data.push(detail);
    })
      return data;
};

// Save order
exports.SaveOrder = async (order) => {
    for(var i=0; i<order.length;i++){
      const options={
        index: i
      };
    const result= await  models.tournament_details.update(options, { where: { id: order[i] }});
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
exports.SaveOrderFromCompetition = async (order) => {
    for(var i=0; i<order.length;i++){
      const options={
        index: order[i].index
    };
    let result= await  models.tournament_details.update(options, { where: { deleted:false,content_competition_id: order[i].id }});
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
exports.CalculateFeeAmount = async (detail_ids,number) => {
    const details=[];
    for(var i=0; i<detail_ids.length; i++){
        let detail=await models.tournament_details.findOne({where:{id:detail_ids[i]}});
        let detail_id= {
            content_competition_id:detail.content_competition_id,
            tournament_id: detail.tournament_id
        };
        details.push(detail_id);
    };
    const contents=[];
    for(var i=0;i<details.length;i++){
        let contentDetail=  await models.content_competitions.findOne({where:{id:details[i].content_competition_id}});
        contents.push(contentDetail.formality_id);
    };
    let tournament=await TournamentService.getbyId(details[0].tournament_id,contents[0]);
    tournament= tournament.fee_details
    var fee_amount=0;
    if(contents[0]===1||contents[0]===2){
        if(contents.length>tournament.main.end_content){
            for(var i=0; i<contents.length;i++){
                if(i<tournament.main.end_content){
                    fee_amount += Number(tournament.main.fee.amount);
                }else{
                    fee_amount += Number(tournament.sub.fee.amount)
                }
            };
        }else{
            for(var i=0; i<contents.length;i++){
                fee_amount += Number(tournament.main.fee.amount);
            }
        }
    }else{
        if(number){
            if(contents.length>tournament.main.end_content){
                for(var i=0; i<contents.length;i++){
                    if(i<tournament.main.end_content){
                        fee_amount += Number(tournament.main.fee.amount*Number(number));
                    }else{
                        fee_amount += Number(tournament.sub.fee.amount*Number(number));
                    }
                };
            }else{
                for(var i=0; i<contents.length;i++){
                    fee_amount += Number(tournament.main.fee.amount*Number(number));
                }
            }
        }
    }
    return fee_amount
  };


exports.getByContentId= async(Id)=>{
    const data=[];
    for(var i=0; i<Id.length;i++){
    const b= await models.tournament_details.findAll({where:{content_competition_id:Id[i],deleted:0}});
    b.map(item=>{
        data.push(item.content_competition_id);
        });
    };
    if (data.length>0){
        for (i=0;i<data.length;i++)
        {
            j=i+1;
            while (j<data.length)
            if (data[i]==data[j])
            {
            for (k=j;k<data.length;k++) 
            data[k]=data[k+1];
            data.length=data.length-1;
            }
        else j=j+1;
        }
        data.length--;
        return data
    }else{
        return data
    }
};


exports.getAllContentOfTournament= async(Id)=>{
    const data=[];
    const b= await models.tournament_details.findAll({where:{tournament_id:Id,deleted:0}});
    b.map(item=>{
        data.push(item.content_competition_id);
        });
    if (data.length>0){
        for (i=0;i<data.length;i++)
        {
            j=i+1;
            while (j<data.length)
            if (data[i]==data[j])
            {
            for (k=j;k<data.length;k++) 
            data[k]=data[k+1];
            data.length=data.length-1;
            }
        else j=j+1;
        }
        // data.length--;
    };
    const result=[];
    for(var i=0; i<data.length;i++){
        const symbol= await models.content_competitions.findOne({where:{id:data[i]}});
        result.push(symbol.symbol)
    }
    return result
};