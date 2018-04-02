<template>
  <div id="commonset"  v-if="showdata">
    <h3>不同行业窑炉占比图</h3>
   <el-form ref="form" :model="search" inline>
    	<el-row :gutter="24">
           <el-col :span="12">
      	 <el-form-item label="选择行业">
      	<el-cascader style="width:160%"
			  :options="state.tradelist"
			  :props="props1"
			  v-model="selectedOptions1"
			  change-on-select
			  >
			 </el-cascader>
			  </el-form-item>
      </el-col>
			</el-row>
			</el-form>
		<div class="text-center" style="text-align: center;">
		<h3>{{notes}}</h3>
	</div>
	 <echart-pie :legenddata="legenddata" :piedata="serieslist" v-if = "showchart"></echart-pie>
	<div class="mytable">
		<table >
			<thead>
				<tr>
					<th rowspan="2" width='10%'>窑炉类型</th>
					<th :colspan="alldata.length" v-if='alldata.length!=0' class="text-center">行业对应各窑炉类型台数（台）</th>
				</tr>
				<tr>
					<td v-for='boiler in alldata' style="background-color:#eef1f6;">{{boiler.tradeName}}</td>
				</tr>
			</thead>
			<tbody>
				<tr v-for='pollu in alldata[0].list.length'>
					<td style="text-align: center;">{{alldata[0].list[pollu-1].name}}</td>
					<td style="text-align: center;" v-for='trade in alldata.length'>{{alldata[trade-1].list[pollu-1].sum}}</td>
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
			props1: {
				label: 'label',
				value: 'value',
				children: 'children'
			},
			tradeIndex: '',
			selectedOptions1: [1],
			industryid: '',
			notes:'',
	    showdata: false,
	    alldata:[{list:[]}],
	    pievalue:[],
	    boilerlist:[]
	}
},
computed: {
		legenddata: function() {
			var list = [];
			for (var i = 0; i < this.pievalue.length; i++) {
				list.push(this.pievalue[i].name)
			};
			console.log(list)
			return list
		},
		serieslist: function() {
			var list = [];
			list.push({
				type: 'pie',
				radius: '65%',
				center: ['55%', '50%'],
				data: this.pievalue,
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			})
			return list
		},
	},
	watch: {		
	'selectedOptions1' (list) {
	 	this.industryid = _.last(list)
	 	console.log(_.findIndex(this.alldata,{'tradeId':_.last(list)}))		
	 	console.log(this.industryid,this.alldata)
	 	this.getall()
    },
 },
 methods: {
 		getall: function() {
 			var vm = this;
 			api.analyze.gettradeboiler('DeviceCount', vm.industryid).then(function(res) {
 				vm.alldata = res.data.res;
 				console.log(vm.alldata)
 				vm.tradeIndex = _.findIndex(vm.alldata,{'tradeId':vm.industryid})			 
 				vm.getdata(vm.tradeIndex)
 				vm.showchart = true
 			})
 		},
 		getdata: function(index) {
 			console.log('index=' + index)
 			var vm = this;
 			vm.pievalue = [];
 			vm.boilerlist = [];
 			vm.notes = vm.alldata[index].tradeName+'占比图'
 			console.log(vm.alldata)
 			if(vm.alldata.length>0){
	 			for (var i = 0; i < vm.alldata[index].list.length; i++) {
	 				if (vm.alldata[index].list[i].sum != 0) {
	 					vm.boilerlist.push(vm.alldata[index].list[i].name)
	 					vm.pievalue.push({
	 						value: vm.alldata[index].list[i].sum,
	 						name: vm.alldata[index].list[i].name
	 					})
	 				}
	 			}
 			vm.boilerlist.push('其他')
 			vm.pievalue.push({
 				value: 0,
 				name: '其他'
 			}) 			
 			 vm.showdata = true
 			} else{
 				this.$message.error('没有数据!')
 			}
 		}
 	},
 	mounted() {
 		this.$nextTick(() => {
 			this.industryid = 1
 			this.getall()
 		})
 	}
 }</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
