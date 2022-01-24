"use strict"
const models                              = require("../../models");
const messageConstants                    = require("../constants/messageContants");


//create
exports.create = async (obj) => {
    return models.contacts.create(obj);
};

//find all
exports.getAll = () => {
   return models.contacts.findAndCountAll({        
    where:{deleted: false},
    order: [
        ['created_date', 'DESC'],
        ],
    attributes:['id','name','title','email','mobile','content_summary']
    });
};


//find all paging
exports.getAllByPaging = (searchViewModel) => {
    const limit = searchViewModel.limit;
    const offset = searchViewModel.offset;
    return models.contacts.findAndCountAll({
        where:{deleted:0},
        limit: limit,
        offset: offset
    });
};

//find by id
exports.getById = async (id) => {
    return models.contacts.findOne({where: {deleted:0,id: id}});
};

//update
exports.update = async (id, options) => {
    return models.contacts.update(options, {where: {id: id}});
};

//delete
exports.delete =async (ids, options) => {
    const _id=JSON.parse("[" + ids + "]");
    for(var i=0; i<_id.length;i++){
        models.contacts.update(options, {where: {id:_id[i], deleted: 0}});
    }
    return true
};

//delete
exports.deleteAll =async (ids, options) => {
    for(var i=0; i<ids.length;i++){
        models.contacts.update(options, {where: {id:ids[i], deleted: 0}});
    }
    return true
};

//restore
exports.restore = async (id, options) => {
    return models.contacts.update(options, {where: {id: id, deleted: 1}});
};