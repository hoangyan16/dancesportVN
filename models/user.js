'use strict';
const moment = require('moment');
const { Sequelize,DataTypes } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
var user = sequelize.define('user', {
id: {
  allowNull: false,
  autoIncrement: true,
  primaryKey: true,
  type: Sequelize.INTEGER(4),
},
name:{
  type: Sequelize.STRING(1024)
},
email: {
    type: Sequelize.STRING(255),
    allowNull: false
},
mobile: {
    type: Sequelize.STRING(10)
},
unit_id: {
    type: Sequelize.INTEGER(4)
},
type:{
    type: Sequelize.STRING(255),
    defaultValue:"Đơn vị"
},
address: {
  type: Sequelize.STRING(255)
},
role: {
  type: Sequelize.INTEGER(2),
  defaultValue: false
},
user_name: {
    type: Sequelize.STRING(255)
},
password: {
    type: Sequelize.STRING(255)
},
token: {
  type: Sequelize.STRING(255)
},
password_expires: {
  type: Sequelize.DATE,
  allowNull: true,
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
return user;
}