'use strict';
const moment = require('moment');
const dayjs = require('dayjs');
const { Sequelize } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
var content_competitions = sequelize.define('content_competitions', {
id: {
  allowNull: false,
  autoIncrement: true,
  primaryKey: true,
  type: Sequelize.INTEGER(4),

},
index: {
  type: Sequelize.INTEGER(4),
},
index_of_detail: {
  type: Sequelize.INTEGER(4),
},
symbol: {
  type: Sequelize.STRING(255)
},
fee_id: {
    type: Sequelize.INTEGER(8)
},
minimum_athletes: {
    type: Sequelize.INTEGER(2)
},
age_id: {
  type: Sequelize.INTEGER(2),
},
sub_ages: {
  type: Sequelize.STRING(255),
},
grade_id:{
    type: Sequelize.INTEGER(4)
},
formality_id:{
  type: Sequelize.INTEGER(4),
},
name:{
    type: Sequelize.STRING(255)
},
is_closed: {
    type: Sequelize.INTEGER(2),
    defaultValue: false
},
unit_id: {
  type: Sequelize.INTEGER(4)
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
return content_competitions;
}
