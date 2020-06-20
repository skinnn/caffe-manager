<template>
	<div class="admin-storage-create-page">
		<form
			@submit="createStorage()"
			class="create-storage"
		>

			<div class="form-group">
				<label for="name">Storage name</label>
				<input
					type="text"
					id="name"
					v-model="form.fields.name"
					class="form-control"
					placeholder="Example: Storage 1.."
				>
			</div>

			<div class="form-group">
				<label>Type</label>
				<select @change="handleSelectType()" class="form-control">
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
				<label>Active</label>
				<select @change="handleSelectActive()" class="form-control">
					<option
						v-for="opt in select.active"
						:key="opt.value"
						:value="opt.value"
					>
						{{ opt.text }}
					</option>
				</select>
			</div>

			

			<!-- <h3>Active (Are articles from this storage used for creating orders)</h3>
			<v-flex xs12 sm5 d-flex>
				<v-select
					:items="select.active"
					v-model="form.fields.active"
					label="Select"
					solo
				></v-select>
			</v-flex> -->

			<button type="submit" class="btn-submit">
				Create
			</button>
		</form>
	</div>
</template>

<script>
// Services
import StorageService from '@/services/StorageService'

export default {
	data() {
		return {
			form: {
				fields: {
					name: '',
					active: true,
					type: 'primary'
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
	mounted() {

	},
	methods: {
		async createStorage() {
			event.preventDefault()
			try {
				const res = await StorageService.createStorage(this.form.fields)
				const storage = res.data.storage
				console.log('storage res: ', res)

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

		handleSelectActive() {
			const active = event.target.value
			this.form.fields.active = Boolean(active)
			console.log(this.form.fields)
		},
		handleSelectType() {
			const type = event.target.value
			this.form.fields.type = type
		}
	}
}
</script>

<style scoped lang="scss">

	.admin-container {

		.create-storage {
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
