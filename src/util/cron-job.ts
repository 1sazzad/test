import cron from "node-cron";
import OtpService from "../service/otp.service";
import CouponService from "../service/coupon.service";
import CartService from "../service/cart.service";
import PaymentService from "../service/payment.service";

// Schedule the cleanup function to run on the 1st day of every month at midnight
cron.schedule(
	"0 0 1 * *",
	() => {
		console.log("[CRON JOB] Running monthly OTP cleanup job...");
		OtpService.cleanupExpiredOtps();
	},
	{
		timezone: "Asia/Dhaka",
	},
);

// Schedule the job to run every day at midnight (00:00)
cron.schedule(
	"0 0 * * *",
	async () => {
		console.log(
			"[CRON JOB] Running expired coupon active status update job...",
		);
		CouponService.expireCoupons();
	},
	{
		timezone: "Asia/Dhaka",
	},
);

// Schedule the job to run every day at midnight (00:00)
cron.schedule(
	"0 0 * * *",
	async () => {
		console.log("[CRON JOB] Running cleaning up cart items...");
		CartService.cleanupCartItems();
	},
	{
		timezone: "Asia/Dhaka",
	},
);

// Schedule the job to run every day at midnight (00:00)
cron.schedule(
	"0 0 * * *",
	async () => {
		console.log("[CRON JOB] Running cleaning up unpaid payments...");
		PaymentService.cleanupUnpaidPayments();
	},
	{
		timezone: "Asia/Dhaka",
	},
);
