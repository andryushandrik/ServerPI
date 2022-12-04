require("dotenv").config();
const { Maintenance } = require("./models/models");
const Sequelize = require('sequelize');


console.log(Maintenance.create({id: 1, date: Sequelize.fn('NOW') }));
