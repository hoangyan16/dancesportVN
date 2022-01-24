"use strict";
const models                             = require('../../models');
const messageContants                    = require('../constants/messageContants');
const TournamentDetailsService           = require('../services/tournamentDetailService');
const TournamentService                  = require('../services/tournamentService');
const fs                                 = require("fs");
const Excel                              = require('exceljs');
const UnitService                        = require("../services/unitService");


// Lấy thông tin VĐV đã được tạo 
exports.getAll=async(user,searchViewModel)=>{
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
    models.tournament_details.belongsToMany(models.athlete, {through:{where:{deleted:false,},model:models.registration},foreignKey:'tournament_detail_id',});
    models.athlete.belongsToMany(models.tournament_details,{through:{where:{deleted:false},model:models.registration},foreignKey:'athlete_id'});
    models.athlete.belongsToMany(models.tournaments,{through:{where:{deleted:false},model:models.registration},foreignKey:'athlete_id'});
    models.tournaments.belongsToMany(models.athlete, {through:{where:{deleted:false},model:models.registration},foreignKey:'tournament_id',});
    const contents= await TournamentDetailsService.getAllContentData();
    const units= await UnitService.getAll();
    const athletewithdetailsnull= await  models.athlete.findAll({
        where: user.role===1?({deleted: 0,status:1}):({deleted: 0,status:1,created_by: user.user_name}),
        order: orderby,
        attributes:['id','full_name_one','date_of_birth_one','full_name_two','date_of_birth_two','email','mobile','fee_amount','is_flashmob','is_pay','number','number_of_couple','unit_id','is_group','created_date','status'],
        include:[
        {
            where:{deleted: 0},
            model: models.tournaments,
            attributes:['id','name'],
        }]
    });
    const athlete= await  models.athlete.findAll({
        where: user.role===1?{deleted: 0,status:1}:{deleted: 0,status:1,created_by: user.user_name},
        order: orderby,
        attributes:['id','full_name_one','date_of_birth_one','full_name_two','date_of_birth_two','email','mobile','is_flashmob','fee_amount','is_pay','number','number_of_couple','unit_id','is_group','created_date','status'],
        include:[
        {
            where:{deleted: 0},
            model: models.tournaments,
            attributes:['id','name'],
        },
        {     
            where:{deleted: 0},
            model: models.tournament_details,
            attributes:['id'],
        }]
    });
    const data = athletewithdetailsnull.map(item =>{
        let unit= units.filter(unit=>unit.id===item.unit_id);
        if(unit.length==0||unit[0].id===null){
            unit[0]=null
        };
        let data_with_detail= athlete.filter(ath=>ath.id===item.id);
        if(data_with_detail.length==0){
            data_with_detail=data_with_detail[0]
        }
        if(!data_with_detail){
        return {
                created_date: item.created_date,
                id: item.id,
                full_name_one: item.full_name_one,
                date_of_birth_one: item.date_of_birth_one,
                full_name_two: item.full_name_two,
                date_of_birth_two: item.date_of_birth_two,
                email: item.email,
                mobile:item.mobile,
                is_flashmob: item.is_flashmob,
                is_pay: item.is_pay,
                number: item.number,
                number_of_couple: item.number_of_couple,
                unit:(unit[0]==null) ? null: 
                            {
                                id: unit[0].id,
                                name: unit[0].name
                            },
                is_group: item.is_group,
                status: item.status,
                fee_amount: item.fee_amount,
                tournament: {
                     id: item.tournaments[0].id,
                     name: item.tournaments[0].name
                }
            }
        }else {
            let details= []
            data_with_detail[0].tournament_details.map(detail=>{
            let content= contents.filter(content=>content.id===detail.id);
            details.push(content[0])
        });
        return {
                created_date: item.created_date,
                id: item.id,
                full_name_one: item.full_name_one,
                date_of_birth_one: item.date_of_birth_one,
                full_name_two: item.full_name_two,
                date_of_birth_two: item.date_of_birth_two,
                email: item.email,
                mobile:item.mobile,
                is_flashmob: item.is_flashmob,
                is_pay: item.is_pay,
                number: item.number,
                number_of_couple: item.number_of_couple,
                unit:(unit[0]==null) ? null: 
                    {
                        id: unit[0].id,
                        name: unit[0].name
                    },
                is_group: item.is_group,
                status: item.status,
                fee_amount: item.fee_amount,
                tournament: {
                     id: item.tournaments[0].id,
                     name: item.tournaments[0].name
                            },
                tournament_details:details
                }
            }
    });
            return data
};

