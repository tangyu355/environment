<template>
  <div id="detailcompany" v-if="showdata">
  	  <el-button type="primary" icon="arrow-left" @click="$router.go(-1)" style="margin-top:5px;margin-bottom: 10px;">返回</el-button>
      <detail  :comdetail="curnode.comdetail" @updatecom="updateComDetail"></detail>
		  <devices  :comid="curnode.comid" :year="startyear"></devices>
		  <product :comid="curnode.comid" :year="startyear"></product>
		   <facility  :comid="curnode.comid" :year="startyear"></facility>
		   <outlet  :comid="curnode.comid" :year="startyear"></outlet>
		   <elec :comid="curnode.comid" :year="startyear"></elec>
  </div>
</template>

<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'
import detail from 'src/components/company/detail'
import devices from 'src/components/company/devices'
import facility from 'src/components/company/facility'
import product from 'src/components/company/product'
import outlet from 'src/components/company/outlet'
import elec from 'src/components/company/elec'

export default {
  components: {
  	detail,
  	devices,
  	facility,
  	product,
  	outlet,
  	elec
  },
  data () {
    return {
      msg: '',
      startyear: '',
      curnode: {comdetail:null,comid:'',comFill:null},
      companyName:'',
      showdata:false
    }
  },
  computed: {
  },
  watch: {
    //'$route': 'fetchData'
  },
  methods: {
  	updateComDetail(data) {
			this.getcompanyinfo(this.curnode);
		},
		getcompanyinfo(node){
			var vm = this;
			
			node.comdetail = {
				cominfo:{
					companyName:vm.companyName,
					contact:"",
					contactNo:"",
					legalPerson:"",
					legalPersonPhone:"",
					addressStr:"",
					remark:""
				},
				comFill:{
					fillyear: vm.startyear,
					gdp:"",
					daysOfWork:"",
					hoursOfDay:""
				}
			};
				
			api.creport.companyinformation(node.comid).then(function(res){
				console.log(res)
				if (res.data.company != null) {
					vm.showdata = true
					node.comdetail.cominfo = res.data.company;
					
					api.creport.getcompanyFill(node.comid, vm.startyear).then(function(res){
						console.log(res)
						if (res.data.data != null) {
							node.comdetail.comFill = res.data.data;
						}	
					},function(bad){
					})
				}
			},function(bad){
			})			
		},
  },
  mounted () {
    this.$nextTick(() => {
      // 代码保证 this.$el 在 document 中
      this.curnode.comid = this.$route.params.comId
      this.startyear = this.$route.params.year
      this.companyName = this.$route.params.companyName
      this.getcompanyinfo(this.curnode)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#home{
	text-align: center;
	margin-top:10%;
}
.text{
	text-align: center;
	font-size: 18px;
	color: #20A0FF;
	margin-top:-10px;
}
</style>
