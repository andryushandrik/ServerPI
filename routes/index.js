const Router = require("express");
const router = new Router();
const UserController = require("../controllers/userController");
const CarController = require("../controllers/carController");
const RentController = require("../controllers/rentController");
const OperationController = require("../controllers/operationController");


const Auth = require("../middleware/authMiddleware");
const Role = require("../middleware/checkRoleMiddleware");

/* User */
router.post("/registration", UserController.registration);
router.post("/login", UserController.login);
router.post("/check", Auth, UserController.check);

/* Car */
router.post("/car", Role("ADMIN"), CarController.create);
router.put("/car/:id", Role("ADMIN"), CarController.update);
router.get("/car", CarController.getAll);
router.get("/car/:id", CarController.getOne);
router.delete("/car/:id", Role("ADMIN"), CarController.delOne);

/* Rent */
router.post("/rent", Role("ADMIN"), RentController.create);
router.post("/car/:id/rent", Auth, RentController.start);
router.put("/rent/:id/end", Auth, RentController.end);
router.put("/rent/:id", Role("ADMIN"), RentController.update);
router.get("/rent/my", Auth, RentController.getMy);
router.get("/rent/active", Auth, RentController.getActive);

router.get("/rent/my/:id", Auth, RentController.getMyOne);
router.get("/rent/:id", Role("ADMIN"), RentController.getOne);
router.get("/rent", Role("ADMIN"), RentController.getAll);

/* Operation and Maintenance */
router.post("/maintenance", Role("ADMIN"), OperationController.create);
router.put("/maintenance/:id", Role("ADMIN"), OperationController.update);
router.get("/maintenance", Role("ADMIN"), OperationController.getAll);
router.get("/maintenance/:id", Role("ADMIN"), OperationController.getOne);
router.delete("/maintenance/:id", Role("ADMIN"), OperationController.delOne);
router.post("/maintenance/:id/carry", Role("ADMIN"), OperationController.addMaintenance);


module.exports = router;
