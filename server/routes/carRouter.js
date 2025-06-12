const Router = require("express");
const carController = require("../controllers/carController");
const router = new Router();

// POST /api/car/
router.post("/", carController.create);
// GET /api/car/
router.get("/", carController.getAll);

// PUT /api/car/:id
router.put("/:id", carController.update);
// DELETE /api/car/:id
router.delete("/:id", carController.delete);

module.exports = router;
