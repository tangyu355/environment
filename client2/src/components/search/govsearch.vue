<template>
<div id="fuelset">
  <h3>查询与导出污染物统计结果</h3>
  <el-row :gutter="24" style="margin-bottom:10px;">  	
    <el-col :span="6" v-if="showpage===1">
      <el-select v-model="govname">
       <el-option
          v-for="item in govlist"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
   	</el-col>
    <el-col :span="6"  v-if="showpage===0">
      <el-select v-model="govname">
        <el-option
          v-for="item in movlist"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
   	</el-col>
    <el-col :span="6">
      <el-cascader
          :options="state.districtlist"
          v-model="district"
          change-on-select
          :show-all-levels="true"
          placeholder="选择地区"
          clearable>
        </el-cascader>
    </el-col> 
    <el-col :span="6">
    	 <el-select v-model="typeid">
        <el-option
          v-for="item in typelist"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="6">
     	<Button type="primary" size="large" @click="search" icon="search">查询</Button>
		<Button type="primary" size="large"  @click="exportData(1)"  icon="ios-cloud-download-outline">导出数据</Button>
    </el-col>
  </el-row>
   <Table :columns="columns" :data="state.showlist"  ref="table" v-loading="loading" element-loading-text="拼命加载中"></Table>
   <Table :columns="columns2" :data="checklist" ref="table2"  hidden  ></Table>
   <my-pagination></my-pagination>
</div>
</template>
<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'
import { Message } from 'element-ui'

export default {
	data() {
		return {
			state: state,
			action: actions,
			yid: state.watchyear,
			dislist: [],
			loading:false,
			typelist:[{name:'省级计算',value:1},{name:'市级计算',value:2}],
			typeid:2,
			govlist: ['秸秆和薪柴', '餐饮', '畜禽养殖', '氮肥施用', '民用生活燃料', '加油站', '油库', '汽修', '干洗', '道路扬尘', '施工扬尘','农药用量','垃圾场污水厂','房屋建筑','能源消耗'],
			movlist:['船舶','工程机械','农业机械','机动车','飞机'],
			columns: [
                {
                  "title": "地区",
                   "key": "cityName",
                },
                {
                  "title": "类型",
                   "key": "stattype3",
                },
                {
                  "title": "月份",
                   "key": "months",
                },
                {
                  "title": "污染物",
                   "key": "pollutantName",
                },
                {
                  "title": "计算公式",
                   "key": "stat_exp",
                },
                {
                  "title": "对应数据",
                   "key": "stat_value",
                },
                {
                  "title": "污染物值",
                   "key": "statvalue",
                },
                {
                  "title": "备注",
                   "key": "stat_valtype",
                },
            ],
            columns2: [
                {
                  "title": "地区",
                   "key": "cityName",
                },
                {
                  "title": "类型",
                   "key": "stattype3",
                },
                {
                  "title": "月份",
                   "key": "months",
                },
                {
                  "title": "污染物",
                   "key": "pollutantName",
                },
                {
                  "title": "计算公式",
                   "key": "stat_exp",
                },
                {
                  "title": "对应数据",
                   "key": "stat_value",
                },
                {
                  "title": "污染物值",
                   "key": "statvalue",
                },
                {
                  "title": "备注",
                   "key": "stat_valtype",
                },
            ],
			did: '',
			govname: '',
	        checklist: [],
	        showpage:'',
	        movinglist: [],
	        showdata: false,
	        district:[1]
      }
    },
    watch: {
	    'state.listnow' (newValue, oldValue) {
	      console.log(newValue)
	       this.action.setShowList(this.checklist)
	      
	    },
	  	'$route.path': {
	  		handler: function (val, oldVal) {  		
	  			console.log(val)
	  			this.getType(val)
	  		},
	      deep: true
	  	},
	  	'district'(list) {       
	        this.did = _.last(list)
	         console.log(this.did)
	     },
	  	'state.watchyear':{
		    	handler: function (val, oldVal) {
		    		console.log(val)
		  			this.yid = val
		  		},
		      deep: true
		    }
	},
    methods: {
		getdistrict: function(pid, callback) {
			api.staticinformation.getdistrict(pid).then(callback)
		},
		search: function() {
			console.log(this.district)
			var vm = this;
			vm.loading = true
			console.log(vm.yid, vm.did, vm.govname)
			if(vm.showpage === 1) {
				api.search.searchall('detailsOfCompute/getdetails', vm.yid, vm.did, vm.govname,vm.typeid).then(function(res) {
					console.log(res)
					if (res.data.status === 0) {
						vm.showdata = true
						vm.loading = false
						vm.checklist = res.data.res
						vm.action.setShowList(vm.checklist)
					} else {
						Message.error(res.data.msg)
					}
				})
			} else{
				api.search.searchall('detailsOfCompute/moving', vm.yid, vm.did, vm.govname,vm.typeid).then(function(res) {
					console.log(res)
					if (res.data.status === 0) {
						vm.showdata = true
						vm.loading = false
						vm.checklist = res.data.res
						vm.action.setShowList(vm.checklist)
					} else {
						Message.error(res.data.msg)
					}
				})				
			}
		},
		exportData (type) {
	      if (type === 1&&this.checklist.length) {
	         this.$refs.table2.exportCsv({
	            filename:this.yid +'年'+this.govname,
	            data:this.checklist
	         });
	      }
     },
		getType (name) {
			var vm = this		
			if(name=='/movingsearch'){
				console.log(11)
				vm.govname = vm.movlist[4];
				vm.showpage = 0
				vm.did = vm.district[0];
				vm.search()				
			} else{
				console.log('我是面源')
				vm.showpage = 1
				vm.govname = vm.govlist[8];
				vm.did = vm.district[0]
				vm.search()
			}			
		}
	},
	mounted() {
		this.$nextTick(() => {// 代码保证 this.$el 在 document 中
			var vm = this;
			vm.getType(this.$route.path)
			_.forEach(this.state.districtlist, function (ob) {
			      	console.log(ob)
			        	_.forEach(ob.children, function (oob) {
			        		if(oob.children.length){
			        			oob.children = ''
			        		}
			        	})
			   }) 
		})
	}
}</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>