import { Order, WhereOptions } from "sequelize";
import Job, { JobAttributes } from "../model/job.model";

class JobService {
	createJob = async (
		title: string,
		content: string,
		jobLocation: string,
		applicationUrl: string,
	): Promise<Job | JobAttributes | null> => {
		try {
			const createdJob = await Job.create({
				title,
				content,
				jobLocation,
				applicationUrl,
			});

			return createdJob ? createdJob.toJSON() : null;
		} catch (err: any) {
			console.log("Error occured while creating job: ".red, err.message);
			throw err;
		}
	};

	editJob = async (
		jobId: number,
		title: string,
		content: string,
		jobLocation: string,
		applicationUrl: string,
	): Promise<Job | JobAttributes | null> => {
		try {
			const job = await Job.findByPk(jobId);

			if (job) {
				job.title = title;
				job.content = content;
				job.jobLocation = jobLocation;
				job.applicationUrl = applicationUrl;
				await job.save();
				return job.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while updating job by id: ".red,
				err.message,
			);
			throw err;
		}
	};

	getJobById = async (jobId: number): Promise<Job | JobAttributes | null> => {
		try {
			const job = await Job.findByPk(jobId);

			return job ? job.toJSON() : null;
		} catch (err: any) {
			console.log(
				"Error occured while getting job by id: ".red,
				err.message,
			);
			throw err;
		}
	};

	deleteJob = async (jobId: number): Promise<boolean> => {
		try {
			const job = await Job.findByPk(jobId);

			if (job) {
				await job.destroy();
				return true;
			}
			return false;
		} catch (err: any) {
			console.log("Error occured while job by id: ".red, err.message);
			throw err;
		}
	};

	getAllJobs = async (
		filter: WhereOptions<JobAttributes>,
		limit: number,
		offset: number,
		order: Order,
	): Promise<{ rows: Job[] | JobAttributes[]; count: number }> => {
		try {
			const jobs = await Job.findAndCountAll({
				where: filter,
				limit,
				offset,
				order,
			});
			return {
				rows: jobs.rows.map((job) => job.toJSON()),
				count: jobs.count,
			};
		} catch (err: any) {
			console.log("Error occured while getting jobs: ".red, err.message);
			throw err;
		}
	};
}

export default JobService;
