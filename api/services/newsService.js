const models                             = require("../../models");
const messageConstants                   = require("../constants/messageContants");


//findall
exports.getAll = () => {
models.news.belongsTo(models.themes,{foreignKey:'theme_id'});
    return models.news.findAndCountAll({        
        where:{deleted: false},
        order: [
            ['created_date', 'DESC'],
        ],
        attributes:['id','name','content_summary','content_detail','created_date','image'],
        include:[{
            where:{deleted: false},
            model: models.themes,
            attributes:['id','name']
        }]
    });
}

//find all paging
exports.getAllByPaging = (searchviewModel) => {
    limit = searchviewModel.limit;
    offset = searchviewModel.offset;
    return models.news.findAndCountAll({
        where:{deleted: false},
        limit: limit,
        offset: offset
    });
};

//find by id
exports.getById = async (id) => {
    models.news.belongsTo(models.themes,{foreignKey:'theme_id'});
    return models.news.findOne({ 
        where:{deleted: false,id:id},
        order: [
            ['created_date', 'DESC'],
        ],
        attributes:['id','name','content_summary','content_detail','updated_date','image'],
        include:[{
            where:{deleted: false},
            model: models.themes,
            attributes:['id','name']
        }]
    });
};

//create
exports.create = async (news) => {
    return models.news.create(news);
};

//create
exports.createUrl = async (file) => {
    var url="/resources/images/news/"+file.filename;
    return url
};


//update
exports.update= async(Id,options)=>{
    return  models.news.update(options,{where:{id:Id}});
};

//delete
exports.delete = async (id, options) => {
    return models.news.update(options, {where: {id:id, deleted : 0}});
};

//restore
exports.restore = async (id, options) => {
    return models.news.update(options, {where: {id:id, deleted : 1}});
};