const fs = require('fs')
const path = require('path')

const Controller = require('../../../../lib/Controller')
const FileController = require('../../file/file.controller')

const Article = require('../article.model')
const File = require('../../file/file.model')

class AttachmentController extends Controller {

	static async create(req, res, next) {
		try {
			const identifier = req.queryParsed.match.identifier
			if (!identifier) {
				throw Controller.makeError('BadRequestError', 'Attachment "identifier" is required')
			}

			const file = req.file
			console.log('req.file: ', file)
			const articleId = req.params.id
			const userId = req.user.id

			const exist = await FileController.getFileByUserAndIdentifier(userId, identifier)
			if (exist) {
				throw Controller.makeError('BadRequestError', `This user already has a file with identifier ${identifier}`)
			}

			// Save uploaded file's metadata in the db
			const savedFile = await FileController.saveFile(file, identifier, userId)

			// const article = await Article.findById(articleId)
			const options = { new: true }
			const data = {
				image_id: savedFile.id
			}
			const updatedArticle = await Article.findByIdAndUpdate(articleId, data, options)

			return res.sendStatus(200)
		} catch (err) {
			return next(err)
		}
	}

	// // Get attachments
	// static async get(req, res, next) {
	// 	try {
	// 		if (!req.queryParsed.match.identifier) {
	// 			throw Controller.makeError('BadRequestError', 'Attachment "identifier" is required')
	// 		}

	// 		const articleId = req.params.id || null
	// 		const match = req.queryParsed.match
	// 		const file = await File.findOne(match)
	// 		console.log('file:', file)

	// 		req.authorized = true
	// 		res.locals = {
	// 			status: 200,
	// 			file: file
	// 		}
	// 		return next()
	// 	} catch (err) {
	// 		return next(err)
	// 	}
	// }

	// Get attachment by file id
	static async getByFileId(req, res, next) {
		const fileId = req.params.fileId || ''

		const file = await File.findById(fileId)
		console.log('FILE: ', file)
		if (!file) {
			return res.status(200).json({
				message: 'File not found'
			})
		}

		req.authorized = true
		res.locals = {
			status: 200,
			file: file
		}
		return next()
	}

	// static async deleteByFileId(req, res, next) {
	// 	try {
	// 		const fileId = req.params.fileId
	// 		const fileToDelete = await File.findById(fileId)
	// 		if (!fileToDelete) {
	// 			throw Controller.makeError('BadRequestError', `File with id ${fileId} does not exist`)
	// 		}

	// 		if (!req.user.roles.includes('admin')) {
	// 			Controller.validateOwnership(req, fileToDelete)
	// 		}

	// 		const deletedFile = await FileController.deleteFileById(fileId)

	// 		const filePath = path.join(Controller.api.uploads.imagesDirectory, deletedFile.name)
	// 		// Check if file exists
	// 		fs.access(filePath, fs.F_OK, (err) => {
	// 			if (err) return
	// 		})
			
	// 		// Delete file
	// 		fs.unlink(filePath, (err) => {
	// 			if (err) throw err
	// 		})

	// 		return res.status(200).json({
	// 			message: 'Deleted successfully'
	// 		})
	// 	} catch (err) {
	// 		return next(err)
	// 	}
	// }

	// // Update attachment
	// static async updateByUserId(req, res, next) {
	// 	try {
	// 		const newAttachment = req.file
	// 		const userId = req.params.id
	// 		const identifier = req.queryParsed.match.identifier
	// 		const query = {
	// 			user_id: userId,
	// 			identifier: identifier
	// 		}
	// 		const oldAttachment = await File.findOne(query)

	// 		const options = { new: true }
	// 		const data = {
	// 			name: newAttachment.filename,
	// 			ext: newAttachment.originalname.split('.').pop(),
	// 			mime: newAttachment.mimetype,
	// 			size: parseInt(newAttachment.size, 10),
	// 			updated: new Date(Date.now()).toString()
	// 		}
	// 		const updatedFile = await File.findOneAndUpdate(query, data, options)
	// 		if (!updatedFile) {
	// 			AttachmentController.deleteAttachmentByName(newAttachment.filename)
	// 			throw Controller.makeError('BadRequestError', `Attachment with identifier ${identifier} does not exist`)
	// 		}

