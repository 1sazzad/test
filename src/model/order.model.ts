import {
	Table,
	Column,
	Model,
	PrimaryKey,
	AutoIncrement,
	ForeignKey,
	BelongsTo,
	HasMany,
	DataType,
} from "sequelize-typescript";
import Customer from "../model/customer.model";
import Staff from "../model/staff.model";
import OrderItem from "../model/order-item.model";
import Payment from "./payment.model";
import Coupon from "../model/coupon.model";
import Courier from "../model/courier.model";
import OrderImage from "./order-image.model";

export interface OrderAttributes {
	orderId: number;
	customerId: number | null;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	staffId: number;
	billingAddress: string;
	additionalNotes: string;
	method: "online" | "offline";
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
		| "order-completed";
	currentStatus: string;
	deliveryDate: Date | null;
	deliveryMethod: "shop-pickup" | "courier";
	paymentMethod: "online-payment" | "cod-payment";
	paymentStatus: "pending" | "partial" | "paid";
	couponId: number | null;
	courierId: number | null;
	courierAddress: string | null;
	orderTotalPrice: number;
	orderItems: OrderItem[];
	payments: Payment[];
	images: OrderImage[];
	createdAt: Date;
	deletedAt: Date;
}

export interface OrderCreationAttributes {
	customerId: number | null;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	staffId: number | null;
	billingAddress: string;
	additionalNotes: string;
	method: "online" | "offline";
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
		| "order-completed";
	currentStatus: string;
	deliveryDate: Date | null;
	deliveryMethod: "shop-pickup" | "courier";
	paymentMethod: "online-payment" | "cod-payment";
	paymentStatus: "pending" | "partial" | "paid";
	couponId: number | null;
	courierId: number | null;
	courierAddress: string | null;
	orderTotalPrice: number;
}

@Table({ tableName: "Orders", timestamps: true })
export default class Order extends Model<
	OrderAttributes,
	OrderCreationAttributes
> {
	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER, allowNull: false })
	declare orderId: number;

	@ForeignKey(() => Customer)
	@Column({ type: DataType.INTEGER, allowNull: true, onDelete: "SET NULL" })
	declare customerId?: number | null;

	@Column({ type: DataType.STRING, allowNull: false })
	declare customerName: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare customerEmail: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare customerPhone: string;

	@ForeignKey(() => Staff)
	@Column({ type: DataType.INTEGER, allowNull: false })
	declare staffId: number;

	@ForeignKey(() => Coupon)
	@Column({ type: DataType.INTEGER, allowNull: true })
	declare couponId: number;

	@Column({ type: DataType.STRING, allowNull: false })
	declare billingAddress: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare additionalNotes: string;

	@Column({
		type: DataType.ENUM("online", "offline"),
		defaultValue: "online",
		allowNull: false,
	})
	declare method: "online" | "offline";

	@Column({
		type: DataType.ENUM("shop-pickup", "courier"),
		defaultValue: "shop-pickup",
		allowNull: false,
	})
	declare deliveryMethod: "shop-pickup" | "courier";

	@Column({
		type: DataType.ENUM(
			"order-request-received",
			"consultation-in-progress",
			"order-canceled",
			"awaiting-advance-payment",
			"advance-payment-received",
			"design-in-progress",
			"awaiting-design-approval",
			"production-started",
			"production-in-progress",
			"ready-for-delivery",
			"out-for-delivery",
			"order-completed",
		),
		defaultValue: "order-request-received",
		allowNull: false,
	})
	declare status:
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
		| "order-completed";

	@Column({ type: DataType.STRING, allowNull: false })
	declare currentStatus: string;

	@Column({
		type: DataType.ENUM("online-payment", "cod-payment"),
		allowNull: false,
	})
	declare paymentMethod: "online-payment" | "cod-payment";

	@Column({
		type: DataType.ENUM("pending", "partial", "paid"),
		defaultValue: "pending",
		allowNull: false,
	})
	declare paymentStatus: "pending" | "partial" | "paid";

	@ForeignKey(() => Courier)
	@Column({ type: DataType.INTEGER, allowNull: true })
	declare courierId: number;

	@Column({ type: DataType.STRING, allowNull: true })
	declare courierAddress: string;

	@Column({ type: DataType.INTEGER, allowNull: false })
	declare orderTotalPrice: number;

	@Column({ type: DataType.DATE, allowNull: true })
	declare deliveryDate: Date | null;

	@HasMany(() => OrderItem, { as: "orderItems" })
	declare orderItems: OrderItem[];

	@HasMany(() => Payment, { as: "payments" })
	declare payments: Payment[];

	@HasMany(() => OrderImage, { as: "images" })
	declare images: OrderImage[];

	@BelongsTo(() => Customer, { onDelete: "SET NULL" })
	declare customer?: Customer;

	@BelongsTo(() => Staff)
	declare staff: Staff;

	@BelongsTo(() => Coupon)
	declare coupon: Coupon;
}
