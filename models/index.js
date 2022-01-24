'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  // operatorsAliases: false,
  operatorsAliases: 0,
  timezone: "+07:00",
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle
  }
});
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.settings                                 = require("./setting.js")(sequelize, Sequelize);
db.contacts                                 = require("./contacts.js")(sequelize, Sequelize);
db.athlete                                  = require("./athlete.js")(sequelize, Sequelize);
db.content_competitions                     = require("./contentCompetition.js")(sequelize, Sequelize);
db.dance_types                              = require("./danceType.js")(sequelize, Sequelize);
db.dances                                   = require("./dance.js")(sequelize, Sequelize);
db.fees                                     = require("./fee.js")(sequelize, Sequelize);
db.ages                                     = require("./age.js")(sequelize, Sequelize);
db.grades                                   = require("./grade.js")(sequelize, Sequelize);
db.registration                             = require("./registration.js")(sequelize, Sequelize);
db.resource                                 = require("./resource.js")(sequelize, Sequelize);
db.tournaments                              = require("./tournament.js")(sequelize, Sequelize);
db.tournament_details                       = require("./tournamentDetail.js")(sequelize, Sequelize);
db.themes                                   = require("./themes.js")(sequelize, Sequelize);
db.news                                     = require("./news.js")(sequelize, Sequelize);
db.users                                    = require("./user.js")(sequelize, Sequelize);
db.formality                                = require("./formality.js")(sequelize, Sequelize);
db.comment                                  = require("./comment.js")(sequelize, Sequelize);
db.mc                                       = require("./mc.js")(sequelize, Sequelize);
db.units                                    = require("./unit.js")(sequelize, Sequelize);
db.fee_details                              = require("./fee_detail.js")(sequelize, Sequelize);

// sequelize.sync({alter: true});
sequelize.sync();
module.exports = db;

