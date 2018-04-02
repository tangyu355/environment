import Vue from 'vue'

export default {
	creatcode (data) {
		return Vue.http.post('invitation/code/set', data)
	},
	getcode () {
		return Vue.http.get('invitation/code/getfixedcode')
	},
	searchcomp (name) {
		return Vue.http.get('company/antistop/'+ name)
	},
	searchgov (name) {
		return Vue.http.get('company/gov/'+ name )
	},
	searchuser (name) {
		return Vue.http.get('user/antistop/'+ name )
	},		
	getcomp () {
		return Vue.http.get('company/all')
	},
	creatcomp (data) {
		return Vue.http.post('company/update', data)
	},
	delcomp (name){
		return Vue.http.get('company/delete/'+ name)
	},
	creatgovern (data) {
		return Vue.http.post('company/update/', data)
	},
	getgovern () {
		return Vue.http.get('company/gov')
	},
	creatuser (data) {
		return Vue.http.post('user/addup', data)
	},
	getuser () {
		return Vue.http.get('user/all')
	},
	deluser (name){
		return Vue.http.get('user/delete/'+name)
	},
	getmyself (){
		return Vue.http.get('user/myself')
	},
	pwdupdate (data){
		return Vue.http.post('user/userupdate/',data)
	},	
	getvalue (name){
		return Vue.http.get('config/getvalue/?key='+name)
	},
	save (data){
		return Vue.http.post('config/update',data)
	},
	loginout (){
		return Vue.http.get('company/logout')
	}
}