// Lấy thông tin VĐV đã được tạo 
exports.getAllNotActive=async(user,searchViewModel)=>{
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
    models.tournament_details.belongsToMany(models.athlete, {through:{where:{deleted:false,},model:models.registration},foreignKey:'tournament_detail_id',});
    models.athlete.belongsToMany(models.tournament_details,{through:{where:{deleted:false},model:models.registration},foreignKey:'athlete_id'});
    models.athlete.belongsToMany(models.tournaments,{through:{where:{deleted:false},model:models.registration},foreignKey:'athlete_id'});
    models.tournaments.belongsToMany(models.athlete, {through:{where:{deleted:false},model:models.registration},foreignKey:'tournament_id',});

    const contents= await TournamentDetailsService.getAllContentData();
    const units= await UnitService.getAll();
    const athletewithdetailsnull= await  models.athlete.findAll({
        where: user.role===1?({status:0,deleted: 0}):({status:0,deleted: 0,created_by: user.user_name}),
        order: orderby,
        attributes:['id','full_name_one','date_of_birth_one','full_name_two','date_of_birth_two','fee_amount','email','mobile','is_flashmob','is_pay','number','number_of_couple','unit_id','is_group','created_date','status'],
        include:[
        {
            where:{deleted: 0},
            model: models.tournaments,
            attributes:['id','name'],
        }]
    });
        const athlete= await  models.athlete.findAll({
            where: user.role===1?{status:0,deleted: 0}:{status:0,deleted: 0,created_by: user.user_name},
            order: orderby,
            attributes:['id','full_name_one','date_of_birth_one','full_name_two','date_of_birth_two','email','fee_amount','mobile','is_flashmob','is_pay','number','number_of_couple','unit_id','is_group','created_date','status'],
            include:[
            {
                where:{deleted: 0},
                model: models.tournaments,
                attributes:['id','name'],
            },
            {     
                where:{deleted: 0},
                model: models.tournament_details,
                attributes:['id'],
            },
        ]
        });
        const data = athletewithdetailsnull.map(item =>{
            let unit= units.filter(unit=>unit.id===item.unit_id);
            if(unit.length==0||unit[0].id===null){
                unit[0]=null
            };
            let data_with_detail= athlete.filter(ath=>ath.id===item.id);
            if(data_with_detail.length==0){
                data_with_detail=data_with_detail[0]
            }
            if(!data_with_detail){
            return {
                    created_date: item.created_date,
                    id: item.id,
                    full_name_one: item.full_name_one,
                    date_of_birth_one: item.date_of_birth_one,
                    full_name_two: item.full_name_two,
                    date_of_birth_two: item.date_of_birth_two,
                    email: item.email,
                    mobile:item.mobile,
                    is_flashmob: item.is_flashmob,
                    is_pay: item.is_pay,
                    number: item.number,
                    number_of_couple: item.number_of_couple,
                    unit:(unit[0]==null) ? null: 
                                {
                                    id: unit[0].id,
                                    name: unit[0].name
                                },
                    is_group: item.is_group,
                    status: item.status,
                    fee_amount: item.fee_amount,
                    tournament: {
                         id: item.tournaments[0].id,
                         name: item.tournaments[0].name
                    }
                }
            }else {
                let details= []
                data_with_detail[0].tournament_details.map(detail=>{
                let content= contents.filter(content=>content.id===detail.id);
                details.push(content[0])
            });
            return {
                    created_date: item.created_date,
                    id: item.id,
                    full_name_one: item.full_name_one,
                    date_of_birth_one: item.date_of_birth_one,
                    full_name_two: item.full_name_two,
                    date_of_birth_two: item.date_of_birth_two,
                    email: item.email,
                    mobile:item.mobile,
                    is_flashmob: item.is_flashmob,
                    is_pay: item.is_pay,
                    number: item.number,
                    number_of_couple: item.number_of_couple,
                    unit:(unit[0]==null) ? null: 
                        {
                            id: unit[0].id,
                            name: unit[0].name
                        },
                    is_group: item.is_group,
                    status: item.status,
                    fee_amount: item.fee_amount,
                    tournament: {
                         id: item.tournaments[0].id,
                         name: item.tournaments[0].name
                                },
                    tournament_details:details
                    }
                }
        });
                return data
    };
    

// Lấy thông tin VĐV đã được tạo 
exports.getbyTournamnetId=async(tournament_id,user,searchViewModel)=>{
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
    models.tournament_details.belongsToMany(models.athlete, {through:{where:{deleted:false,},model:models.registration},foreignKey:'tournament_detail_id',});
    models.athlete.belongsToMany(models.tournament_details,{through:{where:{deleted:false},model:models.registration},foreignKey:'athlete_id'});
    models.athlete.belongsToMany(models.tournaments,{through:{where:{deleted:false},model:models.registration},foreignKey:'athlete_id'});
    models.tournaments.belongsToMany(models.athlete, {through:{where:{deleted:false},model:models.registration},foreignKey:'tournament_id',});
    let condition={deleted: 0}; 
    if(tournament_id){
        condition= {deleted: 0, id : tournament_id};
    }
    const athletewithdetailsnull= await  models.athlete.findAll({
        where: user.role===1?{deleted: 0,status:1}:{deleted: 0,status:1,created_by: user.user_name},
        order: orderby,
        attributes:['id','full_name_one','date_of_birth_one','full_name_two','date_of_birth_two','fee_amount','email','mobile','is_flashmob','is_pay','number','number_of_couple','unit_id','is_group','created_date','status'],
        include:[
        {
            where:condition,
            model: models.tournaments,
            attributes:['id','name'],
        }]
    });
        const athlete= await  models.athlete.findAll({
            where: user.role===1?{deleted: 0,status:1}:{deleted: 0,status:1,created_by: user.user_name},
            order: orderby,
            attributes:['id','full_name_one','date_of_birth_one','full_name_two','date_of_birth_two','fee_amount','email','mobile','is_flashmob','is_pay','number','number_of_couple','unit_id','is_group','created_date','status'],
            include:[
            {
                where:condition,
                model: models.tournaments,
                attributes:['id','name'],
            },
            {
                where:{deleted: 0},
                model: models.tournament_details,
                attributes:['id'],
            }]
        });
        const contents= await TournamentDetailsService.getAllContentData();
        const units= await UnitService.getAll();
        const data = athletewithdetailsnull.map(item =>{
            let unit= units.filter(unit=>unit.id===item.unit_id);
            if(unit.length==0||unit[0].id===null){
                unit[0]=null
            };
            let data_with_detail= athlete.filter(ath=>ath.id===item.id);
            if(data_with_detail.length==0){
                data_with_detail=data_with_detail[0]
            }
            if(!data_with_detail){
            return {
                    created_date: item.created_date,
                    id: item.id,
                    full_name_one: item.full_name_one,
                    date_of_birth_one: item.date_of_birth_one,
                    full_name_two: item.full_name_two,
                    date_of_birth_two: item.date_of_birth_two,
                    email: item.email,
                    mobile:item.mobile,
                    is_flashmob: item.is_flashmob,
                    is_pay: item.is_pay,
                    number: item.number,
                    number_of_couple: item.number_of_couple,
                    unit:(unit[0]==null) ? null: 
                                {
                                    id: unit[0].id,
                                    name: unit[0].name
                                },
                    is_group: item.is_group,
                    status: item.status,
                    fee_amount: item.fee_amount,
                    tournament: {
                         id: item.tournaments[0].id,
                         name: item.tournaments[0].name
                    }
                }
            }else {
                let details= []
                data_with_detail[0].tournament_details.map(detail=>{
                let content= contents.filter(content=>content.id===detail.id);
                details.push(content[0])
            });
            return {
                    created_date: item.created_date,
                    id: item.id,
                    full_name_one: item.full_name_one,
                    date_of_birth_one: item.date_of_birth_one,
                    full_name_two: item.full_name_two,
                    date_of_birth_two: item.date_of_birth_two,
                    email: item.email,
                    mobile:item.mobile,
                    is_flashmob: item.is_flashmob,
                    is_pay: item.is_pay,
                    number: item.number,
                    number_of_couple: item.number_of_couple,
                    unit:(unit[0]==null) ? null: 
                        {
                            id: unit[0].id,
                            name: unit[0].name
                        },
                    is_group: item.is_group,
                    status: item.status,
                    fee_amount: item.fee_amount,
                    tournament: {
                         id: item.tournaments[0].id,
                         name: item.tournaments[0].name
                                },
                    tournament_details:details
                    }
                }
        });
                return data
    };
    

