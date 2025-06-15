import { Request, Response, NextFunction } from "express";
import { responseSender } from "../util";
import { Op, Order, WhereOptions } from "sequelize";
import OrderService from "../service/order.service";
import { OrderAttributes } from "../model/order.model";
import CartService from "../service/cart.service";
import path from "path";
import fs from "fs";
import { io } from "../server";
import PaymentService from "../service/payment.service";
import TransactionService from "../service/transaction.service";
import { frontendLandingPageUrl } from "../config/dotenv.config";

class OrderController {
	private orderService: OrderService;
	private paymentService: PaymentService;
	private transactionService: TransactionService;
	private cartService: CartService;

	constructor() {
		this.orderService = new OrderService();
		this.paymentService = new PaymentService();
		this.transactionService = new TransactionService();
		this.cartService = new CartService();
	}

	createOrder = async (req: Request, res: Response, next: NextFunction) => {
		try {
			if ((req as any).fileValidationError) {
				return responseSender(
					res,
					400,
					(req as any).fileValidationError,
				);
			}
			console.log((req as any).validatedValue);
			console.log(req.files);

			const newOrder = {
				customerId: (req as any).validatedValue.customerId,
				customerName: (req as any).validatedValue.customerName,
				customerEmail: (req as any).validatedValue.customerEmail,
				customerPhone: (req as any).validatedValue.customerPhone,
				staffId: (req as any).validatedValue.staffId,
				billingAddress: (req as any).validatedValue.billingAddress,
				additionalNotes: (req as any).validatedValue.additionalNotes,
				method: (req as any).validatedValue.method,
				status: (req as any).validatedValue.status,
				currentStatus: (req as any).validatedValue.currentStatus,
				deliveryMethod: (req as any).validatedValue.deliveryMethod,
				deliveryDate: (req as any).validatedValue.deliveryDate,
				paymentMethod: (req as any).validatedValue.paymentMethod,
				paymentStatus: (req as any).validatedValue.paymentStatus,
				orderItems: (req as any).validatedValue.orderItems,
				payments: (req as any).validatedValue.payments,
			};

			if (
				(req as any).validatedValue.courierId &&
				!(req as any).validatedValue.courierAddress
			) {
				return responseSender(res, 400, "Courier address is required");
			} else if (
				!(req as any).validatedValue.courierId &&
				(req as any).validatedValue.courierAddress
			) {
				return responseSender(res, 400, "Courier id is required");
			}

			if ((req as any).validatedValue.couponId) {
				(newOrder as any).couponId = (
					req as any
				).validatedValue.couponId;
			}
			if (
				(req as any).validatedValue.courierId &&
				(req as any).validatedValue.courierAddress
			) {
				(newOrder as any).courierId = (
					req as any
				).validatedValue.courierId;
				(newOrder as any).courierAddress = (
					req as any
				).validatedValue.courierAddress;
			}

			// const createdOrder = await this.orderService.createOrder(
			// 	newOrder.customerId,
			// 	newOrder.customerName,
			// 	newOrder.customerEmail,
			// 	newOrder.customerPhone,
			// 	newOrder.staffId,
			// 	newOrder.billingAddress,
			// 	newOrder.additionalNotes,
			// 	newOrder.method,
			// 	newOrder.status,
			// 	newOrder.currentStatus,
			// 	newOrder.deliveryMethod,
			// 	newOrder.deliveryDate,
			// 	newOrder.paymentStatus,
			// 	(newOrder as any)?.couponId || null,
			// 	(newOrder as any)?.courierId || null,
			// 	(newOrder as any)?.courierAddress || null,
			// 	newOrder.orderItems,
			// 	newOrder.payments,
			// );

			// if (!createdOrder) {
			// 	return responseSender(
			// 		res,
			// 		500,
			// 		"Order creation failed. Please try again.",
			// 	);
			// }
			// return responseSender(res, 201, "Order created successfully.", {
			// 	order: createdOrder,
			// });
		} catch (err: any) {
			console.log(err);
			console.log(
				"Error occured while creating order: ".red,
				err.message,
			);
			next(err);
		}
	};

	createOrderRequest = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			if ((req as any).fileValidationError) {
				return responseSender(
					res,
					400,
					(req as any).fileValidationError,
				);
			}

