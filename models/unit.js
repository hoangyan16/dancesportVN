'use strict';
const moment = require('moment');
const { Sequelize,DataTypes } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
var units = sequelize.define('units', {
id:{
  allowNull: false,
  autoIncrement: true,
  primaryKey: true,
  type: Sequelize.INTEGER(4),
},
index:{
  type: Sequelize.INTEGER(4)
},
index_of_athletes:{
  type: Sequelize.INTEGER(4)
},
name:{
    type: Sequelize.STRING(1024)
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
return units;
}
