const { Car } = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op } = require("sequelize");
const accessedFields = ["model", "year", "probeg", "inRent"];
class CarController {
    async create(req, res, next) {
        try {
            const car = await Car.create(req.body, { fields: accessedFields });
            return res.json(car);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const car = await Car.findOne({ where: { id } });
            car.update(req.body, { fields: accessedFields });
            return res.json(car);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getAll(req, res) {
        let { maxProbeg, minYear } = req.query;
        let cars;
        console.log(req.query);
        if (maxProbeg && minYear) {
            cars = await Car.findAll({
                where: {
                    probeg: { [Op.lte]: maxProbeg },
                    year: { [Op.gte]: minYear },
                },
            });
        }
        if (maxProbeg && !minYear) {
            cars = await Car.findAll({
                where: {
                    probeg: { [Op.lte]: maxProbeg },
                },
            });
        }
        if (!maxProbeg && minYear) {
            cars = await Car.findAll({
                where: {
                    year: { [Op.gte]: minYear },
                },
            });
        }
        if (!maxProbeg && !minYear) {
            cars = await Car.findAll();
        }

        console.log(cars);
        return res.json(cars);
    }

    async getOne(req, res) {
        const { id } = req.params;
        console.log(id);
        const car = await Car.findOne({ where: { id } });
        return res.json(car);
    }

    async delOne(req, res) {
        const { id } = req.params;
        const car = await Car.findOne({ where: { id } });
        if (!car) {
            next(ApiError.badRequest("такой машины нет!"));
            console.log("машина " + id + " не найдена");
        }
        await car.destroy();
        return res.json(car);
    }
}

module.exports = new CarController();
