"use strict"
const models                           = require("../../models");


//create
exports.create = async (obj) => {
    const themes = {};
        themes.name= obj.name,
        themes.status= 1,
        themes.deleted= 0;
    return models.themes.create(themes);
};


//find all
exports.getAll = () => {
   return models.themes.findAll({        
    where:{deleted: false},
    order: [
        ['created_date', 'DESC']
    ],
});
};


//find all paging
exports.getAllByPaging = (searchViewModel) => {
    const limit = searchViewModel.limit;
    const offset = searchViewModel.offset;
    return models.themes.findAndCountAll({
        where:{deleted: false},
        limit: limit,
        offset: offset
    });
};

//find by id
exports.getById = async (id) => {
    return models.themes.findOne({where: {id: id,deleted: false}});
};

//update
exports.update = async (id, dancesUpdate) => {
    return models.themes.update(dancesUpdate, {where: {id: id,deleted: false}});
};

//delete
exports.delete =async (id, options) => {
    return models.themes.update(options, {where: {id:id, deleted: 0}});
};

//restore
exports.restore = async (id, options) => {
    return models.themes.update(options, {where: {id: id, deleted: 1}});
};