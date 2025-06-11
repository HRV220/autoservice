const Router = require("express");
const employeeController = require("../controllers/employeeController");
const router = new Router();

router.post("/", employeeController.create);
router.get("/", employeeController.getAll);

module.exports = router;
