const mongoose = require('mongoose')
//creating a structure of schema
const Schema = mongoose.Schema

const urlSchema = new Schema({
	url: {
		type: String,
		required: true
	},
	shorturl: {
		type: String,
		required: true
	}
}, { timestamps: true })

const urlDoc = mongoose.model('Url', urlSchema)
module.exports = urlDoc