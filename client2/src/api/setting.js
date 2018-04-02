import Vue from 'vue'

export default {
	getpollutantcount(tradeid) {
		return Vue.http.get('pollutant/getfactor/'+tradeid)
	},
	getproduct (id){
		return Vue.http.get('proclassify/find',{params:{tradeid:id}})
	},
	getProductGroup (id){
		return Vue.http.get('proclassify/returnGroupAll',{params:{tradeid:id}})
	},
	addProductGroup (data) {
		return Vue.http.post('proclassify/addGroup',data)
	},
	updateProductGroup (data) {
		return Vue.http.post('proclassify/updateGroup',data)
	},
	getFactorType  (pdata){
		return Vue.http.get('proclassify/factortype',pdata)
	},
	setpollutantcount (data) {
		return Vue.http.post('pollutant/setfactor',data)
	},
	setProductFactor (data){
		return Vue.http.post('proclassify/addFactor',data)
	},
	setGroupFactor (data){
		return Vue.http.post('proclassify/addGroupfactor',data)
	},
	setPintoGroup (data){
		return Vue.http.post('proclassify/intoGroup',data)
	},
	delGroup (data){
		return Vue.http.post('proclassify/deleteGroup',data)
	},
	getresult (fillyear){
		return Vue.http.get('compute/fuel/'+fillyear)
	},
	getstatus (fillyear){
		return Vue.http.get('compute/status/'+fillyear)
	},
	getcompute (fillyear,typeid){
		return Vue.http.get('compute/computeAll/'+fillyear+'/'+typeid)
	},
	getcomputestatus (fillyear,typeid){
		return Vue.http.get('compute/statusAll/'+fillyear+'/'+typeid)
	},
	updateGroup (data){
		return Vue.http.post('proclassify/updateGroup',data)
	},
	getProductMaterial (id){
		return Vue.http.get('proclassify/getmaterial/'+id)
	},		
	govfactorset (data){
		return Vue.http.post('/apserver/govfactorset/addup',data)
	},
	getgovfactor (name){
		return Vue.http.get('govfactorset/getdata/'+name)
	},
	getproportion (){
		return Vue.http.get('proportion/getAll')
	},
	uploadfile (name){
		return Vue.http.get('excelup/fileName/'+name)
	},
	lookupfile (){
		return Vue.http.get('vehicle/action/getFactor')
	},
	getvehicleyear (){
		return Vue.http.get('vehicle/action/moteryears')
	},
	searchproduct (data){
		return Vue.http.post('proclassify/CompanyProduct',data)
	},		
	editGroup (data){
		return Vue.http.post('proclassify/updateGroup',data)
	},		
	deleteGroup (data){
		return Vue.http.post('proclassify/deleteGroup',data)
	},		
	gettrade (pid){
		return Vue.http.get('trade/parentProductCount/'+pid)
	},
	getprofactor (id){
		return Vue.http.get('proclassify/returnFactor',{groupid:id})
	},
	getstatusMotor (fillyear,typeid){
		return Vue.http.get('compute/statusMotor/'+fillyear+'/'+typeid)
	},
	getmotor (fillyear,typeid){
		return Vue.http.get('compute/motor/'+fillyear+'/'+typeid)
	},
	editprop (data){
		return Vue.http.post('proportion/setProportion' ,data)
	},
}
