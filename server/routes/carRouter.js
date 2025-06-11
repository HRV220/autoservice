const Router = require("express");
const carController = require("../controllers/carController");
const router = new Router();

router.post("/", carController.create);
router.get("/", carController.getAll);

module.exports = router;
