const Router = require("express");
const router = new Router();
const orderController = require("../controllers/orderController");

// POST /api/order/
router.post("/", orderController.create);
// GET /api/order/  (или GET /api/order?date=2024-01-15)
router.get("/", orderController.getAll);
// ... (существующие роуты post и get '/')
router.get("/:id", orderController.getOne);
router.put("/:id", orderController.update);
// ...
module.exports = router;