// Lấy thông tin VĐV đã được tạo 
exports.getbyTournamnetIdNoActive=async(tournament_id,user,searchViewModel)=>{
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
    models.tournament_details.belongsToMany(models.athlete, {through:{where:{deleted:false,},model:models.registration},foreignKey:'tournament_detail_id',});
    models.athlete.belongsToMany(models.tournament_details,{through:{where:{deleted:false},model:models.registration},foreignKey:'athlete_id'});
    models.athlete.belongsToMany(models.tournaments,{through:{where:{deleted:false},model:models.registration},foreignKey:'athlete_id'});
    models.tournaments.belongsToMany(models.athlete, {through:{where:{deleted:false},model:models.registration},foreignKey:'tournament_id',});
    let condition={deleted: 0}; 
    if(tournament_id){
        condition= {deleted: 0, id : tournament_id};
    }
    const athletewithdetailsnull= await  models.athlete.findAll({
        where: user.role===1?{deleted: 0,status:0}:{deleted: 0,status:0,created_by: user.user_name},
        order: orderby,
        attributes:['id','full_name_one','date_of_birth_one','full_name_two','date_of_birth_two','email','fee_amount','mobile','is_flashmob','is_pay','number','number_of_couple','unit_id','is_group','created_date','status'],
        include:[
        {
            where:condition,
            model: models.tournaments,
            attributes:['id','name'],
        }]
    });
        const athlete= await  models.athlete.findAll({
            where: user.role===1?{deleted: 0,status:0}:{deleted: 0,status:0,created_by: user.user_name},
            order: orderby,
            attributes:['id','full_name_one','date_of_birth_one','full_name_two','date_of_birth_two','email','fee_amount','mobile','is_flashmob','is_pay','number','number_of_couple','unit_id','is_group','created_date','status'],
            include:[
            {
                where:condition,
                model: models.tournaments,
                attributes:['id','name'],
            },
            {
                where:{deleted: 0},
                model: models.tournament_details,
                attributes:['id'],
            }]
        });
        const contents= await TournamentDetailsService.getAllContentData();
        const units= await UnitService.getAll();
        const data = athletewithdetailsnull.map(item =>{
            let unit= units.filter(unit=>unit.id===item.unit_id);
            if(unit.length==0||unit[0].id===null){
                unit[0]=null
            };
            let data_with_detail= athlete.filter(ath=>ath.id===item.id);
            if(data_with_detail.length==0){
                data_with_detail=data_with_detail[0]
            }
            if(!data_with_detail){
            return {
                    created_date: item.created_date,
                    id: item.id,
                    full_name_one: item.full_name_one,
                    date_of_birth_one: item.date_of_birth_one,
                    full_name_two: item.full_name_two,
                    date_of_birth_two: item.date_of_birth_two,
                    email: item.email,
                    mobile:item.mobile,
                    is_flashmob: item.is_flashmob,
                    is_pay: item.is_pay,
                    number: item.number,
                    number_of_couple: item.number_of_couple,
                    unit:(unit[0]==null) ? null: 
                                {
                                    id: unit[0].id,
                                    name: unit[0].name
                                },
                    is_group: item.is_group,
                    status: item.status,
                    fee_amount: item.fee_amount,
                    tournament: {
                         id: item.tournaments[0].id,
                         name: item.tournaments[0].name
                    }
                }
            }else {
                let details= []
                data_with_detail[0].tournament_details.map(detail=>{
                let content= contents.filter(content=>content.id===detail.id);
                details.push(content[0])
            });
            return {
                    created_date: item.created_date,
                    id: item.id,
                    full_name_one: item.full_name_one,
                    date_of_birth_one: item.date_of_birth_one,
                    full_name_two: item.full_name_two,
                    date_of_birth_two: item.date_of_birth_two,
                    email: item.email,
                    mobile:item.mobile,
                    is_flashmob: item.is_flashmob,
                    is_pay: item.is_pay,
                    number: item.number,
                    number_of_couple: item.number_of_couple,
                    unit:(unit[0]==null) ? null: 
                        {
                            id: unit[0].id,
                            name: unit[0].name
                        },
                    is_group: item.is_group,
                    status: item.status,
                    fee_amount: item.fee_amount,
                    tournament: {
                         id: item.tournaments[0].id,
                         name: item.tournaments[0].name
                                },
                    tournament_details:details
                    }
                }
        });
                return data
    };

// Lấy thông tin VĐV đã được tạo bằng paging
exports.getAllByPaging=async(searchViewModel)=>{
const limit= searchViewModel.limit;
const offset= searchViewModel.offset;
const user= searchViewModel.user;
return models.athlete.findAndCountAll({
    where:user.role==1?{deleted: 0}:{deleted: 0,created_by:user.user_name},
    order: [
      ['created_date', 'DESC']
  ],
    limit:limit,
    offset:offset,
});
};

