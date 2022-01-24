'use strict';
const dayjs = require('dayjs');
const moment = require('moment');
const { Sequelize,DataTypes } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
var news = sequelize.define('news', {
id: {
  allowNull: false,
  autoIncrement: true,
  primaryKey: true,
  type: Sequelize.INTEGER(4),

},
name: {
  type: Sequelize.STRING(255)
},
theme_id:{
    type: Sequelize.INTEGER(4)
  },
content_summary:{
    type: Sequelize.TEXT('long'),
},
content_detail:{
    type: Sequelize.TEXT('long')
},
image:{
  type: Sequelize.STRING(2048)
},
status: {
  type: Sequelize.INTEGER(2),
  defaultValue: true
},
deleted: {
  type: Sequelize.INTEGER(2),
  defaultValue: false
},
created_date: {
  type: Sequelize.DATE,
  allowNull: false,
  defaultValue: DataTypes.NOW,
  get()  {
    return moment(this.getDataValue('created_date')).format('DD-MM-YYYY HH:mm:ss'); 
  },
},
created_by: {
  type: Sequelize.STRING(255)
},
updated_date: {
  type: Sequelize.DATE,
  allowNull: true,
  get()  {
    return moment(this.getDataValue('updated_date')).format('DD-MM-YYYY HH:mm:ss'); 
  },
},
updated_by: {
  type: Sequelize.STRING(255)
},
  },
{   
   timestamps: false
});
return news;
}
