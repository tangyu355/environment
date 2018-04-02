import Vue from 'vue'

export default {
	getYearbyListName (name,id) {
		return Vue.http.get( name+'/years?accountid='+id)
	},
	getFillsbyYearAid (name,year,id) {
		return Vue.http.get( name+'/get/'+year+'?accountid='+id)
	},
	getAllcitybyYearId(name,year,id){
		return Vue.http.get( name+'/get/'+year+'/0'+'?accountid='+id)
	},
	clearFillsbyYearAid (name,year,id) {
		return Vue.http.get( name+'/clear/'+year+'?accountid='+id)
	},
	clearFilesbyYearAid (data) {
		return Vue.http.post( 'excelup/clear', data)
	},
	gettablebyYearAid (name,year,id) {
		return Vue.http.get( name+'/get2/'+year+'?accountid='+id)
	},
	addupbyListName (data,name){
		return Vue.http.post(name + '/addup', data)
	},
	addup2byListName (data,name){
		return Vue.http.post(name + '/addup2', data)
	},
	changeStatus (name,data){
		return Vue.http.post(name+'/checked',data)
	},
}
