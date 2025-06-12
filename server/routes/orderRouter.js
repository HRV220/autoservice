const Router = require("express");
const router = new Router();
const orderController = require("../controllers/orderController");

// POST /api/order/
router.post("/", orderController.create);
// GET /api/order/  (или GET /api/order?date=2024-01-15)
router.get("/", orderController.getAll);

module.exports = router;
