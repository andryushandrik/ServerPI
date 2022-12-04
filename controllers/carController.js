const { Car } = require("../models/models");
const ApiError = require("../error/ApiError");
const accessedFields = ["model", "year", "probeg"];
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
            const car = await Car.findOne({ id });
            car.update(req.body, { fields: accessedFields });
            return res.json(car);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getAll(req, res) {
        const cars = await Car.findAll();
        return res.json(cars);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const car = await Car.findOne({ id });
        return res.json(car);
    }

    async delOne(req, res) {
        const { id } = req.params;
        const car = await Car.findOne({ id });
        await car.destroy();
        return res.json(car);
    }
}

module.exports = new CarController();
