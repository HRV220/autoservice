const Router = require("express");
const router = new Router();
const serviceController = require("../controllers/serviceController");

// Маршруты для CRUD операций
router.post("/", serviceController.create); // POST /api/service/
router.get("/", serviceController.getAll); // GET /api/service/
router.get("/:id", serviceController.getOne); // GET /api/service/:id
router.put("/:id", serviceController.update); // PUT /api/service/:id
router.delete("/:id", serviceController.delete); // DELETE /api/service/:id

module.exports = router;
