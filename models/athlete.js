'use strict';
const moment = require('moment');
const { Sequelize,DataTypes } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
var athlete = sequelize.define('athlete', {
id: {
  allowNull: false,
  autoIncrement: true,
  primaryKey: true,
  type: Sequelize.INTEGER(4),
},
number:{
  type: Sequelize.INTEGER(4),
},
is_flashmob:{
  type:Sequelize.INTEGER(2),
  defaultValue:0
},
index:{
  type: Sequelize.INTEGER(4)
},
number_of_couple:{
  type: Sequelize.INTEGER(4),
},
full_name_one: {
    type: Sequelize.STRING(255),
    allowNull: false,
},
date_of_birth_one: {
    type: Sequelize.INTEGER(4),
    allowNull: false,
},
full_name_two: {
    type: Sequelize.STRING(255)
},
date_of_birth_two: {
    type: Sequelize.INTEGER(4),
},
fee_amount:{
  type: Sequelize.DECIMAL(10)
},
email: {
    type: Sequelize.STRING(255)
},
mobile: {
    type: Sequelize.STRING(10)
},
unit_id: {
    type: Sequelize.INTEGER(4)
},
is_pay: {
  type: Sequelize.BOOLEAN,
  defaultValue: false
},
is_group: {
    type: Sequelize.INTEGER(2)
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
    return moment(this.getDataValue('created_date')).format('DD-MM-YYYY'); 
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
return athlete;
}
