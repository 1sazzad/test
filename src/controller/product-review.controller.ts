import { Request, Response, NextFunction } from "express";
import ProductReviewService from "../service/product-review.service";
import { responseSender } from "../util";
import { Order, WhereOptions } from "sequelize";
import { ProductReviewAttributes } from "../model/product-review.model";

class ProductReviewController {
	private productReviewService: ProductReviewService;

	constructor() {
		this.productReviewService = new ProductReviewService();
	}

	createReview = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const newReview = {
				rating: (req as any).validatedValue.rating,
				description: (req as any).validatedValue.description,
				productId: (req as any).validatedValue.productId,
				customerId: (req as any).validatedValue.customerId,
			};

			const createdReview = await this.productReviewService.createReview(
				newReview.rating,
				newReview.description,
				newReview.productId,
				newReview.customerId,
			);

			if (!createdReview) {
				return responseSender(
					res,
					500,
					"Product review creation failed. Please try again.",
				);
			}

			return responseSender(
				res,
				201,
				"Thank you for rating this product.",
				{
					review: createdReview,
				},
			);
		} catch (err: any) {
			console.log(
				"Error occured while creating product review: ".red,
				err.message,
			);
			next(err);
		}
	};

	setStatus = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const fetchedReview =
				await this.productReviewService.getReviewByReviewId(
					(req as any).validatedValue.reviewId,
				);

			if (!fetchedReview) {
				return responseSender(
					res,
					400,
					"Product review couldn't found.",
				);
			}

			const isUpdated = await this.productReviewService.setStatusById(
				fetchedReview.reviewId,
				(req as any).validatedValue.status,
			);

			if (!isUpdated) {
				return responseSender(
					res,
					500,
					"Product review couldn't updated. Please try again.",
				);
			}

			return responseSender(
				res,
				200,
				"Product review updated successfully.",
			);
		} catch (err: any) {
			console.log(
				"Error occured while creating product review: ".red,
				err.message,
			);
			next(err);
		}
	};

	getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
		try {
			// const searchTerm = (req as any).validatedValue.searchTerm;
			// const searchBy = (req as any).validatedValue.searchBy;
			const status = (req as any).validatedValue.status;
			const currentPage = parseInt((req as any).validatedValue.page || 1);
			const limitPerPage = parseInt(
				(req as any).validatedValue.limit || 20,
			);
			const offset = (currentPage - 1) * limitPerPage;
			const order: Order = [["createdAt", "DESC"]];
			const filter: WhereOptions<ProductReviewAttributes> = {};

			if (status) {
				filter.status = status;
			}

			const reviews = await this.productReviewService.getAllReviews(
				filter,
				limitPerPage,
				offset,
				order,
			);
			if (!reviews.rows) {
				return responseSender(
					res,
					400,
					"Failed to get reviews. Please try again.",
				);
			}
			return responseSender(res, 200, "Reviews fetched successfully.", {
				reviews: reviews.rows,
				total: reviews.count,
				totalPages: Math.ceil(reviews.count / limitPerPage),
				currentPage,
			});
		} catch (err: any) {
			console.log(
				"Error occured while fetching product reviews: ".red,
				err.message,
			);
			next(err);
		}
	};
}

export default ProductReviewController;
