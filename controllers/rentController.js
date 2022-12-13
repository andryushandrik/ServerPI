const { Rent, Car } = require("../models/models");
const ApiError = require("../error/ApiError");
const { where, Sequelize } = require("sequelize");
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
            const rent = await Rent.findOne({ where: { id } });
            rent.update(req.body, { fields: accessedFields });
            return res.json(rent);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async start(req, res, next) {
        try {
            const { id } = req.params,
                car = await Car.findOne({ where: { id } }),
                userId = req.user.id;
            console.log(car);
            if (car.inRent) {
                return res.status(403).json({ message: "Машина занята" });
            }

            const rent = await Rent.create({
                carId: id,
                userId,
                startprobeg: car.probeg,
                starttime: Sequelize.fn("NOW"),
            });
            const _car = await car.update({ inRent: true });
            return res.json(rent);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async end(req, res, next) {
        try {
            const { id } = req.params,
                { endprobeg } = req.body;
                const rent = await Rent.findOne({
                    where: { carId: id, endtime: null },
                });
            if (!rent) {
                next(ApiError.badRequest("такой поездки нет!"));
                console.log("Поездка " + id + " не найдена");
            }
            const car = await Car.findOne({ where: { id: rent.carId } });
            console.log(id);
            if (rent.endtime) {
                next(ApiError.badRequest("Поездка уже завершена!"));
            }
            if (rent.userId != req.user.id) {
                return res.status(403).json({ message: "Нет доступа" });
            }
            if (!car.inRent) {
                next(ApiError.badRequest(error.message));
            }
            const _rent = await rent.update({
                endprobeg,
                endtime: Sequelize.fn("NOW"),
            });
            const _car = await car.update({ probeg: endprobeg, inRent: false });
            return res.json(_rent);
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
            },
            attributes: accessedFields.remove("userId") 
        });
        return res.json(rents);
    }

    async getActive(req, res) {
        const _userId = req.user.id;
        const rents = await Rent.findAll({
            where: {
                userId: _userId,
                endtime: null,
            },
        });
        return res.json(rents);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const rent = await Rent.findOne({ where: { id } });
        return res.json(rent);
    }

    async getMyOne(req, res) {
        const { id } = req.params;
        const rent = await Rent.findOne({ where: { id } });
        if (rent.userId != req.user.id) {
            return res.status(403).json({ message: "Нет доступа" });
        }

        return res.json(rent);
    }
}

module.exports = new RentController();
