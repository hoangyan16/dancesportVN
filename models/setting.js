'use strict';
const moment = require('moment');
const dayjs = require('dayjs');
const { Sequelize,DataTypes } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
var settings = sequelize.define('settings', {
id: {
  allowNull: false,
  autoIncrement: true,
  primaryKey: true,
  type: Sequelize.INTEGER(4),

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
about_us:{
    type: Sequelize.TEXT('long'),
    allowNull: true,
},
event_calendar:{
  type: Sequelize.TEXT('long'),
  allowNull: true,
},
dashboard:{
  type: Sequelize.TEXT('long'),
  allowNull: true,
},
contact_nofi: {
  type: Sequelize.TEXT('long'),
  allowNull: true,
},
},
{   
   timestamps: false
});
return settings;
}
