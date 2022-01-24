'use strict';
const moment = require('moment');
const dayjs = require('dayjs');
const { Sequelize,DataTypes } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
var fees = sequelize.define('fees', {
id: {
  allowNull: false,
  autoIncrement: true,
  primaryKey: true,
  type: Sequelize.INTEGER(4),

},
index: {
  allowNull: true,
  type: Sequelize.INTEGER(4),
},
name: {
  type: Sequelize.STRING(255)
},
amount: {
    type: Sequelize.DECIMAL(17)
  },
currency_id:{
    type: Sequelize.INTEGER(2)
},
currency_name:{
  type: Sequelize.STRING(255)
},
formality_id:{
    type: Sequelize.INTEGER(4)
},
status: {
  type: Sequelize.INTEGER(2),
  defaultValue:true
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
return fees;
}
