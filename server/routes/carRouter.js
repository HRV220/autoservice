const Router = require("express");
const carController = require("../controllers/carController");
const router = new Router();

router.post("/", carController.create);

router.get("/", carController.getAll);

router.put("/:id", carController.update);

router.delete("/:id", carController.delete);

module.exports = router;
