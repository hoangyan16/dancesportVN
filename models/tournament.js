'use strict';
const moment = require('moment');
const { Sequelize,DataTypes } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
var tournaments = sequelize.define('tournaments', {
id: {
  allowNull: false,
  autoIncrement: true,
  primaryKey: true,
  type: Sequelize.INTEGER(4),

},
name:{
    type: Sequelize.STRING(255)
},
atheletes_number_start:{
  type: Sequelize.INTEGER(4)
},
address:{
    type: Sequelize.STRING(255)
},
link: {
  type: Sequelize.STRING(1024)
},
start_date: {
  type: Sequelize.DATEONLY,
  get()  {
    return moment(this.getDataValue('start_date')).format('DD-MM-YYYY'); 
  },
},
end_date: {
  type: Sequelize.DATEONLY,
  get()  {
    return moment(this.getDataValue('end_date')).format('DD-MM-YYYY'); 
  },
},
currency_name: {
    type: Sequelize.STRING(255)
},
content: {
    type: Sequelize.TEXT('long')
},
is_active: {
    type: Sequelize.INTEGER(2),
    defaultValue: false
},
is_comment:{
    type: Sequelize.INTEGER(2),
    defaultValue: true
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
    return moment(this.getDataValue('updated_date')).format('DD/MM/YYYY'); 
  },
},
updated_by: {
  type: Sequelize.STRING(255)
},
  },
{   
   timestamps: false
});
return tournaments;
}