// Lấy thông tin VĐV 
exports.getbyId=async (Id)=>{    
    models.tournament_details.belongsToMany(models.athlete, {through:{where:{deleted:false,},model:models.registration},foreignKey:'tournament_detail_id',});
    models.athlete.belongsToMany(models.tournament_details,{through:{where:{deleted:false},model:models.registration},foreignKey:'athlete_id'});
    models.athlete.belongsToMany(models.tournaments,{through:{where:{deleted:false},model:models.registration},foreignKey:'athlete_id'});
    models.tournaments.belongsToMany(models.athlete, {through:{where:{deleted:false},model:models.registration},foreignKey:'tournament_id'});
    let condition={deleted: 0}; 
    if(Id){
        condition= {deleted: 0, id : Id};
    }
    const athletewithdetailsnull= await  models.athlete.findAll({
        where: condition,
        attributes:['id','full_name_one','date_of_birth_one','full_name_two','date_of_birth_two','email','mobile','fee_amount','is_flashmob','is_pay','number','number_of_couple','unit_id','is_group','created_date','status'],
        include:[
        {
            where:{deleted: 0},
            model: models.tournaments,
            attributes:['id','name'],
        }]
    });
        const athlete= await  models.athlete.findAll({
            where: condition,
            attributes:['id','full_name_one','date_of_birth_one','full_name_two','date_of_birth_two','email','mobile','fee_amount','is_flashmob','is_pay','number','number_of_couple','unit_id','is_group','created_date','status'],
            include:[
            {
                where:{deleted: 0},
                model: models.tournaments,
                attributes:['id','name'],
            },
            {
                where:{deleted: 0},
                model: models.tournament_details,
                attributes:['id'],
            }]
        });

        const contents= await TournamentDetailsService.getAllContentData();
        const units= await UnitService.getAll();
        const data = athletewithdetailsnull.map(item =>{
            let unit= units.filter(unit=>unit.id===item.unit_id);
            if(unit.length==0||unit[0].id===null){
                unit[0]=null
            };
            let data_with_detail= athlete.filter(ath=>ath.id===item.id);
            if(data_with_detail.length==0){
                data_with_detail=data_with_detail[0]
            }
            if(!data_with_detail){
            return {
                    created_date: item.created_date,
                    id: item.id,
                    full_name_one: item.full_name_one,
                    date_of_birth_one: item.date_of_birth_one,
                    full_name_two: item.full_name_two,
                    date_of_birth_two: item.date_of_birth_two,
                    email: item.email,
                    mobile:item.mobile,
                    is_flashmob: item.is_flashmob,
                    is_pay: item.is_pay,
                    number: item.number,
                    number_of_couple: item.number_of_couple,
                    unit:(unit[0]==null) ? null: 
                                {
                                    id: unit[0].id,
                                    name: unit[0].name
                                },
                    is_group: item.is_group,
                    status: item.status,
                    fee_amount: item.fee_amount,
                    tournament: {
                         id: item.tournaments[0].id,
                         name: item.tournaments[0].name
                    }
                }
            }else {
                let details= []
                data_with_detail[0].tournament_details.map(detail=>{
                let content= contents.filter(content=>content.id===detail.id);
                details.push(content[0])
            });
            return {
                    created_date: item.created_date,
                    id: item.id,
                    full_name_one: item.full_name_one,
                    date_of_birth_one: item.date_of_birth_one,
                    full_name_two: item.full_name_two,
                    date_of_birth_two: item.date_of_birth_two,
                    email: item.email,
                    mobile:item.mobile,
                    is_flashmob: item.is_flashmob,
                    is_pay: item.is_pay,
                    number: item.number,
                    number_of_couple: item.number_of_couple,
                    unit:(unit[0]==null) ? null: 
                        {
                            id: unit[0].id,
                            name: unit[0].name
                        },
                    is_group: item.is_group,
                    status: item.status,
                    fee_amount: item.fee_amount,
                    tournament: {
                         id: item.tournaments[0].id,
                         name: item.tournaments[0].name
                                },
                    tournament_details:details
                    }
                }
        });
                return data
    };
    
// Tạo thông tin nội dung của cuộc thi
exports.create= async(unitFromContents)=>{
    const dataAuth={
        full_name_one: unitFromContents.full_name_one,
        date_of_birth_one: unitFromContents.date_of_birth_one,
        full_name_two: (unitFromContents.full_name_two==='undefined'||unitFromContents.full_name_two==='')? null:unitFromContents.full_name_two,
        date_of_birth_two: (unitFromContents.date_of_birth_two==='undefined'||unitFromContents.date_of_birth_two==='')? null:unitFromContents.date_of_birth_two,
        number:unitFromContents.number,
        number_of_couple: unitFromContents.number_of_couple,
        email: unitFromContents.email,
        mobile: unitFromContents.mobile,
        fee_amount: unitFromContents.fee_amount,
        is_pay: unitFromContents.is_pay,
        is_flashmob:unitFromContents.is_flashmob,
        unit_id:unitFromContents.unit_id,
        is_group:unitFromContents. is_group,
        created_by:unitFromContents.created_by
      };
        return models.athlete.create(dataAuth);
};

// Tạo thông tin nội dung của cuộc thi
exports.freeCreate= async(unitFromContents)=>{
    const dataAuth={
        full_name_one: unitFromContents.full_name_one,
        date_of_birth_one: unitFromContents.date_of_birth_one,
        full_name_two: (unitFromContents.full_name_two==='undefined'||unitFromContents.full_name_two==='')? null:unitFromContents.full_name_two,
        date_of_birth_two: (unitFromContents.date_of_birth_two==='undefined'||unitFromContents.date_of_birth_two==='')? null:unitFromContents.date_of_birth_two,
        number:unitFromContents.number,
        number_of_couple: unitFromContents.number_of_couple,
        email: unitFromContents.email,
        mobile: unitFromContents.mobile,
        fee_amount: unitFromContents.fee_amount,
        is_pay: unitFromContents.is_pay,
        is_flashmob:unitFromContents.is_flashmob,
        unit_id:unitFromContents.unit_id,
        is_group:unitFromContents. is_group,
        created_by:unitFromContents.created_by,
        status: 0
      };
        return models.athlete.create(dataAuth);
};

// Xóa thông tin nội dung của cuộc thi
exports.activeAthletes= async(Id,options)=>{
    await models.athlete.update(options,{where:{id:Id,deleted:0}});
    const athlete= await models.athlete.findOne({where:{id:Id}});
    return athlete

};

