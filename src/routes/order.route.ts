import express from "express";
import OrderController from "../controller/order.controller";
import { strictLimiter } from "../middleware/rateLimiter.middleware";
import OrderMiddleware from "../middleware/order.middleware";
import ImageUploaderMiddleware from "../middleware/imageUploader.middleware";
import AuthMiddleware from "../middleware/auth.middleware";

const orderMiddleware = new OrderMiddleware();
const authMiddleware = new AuthMiddleware();
const orderController = new OrderController();
const orderImageUploader = new ImageUploaderMiddleware();

const orderRouter = express.Router();

orderRouter.get(
	"/",
	authMiddleware.authenticate(["admin", "agent", "designer"]),
	orderMiddleware.validateFilteringQueries,
	orderController.getAllOrders,
);

orderRouter.get(
	"/customer/:customerId",
	orderMiddleware.validateOrderByCustomer,
	orderController.getOrdersByCustomer,
);

orderRouter.post(
	"/create",
	strictLimiter,
	orderImageUploader.uploader("order-images").array("designFiles", 5),
	orderImageUploader.compressImages,
	orderMiddleware.validateOrderCreation,
	orderController.createOrder,
);

orderRouter.post(
	"/create-request",
	strictLimiter,
	orderImageUploader.uploader("order-images").array("designFiles", 5),
	orderImageUploader.compressImages,
	orderMiddleware.validateOrderRequestCreation,
	orderController.createOrderRequest,
);

orderRouter.put(
	"/update-order",
	strictLimiter,
	orderMiddleware.validateOrderUpdate,
	orderController.updateOrder,
);

orderRouter.post(
	"/add-payment",
	strictLimiter,
	orderMiddleware.validateOrderPaymentCreation,
	orderController.createOrderPayment,
);

orderRouter.post(
	"/payment/success",
	strictLimiter,
	orderController.paymentSuccess,
);

orderRouter.post("/payment/fail", strictLimiter, orderController.paymentFail);

orderRouter.post(
	"/payment/cancel",
	strictLimiter,
	orderController.paymentCancel,
);

export default orderRouter;
