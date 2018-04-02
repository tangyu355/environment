import Vue from 'vue'

export default {
	getbypid (pid) {
		return Vue.http.get('static/pid/'+pid)
	},
	getbyppid (pid) {
		return Vue.http.get('static/ppid/'+pid)
	},
	getbypidgid (pid,gid) {
		return Vue.http.get('static/'+pid+'/'+gid)
	},
	getbygid (gid) {
		return Vue.http.get('static/group/'+gid)
	},
	getbyid (id) {
		return Vue.http.get('static/get/'+id)
	},
	add (data) {
		return Vue.http.post('static/add',data)
	},
	addup (data){
		return Vue.http.post('static/addup',data)
	},
	getTech (){
		return Vue.http.get('static/getTech1')
	},
	getpollutant (){
		return Vue.http.get('pollutant/get/all')
	},
	getAllpollutant (){
		return Vue.http.get('pollutant/get/allgroup')
	},
	addpollutant (data){
		return Vue.http.post('pollutant/addup',data)
	},
	getproduct (){
		return Vue.http.get('step/product/get')
	},
	getTradebyPid (pid){
		return Vue.http.get('trade/parent/'+ pid)
	},
	getTradebyClass (classid){
		return Vue.http.get('trade/class/'+ classid)
	},
	getdistrict(pid) {
		return Vue.http.get('district/parent/'+ pid)
	},
	getaccounttype (name) {
		return Vue.http.get('accountype/getall/'+name)
	},
	getAllDistrict () {
		return Vue.http.get('district/all')
	},
	getAllTrade () {
		return Vue.http.get('trade/getAll')
	},
	getpollutantTen () {
		return Vue.http.get('pollutant/get/ten')
	},
	pollutantDel (data) {
		return Vue.http.post('pollutant/delete',data)
	},
	getGroupList (gid) {
		return Vue.http.get('static/getAllByGroupid/'+gid)
	},
	getfuel () {
		return Vue.http.get('static/0/2')
	}
}