exports.activeAllAthletes= async(Id,options)=>{
    const data=[];
    for(var i= 0; i<Id.length;i++){
     await models.athlete.update(options,{where:{id:Id[i],deleted:0}});
    };
    for(var j= 0;j<Id.length;j++){
            const athlete= await models.athlete.findOne({where:{id:Id[j]}});
            data.push(athlete);
        }
    return data
};

// Xóa thông tin nội dung của cuộc thi
exports.getIdAllAthletesNoActive= async()=>{
        const res=await models.athlete.findAll({where:{deleted:0,status:0}});
        const data= res.map(item=>{
            return item.id
        });
        return data
};


// // Xóa thông tin nội dung của cuộc thi
// exports.activeAthletes= async(Id,options)=>{
//     const success= await models.athlete.update(options,{where:{id:Id,deleted:0}});
//     if(success==true){
//         const athlete= await models.athlete.findOne({where:{id:Id}});
//         const registration=  await models.registration.findAll({where:{athlete_id:Id}});
//         const tournament_detail_id= registration.map(item=>{
//             return item.tournament_detail_id
//         });
//         const details=[];
//         for(var i=0;i<tournament_detail_id.length;i++){
//             let detail=await models.tournament_details.findOne({where:{id:tournament_detail_id[i]}});
//             let detail_id= {
//                 content_competition_id:detail.content_competition_id,
//                 tournament_id: detail.tournament_id
//             };
//             details.push(detail_id);
//         };
//         const tournaments= [];
//         for(var i=0;i<details.length;i++){
//             let tournament=await models.tournaments.findOne({where:{id:details[i].tournament_id}});
//             let tournament_detail= {
//                 name:tournament.name,
//                 address:tournament.address,
//                 start_date: tournament.start_date,
//                 end_date: tournament.end_date
//         };
//             tournaments.push(tournament_detail);
//         };
//         const contents=[];
//         for(var i=0;i<details.length;i++){
//             let contentDetail=await models.content_competitions.findOne({where:{id:details[i].content_competition_id}});
//             contents.push(contentDetail.symbol);
//         };
//         return {athlete,tournaments,contents}
//     }

// };

// Lấy thông tin vận động viên theo giải đấu,nội dung tham dự , phí
exports.getAthletesWithContentInTournament= async(tournament_id)=>{
    models.tournament_details.belongsToMany(models.athlete, {through:{where:{deleted:false,},model:models.registration},foreignKey:'tournament_detail_id',});
    models.athlete.belongsToMany(models.tournament_details,{through:{where:{deleted:false},model:models.registration},foreignKey:'athlete_id'});
    models.athlete.belongsToMany(models.tournaments,{through:{where:{deleted:false},model:models.registration},foreignKey:'athlete_id'});
    models.tournaments.belongsToMany(models.athlete, {through:{where:{deleted:false},model:models.registration},foreignKey:'tournament_id',});
    let condition={deleted: 0}; 
    if(tournament_id){
        condition= {deleted: 0, id : tournament_id};
    }
    const athletewithdetailsnull= await  models.athlete.findAll({
        where: {deleted: 0,status:1},
        attributes:['id','full_name_one','date_of_birth_one','full_name_two','date_of_birth_two','email','fee_amount','mobile','is_flashmob','is_pay','number','number_of_couple','unit_id','is_group','created_date','status'],
        include:[
        {
            where:condition,
            model: models.tournaments,
            attributes:['id','name'],
        }]
    });
        const athlete= await  models.athlete.findAll({
            where:{deleted: 0,status:1},
            attributes:['id','full_name_one','date_of_birth_one','full_name_two','date_of_birth_two','email','fee_amount','mobile','is_flashmob','is_pay','number','number_of_couple','unit_id','is_group','created_date','status'],
            include:[
            {
                where:condition,
                model: models.tournaments,
                attributes:['id','name'],
            },
            {
                where:{deleted: 0},
                model: models.tournament_details,
                attributes:['id'],
            }]
        });
        const contents= await TournamentDetailsService.getAllContentData();
        const units= await UnitService.getAll();
        const data = athletewithdetailsnull.map(item =>{
            let unit= units.filter(unit=>unit.id===item.unit_id);
            if(unit.length==0||unit[0].id===null){
                unit[0]=null
            };
            let data_with_detail= athlete.filter(ath=>ath.id===item.id);
            if(data_with_detail.length==0){
                data_with_detail=data_with_detail[0]
            }
            if(!data_with_detail){
            return {
                    created_date: item.created_date,
                    id: item.id,
                    full_name_one: item.full_name_one,
                    date_of_birth_one: item.date_of_birth_one,
                    full_name_two: item.full_name_two,
                    date_of_birth_two: item.date_of_birth_two,
                    email: item.email,
                    mobile:item.mobile,
                    is_flashmob: item.is_flashmob,
                    is_pay: item.is_pay,
                    number: item.number,
                    number_of_couple: item.number_of_couple,
                    unit:(unit[0]==null) ? null: 
                                {
                                    id: unit[0].id,
                                    name: unit[0].name
                                },
                    is_group: item.is_group,
                    status: item.status,
                    fee_amount: item.fee_amount,
                    tournament: {
                         id: item.tournaments[0].id,
                         name: item.tournaments[0].name
                    }
                }
            }else {
                let details= []
                data_with_detail[0].tournament_details.map(detail=>{
                let content= contents.filter(content=>content.id===detail.id);
                details.push(content[0])
            });
            return {
                    created_date: item.created_date,
                    id: item.id,
                    full_name_one: item.full_name_one,
                    date_of_birth_one: item.date_of_birth_one,
                    full_name_two: item.full_name_two,
                    date_of_birth_two: item.date_of_birth_two,
                    email: item.email,
                    mobile:item.mobile,
                    is_flashmob: item.is_flashmob,
                    is_pay: item.is_pay,
                    number: item.number,
                    number_of_couple: item.number_of_couple,
                    unit:(unit[0]==null) ? null: 
                        {
                            id: unit[0].id,
                            name: unit[0].name
                        },
                    is_group: item.is_group,
                    status: item.status,
                    fee_amount: item.fee_amount,
                    tournament: {
                         id: item.tournaments[0].id,
                         name: item.tournaments[0].name
                                },
                    tournament_details:details
                    }
                }
        });
        const results=data.map(item=>{
                return {
                    id: item.id,
                    full_name_one: item.full_name_one,
                    date_of_birth_one:  item.date_of_birth_one,
                    full_name_two:(item.full_name_two==='undefined'||item.full_name_two==='')? null:item.full_name_two,
                    date_of_birth_two: (item.date_of_birth_two==='undefined')? null:item.date_of_birth_two,
                    email: item.email,
                    is_pay: item.is_pay,
                    number: item.number,
                    fee_amount:item.fee_amount,
                    unit: item.unit,
                    symbol: item.tournament_details.map(detail=>detail.content_competition.symbol)
                }
        });
    return  results
};
//Decide Athletes Numbers
exports.decideAthletesNumbers = async (id, options) => {
    const result=[];
    for(var i= 0; i<id.length;i++){
        let option= {
            number: options
        };
        let athlete= await models.athlete.update(option, { where: { id:id[i]} });
        option.number= options ++;
        result.push(athlete);
    }
    return result
}

