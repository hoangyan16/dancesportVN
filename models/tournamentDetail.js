'use strict';
const moment = require('moment');
const dayjs = require('dayjs');
const { Sequelize,DataTypes } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
var tournament_details = sequelize.define('tournament_details', {
id: {
  allowNull: false,
  autoIncrement: true,
  primaryKey: true,
  type: Sequelize.INTEGER(4),

},
index: {
  type: Sequelize.INTEGER(4),
},
content_competition_id:{
  type: Sequelize.INTEGER(4),
  allowNull: false,
},
tournament_id:{
    type: Sequelize.INTEGER(4),
    allowNull: false,
},
is_register:{
  type: Sequelize.INTEGER(2),
  defaultValue: true
},
quantity:{
  type: Sequelize.INTEGER(4),
  defaultValue: false
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
return tournament_details;
}