	// 		// Delete old attachment
	// 		AttachmentController.deleteAttachmentByName(oldAttachment.name)

	// 		return res.status(200).json({
	// 			file: updatedFile
	// 		})
	// 	} catch (err) {
	// 		return next(err)
	// 	}
	// }

	// // Update attachment by file id
	// static async updateByFileId(req, res, next) {
	// 	try {
	// 		const newAttachment = req.file
	// 		const fileId = req.params.fileId || null
	// 		const oldAttachment = await File.findById(fileId)

	// 		const data = {
	// 			name: newAttachment.filename,
	// 			ext: newAttachment.originalname.split('.').pop(),
	// 			mime: newAttachment.mimetype,
	// 			size: parseInt(newAttachment.size, 10),
	// 			updated: new Date(Date.now()).toString()
	// 		}
	// 		const options = { new: true }
	// 		const updatedFile = await File.findByIdAndUpdate(fileId, data, options)
	// 		if (!updatedFile) {
	// 			AttachmentController.deleteAttachmentByName(newAttachment.filename)
	// 			throw Controller.makeError('BadRequestError', `Attachment with id ${fileId} does not exist`)
	// 		}

	// 		// Delete old attachment
	// 		AttachmentController.deleteAttachmentByName(oldAttachment.name)

	// 		return res.status(200).json({
	// 			file: updatedFile
	// 		})
	// 	} catch (err) {
	// 		return next(err)
	// 	}
	// }

	// static async deleteUserAttachment(req, res, next) {
	// 	try {
	// 		if (!req.queryParsed.match.identifier) {
	// 			throw Controller.makeError('BadRequestError', 'Attachment "identifier" is required')
	// 		}

	// 		const identifier = req.queryParsed.match.identifier
	// 		const query = {
	// 			user_id: req.user.id,
	// 			identifier: identifier
	// 		}

	// 		const fileToDelete = await File.findOne(query)
	// 		if (!fileToDelete) {
	// 			throw Controller.makeError('BadRequestError', `Attachment with this identifier ${identifier} for user ${req.user.username} does not exist`)
	// 		}

	// 		if (!req.user.roles.includes('admin')) {
	// 			Controller.validateOwnership(req, fileToDelete)
	// 		}

	// 		const deletedFile = await FileController.deleteFileById(fileToDelete.id)

	// 		const filePath = path.join(Controller.api.uploads.imagesDirectory, deletedFile.name)
	// 		// Check if file exists
	// 		fs.access(filePath, fs.F_OK, (err) => {
	// 			if (err) return
	// 		})
			
	// 		fs.unlink(filePath, (err) => {
	// 			if (err) throw err
	// 		})

	// 		return res.status(200).json({
	// 			message: 'Attachment deleted'
	// 		})
	// 	} catch (err) {
	// 		return next(err)
	// 	}
	// }

	/**
	 * Remove uploaded attachment by name
	 * @param {Array} fileName [Name of the attachment]
	 */
	static async deleteAttachmentByName(fileName) {
		try {
			const filePath = path.join(Controller.api.uploads.imagesDirectory, fileName)

			// Check if file exists
			fs.access(filePath, fs.F_OK, (err) => {
				if (err) return
			})
			// await fs.unlink(filePath)
			fs.unlink(filePath, (err) => {
				if (err) throw err
			})
	
			return true
		} catch (err) {
			throw err
		}
	}

	/**
	 * Remove uploaded attachments if any (removes both attachments and file meta data from the db).
	 * @param {Array} files []
	 */
	static async deleteAttachments(files) {
		try {
			if (files && files.length === 0) return
		
			const promises = files.map(async (fileId) => {
				const deletedFile = await FileController.deleteFileById(fileId)
				
				if (deletedFile) {
					const filePath = path.join(Controller.api.uploads.imagesDirectory, deletedFile.name)
	
					// Check if file exists
					fs.access(filePath, fs.F_OK, (err) => {
						if (err) return
					})
					// await fs.unlink(filePath)
					fs.unlink(filePath, (err) => {
						if (err) throw err
					})
	
					return deletedFile
				}
			})
	
			const deletedFiles = await Promise.all(promises)
			return deletedFiles
		} catch (err) {
			throw err
		}
	}
}

module.exports = AttachmentController