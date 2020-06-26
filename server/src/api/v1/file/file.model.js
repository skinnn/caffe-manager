const mongoose = require('mongoose')
const Schema = mongoose.Schema
/**
 * File schema contains file metadata
 */
const FileSchema = new Schema({
	// Generated name of the uploaded file in the uploads/ dir
	name: {
		type: String,
		required: true,
	},
	// Tells for which purpose the file is used, e.g for profile picture [profile_picture]
	identifier: {
		type: String,
		required: true
	},
	ext: {
		type: String,
		required: true
	},
	mime: {
		type: String,
		required: true
	},
	size: {
		type: Number,
		required: true
	},
	user_id: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: null },
})

const File = (module.exports = mongoose.model('file', FileSchema))