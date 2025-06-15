import { Request, Response, NextFunction } from "express";
import { responseSender } from "../util";
import TestimonialService from "../service/testimonial.service";

class TestimonialController {
	private testimonialService: TestimonialService;

	constructor() {
		this.testimonialService = new TestimonialService();
	}

	addTestimonial = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const newTestimonial = {
				title: (req as any).validatedValue.title,
				description: (req as any).validatedValue.description,
			};
			const createdTestimonial =
				await this.testimonialService.addTestimonial(
					newTestimonial.title,
					newTestimonial.description,
				);

			if (!createdTestimonial) {
				return responseSender(
					res,
					400,
					"Testimonial could not be created",
				);
			}

			return responseSender(
				res,
				201,
				"Testimonial created successfully.",
				{
					testimonial: createdTestimonial,
				},
			);
		} catch (err: any) {
			console.log(
				"Error occured while creating testimonial: ".red,
				err.message,
			);
			next(err);
		}
	};

	editTestimonial = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const editedTestimonial = {
				testimonialId: (req as any).validatedValue.testimonialId,
				title: (req as any).validatedValue.title,
				description: (req as any).validatedValue.description,
			};

			const isTestimonialExist =
				await this.testimonialService.getTestimonialById(
					editedTestimonial.testimonialId,
				);
			if (!isTestimonialExist) {
				return responseSender(res, 400, "Testimonial does not exist");
			}

			const isEditedTestimonial =
				await this.testimonialService.editTestimonial(
					editedTestimonial.testimonialId,
					editedTestimonial.title,
					editedTestimonial.description,
				);

			if (!isEditedTestimonial) {
				return responseSender(
					res,
					400,
					"Testimonial could not be edited",
				);
			}

			return responseSender(res, 200, "Testimonial edited successfully.");
		} catch (err: any) {
			console.log(
				"Error occured while creating testimonial: ".red,
				err.message,
			);
			next(err);
		}
	};

	deleteTestimonial = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const testimonialId = (req as any).params.testimonialId;

			const isTestimonialExist =
				await this.testimonialService.getTestimonialById(testimonialId);

			if (!isTestimonialExist) {
				return responseSender(res, 404, "Testimonial not found.");
			}

			const isDeleted =
				await this.testimonialService.deleteTestimonial(testimonialId);

			if (!isDeleted) {
				return responseSender(
					res,
					500,
					"Testimonial deletion failed. Please try again.",
				);
			}

			return responseSender(
				res,
				200,
				"Testimonial deleted successfully.",
			);
		} catch (err: any) {
			console.log(
				"Error occures while deleting testimonial: ".red,
				err.message,
			);
			next(err);
		}
	};

	getAllTestimonials = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const testimonials =
				await this.testimonialService.getAllTestimonials();
			if (!testimonials) {
				return responseSender(
					res,
					400,
					"Failed to get testimonials. Please try again.",
				);
			}
			return responseSender(
				res,
				200,
				"Testimonials fetched successfully.",
				{
					testimonials,
				},
			);
		} catch (err: any) {
			console.log(
				"Error occured while fetching testimonials: ".red,
				err.message,
			);
			next(err);
		}
	};
}

export default TestimonialController;
