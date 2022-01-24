const models                             = require('../../models');
const FeeService                         = require("../services/feeService");



// // QUẢN LÝ RESOURCES
// // Lấy thông tin nội dung các cuộc thi đã được tạo 
exports.getAll=async(tournament_id)=>{
    const data=[];
    const new_data=[];
    let condition= {deleted: false};
    if(tournament_id){
        condition= {deleted: false,tournament_id:tournament_id}
    }
    const result= await models.fee_details.findAll({
        where:condition,
        attributes:['id','fee_id','start_content','end_content','tournament_id']
    });
    if(result.length>0){
        for(var i=0; i<result.length;i++){
            const fee = await FeeService.getById(result[i].fee_id);
            detail={
                id: result[i].id,
                formality:{
                    id: fee.formality.id,
                    name: fee.formality.name
                },
                fee:{
                    id: fee.id,
                    name: fee.name,
                    amount: fee.amount,
                },
                start_content:result[i].start_content,
                end_content: result[i].end_content
            };
            data.push(detail);
        };
    for(var i=1; i<=3; i++){
    let result= data.filter(item=>item.formality.id===i);
    if(Number(result[0].fee.amount)>Number(result[1].fee.amount)){
          fee_detail={
              tournament_id: tournament_id,
              formality:{
                  id: result[0].formality.id,
                  name:result[0].formality.name
              },
              main:{
                  id: result[0].id,
                  fee:{
                      id: result[0].fee.id,
                      name: result[0].fee.name,
                      amount: result[0].fee.amount,
                  },
                  start_content: result[0].start_content,
                  end_content: result[0].end_content 
              },
              sub:{
                    id: result[1].id,
                  fee:{
                      id: result[1].fee.id,
                      name: result[1].fee.name,
                      amount: result[1].fee.amount,
                  },
                  start_content: result[1].start_content,
                  end_content: result[1].end_content
              }
          }
     }else{
      fee_detail={
            tournament_id: tournament_id,
          formality:{
              id: result[1].formality.id,
              name:result[1].formality.name
          },
          main:{
              id: result[1].id,
              fee:{
                  id: result[1].fee.id,
                  name: result[1].fee.name,
                  amount: result[1].fee.amount,
              },
              start_content: result[1].start_content,
              end_content: result[1].end_content 
          },
          sub:{
            id: result[0].id,
              fee:{
                  id: result[0].fee.id,
                  name: result[0].fee.name,
                  amount: result[0].fee.amount,
              },
              start_content: result[0].start_content,
              end_content: result[0].end_content
               }
          }
     }
     new_data.push(fee_detail);
    }
    return new_data;
    }else{
        return result
    }
};


// Create 
exports.create= async(details,tournament_id,t)=>{
    const data=[];
    const options=[];
    for(var i=0; i<details.length;i++){
          options[i]={
            tournament_id: tournament_id,
            formality_id: details[i].formality_id,
            fee_id: details[i].fee_id,
            start_content: details[i].start_content,
            end_content: details[i].end_content
          };
          var detail = await models.fee_details.create(options[i],t);
          data.push(detail);
        }
    return data
};

// Update
exports.update= async(details,tournament_id)=>{
    const data=[];
    const options=[];
    for(var i=0; i<details.length;i++){
        options[i]={
            tournament_id: tournament_id,
            formality_id: details[i].formality_id,
            fee_id: details[i].fee_id,
            start_content: details[i].start_content,
            end_content: details[i].end_content
        };
          var detail = await models.fee_details.update(options[i],{where:{deleted:false,id: details[i].id,tournament_id:tournament_id}});
          data.push(detail);
        };
    return data;
};
