"use strict"
const models                           = require("../../models");


//create
exports.create = async (obj,t) => {
    const formality = {};
        formality.name= obj.name,
        formality.status= 1,
        formality.deleted= 0;
    return models.formality.create(formality,t);
};


//find all
exports.getAll = () => {
   return models.formality.findAll({        
    where:{deleted: false},
    order: [
        ['id', 'ASC']
    ],
});
};


//find all paging
exports.getAllByPaging = (searchViewModel) => {
    const limit = searchViewModel.limit;
    const offset = searchViewModel.offset;
    return models.formality.findAndCountAll({
        where:{deleted: false},
        limit: limit,
        offset: offset
    });
};

//find by id
exports.getById = async (id) => {
    return models.formality.findOne({where: {id: id,deleted: false}});
};

//update
exports.update = async (id, dancesUpdate) => {
    return models.formality.update(dancesUpdate, {where: {id: id,deleted: false}});
};

//delete
exports.delete =async (id, options) => {
    return models.formality.update(options, {where: {id:id, deleted: 0}});
};

//restore
exports.restore = async (id, options) => {
    return models.formality.update(options, {where: {id: id, deleted: 1}});
};