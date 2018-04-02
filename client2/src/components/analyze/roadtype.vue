<template>
  <div id="commonset" v-if="show">
	<h3>全省、某城市道路扬尘占比图</h3>
	<el-row :gutter="24">
		<el-form ref="" inline>
			<el-col :span="6">
				<el-form-item label="选择类型">
					<el-select v-model="pid" @change='selecttype'>
						<el-option v-for="item in typelist" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="6" v-if="pid==2">
				<el-form-item label="选择城市">
					<el-select v-model="cid" @change='getall'>
						<el-option v-for="(item,index) in alldata" :label="item.districtName" :value="index">
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
		</el-form>
	</el-row>
	<echart-pie :legenddata="legenddata" :piedata="serieslist"></echart-pie>
	<div class="mytable">
		<table v-if="pid!=2">
			<thead>
				<tr>
					<th rowspan="2"></th>
					<th :colspan="alldata.length" class="text-center">分类</th>
				</tr>
				<tr>
					<td v-for='boiler in alldata' style="background-color:#eef1f6;">{{boiler.name}}</td>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>对应数量</td>
					<td v-for='boiler in alldata'>{{boiler.value}}</td>
				</tr>
			</tbody>
		</table>
		<table v-if="pid==2&&alldata[0].list">
			<thead>
				<tr>
					<th rowspan="2"></th>
					<th :colspan="alldata.length" class="text-center">分类</th>
				</tr>
				<tr>
					<td v-for='boiler in alldata' style="background-color:#eef1f6;">{{boiler.districtName}}</td>
				</tr>
			</thead>
			<tbody>
				<tr v-for='pollu in alldata[0].list.length'>
					<td>{{alldata[0].list[pollu-1].name}}</td>
					<td v-for='boiler in alldata.length'>{{alldata[boiler-1].list[pollu-1].value.toFixed(2)}}</td>
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
    	typelist:[{id:0,name:'全省道路总长度占比'},{id:1,name:'全省不同等级道路占比'},{id:2,name:'某城市不同等级道路占比'}],
    	state:state,	
        action: actions,
        yid:state.watchyear,
        show:false,
        pname:'',
     	alldata: [{
			list: []
		}],
		citylist: [],
		boilerlist: [],
		pievalue: [],
		pid: 0,
		cid: 0,
		typeid:2
    }
},
computed: {
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
		legenddata: function() {
			var list = [];
			var list = [];
			for (var i = 0; i < this.pievalue.length; i++) {
				list.push(this.pievalue[i].name)
			};
			return list
			console.log(list)
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
				if (this.pid == 0) {
					this.pname ='roaddusting';
				this.getall();
			}
			if (this.pid == 1) {
				this.pname = 'road';
				this.getall();
			}
			if (this.pid == 2) {
				this.pname = 'cityroad';
				this.getall();
			}
		},
		getall: function() {
			var vm = this;
			vm.boilerlist = [];
			vm.pievalue = [];
			console.log(vm.cid)
			api.analyze.getByType('surface/'+ this.pname + 'type', vm.yid,vm.typeid).then(function(res) {
				console.log(res)
				if (vm.pid == 2) {
					vm.alldata = res.data.list;
					//console.log(vm.alldata)
					for (var i = 0; i < vm.alldata[0].list.length; i++) {
						if (vm.alldata[vm.cid].list[i].value != 0) {
							vm.boilerlist.push(vm.alldata[vm.cid].list[i].name);
							vm.pievalue.push({
								value: vm.alldata[vm.cid].list[i].value,
								name: vm.alldata[vm.cid].list[i].name
							})
						}
					}
					vm.boilerlist.push('其他');
					vm.pievalue.push({
						value: 0,
						name: '其他'
					});
				} else {
					vm.alldata = res.data.list;
					for (var i = 0; i < vm.alldata.length; i++) {
						if (vm.alldata[i].value != 0) {
							vm.boilerlist.push(vm.alldata[i].name);
							vm.pievalue.push({
								value: vm.alldata[i].value,
								name: vm.alldata[i].name
							})
						}
					}
					vm.boilerlist.push('其他');
					vm.pievalue.push({
						value: 0,
						name: '其他'
					});
				}
				vm.show = true
				console.log(vm.boilerlist)
			})
		},
	},
	mounted() {
		this.$nextTick(() => {
			var vm = this
			vm.pname ='roaddusting';
		    vm.getall();
    })
  }
}
</script>	

