<template>
	<div class="create-storage-wrapper">
		<form class="create-storage">

			<div class="form-group">
				<label for="name">Storage name</label>
				<input
					type="text"
					id="name"
					:readonly="!editMode"
					v-model="form.fields.name"
					class="form-control"
					placeholder="Example: Storage 1.."
				>
			</div>

			<div class="form-group">
				<label>Type</label>
				<select class="form-control"
					@change="handleSelectType()"
					:readonly="!editMode"
					:disabled="!editMode"
				>
					<option
						v-for="opt in select.type"
						:key="opt.value"
						:value="opt.value"
						:selected="opt.value === form.fields.type"
					>
						{{ opt.text }}
					</option>
				</select>
			</div>

			<div class="form-group">
				<label>Active (Are articles from this storage used for creating orders?)</label>
				<select class="form-control"
					@change="handleSelectActive()"
					v-model="form.fields.active"
					:readonly="!editMode"
					:disabled="!editMode"
				>
					<option
						v-for="opt in select.active"
						:key="opt.value"
						:value="opt.value"
					>
						{{ opt.text }}
					</option>
				</select>
			</div>

			<button type="button" class="btn-submit"
				v-if="form.mode === 'create'"
				@click="createStorage()"
			>
				Create
			</button>

			<button type="button" class="btn-submit"
				v-if="form.mode === 'update' && editMode"
				@click="updateStorage()"
			>
				Update
			</button>
		</form>
	</div>
</template>

<script>
// Services
import StorageService from '@/services/StorageService'
// Helpers
import { isEmptyObject } from '@/lib/helpers'

export default {
	name: 'StorageForm',

	props: {
		// If storage is passed then component is acting as Edit form, otherwise as Create form
		storageData: {
			type: Object,
			default: null
		},

		editMode: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			storage: this.storage,
			form: {
				mode: null, // 'edit' or 'create'

				fields: {
					name: '',
					active: null,
					type: ''
				}
			},
			select: {
				type: [
					{ text: 'Primary', value: 'primary' },
					{ text: 'Secondary', value: 'secondary' }
				],
				active: [
					{ text: 'Yes', value: true },
					{ text: 'No', value: false }
				]
			}
		}
	},

	watch: {
		editMode: function(val) {
			if (val === false) {
				this.discardForm()
			}
		},

		storageData: function(val) {
			this.storage = this.$props.storageData
			this.populateFormData(this.form.fields, this.$props.storageData)
			// // Populate storage meta fields
			// this.populateFormData(this.form.meta, user)
		}
	},

	mounted() {
		if (this.$props.storageData) this.form.mode = 'update'
		else this.form.mode = 'create'

		if (this.form.mode === 'update') {
			this.populateFormData(this.form.fields, this.$props.storageData)
		}
	},

	methods: {
	
		async createStorage() {
			try {
				const res = await StorageService.createStorage(this.form.fields)
				const storage = res.data.storage

				if (res.status === 201) {
					this.$store.dispatch('addNotification', {
						type: 'success',
						text: `Storage: ${storage.name} is created`
					})

					// Reset input fields
					this.form.fields.name = ''
					this.form.fields.type = ''
					this.form.fields.active = true
				}
			} catch (err) {
				console.log(err.response.data)
				this.$store.dispatch('addNotification', {
					type: 'error',
					text: err.response.data.message
				})
			}
		},

		async updateStorage(storageId) {
			// Get all fields that should be updated (data that user changed, if any)
			const changedFields = this.checkForChangedFields(this.form.fields, this.storage)

			try {
				// If there is anything to update
				if (!isEmptyObject(changedFields)) {
					// Update storage
					const res = await StorageService.updateStorage(this.storage.id, changedFields)
					const storage = res.data.storage
					this.storage = storage

					// Emit update event to parent
					this.$emit('storageUpdate', this.storage)

					// If successfully saved
					this.$store.dispatch('addNotification', {
						type: 'success',
						text: 'Storage updated successfully'
					})
				} else {
					this.$store.dispatch('addNotification', {
						type: 'info',
						text: 'Nothing to update'
					})
				}
			} catch (error) {
				this.success = null
				this.error = error.response.data.error
			}
		},

		discardForm() {
			this.populateFormData(this.form.fields, this.storage)
		},

		handleSelectActive() {
			const value = event.target.value === 'true'
			this.form.fields.active = value
		},

		handleSelectType() {
			const type = event.target.value
			this.form.fields.type = type
		},

		// TODO: Move to form helpers file
		populateFormData(fields, userRecord) {
			for (let field in fields) {
				for (let prop in userRecord) {
					if (field === prop) {
						fields[field] = userRecord[prop]

						// // Format dateOfBirth while populating the form
						// if (key === 'dateOfBirth') {
						// 	// Format user dateOfBirth from datetime to date
						// 	userRecord[key] = userRecord[key].split('T')[0]
						// }
					}
				}
			}
		},

		// TODO: Move to form helpers
		/**
		 * Returns object with props which keys are changed comparing to the origina fields.
		 * @param objToCheck
		 * @param originalObject
		 */
		checkForChangedFields(objToCheck, originalObject) {
			let changedFields = {}
			for (let field in objToCheck) {
				for (let originalField in originalObject) {
					if (field === originalField) {
						
						if (objToCheck[field] !== originalObject[originalField]) {
							changedFields[field] = objToCheck[field]
						}
					}
				}
			}
			return changedFields
		}
	}
}
</script>

<style scoped lang="scss">

	.admin-container {

		form.create-storage {
			width: 600px;
			max-width: 600px;
			padding: 20px;

			h3 {
				height: 40px;
				display: inline-block;
				width: 370px;
			}
		}
	}

	.list-title {
		font-size: 17px;
	}

</style>
