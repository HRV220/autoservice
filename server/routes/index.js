const Router = require("express");
const router = new Router();
const carRouter = require("./carRouter");
const clientRouter = require("./clientRouter");
const employeeRouter = require("./employeeRouter");
const orderRouter = require("./orderRouter");
const userRouter = require("./userRouter");

router.use("/car", carRouter);
router.use("/employee", employeeRouter);
router.use("/order", orderRouter);
router.use("/user", userRouter);
router.use("/client", clientRouter);

module.exports = router;
