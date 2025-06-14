const Router = require("express");
const router = new Router();
const carRouter = require("./carRouter");
const clientRouter = require("./clientRouter");
const employeeRouter = require("./employeeRouter");
const orderRouter = require("./orderRouter");
const userRouter = require("./userRouter");
const serviceRouter = require("./serviceRouter");

router.use("/car", carRouter);
router.use("/employee", employeeRouter);
router.use("/order", orderRouter);
router.use("/user", userRouter);
router.use("/client", clientRouter);
router.use("/service", serviceRouter);

module.exports = router;
