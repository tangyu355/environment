import Vue from 'vue'

export default {
	industry (data) {
		return Vue.http.post('detailsOfindustry/get',data)
	},
	getgovlist () {
		return Vue.http.get('accountype/getall')
	},
	searchall (name,year,did,govname,typeid) {
		return Vue.http.get(name+'/'+year+'/'+did+'/'+govname+'/'+typeid)			
	}
}
