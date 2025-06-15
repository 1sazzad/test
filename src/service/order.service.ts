import Order, {
	OrderAttributes,
	OrderCreationAttributes,
} from "../model/order.model";
import StaffService from "../service/staff.service";
import OrderItem from "../model/order-item.model";
import PaymentDetails from "../model/payment.model";
import { WhereOptions, Order as SequelizeOrder } from "sequelize";
import Product from "../model/product.model";
import ProductVariant from "../model/product-variant.model";
import OrderImage from "../model/order-image.model";
import ProductVariantDetail from "../model/product-variant-detail.model";
import VariationItem from "../model/variation-item.model";
import Variation from "../model/variation.model";
import CustomerService from "../service/customer.service";

class OrderService {
	private staffService: StaffService;
	private customerService: CustomerService;
	constructor() {
		this.staffService = new StaffService();
		this.customerService = new CustomerService();
	}

	createOrder = async (
		customerId: number | null,
		customerName: string,
		customerEmail: string,
		customerPhone: string,
		staffId: number | null,
		billingAddress: string,
		additionalNotes: string,
		method: "online" | "offline",
		status:
			| "order-request-received"
			| "consultation-in-progress"
			| "order-canceled"
			| "awaiting-advance-payment"
			| "advance-payment-received"
			| "design-in-progress"
			| "awaiting-design-approval"
			| "production-started"
			| "production-in-progress"
			| "ready-for-delivery"
			| "out-for-delivery"
			| "order-completed",
		currentStatus: string,
		deliveryMethod: "shop-pickup" | "courier",
		deliveryDate: Date | null,
		paymentMethod: "online-payment" | "cod-payment",
		paymentStatus: "pending" | "partial" | "paid",
		couponId: number | null,
		courierId: number | null,
		courierAddress: string | null,
		orderItems: {
			productId: number;
			productVariantId: number;
			quantity: number;
			size: number | null;
			widthInch: number | null;
			heightInch: number | null;
			price: number;
		}[],
	): Promise<Order | OrderAttributes | null> => {
		try {
			const newOrder = {
				customerId,
				customerName,
				customerEmail,
				customerPhone,
				billingAddress,
				additionalNotes,
				staffId,
				method,
				status,
				deliveryMethod,
				paymentMethod,
				paymentStatus,
				couponId,
				courierId,
				courierAddress,
				deliveryDate,
				currentStatus,
			};

			if (customerId) {
				const customer =
					await this.customerService.getCustomerById(customerId);

				if (customer) {
					newOrder.customerId = customer.customerId;
					newOrder.customerName = customer.name;
					newOrder.customerEmail = customer.email;
					newOrder.customerPhone = customer.phone;
				} else {
					newOrder.customerId = null;
				}
			}

			if (!courierId || !courierAddress) {
				newOrder.courierId = null;
				newOrder.courierAddress = null;
			}

			if (!staffId) {
				const randomStaff = await this.staffService.getRandomStaff();
				if (randomStaff) {
					newOrder.staffId = randomStaff.staffId;
				}
			}

			const createdOrder = await Order.create({
				customerId: newOrder.customerId,
				customerName: newOrder.customerName,
				customerEmail: newOrder.customerEmail,
				customerPhone: newOrder.customerPhone,
				billingAddress: newOrder.billingAddress,
				additionalNotes: newOrder.additionalNotes,
				staffId: newOrder.staffId,
				method: newOrder.method,
				status: newOrder.status,
				deliveryMethod: newOrder.deliveryMethod,
				paymentMethod: newOrder.paymentMethod,
				paymentStatus: newOrder.paymentStatus,
				couponId: newOrder.couponId,
				courierId: newOrder.courierId,
				courierAddress: newOrder.courierAddress,
				deliveryDate: newOrder.deliveryDate,
				currentStatus: newOrder.currentStatus,
				orderTotalPrice: orderItems.reduce((acc, curr) => {
					return acc + curr.price;
				}, 0),
			});

			if (orderItems.length > 0) {
				await OrderItem.bulkCreate(
					orderItems.map((orderItem) => ({
						...orderItem,
						orderId: createdOrder.orderId,
					})),
				);
			}

			// if (payments.length > 0) {
			// 	await PaymentDetails.bulkCreate(
			// 		payments.map((payments) => ({
			// 			...payments,
			// 			orderId: createdOrder.orderId,
			// 		})),
			// 	);
			// }

			// const createdOrder = await this.getOrderById(newOrder.orderId);
			return (await this.getOrderById(createdOrder.orderId)) || null;
		} catch (err: any) {
			console.log(
				"Error occurred while creating order: ".red,
				err.message,
			);
			throw err;
		}
	};

