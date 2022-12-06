const { Rent, Maintenance } = require("../models/models");
const Sequelize = require("sequelize");
const ApiError = require("../error/ApiError");
const accessedFields = ["model", "year", "probeg"];
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
    async addMaintenance(req, res, next) {
        try {
            const { id } = req.params;
            const rent = await Rent.findOne({ where: { id } });
            if (!rent) {
                next(ApiError.badRequest("Процедура ТО не найдена!"));
            }
            const maintenance = await Maintenance.create({
                rentId: rent.id,
                date: Sequelize.fn("NOW"),
            });
            return res.json(maintenance);
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

    async getAll(req, res) {
        const rents = await Rent.findAll();
        return res.json(rents);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const rent = await Rent.findOne({ where: { id } });
        return res.json(rent);
    }

    async delOne(req, res) {
        const { id } = req.params;
        const rent = await Rent.findOne({ where: { id } });
        await rent.destroy();
        return res.json(rent);
    }
}

module.exports = new RentController();
