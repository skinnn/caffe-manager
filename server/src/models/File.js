const mongoose = require('mongoose')
const Schema = mongoose.Schema
/**
 * File schema contains file metadata
 */
const FileSchema = new Schema({
	// Generated name of the uploaded file in the uploads/ dir
	name: { type: String, required: true },
	// Tells for which purpose the file is used, e.g for profile picture [profile_picture]
	identifier: { type: String, required: true, enum: ['profile_image'] },
	ext: { type: String, required: true },
	mime: { type: String, required: true },
	size: { type: String, required: true },
	__owner: { type: String, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: String, default: null }
})

const File = module.exports = mongoose.model('File', FileSchema)

module.exports.createFile = (file) => {
	return new Promise((resolve, reject) => {
		File.create(file, (err, doc) => {
			if (err) reject(err)
			resolve(doc)
		})
	})
}