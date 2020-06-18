const Controller = require('../../../lib/Controller')
const File = require('./file.model')

class FileController extends Controller {

	// Save uploaded file's metadata in the db
	static async saveFileMeta(file, identifier, userId) {
		try {
			const ext = file.originalname.split('.').pop()
			
			const fileMeta = {
				name: file.filename, // File name which is generated after file is uploaded
				identifier: identifier,
				ext: ext,
				mime: file.mimetype,
				size: parseInt(file.size, 10),
				user_id: userId
			}
			const newFile = new File(fileMeta)

			// Save uploaded file's metadata to db
			const savedFile = await File.createFile(newFile)
			return savedFile
		} catch (err) {
			throw err
		}
	}

	static async getFileById(id) {
		try {
			const query = { _id: id }
			const file = await File.findOne(query)

			return file
		} catch (err) {
			throw err
		}
	}

	static async deleteFileById(id) {
		try {
			const query = { _id: id }
			const deletedFile = await File.findByIdAndRemove(query)
			console.log('DELETED FILE  INSIDE: ', deletedFile)

			return deletedFile
		} catch (err) {
			throw err
		}
	}

}

module.exports = FileController