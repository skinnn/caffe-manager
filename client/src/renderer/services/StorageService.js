import Api from '@/services/Api'

export default {
  createStorage(storage) {
    return Api().post('admin/storage/create', storage)
  }
}
