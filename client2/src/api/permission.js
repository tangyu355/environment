import Vue from 'vue'

export default {
  getAll (data) {
    return Vue.http.post('permission/getAll', data)
  },
  addup (data) {
    return Vue.http.post('permission/addup', data)
  }
}