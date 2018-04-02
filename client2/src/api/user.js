import Vue from 'vue'

export default {
  signin (data) {
      return Vue.http.post('user/login', data)
    },
    signout () {
      return Vue.http.get('user/logout')
    },
    me (data){
      return Vue.http.get('user/islogin')
    },
    changeyear(year){
    	return Vue.http.get('user/changeyear/'+year)
    },
	  addup (data) {
	    return Vue.http.post('role/addup', data)
	  },
	  getAll () {
	    return Vue.http.get('role/getAll')
	  },
	  delRole (data) {
	    return Vue.http.post('role/delRole', data)
	  }    
}