			const newOrder = {
				customerId: (req as any).validatedValue.customerId,
				customerName: (req as any).validatedValue.customerName,
				customerPhone: (req as any).validatedValue.customerPhone,
				staffId: (req as any).validatedValue.staffId,
				billingAddress: (req as any).validatedValue.billingAddress,
				additionalNotes: (req as any).validatedValue.additionalNotes,
				deliveryMethod: (req as any).validatedValue.deliveryMethod,
				paymentMethod: (req as any).validatedValue.paymentMethod,
				orderItems: JSON.parse((req as any).validatedValue.orderItems),
			};

			if (req.files && (req.files as Express.Multer.File[]).length > 0) {
				(newOrder as any).images = req.files;
			}

			if (
				(req as any).validatedValue.courierId &&
				!(req as any).validatedValue.courierAddress
			) {
				return responseSender(res, 400, "Courier address is required");
			} else if (
				!(req as any).validatedValue.courierId &&
				(req as any).validatedValue.courierAddress
			) {
				return responseSender(res, 400, "Courier id is required");
			}

			if ((req as any).validatedValue.couponId) {
				(newOrder as any).couponId = (
					req as any
				).validatedValue.couponId;
			}
			if (
				(req as any).validatedValue.courierId &&
				(req as any).validatedValue.courierAddress
			) {
				(newOrder as any).courierId = (
					req as any
				).validatedValue.courierId;
				(newOrder as any).courierAddress = (
					req as any
				).validatedValue.courierAddress;
			}

			const createdOrder = await this.orderService.createOrderRequest(
				newOrder.customerId,
				newOrder.customerName,
				newOrder.customerPhone,
				newOrder.staffId,
				newOrder.billingAddress,
				newOrder.additionalNotes,
				newOrder.deliveryMethod,
				newOrder.paymentMethod,
				(newOrder as any)?.couponId || null,
				(newOrder as any)?.courierId || null,
				(newOrder as any)?.courierAddress || null,
				newOrder.orderItems,
				// newOrder.payments,
			);

			if (!createdOrder) {
				return responseSender(
					res,
					500,
					"Order request creation failed. Please try again.",
				);
			}

			if ((newOrder as any).images?.length > 0) {
				for (const image of (newOrder as any).images) {
					await this.orderService.addOrderImage(
						image.filename,
						createdOrder.orderId,
					);
				}
			}

			await this.cartService.clearCartItems(newOrder.customerId);

			// emit the create order request event
			io.emit("create-order-request", { order: createdOrder });

