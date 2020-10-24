require('dotenv').load();

const _sharable = {
	PORT: process.env.PORT || 3000,
};

const dev = Object.assign({}, _sharable);
const prod = Object.assign({}, _sharable);

module.exports = process.env.NODE_ENV === 'production' ? prod : dev;
