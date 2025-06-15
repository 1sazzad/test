import Newsletter, { NewsletterAttributes } from "../model/newsletter.model";
import { Order, WhereOptions } from "sequelize";

class NewsletterService {
	subscribe = async (
		email: string,
		verificationToken: string,
	): Promise<Newsletter | NewsletterAttributes | null> => {
		try {
			const newsletter = await Newsletter.create({
				email,
				verified: false,
				verificationToken,
			});
			const createdNewsletter = await Newsletter.findByPk(
				newsletter.newsletterId,
			);
			if (createdNewsletter) {
				return createdNewsletter.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while subscribing newsletter: ".red,
				err.message,
			);
			throw err;
		}
	};

	verifyEmail = async (
		email: string,
		verificationToken: string,
	): Promise<Newsletter | NewsletterAttributes | null> => {
		try {
			const newsletter = await Newsletter.findOne({
				where: { email, verificationToken },
			});
			if (newsletter) {
				newsletter.verified = true;
				await newsletter.save();
				return newsletter.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while verifying email: ".red,
				err.message,
			);
			throw err;
		}
	};

	unsubscribe = async (
		email: string,
		verificationToken: string,
	): Promise<boolean> => {
		try {
			const newsletter = await Newsletter.findOne({
				where: { email, verificationToken },
			});
			if (newsletter) {
				await newsletter.destroy();
				return true;
			}
			return false;
		} catch (err: any) {
			console.log(
				"Error occured while unsubscribing newsletter: ".red,
				err.message,
			);
			throw err;
		}
	};

	findByEmail = async (
		email: string,
	): Promise<Newsletter | NewsletterAttributes | null> => {
		try {
			const newsletter = await Newsletter.findOne({ where: { email } });
			if (newsletter) {
				return newsletter.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while getting newsletter by email: ".red,
				err.message,
			);
			throw err;
		}
	};

	getAll = async (
		filter: WhereOptions,
		limit: number,
		offset: number,
		order: Order,
	): Promise<{
		rows: Newsletter[] | NewsletterAttributes[];
		count: number;
	}> => {
		try {
			const newsletters = await Newsletter.findAndCountAll({
				where: filter,
				limit,
				offset,
				order,
			});
			return {
				rows: newsletters.rows.map((newsletter) => newsletter.toJSON()),
				count: newsletters.count,
			};
		} catch (err: any) {
			console.log(
				"Error occured while getting all newsletters: ".red,
				err.message,
			);
			throw err;
		}
	};

	deleteByEmail = async (email: string): Promise<boolean> => {
		try {
			const newsletter = await Newsletter.findOne({
				where: { email },
			});
			if (newsletter) {
				await newsletter.destroy();
				return true;
			}
			return false;
		} catch (err: any) {
			console.log(
				"Error occured while deleting a record from newsletter: ".red,
				err.message,
			);
			throw err;
		}
	};
}

export default NewsletterService;