// Chỉnh sửa thông tin nội dung của cuộc thi
exports.update= async(Id,options)=>{
    return models.athlete.update(options,{where:{id:Id}});
};


// Xóa thông tin nội dung của cuộc thi
exports.delete= async(Id,options)=>{
    await models.athlete.update(options,{where:{id:Id,deleted:0}});
    let data= await models.athlete.findOne({where:{id:Id}});
    return data
};

// Xóa và lấy thông tin vđv 
exports.deleteAll= async(Id,options)=>{
    const data=[];
    for(var i=0;i<Id.length;i++){
        await models.athlete.update(options,{where:{id:Id[i],deleted:0}});
        let result= await models.athlete.findOne({where:{id:Id[i]}});
        data.push(result);
    }
    return data
};


// Xóa và lấy thông tin vđv 
exports.deleteAllNotActive= async(Id,options)=>{
    for(var i=0;i<Id.length;i++){
        await models.athlete.update(options,{where:{id:Id[i],deleted:0}});
    }
    return true
};
// Xóa thông tin nội dung của cuộc thi
exports.deleteAthlete= async(Id,options)=>{
    return  models.athlete.update(options,{where:{id:Id,deleted:0}});
};

// Xóa thông tin nội dung của cuộc thi
exports.restore= async(Id,options)=>{
return models.athlete.update(options,{where:{Id:Id,deleted:1}});
};


// Create excel file tó send to athlete
exports.createExcelFileForAthletesActived= async(unitFromContents,tournament,filename)=>{
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Sheet1');
worksheet.columns = [
        {header: 'STT', key: 'index'},
        {header: 'Họ tên nam', key: 'first_name'},
        {header: 'Năm sinh', key: 'date_of_birth1'},
        {header: 'Họ tên nữ', key: 'second_name'},
        {header: 'Năm sinh', key: 'date_of_birth2'},
        {header: 'Nội dung thi đấu', key: 'content'},
        {header: 'Lệ phí', key: 'fee'},
    ];
        let content= unitFromContents.symbol.toString();
        let  athlete=[{   
                index: 1,
                first_name: unitFromContents.full_name_one,
                date_of_birth1: unitFromContents.date_of_birth_one,
                second_name:unitFromContents.full_name_two,
                date_of_birth2: unitFromContents.date_of_birth_two,
                content:content,
                fee:parseInt(unitFromContents.fee_amount)
            },
            {   
                content:"Tổng cộng",
                fee:unitFromContents.fee_amount
            },
        ];
        athlete.forEach((e) => {
            worksheet.addRow(e);
        });
        worksheet.insertRow(1,{index:tournament.address});
        worksheet.insertRow(1,{index:`Từ ${tournament.start_date} đến ${tournament.end_date}`});
        worksheet.insertRow(1,{index:tournament.name});
        worksheet.insertRow(4);
        const buffer = await workbook.xlsx.writeFile(`${__basedir}/resources/files/jsontoexcel/${filename}`);
        return buffer;
};
// Khóa 
exports.lock= async(Id,options)=>{
const isclosed = await models.athlete.findOne({where:{Id:Id,is_closed:false}});
    if (!isclosed){
    return Promise.resolve({
    message:messageContants.ATHLETE_LOCKED,
        });
    }else{
    return models.athlete.update(options,{where:{Id:Id}});
    }
};

// Mở khóa 
exports.CheckIsPay= async(Id,option1,option2)=>{
    const athlete= await models.athlete.findOne({where:{id:Id}});
    if(athlete.is_pay===false){
         await models.athlete.update(option1,{where:{id:Id}});
            return true;
    }
    if(athlete.is_pay===true){
         await models.athlete.update(option2,{where:{id:Id}});
         return false;
    }
};

// Save order
exports.SaveOrderFromUnit = async (order) => {
    for(var i=0; i<order.length;i++){
      const options={
        index: order[i].index
      };
    const result= await  models.athlete.update(options, { where: {unit_id: order[i].id }});
    if(!result){
      return Promise.resolve({
        status: 0,
        message: messageContants.ATHLETE_UPDATE_FAIL
      });
    }
  }
  return true
  };

// Save order
exports.SaveOrder = async (order) => {
    for(var i=0; i<order.length;i++){
      const options={
        index: order[i].index
      };
    const result= await  models.athlete.update(options, { where: {id: order[i].id }});
    if(!result){
      return Promise.resolve({
        status: 0,
        message: messageContants.ATHLETE_UPDATE_FAIL
      });
    }
  }
  return true
  };

  // Get Athlete_id by unit_id 
exports.getAthleteIdByUnitId= async(Id)=>{
    const contents= await models.athlete.findAndCountAll({where:{unit_id:Id,deleted: false}});
    const id_content=[];
    for(var i= 0; i<contents.count;i++){
      id_content[i]= contents.rows[i].id;
    };
    return id_content;
};

