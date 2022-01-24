"use strict"
const models                              = require("../../models");
const messageConstants                    = require("../constants/messageContants");


//create
exports.create = async (obj) => {
    return models.settings.create(obj);
};
//create
exports.uploadImages = async (file) => {
    var url="/resources/images/settings/"+file.filename;
    const encoded = encodeURI(url);
    return encoded
};
//find all
exports.getAll = () => {
   return models.settings.findAndCountAll({        
    where:{deleted: false},
    order: [
        ['created_date', 'DESC']
    ],
    attributes:['id','about_us','contact_nofi','dashboard','event_calendar']
});
};



//find all paging
exports.getAllByPaging = (searchViewModel) => {
    const limit = searchViewModel.limit;
    const offset = searchViewModel.offset;
    return models.settings.findAndCountAll({
        where:{deleted:0},
        limit: limit,
        offset: offset
    });
};

//find by id
exports.getById = async (id) => {
    return models.settings.findOne({where: {deleted:0,id: id}});
};

//update
exports.update =async (id, options) => {
    return models.settings.update(options, {where: {id:id, deleted: 0}});
};

//delete
exports.delete =async (id, options) => {
    return models.settings.update(options, {where: {id:id, deleted: 0}});
};

//restore
exports.restore = async (id, options) => {
    return models.settings.update(options, {where: {id: id, deleted: 1}});
};