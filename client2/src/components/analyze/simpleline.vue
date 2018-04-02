<template>
  <div id="commonset" v-if="show">
    <h3>{{head[aname].title}}</h3>
    <el-row :gutter="24">
    	<el-form ref="" label-width="80px" inline>
    		<el-col :span="6" v-if="head[aname].ispro">
				<el-form-item label="统计类型">
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
	<echart-bar :xname='xname' :legenddata="legenddata" :bardata="bardata" v-if="showchart"></echart-bar>
<div class="mytable" v-if="showchart">
	<table >
		<thead>
			<tr>
				<th rowspan="2"></th>
				<th :colspan="boatdata.length" class="text-center">{{head[aname].yname}}</th>
			</tr>
			<tr>
				<th v-for='item in boatdata'>{{item.name}}</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>{{head[aname].xname}}</td>
				<td v-for='month in boatdata.length'>{{boatdata[month-1].value.toFixed(2)}}</td>
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
			typeid: 2,
			state: state,
			action: actions,
			showchart: true,
			boatdata: [],
			show:false,
			boilerlist: [],
			pievalue: [],
			yid: state.watchyear,
			isSmall: false,
			aname: '',
			 head: {
				'boatMonth': {
					xname: '每月船舶燃油消耗量（kg）',
					yname:'月份',
					title:'每月船舶燃油消耗统计图',
					type:'line',
					ispro:true
				},
				'boatCity': {
					xname: '每月船舶燃油消耗量（kg）',
					yname:'城市',
					title:'每月船舶燃油消耗统计图',
					type:'bar',
					ispro:true
				},
				'motortype': {
					xname: '年均行驶里程（公里/年）',
					yname:'机动车类型',
					title:'全省不同车型活动水平',
					type:'bar',
					ispro:true
				},
       }
 }
},
computed: {
		bardata() {
			var list = [];	
			var datalist = [];
						for (var i = 0; i < this.boatdata.length; i++) {							
							datalist.push(this.boatdata[i].value)	
							 };
						 list.push({
							name:this.head[this.aname].xname,
							type:'line',
							data:datalist
						})
       
			return list
		},
		legenddata:function(){
			var list=[this.head[this.aname].xname]
			return list
		},
		xname: function() {
			var list = [];
			for (var i = 0; i < this.boatdata.length; i++) {
				list.push(this.boatdata[i].name)
			};
			console.log(list)
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
			this.getall()
		},
		getall() {
			var vm = this
			let param = this.yid
			if(this.head[this.aname].ispro){
				param = this.yid + '/' +this.typeid
			}
			api.analyze.getall('surface/'+vm.aname,param).then(function(res){	
			console.log(res)
			  if(res.data.list.length&&res.data.status==0){
				  vm.boatdata = res.data.list;
				  vm.showchart = true
				  vm.show  = true
				} else{
					vm.show = true
					vm.showchart = false
				}
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
