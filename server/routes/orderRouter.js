const Router = require("express");
const employeeController = require("../controllers/employeeController");
const orderController = require("../controllers/orderController");
const router = new Router();

router.post("/", orderController.create);
router.get("/", orderController.getAll);

module.exports = router;
