<template>
  <div id="commonset" v-if="showdata">
    <h3>各城市农业机械类型统计图</h3>
    <el-form ref="form"  inline>
    	<el-row :gutter="24">
         <el-col :span="6">
         <el-form-item label="选择类型">
         	<el-select v-model="pid" @change='getall'>
	           <el-option
	            v-for="item in typelist" 
	            :label="item.name"
	            :value="item.id">
	          </el-option>
	        </el-select>
         </el-form-item>
         </el-col>
          <el-col :span="6">
	    <el-form-item label="选择城市">
            <el-select v-model="choosedcities" multiple>
	      	   	<el-option
		            v-for="item in citylist"
		            :label="item.name"
		            :value="item.id">
		          </el-option>
		        </el-select>
			</el-form-item>
			</el-col>
			<el-col :span="6">
				<el-form-item label="选择统计类型">
					<el-select v-model="typeid" @change="getall">
						<el-option v-for="item in state.typeidList" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			</el-row>
			</el-form>
			<echart-pie :legenddata="legenddata" :piedata="serieslist"></echart-pie>
			<div class="mytable">
			<table >
				<thead>
					<tr>
						<th rowspan="2"></th>
						<th :colspan="alldata.length" class="text-center">城市</th>
					</tr>
					<tr>
						<th v-for='boiler in alldata'>{{boiler.name}}</th>
					</tr>
				</thead>
				<tbody v-if="pid==0">
					<tr>
						<td>数量</td>
						<td v-for='boiler in alldata.length'>{{alldata[boiler-1].number}}</td>
					</tr>
				</tbody>
				<tbody v-if="pid==1">
					<tr>
						<td>数量</td>
						<td v-for='boiler in alldata.length'>{{alldata[boiler-1].kw}}</td>
					</tr>
				</tbody>
				<tbody v-if="pid==2">
					<tr>
						<td>数量</td>
						<td v-for='boiler in alldata.length'>{{alldata[boiler-1].fuelConsume}}</td>
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
	components: {},
	data() {
		return {
			state: state,
			action: actions,
			yid: state.watchyear,
			alldata: [{
				list: []
			}],
			showdata: false,
			pid: 0,
			typeid:2,
			citylist: [],
			choosedcities: [],
			typelist:[{id:0,name:'农业机械保有量/台'},{id:1,name:'农业机械保有量/kw'},{id:2,name:'农业机械油消耗量/吨'}]
		}
	},
	computed: {
		boilerlist: function() {
			var list = [];
			for (var j = 0; j < this.choosedcities.length; j++) {
				list.push(this.citylist[this.choosedcities[j]].name)
			}
			return list
		},
		pievalue: function() {
			var vm = this;
			var list = [];
			for (var j = 0; j < vm.choosedcities.length; j++) {
				if (vm.pid == 0) {
					list.push({
						value: vm.alldata[vm.choosedcities[j]].number,
						name: vm.citylist[vm.choosedcities[j]].name
					})
				}
				if (vm.pid == 1) {
					list.push({
						value: vm.alldata[vm.choosedcities[j]].kw,
						name: vm.citylist[vm.choosedcities[j]].name
					})
				}
				if (vm.pid == 2) {
					list.push({
						value: vm.alldata[vm.choosedcities[j]].fuelConsume,
						name: vm.citylist[vm.choosedcities[j]].name
					})
				}
			}
			return list;
		},
		legenddata() {
			var list = [];
			for (var i = 0; i < this.pievalue.length; i++) {
				list.push(this.pievalue[i].name)
			};
			return list
		},
		serieslist: function() {
			var list = [];
			list.push({
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: this.pievalue,
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			})
			console.log(list)
			return list
		},
	},
	watch: {
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
				api.analyze.getdirect('farm', vm.yid,vm.typeid).then(function(res) {
				console.log(res)
				if (res.data.list.length != 0) {
					vm.alldata = res.data.list;
					vm.choosedcities = [];
					vm.citylist = [];
					for (var i = 0; i < res.data.list.length; i++) {

						if (i == 0) {
							vm.citylist.push({
								name: res.data.list[i].name,
								id: i,
								value: true
							})
                          vm.choosedcities = [0]
						} else {
							vm.citylist.push({
								name: res.data.list[i].name,
								id: i,
								value: false
							})
						}
						
					};
					console.log(vm.citylist)
					vm.showdata = true
				}
			})
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.pid = 0
			this.getall()
		})
	}
}
</script>

