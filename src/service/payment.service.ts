import axios from "axios";
import {
	sslCommerzSandbox,
	sslCommerzStoreId,
	sslCommerzStorePassword,
} from "../config/dotenv.config";
import Payment, { PaymentAttributes } from "../model/payment.model";
import { generateTransactionId } from "../util";
import { Op } from "sequelize";

class PaymentService {
	private SSLCommerzConfig: {
		store_id: string;
		store_passwd: string;
		sandbox: boolean;
	};

	private BASE_URL: string;

	constructor() {
		this.SSLCommerzConfig = {
			store_id: sslCommerzStoreId,
			store_passwd: sslCommerzStorePassword,
			sandbox: sslCommerzSandbox === "true",
		};

		this.BASE_URL = this.SSLCommerzConfig.sandbox
			? "https://sandbox.sslcommerz.com"
			: "https://securepay.sslcommerz.com";
	}

	createCashPayment = async (
		orderId: number,
		amount: number,
	): Promise<Payment | PaymentAttributes | null> => {
		try {
			const transactionId = await this.generateUniqueTransactionId();

			const createdPayment = await Payment.create({
				transactionId,
				orderId,
				paymentMethod: "cod-payment",
				amount,
				isPaid: true,
				paymentLink: null,
			});

			return createdPayment.toJSON();
		} catch (err: any) {
			console.log(
				"Error occurred while creating online order payment: ".red,
				err.message,
			);
			throw err;
		}
	};

	createOnlinePayment = async (
		orderId: number,
		amount: number,
		customerName: string,
		customerEmail: string,
		customerPhone: string,
	): Promise<Payment | PaymentAttributes | null> => {
		try {
			const transactionId = await this.generateUniqueTransactionId();

			const paymentData = {
				store_id: this.SSLCommerzConfig.store_id,
				store_passwd: this.SSLCommerzConfig.store_passwd,
				total_amount: amount.toString(),
				currency: "BDT",
				tran_id: transactionId,
				success_url: "http://localhost:4000/api/order/payment/success",
				fail_url: "http://localhost:4000/api/order/payment/fail",
				cancel_url: "http://localhost:4000/api/order/payment/cancel",
				cus_name: customerName,
				cus_email: customerEmail,
				cus_phone: customerPhone,
				cus_add1: "N/A", // Optional
				cus_city: "N/A", // Optional
				cus_country: "N/A", // Optional
				shipping_method: "NO", // Optional
				product_name: "N/A", // Optional
				product_category: "N/A", // Optional
				product_profile: "general", // Optional
			};

			const response = await axios.post(
				`${this.BASE_URL}/gwprocess/v4/api.php`,
				paymentData,
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				},
			);

			if (response.data.status === "SUCCESS") {
				const createdPayment = await Payment.create({
					transactionId,
					orderId,
					paymentMethod: "online-payment",
					amount,
					isPaid: false,
					paymentLink: response.data.GatewayPageURL,
				});

				return createdPayment.toJSON();
			}

			return null;
		} catch (err: any) {
			console.log(
				"Error occurred while creating online order payment: ".red,
				err.message,
			);
			throw err;
		}
	};

	getPaymentByTransactionId = async (
		transactionId: string,
	): Promise<Payment | null> => {
		try {
			const payment = await Payment.findOne({ where: { transactionId } });
			return payment;
		} catch (err: any) {
			console.log(
				"Error occurred while fetching payment by transaction id: ".red,
				err.message,
			);
			throw err;
		}
	};

	updatePaymentStatus = async (
		transactionId: number,
		isPaid: boolean,
	): Promise<boolean> => {
		try {
			const payment = await Payment.update(
				{ isPaid },
				{ where: { transactionId } },
			);

			if (!payment) {
				return false;
			}

			return true;
		} catch (err: any) {
			console.log(
				"Error occurred while updating payment status: ".red,
				err.message,
			);
			throw err;
		}
	};

	generateUniqueTransactionId = async (): Promise<string> => {
		let transactionId: string;
		let exists: Payment | null;

		do {
			transactionId = generateTransactionId(true);
			exists = await Payment.findOne({ where: { transactionId } });
		} while (exists);

		return transactionId;
	};

	static cleanupUnpaidPayments = async () => {
		try {
			await Payment.destroy({
				where: {
					createdAt: {
						[Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000),
					},
					isPaid: false,
				},
			});
			console.log("Unpaid payments cleaned up successfully.".green);
		} catch (error) {
			console.log("Error cleaning up unpaid payments: ".red, error);
		}
	};
}

export default PaymentService;
