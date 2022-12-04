const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Basket } = require("../models/models");

const generateJwt = (id, role) => {
    return jwt.sign({ id, role }, process.env.SECRET_KEY, { expiresIn: "24h" });
};

class UserController {
    async registration(req, res, next) {
        const { name, login, password, documentdate, role } = req.body;
        console.log(req.body);
        if (!login || !password) {
            return next(
                ApiError.badRequest("Некорректный логином или password")
            );
        }
        const candidate = await User.findOne({ where: { login } });
        if (candidate) {
            return next(
                ApiError.badRequest(
                    "Пользователь с таким логином уже существует"
                )
            );
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({
            name,
            login,
            documentdate,
            role,
            password: hashPassword,
        });
        const token = generateJwt(user.id, user.login, user.role);
        return res.json({ token });
    }

    async login(req, res, next) {
        const { login, password } = req.body;
        const user = await User.findOne({ where: { login } });
        if (!user) {
            return next(ApiError.internal("Пользователь не найден"));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal("Указан неверный пароль"));
        }
        const token = generateJwt(user.id, user.login, user.role);
        return res.json({ token });
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.login, req.user.role);
        return res.json({ token });
    }
}

module.exports = new UserController();