	createOrderRequest = async (
		customerId: number | null,
		customerName: string,
		customerPhone: string,
		staffId: number | null,
		billingAddress: string,
		additionalNotes: string,
		deliveryMethod: "shop-pickup" | "courier",
		paymentMethod: "online-payment" | "cod-payment",
		couponId: number | null,
		courierId: number | null,
		courierAddress: string | null,
		orderItems: {
			productId: number;
			productVariantId: number;
			quantity: number;
			size: number | null;
			widthInch: number | null;
			heightInch: number | null;
			price: number;
		}[],
	): Promise<Order | OrderAttributes | null> => {
		try {
			const newOrder = {
				customerId,
				customerName,
				customerPhone,
				billingAddress,
				additionalNotes,
				staffId,
				method: "online",
				status: "order-request-received",
				deliveryMethod,
				paymentMethod,
				paymentStatus: "pending",
				couponId,
				courierId,
				courierAddress,
				deliveryDate: null,
				currentStatus: "",
			};

			if (customerId) {
				const customer =
					await this.customerService.getCustomerById(customerId);

				if (customer) {
					newOrder.customerId = customer.customerId;
					(newOrder as any).customerEmail = customer.email;
				} else {
					newOrder.customerId = null;
				}
			}

			if (!courierId || !courierAddress) {
				newOrder.courierId = null;
				newOrder.courierAddress = null;
			}

			if (!staffId) {
				const randomStaff = await this.staffService.getRandomStaff();
				if (randomStaff) {
					newOrder.staffId = randomStaff.staffId;
				}
			}

			const createdOrder = await Order.create({
				customerId: newOrder.customerId,
				customerName: newOrder.customerName,
				customerEmail: (newOrder as any).customerEmail,
				customerPhone: newOrder.customerPhone,
				billingAddress: newOrder.billingAddress,
				additionalNotes: newOrder.additionalNotes,
				staffId: newOrder.staffId,
				method: newOrder.method as any,
				status: newOrder.status as any,
				deliveryMethod: newOrder.deliveryMethod,
				paymentMethod: newOrder.paymentMethod,
				paymentStatus: newOrder.paymentStatus as any,
				couponId: newOrder.couponId,
				courierId: newOrder.courierId,
				courierAddress: newOrder.courierAddress,
				deliveryDate: newOrder.deliveryDate,
				currentStatus: newOrder.currentStatus,
				orderTotalPrice: orderItems.reduce((acc, curr) => {
					return acc + curr.price;
				}, 0),
			});

			if (orderItems.length > 0) {
				await OrderItem.bulkCreate(
					orderItems.map((orderItem) => ({
						...orderItem,
						orderId: createdOrder.orderId,
					})),
				);
			}

			// const createdOrder = await this.getOrderById(newOrder.orderId);
			return (await this.getOrderById(createdOrder.orderId)) || null;
		} catch (err: any) {
			console.log(
				"Error occurred while creating order: ".red,
				err.message,
			);
			throw err;
		}
	};

	getOrderById = async (
		orderId: number,
	): Promise<Order | OrderAttributes | null> => {
		try {
			const order = await Order.findByPk(orderId, {
				include: [
					{
						model: OrderItem,
						as: "orderItems",
						separate: true,
						include: [
							{
								model: Product,
								as: "product",
								attributes: [
									"productId",
									"name",
									"basePrice",
									"sku",
								],
							},
							{
								model: ProductVariant,
								as: "productVariant",
								attributes: [
									"productVariantId",
									"productId",
									"additionalPrice",
								],
								include: [
									{
										model: ProductVariantDetail,
										as: "variantDetails",
										attributes: [
											"productVariantDetailId",
											"productVariantId",
											"variationItemId",
										],
										separate: true,
										include: [
											{
												model: VariationItem,
												attributes: ["value"],
												include: [
													{
														model: Variation,
														as: "variation",
														attributes: [
															"name",
															"unit",
														],
													},
												],
											},
										],
									},
								],
							},
						],
					},
					{ model: OrderImage, as: "images", separate: true },
					{ model: PaymentDetails, as: "payments", separate: true },
				],
			});

			return order ? order.toJSON() : null;
		} catch (err: any) {
			console.log(
				"Error occurred while fetching order by id: ".red,
				err.message,
			);
			throw err;
		}
	};

	getOrdersByCustomer = async (
		customerId: number,
	): Promise<Order[] | OrderAttributes[] | null> => {
		try {
			const orders = await Order.findAll({
				where: { customerId },
				include: [
					{
						model: OrderItem,
						as: "orderItems",
						separate: true,
						include: [
							{
								model: Product,
								as: "product",
								attributes: [
									"productId",
									"name",
									"basePrice",
									"sku",
								],
							},
							{
								model: ProductVariant,
								as: "productVariant",
								attributes: [
									"productVariantId",
									"productId",
									"additionalPrice",
								],
								include: [
									{
										model: ProductVariantDetail,
										as: "variantDetails",
										attributes: [
											"productVariantDetailId",
											"productVariantId",
											"variationItemId",
										],
										separate: true,
										include: [
											{
												model: VariationItem,
												attributes: ["value"],
												include: [
													{
														model: Variation,
														as: "variation",
														attributes: [
															"name",
															"unit",
														],
													},
												],
											},
										],
									},
								],
							},
						],
					},
					{ model: OrderImage, as: "images", separate: true },
					{
						model: PaymentDetails,
						as: "payments",
						separate: true,
					},
				],
			});

			return orders ? orders.map((order) => order.toJSON()) : null;
		} catch (err: any) {
			console.log(
				"Error occurred while fetching order by id: ".red,
				err.message,
			);
			throw err;
		}
	};