			return responseSender(
				res,
				201,
				"Order request created successfully.",
				{
					order: createdOrder,
				},
			);
		} catch (err: any) {
			// cleanup process if database operation failed
			if (req.files && Array.isArray(req.files)) {
				req.files.forEach((file) => {
					const filePath = path.join(file.destination, file.filename);

					fs.unlink(filePath, (unlinkErr) => {
						if (unlinkErr) {
							console.log(
								"Error deleting uploaded file: ".red,
								unlinkErr.message,
							);
						}
					});
				});
			}

			console.log(
				"Error occured while creating order request: ".red,
				err.message,
			);
			next(err);
		}
	};

	updateOrder = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const newOrder = {
				orderId: (req as any).validatedValue.orderId,
				deliveryDate: (req as any).validatedValue.deliveryDate,
				status: (req as any).validatedValue.status,
				courierAddress: (req as any).validatedValue.courierAddress,
				additionalNotes: (req as any).validatedValue.additionalNotes,
			};

			const updatedOrder = await this.orderService.updateOrder(
				newOrder.orderId,
				newOrder.deliveryDate,
				newOrder.status,
				newOrder.courierAddress,
				newOrder.additionalNotes,
			);

			if (!updatedOrder) {
				return responseSender(
					res,
					500,
					"Order update failed. Please try again.",
				);
			}

			return responseSender(res, 200, "Order updated successfully.");
		} catch (err: any) {
			console.log(
				"Error occured while updating order: ".red,
				err.message,
			);
			next(err);
		}
	};

	createOrderPayment = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const newPayment = {
				orderId: (req as any).validatedValue.orderId,
				amount: (req as any).validatedValue.amount,
				paymentMethod: (req as any).validatedValue.paymentMethod,
				customerName: (req as any).validatedValue.customerName,
				customerEmail: (req as any).validatedValue.customerEmail,
				customerPhone: (req as any).validatedValue.customerPhone,
			};

			if (newPayment.paymentMethod === "cod-payment") {
				const createdPayment =
					await this.paymentService.createCashPayment(
						newPayment.orderId,
						newPayment.amount,
					);

				if (!createdPayment) {
					return responseSender(
						res,
						500,
						"Order payment request creation failed. Please try again.",
					);
				}

				// update the order status
				const order = await this.orderService.getOrderById(
					newPayment.orderId,
				);
				if (!order) {
					return responseSender(
						res,
						500,
						"Order not found. Please try again.",
					);
				}

				const totalPaidAmount = order.payments.reduce((acc, curr) => {
					if (curr.isPaid) return acc + curr.amount;
					return acc;
				}, 0);

				const isOrderStatusUpdated =
					await this.orderService.updateOrderPaymentStatus(
						newPayment.orderId,
						totalPaidAmount === order.orderTotalPrice
							? "paid"
							: "partial",
					);

				if (!isOrderStatusUpdated) {
					return responseSender(
						res,
						500,
						"Order status update failed. Please try again.",
					);
				}

				return responseSender(
					res,
					201,
					"Order payment request created successfully.",
					{
						...createdPayment,
					},
				);
			}

			const createdPayment =
				await this.paymentService.createOnlinePayment(
					newPayment.orderId,
					newPayment.amount,
					newPayment.customerName,
					newPayment.customerEmail,
					newPayment.customerPhone,
				);

			if (!createdPayment) {
				return responseSender(
					res,
					500,
					"Order payment request creation failed. Please try again.",
				);
			}

			return responseSender(
				res,
				201,
				"Order payment request created successfully.",
				{
					...createdPayment,
				},
			);
		} catch (err: any) {
			console.log(
				"Error occured while creating order payment: ".red,
				err.message,
			);
			next(err);
		}
	};

	paymentSuccess = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const transactionId = req.body.tran_id;
			const payment =
				await this.paymentService.getPaymentByTransactionId(
					transactionId,
				);

			if (!payment) {
				return responseSender(
					res,
					500,
					"Payment not found. Please try again.",
				);
			}
			const orderId = payment.orderId;
			const valId = req.body.val_id;
			const amount = req.body.amount;
			const storeAmount = req.body.store_amount;
			const cardType = req.body.card_type;
			const bankTransactionId = req.body.bank_tran_id;
			const status = req.body.status;
			const transactionDate = req.body.tran_date;
			const currency = req.body.currency;
			const cardIssuer = req.body.card_issuer;
			const cardBrand = req.body.card_brand;

			// create a transaction
			const transaction = await this.transactionService.createTransaction(
				transactionId,
				orderId,
				valId,
				amount,
				storeAmount,
				cardType,
				bankTransactionId,
				status,
				transactionDate,
				currency,
				cardIssuer,
				cardBrand,
			);

			// update the order payment status
			const isPaymentStatusUpdated =
				await this.paymentService.updatePaymentStatus(
					transactionId,
					true,
				);

			if (!isPaymentStatusUpdated) {
				return responseSender(
					res,
					500,
					"Payment status update failed. Please try again.",
				);
			}

			// update the order status
			const order = await this.orderService.getOrderById(orderId);
			if (!order) {
				return responseSender(
					res,
					500,
					"Order not found. Please try again.",
				);
			}

			const totalPaidAmount = order.payments.reduce((acc, curr) => {
				if (curr.isPaid) return acc + curr.amount;
				return acc;
			}, 0);

			const isOrderStatusUpdated =
				await this.orderService.updateOrderPaymentStatus(
					orderId,
					totalPaidAmount === order.orderTotalPrice
						? "paid"
						: "partial",
				);

			if (!isOrderStatusUpdated) {
				return responseSender(
					res,
					500,
					"Order status update failed. Please try again.",
				);
			}

			if (!transaction) {
				return res.redirect(`${frontendLandingPageUrl}/failed-payment`);
			}

			return res.redirect(
				`${frontendLandingPageUrl}/success-payment?transaction=${JSON.stringify(transaction)}`,
			);
		} catch (err: any) {
			console.log(
				"Error occured while payment success: ".red,
				err.message,
			);
			next(err);
		}
	};

	paymentFail = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const transactionId = req.body.tran_id;
			const order =
				await this.paymentService.getPaymentByTransactionId(
					transactionId,
				);

			if (!order) {
				return responseSender(
					res,
					500,
					"Order not found. Please try again.",
				);
			}

			// update the order payment status
			const isPaymentStatusUpdated =
				await this.paymentService.updatePaymentStatus(
					transactionId,
					false,
				);

			if (!isPaymentStatusUpdated) {
				return res.redirect(`${frontendLandingPageUrl}/failed-payment`);
			}

			return res.redirect(`${frontendLandingPageUrl}/failed-payment`);
		} catch (err: any) {
			console.log("Error occured while payment fail: ".red, err.message);
			next(err);
		}
	};

	paymentCancel = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const transactionId = req.body.tran_id;
			const order =
				await this.paymentService.getPaymentByTransactionId(
					transactionId,
				);

			if (!order) {
				return responseSender(
					res,
					500,
					"Order not found. Please try again.",
				);
			}

			// update the order payment status
			const isPaymentStatusUpdated =
				await this.paymentService.updatePaymentStatus(
					transactionId,
					false,
				);

			if (!isPaymentStatusUpdated) {
				return res.redirect(`${frontendLandingPageUrl}/failed-payment`);
			}

			return res.redirect(`${frontendLandingPageUrl}/failed-payment`);
		} catch (err: any) {
			console.log(
				"Error occured while payment cancel: ".red,
				err.message,
			);
			next(err);
		}
	};

	getOrdersByCustomer = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const customerId = (req as any).validatedValue.customerId;
			// const searchTerm = (req as any).validatedValue.searchTerm;
			// const currentPage = parseInt((req as any).validatedValue.page || 1);
			// const limitPerPage = parseInt(
			// 	(req as any).validatedValue.limit || 20,
			// );
			// const offset = (currentPage - 1) * limitPerPage;
			// const order: Order = [["createdAt", "DESC"]];
			// const filter: WhereOptions<OrderAttributes> = {};
			if (!customerId) {
				return responseSender(res, 500, "Please provide customerId.");
			}

			const orders =
				await this.orderService.getOrdersByCustomer(customerId);
			if (!orders) {
				return responseSender(
					res,
					400,
					"Failed to get orders. Please try again.",
				);
			}
			return responseSender(res, 200, "Orders fetched successfully.", {
				orders,
			});
		} catch (err: any) {
			console.log(
				"Error occured while fetching order: ".red,
				err.message,
			);
			next(err);
		}
	};

	getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const searchTerm = (req as any).validatedValue.searchTerm;
			const searchBy = (req as any).validatedValue.searchBy || "order-id";
			const filteredBy = (req as any).validatedValue.filteredBy || "all";
			const currentPage = parseInt((req as any).validatedValue.page || 1);
			const limitPerPage = parseInt(
				(req as any).validatedValue.limit || 20,
			);
			const offset = (currentPage - 1) * limitPerPage;
			const order: Order = [["createdAt", "DESC"]];
			const filter: WhereOptions<OrderAttributes> = {};

			const author = (req as any).admin || (req as any).staff;

			if (author?.staffId) {
				filter.staffId = author.staffId;
			}

			if (filteredBy === "active") {
				filter.status = [
					"consultation-in-progress",
					"awaiting-advance-payment",
					"advance-payment-received",
					"design-in-progress",
					"awaiting-design-approval",
					"production-started",
					"production-in-progress",
					"ready-for-delivery",
					"out-for-delivery",
				];
			} else if (filteredBy === "requested") {
				filter.status = "order-request-received";
			} else if (filteredBy === "completed") {
				filter.status = "order-completed";
			} else if (filteredBy === "cancelled") {
				filter.status = "order-canceled";
			}

			if (searchTerm && searchBy) {
				switch (searchBy) {
					case "order-id":
						filter.orderId = {
							[Op.like]: searchTerm,
						};
						break;
					case "customer-name":
						filter.customerName = {
							[Op.like]: `%${searchTerm}%`,
						};
						break;
					case "customer-phone":
						filter.customerPhone = {
							[Op.like]: `%${searchTerm}%`,
						};
						break;
					case "customer-email":
						filter.customerEmail = {
							[Op.like]: `%${searchTerm}%`,
						};
						break;
					default:
						break;
				}
			}

			const orders = await this.orderService.getAllOrders(
				filter,
				limitPerPage,
				offset,
				order,
			);
			if (!orders.rows) {
				return responseSender(
					res,
					400,
					"Failed to get orders. Please try again.",
				);
			}
			return responseSender(res, 200, "Orders fetched successfully.", {
				orders: orders.rows,
				total: orders.count,
				totalPages: Math.ceil(orders.count / limitPerPage),
				currentPage,
			});
		} catch (err: any) {
			console.log(
				"Error occured while fetching order: ".red,
				err.message,
			);
			next(err);
		}
	};
}

export default OrderController;