// Get athlete by unit_id 
exports.updateUnitForAthlete= async(Id)=>{
    const option= {
        unit_id: Id,
        updated_date: new Date()
      };
    await models.athlete.update(option,{where:{unit_id:Id,deleted: false}});
    return true;
};


// Get athlete by unit_id 
exports.getByUnitId=async()=>{
    const contents= await models.athlete.findAndCountAll({where:{deleted: false}});
    const unit_id_in_content=[];
    for(var i= 0; i<contents.count;i++){
      unit_id_in_content[i]= contents.rows[i].unit_id;
  };
  return unit_id_in_content
  };

// Get athlete by unit_id 
exports.getAthleteForEdit=async(Id)=>{
    const athlete = await models.athlete.findOne({where:{id:Id,deleted: false}});
    if(athlete){
        return athlete.date_of_birth_one;
    }else{
        return 0;
    }
};

// Create excel file
exports.createExcelFileForAthletes= async(unitFromContents,tournament,filename,symbol)=>{
    let workbook        = new Excel.Workbook();
    let worksheet2      = workbook.addWorksheet('T1');
    let worksheet       = workbook.addWorksheet('T2');

    // T1
    const res=[];
    const index=[];
    for(var i=0;i<symbol.length;i++ ){
        let columns={header:`ND${i+1}`,key:`${symbol[i]}`,width:5};
        res.push(columns);
        index.push(columns);
    };
    res.unshift(   
    {header: 'TT', key: 'index',width:4},
    {header: 'SĐ', key: 'number',width:4},
    {header: 'NAM', key: 'first_name',width:15},
    {header: 'NS', key: 'date_of_birth1',width:5},
    {header: 'NỮ', key: 'second_name',width:25},
    {header: 'NS', key: 'date_of_birth2',width:5},
    {header: 'ĐƠN VỊ', key: 'unit',width:15},
    {header: 'MÃ ĐV', key: 'unit_id',width:7},
    )
    res.push(   
        {header: 'Email', key: 'email',width:25},
        {header: 'ĐT', key: 'phone',width:20},
        {header: 'KINH PHÍ', key: 'fee',width:15},
        {header: 'ND', key: 'content',width:5},
        {header: 'N', key: 'n',width:5},
        {header: 'ND ĐÔI', key: 'couple',width:10},
        {header: 'ND ĐƠN', key: 'single',width:10},
        {header: 'ND ĐD ĐÔI', key: 'formality_couple',width:10},
        {header: 'ND ĐD ĐƠN', key: 'single_couple',width:10},
        );
worksheet2.columns = res
    const athletes=[];
    for(var i=0;i<unitFromContents.length;i++){
        var symbols={};
        for(var j=0; j<unitFromContents[i].symbol.length;j++){
            symbols[index[j].key.toString()]= unitFromContents[i].symbol[j] ;
        }
        let athlete={   
            index: i+1,
            number: unitFromContents[i].number,
            first_name: unitFromContents[i].full_name_one,
            date_of_birth1: unitFromContents[i].date_of_birth_one,
            second_name:unitFromContents[i].full_name_two,
            date_of_birth2:unitFromContents[i].date_of_birth_two,
            unit: unitFromContents[i].unit.name,
            unit_id: unitFromContents[i].unit.id,
            email: unitFromContents[i].email,
            phone: unitFromContents[i].mobile,
            fee: unitFromContents[i].fee_amount
    };
        const targetObject= Object.assign(athlete,symbols);
        athletes.push(targetObject);
    };
    athletes.forEach((e) => {
        worksheet2.addRow(e);
    });
        
    worksheet2.insertRow(1,{first_name:`CẬP NHẬT ĐĂNG KÍ ${tournament.name.toUpperCase()}`});
        // worksheet.getCell('A1').font = {
            //     size: 14,
            //     bold: true
            // };
            // worksheet.getCell('G4').fill = {
                //     type: 'pattern', 
                //     pattern:'solid',
                //     fgColor:{argb: '8BE297'}
                //   };
                // worksheet2.insertRow(1);
    worksheet2.getCell('R1').value= `Cập nhật ngày: ${tournament.updated_date}`;
    worksheet2.insertRow(2);

    // T2
    const res2=[];
    for(var i=0;i<symbol.length;i++ ){
        let column={header:`${symbol[i]}`,key:`${symbol[i]}`,width:5};
        res2.push(column);
    };
    res2.unshift(   
    {header: '', key: 'index',width:5},
    {header: '', key: 'first_name',width:15},
    {header: '', key: 'date_of_birth1',width:5},
    {header: '', key: 'second_name',width:25},
    {header: '', key: 'date_of_birth2',width:5},
    {header: '', key: 'unit',width:15},     
    )
worksheet.columns = res2
    const athletes2=[];
    let athlete={   
        index:'',
        first_name: '',
        date_of_birth1: '',
        second_name:'',
        date_of_birth2:'',
        unit: ''
    };
    athletes2.push(athlete);
    athlete={   
        index:'',
        first_name: '',
        date_of_birth1: '',
        second_name:'',
        date_of_birth2:'',
        unit: ''
    };
    athletes2.push(athlete);
     athlete={   
        index:'',
        first_name: '',
        date_of_birth1: '',
        second_name:'',
        date_of_birth2:'',
        unit: ''
    };
    athletes2.push(athlete);
     athlete={   
        index:'TT',
        first_name: 'NAM',
        date_of_birth1: 'NS',
        second_name:'NỮ',
        date_of_birth2:'NS',
        unit: 'ĐƠN VỊ'
    };
    athletes2.push(athlete);
    for(var i=0;i<unitFromContents.length;i++){
        var symbols2={};
        for(var j=0; j<unitFromContents[i].symbol.length;j++){
            symbols2[unitFromContents[i].symbol[j].toString()]= 1 ;
        }
             athlete={   
                index: i+1,
                first_name: unitFromContents[i].full_name_one,
                date_of_birth1: unitFromContents[i].date_of_birth_one,
                second_name:unitFromContents[i].full_name_two,
                date_of_birth2:unitFromContents[i].date_of_birth_two,
                unit: unitFromContents[i].unit.name
        };
            const targetObject= Object.assign(athlete,symbols2);
            athletes2.push(targetObject);
        };
        athletes2.forEach((e) => {
            worksheet.addRow(e);
        });
        
        worksheet.insertRow(1,{first_name:`Cập nhật ngày: ${tournament.updated_date}`});
        worksheet.insertRow(1,{first_name:`CẬP NHẬT ĐĂNG KÍ ${tournament.name.toUpperCase()}`});
        // worksheet.getCell('A1').font = {
            //     size: 14,
            //     bold: true
            // };
            // worksheet.getCell('G4').fill = {
                //     type: 'pattern',
                //     pattern:'solid',
                //     fgColor:{argb: '8BE297'}
                //   };
        worksheet.insertRow(3);
        worksheet.insertRow(1);



        // worksheet.insertRow(4);
        const buffer = await workbook.xlsx.writeFile(`${__basedir}/resources/files/jsontoexcel/${filename}`);
        const option= {link:`/resources/files/jsontoexcel/${filename}`};
        await models.tournaments.update(option,{where:{id:tournament.id}});
        return option;
};

