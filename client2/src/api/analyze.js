import Vue from 'vue'

export default {
	getjson (json) {
		return Vue.http.get(json)
	},
	getyear (name){
		return Vue.http.get(name +'/getyears')
	},
	getcity (pno){
		return Vue.http.get('district/parent/'+pno)
	},
	getpollution (){
		return Vue.http.get('pollutant/get/all')
	},
	getall (name,yearid){
		return Vue.http.get(name +'/getdata/'+yearid)
	},
	getByType (name,yearid,typeId){
		return Vue.http.get(name +'/getdata/'+yearid+'/'+typeId)
	},
	getindustrylist (pid){
		return Vue.http.get('trade/parent/'+pid)
	},
	getproduct (name) {
		return Vue.http.get('surface/'+name)
	},
	getmonthly (year){
		return Vue.http.get('analysis/month/?year='+year)
	},
	getresult (name,typeid,pid,year){
		return Vue.http.get('surface/'+name+'/'+typeid+'/'+pid+'/'+year)
	},
	searchpollution (data){
		return Vue.http.post('details/getdetails',data)
	},
	getresults (name,pid,year){
		return Vue.http.get(name+'/getdata/'+pid+'/'+year)
	},
	getdirect (name,year,typeid){
		return Vue.http.get('surface/'+name+'/getdata/'+year+'/'+typeid)
	},
	gettradeboiler (name,industryid){
		return Vue.http.get('surface/'+name+'/'+industryid)
	},
	gettradefuel (name,year,tradeid){
		return Vue.http.get(name+'/getdata/'+year+'/'+tradeid)
	},
	getresultByType (name,year,tradeid,typeid){
		return Vue.http.get(name+'/getdata/'+year+'/'+tradeid+'/'+typeid)
	},
	getgoverncost (name,typeid,year,tradeid,gid){
		return Vue.http.get(name+'/'+typeid+'/'+year+'/'+tradeid+'/'+gid)
	},
	getgisdata (data) {
		return Vue.http.post('gisstat/getgisdata',data)
	}
}
