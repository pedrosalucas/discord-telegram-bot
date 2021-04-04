require('dotenv').config();
const mongoose = require('mongoose');
const MONGO_PATH = process.env.MONGO_PATH;

module.exports = async () => {
	await mongoose.connect(MONGO_PATH, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	});

	return mongoose;
};