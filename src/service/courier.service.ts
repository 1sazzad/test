import { Order, WhereOptions } from "sequelize";
import Courier, { CourierAttributes } from "../model/courier.model";

class CourierService {
	addCourier = async (
		name: string,
	): Promise<Courier | CourierAttributes | null> => {
		try {
			const createdCourier = await Courier.create({
				name,
			});

			return createdCourier || null;
		} catch (err: any) {
			console.log(
				"Error occurred while creating new courier service: ".red,
				err.message,
			);
			throw err;
		}
	};

	getCourierById = async (
		courierId: number,
	): Promise<Courier | CourierAttributes | null> => {
		try {
			const courier = await Courier.findByPk(courierId);

			return courier || null;
		} catch (err: any) {
			console.log(
				"Error occured while updating courier by id: ".red,
				err.message,
			);
			throw err;
		}
	};

	editCourier = async (courierId: number, name: string): Promise<boolean> => {
		try {
			const courier = await Courier.findByPk(courierId);

			if (courier) {
				courier.name = name;
				await courier.save();
				return true;
			}
			return false;
		} catch (err: any) {
			console.log(
				"Error occured while updating courier by id: ".red,
				err.message,
			);
			throw err;
		}
	};

	deleteCourier = async (courierId: number): Promise<boolean> => {
		try {
			const courier = await Courier.findByPk(courierId);

			if (courier) {
				await courier.destroy();
				return true;
			}
			return false;
		} catch (err: any) {
			console.log(
				"Error occured while deleting courier by id: ".red,
				err.message,
			);
			throw err;
		}
	};

	getAllCourier = async (
		filter: WhereOptions<CourierAttributes> = {},
		limit: number,
		offset: number,
		order: Order,
	): Promise<{ rows: Courier[] | CourierAttributes[]; count: number }> => {
		try {
			const couriers = await Courier.findAll({
				where: filter,
				limit,
				offset,
				order,
			});
			const count = await Courier.count({ where: filter });

			return {
				rows: couriers.map((courier) => courier.toJSON()),
				count,
			};
		} catch (err: any) {
			console.log("Error fetching couriers: ".red, err.message);
			throw err;
		}
	};
}

export default CourierService;
