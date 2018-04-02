<template>
  <div id="commonset" v-if="showdata">
    <h3>全省分地区建筑情况</h3>
    <el-form ref="form"  inline>
    	<el-row :gutter="24">
         <el-col :span="6">
         <el-form-item label="选择类型">
         	<el-select v-model="tid" @change='selecttype'>
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
			<div v-if = "!showchart" class="text-center">
			<h3>没有数据</h3>
		</div>
			<echart-bar :xname='xname' :bardata='bardata' :legenddata="legenddata" v-if="showchart"></echart-bar>
			<div class="mytable" v-if="showchart">
			<table >
				<thead>
					<tr>
						<th rowspan="2">分类</th>
						<th :colspan="alldata.length" class="text-center">城市</th>
					</tr>
					<tr>
						<th v-for='boiler in alldata'>{{boiler.districtName}}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for='pollu in alldata[0].list.length'>
						<td>{{alldata[0].list[pollu-1].name}}</td>
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
			state: state,
			action: actions,
			yid: state.watchyear,
			alldata: [{
				list: []
			}],
			showdata: false,
			pid: 0,
			citylist: [],
			tid:0,
			choosedcities: [],
			showchart:false,
			typeid:2,
			typelist:[{id:0,name:'全省21市州施工面积组成情况（m2）'},{id:1,name:'全省21市州建筑面积组成情况（m2）'},{id:2,name:'全省21市州建筑工地开工现状（km2）'},{id:3,name:'全省21市州建筑工地数量组成情况(个)'}]
}
},
computed: {
		bardata: function() {
			var list = [];
			if (this.tid == 0 || this.tid == 1) {
				var datalist = [];
				for (var j = 0; j < this.choosedcities.length; j++) {
					datalist.push(this.alldata[this.choosedcities[j]].list[this.tid].value)
				}
				list.push({
					name: this.alldata[0].list[this.tid].name,
					type: 'bar',
					stack: 'pollution',
					data: datalist,
				})
			}
			if (this.tid == 2 || this.tid == 3) {
				for (var i = 0; i < this.alldata[0].list.length; i++) {
					var datalist = [];
					for (var j = 0; j < this.choosedcities.length; j++) {
						datalist.push(this.alldata[this.choosedcities[j]].list[i].value)
					};

					list.push({
						name: this.alldata[0].list[i].name,
						type: 'bar',
						stack: 'pollution',
						data: datalist,
					})
				}
			};
			for (var i = 0; i < list.length; i++) {
				var total = 0
				for (var j = 0; j < list[i].data.length; j++) {
					total += list[i].data[j]
				};
				console.log(total)
				list[i].data.push(total)
			};
			return list
		},
		legenddata: function() {
			var list = [];
			if (this.tid == 1) {
				list.push('建筑面积')
			}
			if (this.tid == 0) {
				list.push('施工面积')
			}
			if (this.tid == 2 || this.tid == 3) {
				for (var i = 0; i < this.alldata[0].list.length; i++) {
					list.push(this.alldata[0].list[i].name)
				};
			}
			console.log(this.tid)
			return list
		},
		xname: function() {
			var list = [];
			for (var i = 0; i < this.choosedcities.length; i++) {
				list.push(this.citylist[this.choosedcities[i]].name)
			};
			list.push('总计')
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
		selecttype: function() {
			if (this.tid == 0 || this.tid == 1) {
				this.pname ='construction';
				this.getall();
			}
			if (this.tid == 2) {
				this.pname = 'construction2';
				this.getall();
			}
			if (this.tid == 3) {
				this.pname = 'construction3';
				this.getall();
			}
		},
		getall: function() {
			var vm = this;
			api.analyze.getByType('surface/'  + this.pname + 'city', vm.yid,vm.typeid).then(function(res) {
				console.log(res)
				if(res.data.res.length){
				vm.alldata = res.data.res;
				console.log(vm.alldata)
				vm.citylist = [];
				for (var i = 0; i < res.data.res.length; i++) {

					if (i == 3 || i == 9 || i == 12) {
						vm.citylist.push({
							name: res.data.res[i].districtName,
							id: i,
							value: true
						})

					} else {
						vm.citylist.push({
							name: res.data.res[i].districtName,
							id: i,
							value: false
						})
					}
					vm.choosedcities = [3, 9, 12];
					vm.showchart = true
				};
				} else{
					vm.showchart = false
				}
				vm.showdata = true
			})
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.pname ='construction'
			this.getall()
		})
	}
}
</script>


