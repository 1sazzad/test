import { Order, WhereOptions } from "sequelize";
import Media, { MediaAttributes } from "../model/media.model";

class MediaService {
	createMedia = async (
		imageName: string,
	): Promise<Media | MediaAttributes | null> => {
		try {
			const media = await Media.create({ imageName });

			return media ? media.toJSON() : null;
		} catch (err: any) {
			console.log(
				"Error occurred while creating media image: ".red,
				err.message,
			);
			throw err;
		}
	};

	getMediaById = async (
		mediaId: number,
	): Promise<Media | MediaAttributes | null> => {
		try {
			const media = await Media.findByPk(mediaId);

			return media ? media.toJSON() : null;
		} catch (err: any) {
			console.log(
				"Error occurred while fetching media by id: ".red,
				err.message,
			);
			throw err;
		}
	};

	deleteMedia = async (mediaId: number): Promise<boolean> => {
		try {
			const media = await Media.findByPk(mediaId);

			if (media) {
				await media.destroy();
				return true;
			}
			return false;
		} catch (err: any) {
			console.log(
				"Error occurred while deleting media by id: ".red,
				err.message,
			);
			throw err;
		}
	};

	getAllMedias = async (): Promise<Media[] | MediaAttributes[] | null> => {
		try {
			const medias = await Media.findAll();
			if (medias) {
				return medias.map((media) => media.toJSON());
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while getting medias: ".red,
				err.message,
			);
			throw err;
		}
	};
}

export default MediaService;
