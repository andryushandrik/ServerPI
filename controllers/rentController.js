const { Rent, Car } = require("../models/models");
const ApiError = require("../error/ApiError");
const { where } = require("sequelize");
const accessedFields = [
    "carId",
    "userId",
    "starttime",
    "endtime",
    "startprobeg",
    "endprobeg",
];
class RentController {
    async create(req, res, next) {
        try {
            const rent = await Rent.create(req.body, {
                fields: accessedFields,
            });
            return res.json(rent);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const rent = await Rent.findOne({ id });
            rent.update(req.body, { fields: accessedFields });
            return res.json(rent);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async start(req, res, next) {
        try {
            const { carId } = req.params,
                car = await Car.findOne({ carId }),
                userId = req.user.id;
            const rent = await Rent.create({
                carId,
                userId,
                startprobeg: car.probeg,
                starttime: Sequelize.fn("NOW"),
            });
            return res.json(rent);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async end(req, res, next) {
        try {
            const { id } = req.params,
                { probegend } = req.body,
                rent = await Rent.findOne({ id }),
                car = await Car.findOne({ id: rent.carId });

            if (rent.userId != req.user.id) {
                return res.status(403).json({ message: "Нет доступа" });
            }

            rent = await rent.update({
                probegend,
                endtime: Sequelize.fn("NOW"),
            });
            await car.update({ probeg: probegend });
            return res.json(rent);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getAll(req, res) {
        const rents = await Rent.findAll();
        return res.json(rents);
    }

    async getMy(req, res) {
        const _userId = req.user.id;
        const rents = await Rent.findAll({
            where: {
                userId: _userId,
            }
          });
        return res.json(rents);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const rent = await Rent.findOne({ id });
        return res.json(rent);
    }

    async getMyOne(req, res) {
        const { id } = req.params;
        const rent = await Rent.findOne({ id });
        if (rent.userId != req.user.id) {
            return res.status(403).json({ message: "Нет доступа" });
        }
        
        return res.json(rent);
    }
}

module.exports = new RentController();
