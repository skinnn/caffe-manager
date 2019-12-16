<template>
  <div class="admin-article-subgroup-list-page">
    <div>
      <admin-side-menu />
    </div>
      <v-layout column class="right-side">
        <v-flex>
          <div class="admin-header">
              <h1 class="heading">{{storageName}} - Subgroups</h1>
              <admin-logout-btn />
          </div>
        </v-flex>

        <v-flex class="admin-container">
          <!-- Display messages -->
          <div class="error-msg" v-if="error" v-html="error" />
          <div class="success-msg" v-if="success" v-html="success" />
          <div class="info-msg" v-if="info" v-html="info" />

          <!-- List of subgroups -->
          <div class="list-of-article-subgroups">
            <!-- Article Subgroup List -->
            <v-list two-line>
              <v-list-tile
                v-for="subgroup in this.subgroups"
                :key="subgroup._id"
                @click="viewArticleSubgroup(subgroup, storageId)"
              >

                <v-list-tile-action>
                  <v-icon>folder</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{subgroup.name}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{subgroup.name}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </div>

          <div class="create-subgroup">
            <!-- TODO: Add Image to the Subgroup -->
            <v-form
              @submit.prevent="createSubgroup"
              enctype="multipart/form-data"
              class="create-article-subgroup-form"
            >

              <h3>Create Subgroup:</h3>
              <v-flex xs12 sm8 d-flex>
                <v-text-field
                  type="text"
                  name="name"
                  maxlength="35"
                  placeholder="Subgroup name"
                  v-model="subgroup.name"
                  solo
                ></v-text-field>
              </v-flex>

              <h3>Add Image</h3>
              <div class="upload-image">
                <input
                  type="file"
                  @change="imagePreview(this)"
                  id="subgroupImage"
                  name="imageUpload"
                  class="previewImgInput"
                />
                <img id="previewImg" class="previewImg" src="" alt="">
                <!-- Preview Image placeholder -->
                <img v-if="!selectedImage" class="previewImgPlaceholder" src="" alt="">
              </div>

              <v-btn class="createSubgroupBtn green" type="submit">
                Create
              </v-btn>
            </v-form>
          </div>

        </v-flex>
      </v-layout>
  </div>
</template>

<script>
import AdminSideMenu from '@/components/admin/AdminSideMenu'
import ArticleSubgroupService from '@/services/ArticleSubgroupService'

export default {
  components: {
    AdminSideMenu
  },
  data() {
    return {
      storageName: this.$store.state.route.params.storageName,
      storageId: this.$store.state.route.params.storageId,
      subgroup: {
        name: ''
      },
      subgroups: [],
      selectedImage: null,
      // Messages
      error: null,
      success: null,
      info: null
    }
  },
  async mounted() {
    try {
      const storageId = this.storageId
      const response = (await ArticleSubgroupService.getSubgroupsByStorageId(storageId)).data
      console.log('Subgroups: ', response)
      // Get User list
      if (response.subgroups) {
        const subgroups = this.subgroups
        // Add user in the storages array
        response.subgroups.forEach(function(subgroup) {
          subgroups.push(subgroup)
        })
      }
    } catch (error) {
      console.log(error)
      this.success = ''
      this.error = error.response.data.error
    }
  },
  methods: {
    imagePreview() {
      const img = document.getElementById('subgroupImage').files
      const previewImg = document.getElementById('previewImg')
      this.selectedImage = true
      var reader = new FileReader()
      reader.onload = function(e) {
        previewImg.src = e.target.result
      }
      reader.readAsDataURL(img[0])
    },

    async createSubgroup() {
      try {
        const formData = new FormData()
        // Get image
        let imagefile = document.querySelector('#subgroupImage')
        let image = imagefile.files[0]
        let storageId = this.storageId
        let subgroupName = this.subgroup.name
        // -----------------------------
        formData.append('imageUpload', image)
        formData.append('storageId', storageId)
        formData.append('subgroupName', subgroupName)

        const response = (await ArticleSubgroupService.createArticleSubgroup(formData, storageId)).data
        console.log(response)
        if (response.subgroup) {
          this.subgroups.push(response.subgroup)
        }
      } catch (error) {
      }
    },

    viewArticleSubgroup(subgroup, storageId) {
      this.$router.push({
        name: 'admin-view-article-subgroups',
        params: {subgroup, storageId}
      })
    }
  }
}
</script>

<style scoped lang="scss">

  .create-article-subgroup-form {
    width: 600px;
    max-width: 600px;
    padding: 20px;

    .createSubgroupBtn {
      display: block;
      width: 25%;
    }

    .previewImg {
      min-width: 150px;
      min-height: 150px;
      max-width: 200px;
      max-height: 200px;
      border: 1px solid orange;
      border-radius: 3px;
      margin: 10px 0 0 10px;
      display: block;
    }

    .previewImgPlaceholder {
      width: 150px;
      height: 150px;
      border: 1px solid orange;
      border-radius: 3px;
      margin: 10px 0 0 10px;
      display: block;
    }

    .previewImgInput {
      margin: 5px 0 0 10px;
    }
  }

  .list-title {
    font-size: 17px;
  }

</style>
