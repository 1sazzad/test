import Staff, { StaffAttributes } from "../model/staff.model";
import { io } from "../server";
import { Order, WhereOptions } from "sequelize";

class StaffService {
	registerStaff = async (
		name: string,
		email: string,
		phone: string,
		password: string,
		role: "agent" | "designer",
		commissionPercentage: number,
		designCharge?: number,
	): Promise<Staff | StaffAttributes | null> => {
		try {
			const staff = await Staff.create({
				name,
				email,
				phone,
				password,
				role,
				commissionPercentage,
				designCharge,
				balance: 0,
			});
			const createdStaff = await Staff.findByPk(staff.staffId);
			if (createdStaff) {
				return createdStaff.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while creating staff: ".red,
				err.message,
			);
			throw err;
		}
	};

	uploadStaffAvatar = async (
		staffId: number,
		avatarPath: string,
	): Promise<boolean> => {
		try {
			const staff = await Staff.findOne({ where: { staffId: staffId } });
			if (staff) {
				await Staff.update(
					{ avatar: avatarPath },
					{ where: { staffId } },
				);
				return true;
			}
			return false;
		} catch (err: any) {
			console.log(
				"Error occured while uploading staff avatar: ".red,
				err.message,
			);
			throw err;
		}
	};

	getStaffByEmail = async (
		email: string,
	): Promise<Staff | StaffAttributes | null> => {
		try {
			const staff = await Staff.findOne({ where: { email } });
			if (staff) {
				return staff.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while getting staff by email: ".red,
				err.message,
			);
			throw err;
		}
	};

	setStaffOnline = async (staffId: number): Promise<boolean> => {
		try {
			const staff = await Staff.findOne({ where: { staffId } });
			if (staff) {
				await Staff.update(
					{ status: "online" },
					{ where: { staffId } },
				);

				// emit the event only when the status was offline
				if (staff.status === "offline") {
					io.emit("staff-status-updated");
				}

				return true;
			}
			return false;
		} catch (err: any) {
			console.log(
				"Error occured while setting staff online: ".red,
				err.message,
			);
			throw err;
		}
	};

	setStaffOffline = async (staffId: number): Promise<boolean> => {
		try {
			const staff = await Staff.findOne({ where: { staffId } });
			if (staff) {
				await Staff.update(
					{ status: "offline" },
					{ where: { staffId } },
				);

				// emit the event only when the status was online
				if (staff.status === "online") {
					io.emit("staff-status-updated");
				}

				return true;
			}
			return false;
		} catch (err: any) {
			console.log(
				"Error occured while setting staff offline: ".red,
				err.message,
			);
			throw err;
		}
	};

	getStaffByEmailAndRole = async (
		email: string,
		role: "agent" | "designer",
	): Promise<Staff | StaffAttributes | null> => {
		try {
			const staff = await Staff.findOne({ where: { email, role } });
			if (staff) {
				return staff.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while getting staff by role: ".red,
				err.message,
			);
			throw err;
		}
	};

	getRandomStaff = async (): Promise<Staff | StaffAttributes | null> => {
		try {
			// Fetch all online staff first
			const activeStaff = await Staff.findAll({
				where: { status: "online" },
			});

			// If active staff exist, pick a random one
			if (activeStaff.length) {
				const randomIndex = Math.floor(
					Math.random() * activeStaff.length,
				);
				return activeStaff[randomIndex].toJSON();
			}

			// If no active staff, fetch all staff
			const allStaff = await Staff.findAll();

			// If no staff exist at all, return null
			if (!allStaff.length) {
				return null;
			}

			// Pick a random staff from all available staff
			const randomIndex = Math.floor(Math.random() * allStaff.length);
			return allStaff[randomIndex].toJSON();
		} catch (err: any) {
			console.log(
				"Error occurred while getting random active staff: ".red,
				err.message,
			);
			throw err;
		}
	};

	getAllStaff = async (
		filter: WhereOptions<StaffAttributes>,
		limit: number,
		offset: number,
		order: Order,
	): Promise<{ rows: Staff[] | StaffAttributes[]; count: number }> => {
		try {
			const staff = await Staff.findAndCountAll({
				where: filter,
				limit,
				offset,
				order,
			});
			return {
				rows: staff.rows.map((staffItem) => staffItem.toJSON()),
				count: staff.count,
			};
		} catch (err: any) {
			console.log(
				"Error occures while fetching all staff data. ".red,
				err.message,
			);
			throw err;
		}
	};

	updateStaff = async (
		email: string,
		name: string,
		phone: string,
		avatar: string,
		password?: string,
	): Promise<boolean> => {
		try {
			const prevTokenVersion = (await Staff.findOne({
				where: { email },
				attributes: ["tokenVersion"],
			})) || { tokenVersion: 0 };
			const isUpdated = await Staff.update(
				{
					name,
					password,
					phone,
					avatar,
					tokenVersion: prevTokenVersion.tokenVersion + 1,
				},
				{
					where: { email },
				},
			);
			if (isUpdated) {
				return true;
			}
			return false;
		} catch (err: any) {
			console.log(
				"Error occured while updating staff: ".red,
				err.message,
			);
			throw err;
		}
	};

	updateStaffProtected = async (
		name: string,
		email: string,
		phone: string,
		role: "agent" | "designer",
		commissionPercentage: number,
		designCharge?: number,
	): Promise<boolean> => {
		try {
			const prevTokenVersion = (await Staff.findOne({
				where: { email },
				attributes: ["tokenVersion"],
			})) || { tokenVersion: 0 };
			const isUpdated = await Staff.update(
				{
					name,
					phone,
					role,
					commissionPercentage,
					designCharge,
					tokenVersion: prevTokenVersion.tokenVersion + 1,
				},
				{
					where: {
						email,
					},
				},
			);
			if (isUpdated) {
				return true;
			}
			return false;
		} catch (err: any) {
			console.log(
				"Error occured while updating staff: ".red,
				err.message,
			);
			throw err;
		}
	};
}

export default StaffService;
