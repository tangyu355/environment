import Vue from 'vue'

export default {
	getcompany (data) {
		return Vue.http.post('workflow/company/status',data)
	},
	getgovimport (year) {
		return Vue.http.get('workflow/gov/import/' + year)
	},
	searchgov (data) {
		return Vue.http.post('workflow/gov/imports',data)
	},	
	getgover (fillyear) {
		return Vue.http.get('workflow/gov/hand/'+fillyear)
	},
	getAllsmallcompany (data) {
		return Vue.http.post('workflow/small/status',data)
	},
	searchhand (data) {
		return Vue.http.post('workflow/gov/hands',data)
	},	
	getdevice (id, year){
		return Vue.http.get('device/company/'+id + '/' + year)
	},
	getstep (id, year){
		return Vue.http.get('step/company/'+id + '/' + year)
	},
	getoutlet (id, year){
		return Vue.http.get('outlet/company/'+ id + '/' + year)
	},
	getfacility (id, year){
		return Vue.http.get('facility/company/'+id + '/' + year)
	},
	getelec (id, year){
		return Vue.http.get('elec/company/'+id + '/' + year)
	},
	companyinformation (id){
		return Vue.http.get('company/id/'+id)
	},
	companychecked (data) {
		return Vue.http.post('workflow/small/checked', data)
	},
	companyrollback (data) {
		return Vue.http.post('workflow/small/rollback', data)
	},
	getcompanyFill (id,year) {
		return Vue.http.get('company/fill/get/'+id + '/' + year)
	},
	companyFill (data) {
		return Vue.http.post('company/fill',data)
	},
	editdeviceinfo (data){
		return Vue.http.post('device/addup',data)
	},
	editdevicefill (data){
		return Vue.http.post('devfill/fill',data)
	},
	refusedevicefill (data){
		return Vue.http.post('devfill/unpass',data)
	},
	editStepInfo (data){
		return Vue.http.post('step/addup',data)
	},
	editProduct (data){
		return Vue.http.post('step/product/addup',data)
	},
	smallfilladdup (data){
		return Vue.http.post('step/small/filladdup',data)
	},
	smallFacilityaddup (data){
		return Vue.http.post('smallFacility/addup',data)
	},
	editProductFill (data){
		return Vue.http.post('step/product/filladdup',data)
	},
	refuseProductFill (data){
		return Vue.http.post('productfill/unpass',data)
	},
	editMaterial (data){
		return Vue.http.post('step/material/filladdup',data)
	},
	editMaterial0 (data){
		return Vue.http.post('step/material/update',data)
	},
	editOutInfo (data){
		return Vue.http.post('outlet/addup',data)
	},
	editOutfill (data){
		return Vue.http.post('outlet/fill',data)
	},
	refuseOutfill (data){
		return Vue.http.post('outlet/unpass',data)
	},
	editPollutant (data){
		return Vue.http.post('outlet/pollutant/fill',data)
	},
	editFacility (data){
		return Vue.http.post('facility/addup',data)
	},
	editFacilityFill (data){
		return Vue.http.post('facility/fill',data)
	},
	refuseFacilityFill (data){
		return Vue.http.post('facility/unpass',data)
	},
	editElec (data,year){
		return Vue.http.post('elec/fill/' + year,data)
	},
	changeElecStatus (data){
		return Vue.http.post('elec/checked',data)
	},
	
	allpass (fillyear,data){
		return Vue.http.post('workflow/checked/'+fillyear,data)
	},
	allrollback  (data){
		return Vue.http.post('workflow/rollback',data)
	},
	downfile(data) {
		return Vue.http.post('exceldown/download', data);
	},
	editcompany (data){
		return Vue.http.post('company/update', data);
	},
	editcompany2 (data){
		return Vue.http.post('company/userupdatefill', data);
	},
	updateSmallCom (data) {
		return Vue.http.post('workflow/small/update', data);
	},
	getownstep (fillyear, companyId) {
		return Vue.http.get('step/get/'+ fillyear + '/' +  companyId)
	},
	getowndevice (enterpriceId) {
		return Vue.http.get('device/all/'+ enterpriceId)
	},
	addstep (data){
		return Vue.http.post('facility/step/add',data)
	},
	adddevice (data){
		return Vue.http.post('facility/device/add',data)
	},
}
