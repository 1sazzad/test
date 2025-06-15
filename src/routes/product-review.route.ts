import express from "express";
import AuthMiddleware from "../middleware/auth.middleware";
import { strictLimiter } from "../middleware/rateLimiter.middleware";
import ProductReviewMiddleware from "../middleware/product-review.middleware";
import ProductReviewController from "../controller/product-review.controller";

const productReviewMiddleware = new ProductReviewMiddleware();
const productReviewController = new ProductReviewController();
const authMiddleware = new AuthMiddleware();

const productReviewRouter = express.Router();

productReviewRouter.get(
	"/",
	authMiddleware.authenticate(["admin", "agent"]),
	productReviewMiddleware.validateFilteringQueries,
	productReviewController.getAllReviews,
);

productReviewRouter.post(
	"/create",
	strictLimiter,
	authMiddleware.authenticate(["customer"]),
	productReviewMiddleware.validateProductReviewCreation,
	productReviewController.createReview,
);

productReviewRouter.put(
	"/",
	strictLimiter,
	productReviewMiddleware.validateProductReviewStatusUpdate,
	productReviewController.setStatus,
);

export default productReviewRouter;