	addOrderImage = async (
		imageName: string,
		orderId: number,
	): Promise<boolean> => {
		try {
			await OrderImage.create({ imageName, orderId });
			return true;
		} catch (err: any) {
			console.log(
				"Error occurred while adding order image: ",
				err.message,
			);
			throw err;
		}
	};

	updateOrder = async (
		orderId: number,
		deliveryDate: Date | null,
		status:
			| "order-request-received"
			| "consultation-in-progress"
			| "order-canceled"
			| "awaiting-advance-payment"
			| "advance-payment-received"
			| "design-in-progress"
			| "awaiting-design-approval"
			| "production-started"
			| "production-in-progress"
			| "ready-for-delivery"
			| "out-for-delivery"
			| "order-completed",
		courierAddress: string | null,
		additionalNotes: string,
	): Promise<boolean> => {
		try {
			const orderToUpdate = await Order.update(
				{
					deliveryDate,
					status,
					courierAddress,
					additionalNotes,
				},
				{
					where: { orderId },
				},
			);

			if (!orderToUpdate) {
				return false;
			}

			return true;
		} catch (err: any) {
			console.log("Error occurred while updating order: ", err.message);
			throw err;
		}
	};

	updateOrderPaymentStatus = async (
		orderId: number,
		paymentStatus: "pending" | "partial" | "paid",
	): Promise<boolean> => {
		try {
			const order = await Order.update(
				{ paymentStatus },
				{ where: { orderId } },
			);

			if (!order) {
				return false;
			}

			return true;
		} catch (err: any) {
			console.log(
				"Error occurred while updating order payment status: ".red,
				err.message,
			);
			throw err;
		}
	};

	// updateOrder = async (
	// 	statusId: number,
	// 	orderItems: OrderItemCreationAttributes[],
	// 	payments: PaymentDetailsCreationAttributes[],
	// ): Promise<boolean> => {
	// 	try {

	// 		const [updatedRows] = await Product.update(updateData, {
	// 			where: { productId },
	// 		});
	// 		return updatedRows > 0;
	// 	} catch (err: any) {
	// 		console.log(
	// 			"Error occurred while updating product: ".red,
	// 			err.message,
	// 		);
	// 		throw err;
	// 	}
	// };

	// deleteOrder = async (productId: number): Promise<boolean> => {
	// 	try {
	// 		const product = await Product.findByPk(productId);
	// 		if (product) {
	// 			await product.destroy();
	// 			return true;
	// 		}
	// 		return false;
	// 	} catch (err: any) {
	// 		console.log(
	// 			"Error occurred while deleting product: ".red,
	// 			err.message,
	// 		);
	// 		throw err;
	// 	}
	// };

	getAllOrders = async (
		filter: WhereOptions<OrderAttributes>,
		limit: number,
		offset: number,
		order: SequelizeOrder,
	): Promise<{
		rows: Order[] | OrderAttributes[];
		count: number;
	}> => {
		try {
			const orders = await Order.findAll({
				where: filter,
				limit,
				offset,
				order,
				subQuery: false,
				include: [
					{
						model: OrderItem,
						as: "orderItems",
						separate: true,
						include: [
							{
								model: Product,
								as: "product",
								attributes: [
									"productId",
									"name",
									"basePrice",
									"sku",
								],
							},
							{
								model: ProductVariant,
								as: "productVariant",
								attributes: [
									"productVariantId",
									"productId",
									"additionalPrice",
								],
								include: [
									{
										model: ProductVariantDetail,
										as: "variantDetails",
										attributes: [
											"productVariantDetailId",
											"productVariantId",
											"variationItemId",
										],
										separate: true,
										include: [
											{
												model: VariationItem,
												attributes: ["value"],
												include: [
													{
														model: Variation,
														as: "variation",
														attributes: [
															"name",
															"unit",
														],
													},
												],
											},
										],
									},
								],
							},
						],
					},
					{ model: OrderImage, as: "images", separate: true },
					{ model: PaymentDetails, as: "payments", separate: true },
				],
			});

			// Get total count separately
			const count = await Order.count({ where: filter });

			return {
				rows: orders.map((order) => order.toJSON()),
				count,
			};
		} catch (err: any) {
			console.log(
				"Error occurred while fetching orders: ".red,
				err.message,
			);
			throw err;
		}
	};
}

export default OrderService;