// Lấy thông tin vận động viên theo giải đấu,nội dung tham dự , phí để tổng hợp
exports.getAthletesForExcel= async(tournament_id)=>{
    models.tournament_details.belongsToMany(models.athlete, {through:{where:{deleted:false,},model:models.registration},foreignKey:'tournament_detail_id',});
    models.athlete.belongsToMany(models.tournament_details,{through:{where:{deleted:false},model:models.registration},foreignKey:'athlete_id'});
    models.athlete.belongsToMany(models.tournaments,{through:{where:{deleted:false},model:models.registration},foreignKey:'athlete_id'});
    models.tournaments.belongsToMany(models.athlete, {through:{where:{deleted:false},model:models.registration},foreignKey:'tournament_id',});
    let condition={deleted: 0}; 
    if(tournament_id){
        condition= {deleted: 0, id : tournament_id};
    }
    const athletewithdetailsnull= await  models.athlete.findAll({
        where: {deleted: 0,status:1},
        attributes:['id','full_name_one','date_of_birth_one','full_name_two','date_of_birth_two','email','fee_amount','mobile','is_flashmob','is_pay','number','number_of_couple','unit_id','is_group','created_date','status'],
        include:[
        {
            where:condition,
            model: models.tournaments,
            attributes:['id','name'],
        }]
    });
        const athlete= await  models.athlete.findAll({
            where:{deleted: 0,status:1},
            attributes:['id','full_name_one','date_of_birth_one','full_name_two','date_of_birth_two','email','fee_amount','mobile','is_flashmob','is_pay','number','number_of_couple','unit_id','is_group','created_date','status'],
            include:[
            {
                where:condition,
                model: models.tournaments,
                attributes:['id','name'],
            },
            {
                where:{deleted: 0},
                model: models.tournament_details,
                attributes:['id'],
            }]
        });
        const contents= await TournamentDetailsService.getAllContentData();
        const units= await UnitService.getAll();
        const data = athletewithdetailsnull.map(item =>{
            let unit= units.filter(unit=>unit.id===item.unit_id);
            if(unit.length==0||unit[0].id===null){
                unit[0]=null
            };
            let data_with_detail= athlete.filter(ath=>ath.id===item.id);
            if(data_with_detail.length==0){
                data_with_detail=data_with_detail[0]
            }
            if(!data_with_detail){
            return {
                    created_date: item.created_date,
                    id: item.id,
                    full_name_one: item.full_name_one,
                    date_of_birth_one: item.date_of_birth_one,
                    full_name_two: item.full_name_two,
                    date_of_birth_two: item.date_of_birth_two?item.date_of_birth_two:'X',
                    email: item.email,
                    mobile:item.mobile,
                    is_flashmob: item.is_flashmob,
                    is_pay: item.is_pay,
                    number: item.number,
                    number_of_couple: item.number_of_couple,
                    unit:(unit[0]==null) ? null: 
                                {
                                    id: unit[0].id,
                                    name: unit[0].name
                                },
                    is_group: item.is_group,
                    status: item.status,
                    fee_amount: item.fee_amount,
                    tournament: {
                         id: item.tournaments[0].id,
                         name: item.tournaments[0].name
                    }
                }
            }else {
                let details= []
                data_with_detail[0].tournament_details.map(detail=>{
                let content= contents.filter(content=>content.id===detail.id);
                details.push(content[0])
            });
            return {
                    created_date: item.created_date,
                    id: item.id,
                    full_name_one: item.full_name_one,
                    date_of_birth_one: item.date_of_birth_one,
                    full_name_two: item.full_name_two,
                    date_of_birth_two: item.date_of_birth_two?item.date_of_birth_two:'X',
                    email: item.email,
                    mobile:item.mobile,
                    is_flashmob: item.is_flashmob,
                    is_pay: item.is_pay,
                    number: item.number,
                    number_of_couple: item.number_of_couple,
                    unit:(unit[0]==null) ? null: 
                        {
                            id: unit[0].id,
                            name: unit[0].name
                        },
                    is_group: item.is_group,
                    status: item.status,
                    fee_amount: item.fee_amount,
                    tournament: {
                         id: item.tournaments[0].id,
                         name: item.tournaments[0].name
                                },
                    tournament_details:details
                    }
                }
        });
        const results=data.map(item=>{
                return {
                    id: item.id,
                    full_name_one: item.full_name_one,
                    date_of_birth_one:  item.date_of_birth_one,
                    full_name_two:(item.full_name_two==='undefined'||item.full_name_two==='')? null:item.full_name_two,
                    date_of_birth_two: item.date_of_birth_two,
                    email: item.email,
                    mobile:item.mobile,
                    is_pay: item.is_pay,
                    number: item.number,
                    fee_amount:item.fee_amount,
                    unit: item.unit,
                    symbol: item.tournament_details.map(detail=>detail.content_competition.symbol)
                }
        });
    return  results
};