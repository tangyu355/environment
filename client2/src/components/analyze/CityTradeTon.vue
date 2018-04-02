<template>
  <div id="commonset"  v-if="showdata">
    <h3>分行业、分地区的锅炉蒸吨数统计图</h3>
   <el-form ref="form" :model="search" inline>
    	<el-row :gutter="24">
     <el-col :span="6">
	    		<el-form-item label="选择类别" >
	          <el-select v-model="typeid" @change="getall">
		         <el-option
		            v-for="item in state.typelist"
		            :label="item.name"
		            :value="item.id">
		          </el-option>
		        </el-select>
	        </el-form-item>       	
	     </el-col>
	     <el-col :span="6">
	    		<el-form-item label="选择城市" >
	          <el-select v-model="choosedcity" multiple>
	      	   	<el-option
		            v-for="item in citylist"
		            :label="item.name"
		            :value="item.id">
		          </el-option>
		        </el-select>
	        </el-form-item>       	
	     </el-col>
      <el-col :span="6">
      	 <el-form-item label="选择行业">
      	<el-cascader
			  :options="state.tradelist"
			  :props="props1"
			  v-model="selectedOptions1"
			  change-on-select
			  >
			 </el-cascader>
			  </el-form-item>
      </el-col>
      <el-col :span="6">
	    		<el-form-item label="勾选行业">
	          <el-select v-model="choosedindustry" multiple>
	      	   	<el-option
		            v-for="item in industrylist"
		            :label="item.name"
		            :value="item.id">
		          </el-option>
		        </el-select>
	        </el-form-item>       	
       	</el-col>
</el-row>
</el-form>
<echart-bar :xname='xname' :bardata='bardata' :legenddata="legenddata"></echart-bar>
<div class="mytable">
<table >
	<thead>
		<tr>
			<th rowspan="2">行业</th>
			<th :colspan="alldata.length" class="text-center" v-if='alldata.length!=0'>城市对应行业锅炉蒸吨数(吨)</th>
		</tr>
		<tr>
			<td v-for='city in alldata' style="background-color:#eef1f6;">{{city.districtName}}</td>
		</tr>
	</thead>
	<tbody>
		<tr v-for='pollu in alldata[0].list.length'>
			<td>{{alldata[0].list[pollu-1].tradeName}}</td>
			<td v-for='boiler in alldata.length'>{{alldata[boiler-1].list[pollu-1].sum.toFixed(2)}}</td>
		</tr>
	</tbody>
</table>
</div>
</div>
</template>

<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'

export default {
  components: {
  },
  data () {
    return {
    	state: state,
      action: actions,
      yid:state.watchyear,
      cid:-1,
      props1:{
        label: 'label',
        value: 'value',
        children: 'children'      	
      },
      selectedOptions1:[1],
      typeid:0,
      pid:'',
      industryid: '',
      pname: '四川省',
      choosedindustry:'',
      industrylist: [],
      citylist:[],
      choosedcity:[],
      showdata:false,
      aname:''}
},
computed: {
		xname: function() {
			var list = [];
			for (var i = 0; i < this.choosedcity.length; i++) {
				list.push(this.citylist[this.choosedcity[i]].name)
			};
			return list
		},
		legenddata: function() {
			var list = [];
			for (var i = 0; i < this.choosedindustry.length; i++) {
				list.push(this.industrylist[this.choosedindustry[i]].name)
				console.log(this.industrylist[this.choosedindustry[i]].name);
			};
			console.log(list)
			return list
		},
		bardata: function() {
				var list = [];
				for (var j = 0; j < this.choosedindustry.length; j++) {
					var datalist = [];
					for (var i = 0; i < this.choosedcity.length; i++) {
						datalist.push(this.alldata[this.choosedcity[i]].list[this.choosedindustry[j]].sum)
					};
					list.push({
								name: this.industrylist[this.choosedindustry[j]].name,
								type:'bar',
					data: datalist
				})
			}
			console.log(list)
			return list
		},
	},
	watch: {
		'selectedOptions1'(list) {
	   this.industryid = _.last(list)
	   console.log(this.industryid)
	   this.getall()
   },
   'state.watchyear':{
		   handler: function (val, oldVal) {
		    		console.log(val)
		    		this.yid = val
		  			this.getall()
		  		},
		      deep: true
		   }
},
methods: {
		getall: function() {
			var vm = this;
			api.analyze.gettradefuel('surface/CityTradeTon', vm.typeid, vm.industryid).then(function(res) {
				console.log(res)
				if (res.data.res[0].list.length != 1) {
					vm.alldata = res.data.res;
					vm.getallcity()
						//console.log(vm.alldata)						
					vm.citylist = [];
					vm.industrylist = [];
					vm.choosedindustry = [];
					for (var i = 0; i < vm.alldata.length; i++) {
						if (i == 3 || i == 9 || i == 12) {
							vm.citylist.push({
								name: vm.alldata[i].districtName,
								id: i,
								value: true
							})
							vm.choosedcity = [3, 9, 12];
						} else {
							vm.citylist.push({
								name: vm.alldata[i].districtName,
								id: i,
								value: false
							})
						}
					};
					console.log(vm.citylist)
					if (vm.alldata[0].list.length >= 1) {
						for (var i = 0; i < vm.alldata[0].list.length; i++) {
							if (i < 5) {
								vm.industrylist.push({
									name: vm.alldata[0].list[i].tradeName,
									id: i,
									value: true
								})
								vm.choosedindustry.push(i);
							} else {
								vm.industrylist.push({
									name: vm.alldata[0].list[i].tradeName,
									id: i,
									value: false
								})
							}

						};
					}
				}
				vm.showdata = true
			})
		},
		getallcity: function() {
			var vm = this
			api.analyze.gettradefuel('surface/CityTradeTon2', vm.typeid, vm.industryid).then(function(res) {
				console.log(res)
				vm.alldata.push(res.data.res[0])
			})
		},
	},
	mounted() {
		this.$nextTick(() => {
			var vm = this
			vm.industryid = 1
			vm.aname = this.$route.path
			vm.getall()
		})
	}
}</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
