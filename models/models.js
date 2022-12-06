const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Car = sequelize.define('car', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    model: {type: DataTypes.STRING, allowNull: false},
    year: {type: DataTypes.INTEGER, allowNull: false},
    probeg: {type: DataTypes.INTEGER},
    inRent: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},

})

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    login: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    documentdate: {type: DataTypes.DATEONLY},
    role: {type: DataTypes.STRING, defaultValue: "USER", allowNull: false},
})

const Rent = sequelize.define('rent', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    starttime: {type: DataTypes.DATE},
    endtime: {type: DataTypes.DATE},
    startprobeg: {type: DataTypes.INTEGER},
    endprobeg: {type: DataTypes.INTEGER},
})

const Operation = sequelize.define('operation', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true,},
    next: {type: DataTypes.DATEONLY},
})
const Maintenance = sequelize.define('maintenance', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.DATEONLY},
})

Car.hasMany(Rent)
Rent.belongsTo(Car)

User.hasMany(Rent)
Rent.belongsTo(User)

Car.hasMany(Operation)
Operation.belongsTo(Car)

Operation.hasMany(Maintenance)
Maintenance.belongsTo(Operation)



module.exports = {
    Car,
    User,
    Rent,
    Operation,
    Maintenance
}