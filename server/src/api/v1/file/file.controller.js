const File = require('./file.model')

class FileController {

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

}

module.exports = FileController