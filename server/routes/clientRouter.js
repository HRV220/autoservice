const Router = require("express");
const clientController = require("../controllers/clientController");
const router = new Router();

router.post("/", clientController.create);

router.get("/", clientController.getAll);

router.get("/:id", clientController.getOne);

module.exports = router;
