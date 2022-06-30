import mongoose, { connection } from "mongoose";
(mongoose as any).Promise = Promise;
import mongoosePaginate from 'mongoose-paginate-v2';
import l, { logger } from "./logger";
const db = mongoose.Connection

let isConnected: boolean;

const dbOption: mongoose.ConnectOptions = {
	autoReconnect: true,
	useNewUrlParser: true,
	poolSize: 5,
	useUnifiedTopology: false
};

const mongoosePaginateOptions = {
	customLabels: {
		docs: 'rows',
		limit: 'pageSize',
		page: 'pageIndex'
	}
}

mongoosePaginate.paginate.options = mongoosePaginateOptions;


export function connectDB() {
	return new Promise((resolve, reject) => {
		mongoose.connection.on('connected', function () {
			l.info('Mongoose successfully connected');
			isConnected = true;
			resolve(db);
		});

		mongoose.connection.on('error', function (err) {
			logger.error(err);
			l.error(`Mongoose default connection has occured error ${err}`);
		});

		mongoose.connection.on('disconnected', function () {
			l.warn('Mongoose connection disconnected');
		});

		// Close the Mongoose connection If the Node process ends
		process.on('SIGINT', () => {
			mongoose.connection.close(() => {
				console.log("Mongoose default connection is disconnected due to application termination");
				process.exit(0);
			});
		});

		try {
			const MONGO_URI = "mongodb+srv://admin:dsgnry_admin_pass_2022@blacklion.z8eqjt2.mongodb.net/flux_blacklion?retryWrites=true&w=majority";
			mongoose.connect(MONGO_URI, dbOption)
		}
		catch (err) {
			logger.error(err);
			console.log(err);
		}
	})
}
