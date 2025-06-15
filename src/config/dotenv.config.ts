import "dotenv/config";
import urlJoin from "url-join";

export const nodeEnv: string = process.env.NODE_ENV || "development";
export const serverBaseUrl: string = urlJoin(
	`${process.env.SERVER_BASE_URL}:${process.env.SERVER_PORT}`,
);

export const serverUrlPrefix: string = process.env.SERVER_URL_PREFIX || "";
export const port: string = process.env.SERVER_PORT || "3000";
export const apiDocsUrl: string = process.env.API_DOCS_URL || "";

export const dbName: string =
	nodeEnv === "production"
		? process.env.PRODUCTION_DB_NAME || ""
		: process.env.DEVELOPMENT_DB_NAME || "";
export const dbUser: string =
	nodeEnv === "production"
		? process.env.PRODUCTION_DB_USER || ""
		: process.env.DEVELOPMENT_DB_USER || "";
export const dbPassword: string =
	nodeEnv === "production"
		? process.env.PRODUCTION_DB_PASSWORD || ""
		: process.env.DEVELOPMENT_DB_PASSWORD || "";
export const dbHost: string =
	nodeEnv === "production"
		? process.env.PRODUCTION_DB_HOST || ""
		: process.env.DEVELOPMENT_DB_HOST || "";

export const dbConnectionString: string =
	nodeEnv === "production"
		? process.env.PRODUCTION_DB_CONNECTION_STRING || ""
		: process.env.DEVELOPMENT_DB_CONNECTION_STRING || "";

export const rateLimitWindow: string = process.env.RATE_LIMIT_WINDOW || "15";
export const rateLimitMax: string = process.env.RATE_LIMIT_MAX || "10";
export const strictRateLimitWindow: string =
	process.env.STRICT_RATE_LIMIT_WINDOW || "1";
export const strictRateLimitMax: string =
	process.env.STRICT_RATE_LIMIT_MAX || "10";

export const apiWhitelistedDomains: string[] =
	process.env.API_WHITELISTED_DOMAINS?.split(" ") || [];
export const frontendLandingPageUrl: string =
	process.env.FRONTEND_LANDING_PAGE_URL || "";

export const jwtSecret: string = process.env.JWT_SECRET || "";
export const jwtExpiresIn: string = process.env.JWT_EXPIRES_IN || "1d";

export const mailServerHost: string = process.env.MAIL_SERVER_HOST || "";
export const mailServerPort: string = process.env.MAIL_SERVER_PORT || "";
export const mailServerUser: string = process.env.MAIL_SERVER_USER || "";
export const mailServerPassword: string =
	process.env.MAIL_SERVER_PASSWORD || "";
export const staticDir: string = process.env.APP_STATIC_DIR || "";

export const sslCommerzStoreId: string = process.env.SSL_COMMERZ_STORE_ID || "";
export const sslCommerzStorePassword: string =
	process.env.SSL_COMMERZ_STORE_PASSWORD || "";
export const sslCommerzSandbox: string = process.env.SSL_COMMERZ_SANDBOX || "";
