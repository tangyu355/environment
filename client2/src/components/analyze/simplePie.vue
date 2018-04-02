<template>
  <div id="commonset" v-if="show">
    <h3>{{head[aname].title}}</h3>
    <el-row :gutter="24">
    	<el-form ref="" inline>
		   <el-col :span="6">			
	    		<el-form-item label="选择类别" v-if="isSmall">
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
	    		<el-form-item label="选择类别" v-if="aname=='roaddustingtype'">
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
				<el-form-item label="选择统计类型" v-if="head[aname].ispro">
					<el-select v-model="typeid" @change="getall">
						<el-option v-for="item in state.typeidList" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
	      </el-form>
	  </el-row>
	  <div v-if = "!showchart" class="text-center">
		<h3>没有数据</h3>
</div>
	<echart-pie :legenddata="legenddata" :piedata="serieslist" v-if="showchart"></echart-pie>
	<div class="mytable" v-if = "showchart">
	<table >
		<thead>
			<tr>
				<th rowspan="2"></th>
				<th :colspan="alldata.length" class="text-center">{{head[aname].xname}}</th>
			</tr>
			<tr>
				<th v-for='boiler in alldata'>{{boiler.name}}</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td style="text-align: center;">{{head[aname].yname}}</td>
				<td style="text-align: center;" v-for='boiler in alldata'>{{boiler.count}}</td>
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
			typeid: 0,
			state: state,
			action: actions,
			typeid:2,
			showchart: false,
			alldata: [{
				list: []
			}],
			show:false,
			boilerlist: [],
			pievalue: [],
			yid: state.watchyear,
			isSmall: false,
			aname: '',
			 head: {
				'DeviceTonCount': {
					xname: '锅炉蒸吨范围(吨)',
					yname:'对应台数(台)',
					title:'不同范围蒸吨占比'
				},
				'devices': {
					xname: '锅炉分类',
					yname:'对应台数(台)',
					title:'不同类型台数占比'
				},
				'MonthFeul': {
					xname: '月份',
					yname:'燃煤消耗（吨）',
					title:'不同月份锅炉燃煤占比'
				},
				'fuelboiler': {
					xname: '锅炉分类',
					yname:'对应台数(台)',
					title:''
				},
				'DeviceMonthFeul':{
					xname: '月份',
					yname:'单位（吨）',
					title:'每月燃煤消耗占比'
				},
				'Nfertilizer':{
					xname: '氮肥分类',
					yname:'单位（吨）',
					title:'全省氮肥施用类型占比图',
					ispro:true
				},
				'CoalGl':{
					xname: '燃煤分类',
					yname:'单位（吨）',
					title:'分类型燃煤锅炉消耗占比'
				},
				'roaddustingtype':{
					xname: '锅炉分类',
					yname:'对应台数(台)',
					title:''
				},
				'cateringtype':{
					xname: '餐馆分类',
					yname:'单位（家）',
					title:'餐饮类型占比图',
					ispro:true
				},
				'boilerton':{
					xname: '锅炉分类',
					yname:'对应台数(台)',
					title:'锅炉类型占比图',
					ispro:true
				},
				'boatType':{
					xname: '分类',
					yname:'燃油(吨)',
					title:'船舶燃油消耗量占比图',
					ispro:true
				},
			}
		}
	},
	computed: {
		serieslist() {
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
		legenddata() {
			var list = [];
			for (var i = 0; i < this.pievalue.length; i++) {
				list.push(this.pievalue[i].name)
			};
			return list
		},
	},
	watch: {
      '$route': 'fetchData',
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
	    fetchData() {
			this.show = false
			this.aname = this.$route.params.analyname
			if (this.$route.params.isSmall.toString() === "true") {
				this.isSmall = true
			} else {
				this.isSmall = false
			}
			this.getall()
		},
		getall() {
			var vm = this;
			let address = this.aname
			let param = this.yid
			//console.log('isSmall:',this.isSmall)
			if(this.isSmall){
			  address =  this.typeid+'/'+this.aname
      } 
      if(this.head[this.aname].ispro){
      	param = this.yid+ '/'+this.typeid
      }
			api.analyze.getall('surface/' + address, param).then(function(res) {
				console.log(res)
				if(res.data.status==0&&res.data.list.length){
				vm.alldata = res.data.list
				vm.boilerlist = []
				vm.pievalue = []
				for (var i = 0; i < vm.alldata.length; i++) {
					vm.boilerlist.push(vm.alldata[i].name);
					vm.pievalue.push({
						value: vm.alldata[i].count,
						name: vm.alldata[i].name
					})
				}
				vm.showchart = true
				vm.show = true
				} else{
					vm.showchart = false
				  vm.show = true
				}
				console.log(vm.boilerlist, vm.pievalue)
			})
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.fetchData()
		})
	}
}</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
