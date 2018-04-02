<template>
  <div id="commonset">
    <h3>某一产品，分地区每月产品产量占比统计图</h3>
   <el-row :gutter="24">
    	<el-form ref="" label-width="80px">
	    	<!--<el-col :span="6">
	    		<el-form-item label="选择年份">
	          <el-select v-model="yid" @change="getall">
		         	<el-option
		            v-for="item in state.yearlist"
		            :label="item"
		            :value="item">
		          </el-option>
		        </el-select>
	        </el-form-item>
	       </el-col>-->
	       <el-col :span="6">
	    		<el-form-item label="类别" >
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
	    		<el-form-item label="选择产品">
	          <el-select v-model="pid" @change="getall">
		         	<el-option
		            v-for="item in productlist"
		            :label="item.productName"
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
	    </el-form>
	  </el-row>
		<echart-bar :xname='xname' :bardata='bardata' :legenddata="legenddata"></echart-bar>
		<div class="mytable">
		<table >
			<thead>
				<tr>
					<th rowspan="2" width='5%'>月份</th>
					<th rowspan="2">单位</th>
					<th :colspan="alldata.length" class="text-center">当年各城市每月对应产品产量(吨)</th>
				</tr>
				<tr>
					<td v-for='boiler in alldata' style="background-color:#eef1f6;">{{boiler.name}}</td>
				</tr>
			</thead>
			<tbody>
				<tr v-for='pollu in alldata[0].list.length'>
					<td>{{alldata[0].list[pollu-1].name}}</td>
					<td>{{alldata[0].list[pollu-1].unit}}</td>
					<td v-for='boiler in alldata.length'>{{alldata[boiler-1].list[pollu-1].value}}</td>
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
			alldata: [{
				list: []
			}],
			citylist: [],
			pollutionlist: [],
			choosedcities: [],
			choosedpollution: [],
			show: true,
			typeid: 0,
			boilerlist: [],
			pid: '',
			productlist: [],
			state: state,
			action: actions,
			yid: state.watchyear,
		}
	},
	computed: {
		bardata: function() {
			var list = [];
			for (var i = 0; i < this.choosedcities.length; i++) {
				var datalist = [];
				for (var j = 0; j < this.alldata[0].list.length; j++) {
					datalist.push(this.alldata[this.choosedcities[i]].list[j].value)
				}
				list.push({
					name: this.citylist[this.choosedcities[i]].name,
					type: 'line',
					// stack: this.alldata[0].list[j].name,
					data: datalist,
				})
			};
			return list
		},
		xname: function() {
			var list = [];
			for (var i = 0; i < this.alldata[0].list.length; i++) {
				list.push(this.alldata[0].list[i].name)
			};
			return list
		},
		legenddata: function() {
			var list = [];
			console.log(this.choosedcities)
			for (var i = 0; i < this.choosedcities.length; i++) {
				list.push(this.citylist[this.choosedcities[i]].name)
			};
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
		getproduct: function() {
			var vm = this;
			api.analyze.getproduct('getAllProd').then(function(res) {
				console.log(res)
				vm.productlist = res.data.res;
				vm.pid = vm.productlist[0].id;
				vm.getall();
			})
		},
		getall: function() {
			var vm = this;
			api.analyze.getresult('CityProdSum',vm.typeid, vm.pid, vm.yid).then(function(res) {
				console.log(res)
				if (res.data.list.length != 0) {
					vm.alldata = res.data.list;
					for (var i = 0; i < res.data.list.length; i++) {
						if (i == 3 || i == 9 || i == 12) {
							vm.citylist.push({
								name: res.data.list[i].name,
								id: i,
								value: true
							})

						} else {
							vm.citylist.push({
								name: res.data.list[i].name,
								id: i,
								value: false
							})
						}
						vm.choosedcities = [3, 9, 12];

					};
				}
			})
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.getproduct()
		})
	}
}
</script>