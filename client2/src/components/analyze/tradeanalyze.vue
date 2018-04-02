<template>

 	<div id="fuelset" v-if="show">
 		{{isSmall}}
	<h3 >{{head[aname].name}}</h3>	
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
	      <el-col :span="6" v-if="isSmall">
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
	      <el-col :span="6" v-if="head[aname].chooseY && head[aname].mutichooseY">
	    		<el-form-item :label="head[aname].ytitle" >
	          <el-select v-model="choosedcontent" multiple>
		         	<el-option
		            v-for="item in contentlist"
		            :label="item.name"
		            :value="item.id">
		          </el-option>
		        </el-select>
	        </el-form-item>       	
	      </el-col>
	      <el-col :span="6" v-if="head[aname].chooseY && !head[aname].mutichooseY">
		    		<el-form-item :label="head[aname].ytitle"  >
		          <el-select v-model="choosedcontent[0]">
			         	<el-option
			            v-for="item in contentlist"
			            :label="item.name"
			            :value="item.id">
			          </el-option>
			        </el-select>
		        </el-form-item>       	
	       	</el-col>
	      <el-col :span="6">
	    		<el-form-item :label="head[aname].xtitle" v-if="head[aname].chooseX">
	          <el-select v-model="choosedx" multiple>
	      	   	<el-option
		            v-for="item in xlist"
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
							<th rowspan="2" style="min-width:80px">{{head[aname].ytitle}}</th>
							<th :colspan="alldata.length" class="text-center">{{head[aname].xtitle}}</th>
						</tr>
						<tr>
							<th v-for='x in xlist' style="min-width:80px">{{x.name}}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="y in contentlist.length">
							<td style="text-align: center;">{{contentlist[y-1].name}}</td>
							<td style="text-align: center;" v-for='boiler in alldata'>
								<div v-if= "boiler.list[y-1]">
									<p v-if = "head[aname].percent">
										{{boiler.list[y-1].statvalue2}}({{boiler.list[y-1][head[aname].valuename].toFixed(2)}}%)
									</p>
									<p v-else>{{boiler.list[y-1][head[aname].valuename].toFixed(2)}}</p>
								</div>
								
							</td>
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
	props: {
    searchtype: Number
  },
  components: {
  },
  data () {
    return {
	    state: state,
		  action: actions,
		  yid: state.watchyear,
		  typeid:1,
		  choosedindustry: [],
		  industrylist: [],
		  props1:{
	        label: 'label',
	        value: 'value',
	        children: 'children'      	
	      },
         selectedOptions1:[1],
		  head: {
				'cityPollutant': {
					name: '各城市各污染物的排放量',
					yname: 'districtName',
					ytitle: '城市',
					xtitle: '污染物',
					chooseY: true,
					y: [5, 4],
					mutichooseY: true,
					chooseX: false,
					valuename: 'statvalue',
					type: 'bar',
					unit: '吨'
				},
				'cityRestaurant': {
					name: '各城市餐饮PM10、PM2.5、VOCs排放量',
					yname: 'pollutantName',
					ytitle: '污染物',
					xtitle: '城市',
					chooseY: true,
					y: [1, 2, 0],
					mutichooseY: true,
					chooseX: true,
					x: [0, 17],
					valuename: 'statvalue',
					type: 'bar',
					unit: '吨'
				},
				//'firewoodType': {name:'不同农作物类型各污染物排放量（吨）',yname:'name',ytitle:'污染物',xtitle:'城市',chooseY:true,y:[1,2,0],mutichooseY:true,chooseX:true,x:[0,17],valuename:'statvalue',type:'bar',unit:'吨'},
				'cityFirewood': {
					name: '不同地区农作物污染物排放量（吨）',
					yname: 'districtName',
					ytitle: '城市',
					xtitle: '污染物',
					chooseY: true,
					y: [1, 2, 0],
					mutichooseY: true,
					chooseX: false,
					valuename: 'statvalue',
					type: 'bar',
					unit: '吨'
				},
				'nfertigation': {
					name: '氮肥施用氨月排放量（吨）',
					yname: 'pollutantName',
					ytitle: '污染物',
					xtitle: '月份',
					chooseY: false,
					chooseX: false,
					valuename: 'statvalue',
					type: 'line',
					unit: '吨'
				},
				'cityNfertigation': {
					name: '不同地区氮肥NH3排放量（吨）及占比',
					yname: 'nfertigaName',
					ytitle: '污染物',
					xtitle: '城市',
					chooseY: false,
					chooseX: true,
					x: [0, 5, 8, 12, 15, 17],
					valuename: 'statvalue',
					type: 'bar',
					onestack: true,
					unit: '%',
					percent: true
				},
				'cityTypefarming': {
					name: '不同地区氮肥NH3排放量（吨）及占比',
					yname: 'nfertigaName',
					ytitle: '污染物',
					xtitle: '城市',
					chooseY: false,
					chooseX: true,
					x: [0, 5, 8, 12, 15, 17],
					valuename: 'statvalue',
					type: 'bar',
					onestack: true,
					unit: '吨'
				},
				'dfuelType': {
					name: '能源民用燃烧不同污染物排放来源',
					yname: 'firewoodName',
					ytitle: '燃料类型',
					xtitle: '污染物',
					chooseY: true,
					y: [1, 2, 0],
					mutichooseY: true,
					chooseX: true,
					x: [0, 1],
					valuename: 'statvalue2',
					type: 'bar',
					unit: '吨'
				},
				'cityDfuel': {
					name: '各城市民用燃烧排放量',
					yname: 'pollutantName',
					ytitle: '污染物',
					xtitle: '城市',
					chooseY: true,
					y: [1, 2, 0],
					mutichooseY: true,
					chooseX: true,
					x: [0, 17],
					valuename: 'statvalue',
					type: 'bar',
					unit: '吨'
				},
				'district': {
					name: '污染物地区分布统计图',
					yname: 'pollutantname',
					ytitle: '污染物',
					xtitle: '城市',
					chooseY: true,
					y: [1, 2, 0],
					mutichooseY: true,
					chooseX: true,
					x: [0, 17],
					valuename: 'total',
					type: 'bar',
					unit: '吨'
				},
         'glpollutantstat': {
					name: '工业源锅炉排放量统计图',
					yname: 'glname',
					ytitle: '污染物',
					xtitle: '农业机械',
					chooseY: false,
					chooseX: false,
					valuename: 'total',
					type: 'bar',
					unit: '吨'
				},				
				'cityGarage': {
					name: '统计不同类型汽修企业VOCs排放量',
					yname: 'nfertigaName',
					ytitle: '企业等级',
					xtitle: '城市',
					chooseY: false,
					chooseX: true,
					x: [0, 17],
					valuename: 'statvalue',
					type: 'bar',
					unit: '吨'
				},
				'sourceType': {
					name: '分污染源各污染物排放量（吨）',
					yname: 'groupName',
					ytitle: '污染源',
					xtitle: '污染物',
					chooseY: true,
					y: [5, 6, 7],
					mutichooseY: true,
					chooseX: false,
					valuename: 'statvalue',
					type: 'bar',
					unit: '吨'
				},
				'boatMonths': {
					name: '四川省各月份船舶污染物排放量（吨）',
					yname: 'pollutantName',
					ytitle: '污染源',
					xtitle: '月份',
					chooseY: true,
					y: [0],
					mutichooseY: false,
					chooseX: false,
					valuename: 'statvalue',
					type: 'line',
					unit: '吨'
				},
				'cityBoat': {
					name: '各城市船舶污染物排放量',
					yname: 'districtName',
					ytitle: '城市',
					xtitle: '污染物',
					chooseY: true,
					y: [5, 4],
					mutichooseY: true,
					chooseX: false,
					valuename: 'statvalue',
					type: 'bar',
					unit: '吨'
				},
				'cityAgricultural': {
					name: '全省各市州农业机械械尾气排放量（吨）',
					yname: 'pollutantName',
					ytitle: '污染源',
					xtitle: '城市',
					chooseY: true,
					y: [3, 4, 8, 1, 2, 0],
					mutichooseY: true,
					chooseX: false,
					valuename: 'statvalue',
					type: 'bar',
					unit: '吨'
				},
				'cityConstruction': {
					name: '全省各市州工程机械械尾气排放量（吨）',
					yname: 'pollutantName',
					ytitle: '污染源',
					xtitle: '城市',
					chooseY: true,
					y: [3, 4, 8, 1, 2, 0],
					mutichooseY: true,
					chooseX: false,
					valuename: 'statvalue',
					type: 'bar',
					unit: '吨'
				},
				'roaddusttype': {
					name: '四川省21市州道路扬尘排放量(吨)',
					yname: 'name',
					ytitle: '污染物',
					xtitle: '城市',
					chooseY: false,
					chooseX: false,
					valuename: 'sum',
					type: 'bar',
					unit: '吨'
				},
				'constructPollutant': {
					name: '全省不同类型工程机械械尾气排放量(吨)',
					yname: 'pollutantName',
					ytitle: '污染物',
					xtitle: '机型',
					chooseY: false,
					chooseX: false,
					valuename: 'statvalue',
					type: 'bar',
					unit: '吨'
				},
				'machinePollutant': {
					name: '全省不同类型农业机械械尾气排放量(吨)',
					yname: 'pollutantName',
					ytitle: '污染物',
					xtitle: '农业机械',
					chooseY: false,
					chooseX: false,
					valuename: 'statvalue',
					type: 'bar',
					unit: '吨'
				},
				'planeType': {
					name: '分城市飞机污染物排放量（吨）',
					yname: 'pollutantName',
					ytitle: '污染源',
					xtitle: '机场',
					chooseY: true,
					y: [0],
					mutichooseY: false,
					chooseX: false,
					valuename: 'statvalue',
					type: 'line',
					unit: '吨'
				},
				'sourceTypeall': {
					name: '全省分污染源排放量（吨）',
					yname: 'groupName',
					ytitle: '污染源',
					xtitle: '污染物',
					chooseY: true,
					y: [5, 6, 7],
					mutichooseY: true,
					chooseX: false,
					valuename: 'statvalue',
					type: 'bar',
					unit: '吨'
				},		
			},
		 	aname: 'cityPollutant',
			alldata: '', //获取的所有数据
		 	xlist: [], //X轴向内容（可能是城市或者污染物等）
		 	contentlist: [], //统计内容（Y轴向内容）
		 	choosedx: [],
	 		choosedcontent: [],
	 		isSmall: false,
	 		show:false
	 	}
	},
	computed: {
	 		xname() {
	 			var list = [];
	 			if (this.choosedx.length) {
	 				for (var i = 0; i < this.choosedx.length; i++) {
	 					list.push(this.xlist[this.choosedx[i]].name)
	 				};
	 			} else {
	 				for (var i = 0; i < this.alldata.length; i++) {
	 					list.push(this.alldata[i].name)
	 				}
	 			}
	 			list.push('合计')
	 			return list
	 		},
	 		legenddata: function() {
	 			var list = [];
	 			for (var i = 0; i < this.choosedcontent.length; i++) {
	 				if (this.contentlist[this.choosedcontent[i]].name !== '合计') {
	 					list.push(this.contentlist[this.choosedcontent[i]].name)
	 				}
	 			};
	 			return list
	 		},
	 		bardata() {
	 			var list = [];
	 			//console.log(this.alldata)
	 			if (this.alldata.length) {
	 				for (var j = 0; j < this.choosedcontent.length; j++) {
	 					var datalist = [];
	 					if (this.choosedx.length) {
	 						for (var i = 0; i < this.choosedx.length; i++) {
	 							console.log(this.alldata[this.choosedx[i]].list[this.choosedcontent[j]][this.head[this.aname]])
	 							datalist.push(this.alldata[this.choosedx[i]].list[this.choosedcontent[j]][this.head[this.aname].valuename])
	 								//console.log(datalist)
	 						};
	 					}
	 					//console.log(this.contentlist[this.choosedcontent[j]].name)
	 					if (this.head[this.aname].onestack) {
	 						if (this.contentlist[this.choosedcontent[j]].name !== '合计')
	 							list.push({
	 								name: this.contentlist[this.choosedcontent[j]].name,
	 								type: this.head[this.aname].type,
	 								data: datalist	
	 							})
	 					} else {
	 						list.push({
	 							name: this.contentlist[this.choosedcontent[j]].name,
	 							type: this.head[this.aname].type,
	 							data: datalist
	 						})
	 					}

	 					//console.log(list)
	 				};
	 			}
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
	 	},
	 	watch: {
	 		'$route': 'fetchData',
    },
methods: {
		fetchData() {		
			this.show = false
			//console.log(this.$route.params)
			this.aname = this.$route.params.analyname
			if(this.$route.params.isSmall.toString() === "true" ){
				this.isSmall = true
			} else {
				this.isSmall = false
			}
			//console.log(this.$route.params.isSmall)
			//console.log(this.isSmall)
    	this.getall()
		},
		selectyear() {
			this.getall()
		},
		getall () {
			let vm = this
			let address = this.aname
			//console.log('isSmall:',this.isSmall)
			if(this.isSmall){
			  address = this.aname + '/' + this.typeid
       }
			//console.log(address,this.isSmall)
			api.analyze.getall('surface/' + address, this.yid).then(function(res) {
				console.log(res)
				if (res.data.status == 0 && res.data.list.length !== 0) {
					vm.alldata = res.data.list;
					vm.xlist = [];
					vm.contentlist = [];
					for (var i = 0; i < res.data.list.length; i++) {
						vm.xlist.push({
							name: res.data.list[i].name,
							id: i,
							value: false
						})
					};
					if(!vm.head[vm.aname]){
							var str = '' + vm.aname
							vm.aname = str.split('/')[0]
					}
					if (res.data.list[0].list.length) {
						for (var i = 0; i < res.data.list[0].list.length; i++) {
							vm.contentlist.push({
								name: res.data.list[0].list[i][vm.head[vm.aname].yname],
								id: i,
								value: false
							})
						}
					}
					if (vm.head[vm.aname].chooseX === false) {
						vm.choosedx = []
						for (var i in vm.xlist) {
							vm.choosedx.push(vm.xlist[i].id)
						}
					} else {
						vm.choosedx = vm.head[vm.aname].x;
						for (var i in vm.choosedx) {
							vm.xlist[vm.choosedx[i]].value = true
						}
					}
					if (vm.head[vm.aname].chooseY === false) {
						vm.choosedcontent = []
						for (var i in vm.contentlist) {
							vm.choosedcontent.push(vm.contentlist[i].id)
						}
					} else {
						vm.choosedcontent = vm.head[vm.aname].y;
						console.log(vm.contentlist)
						for (var i in vm.choosedcontent) {
							vm.contentlist[vm.choosedcontent[i]].value = true
						}
					}
					vm.showtable = true;
				} else {
					vm.$message.error('没有数据！')
				}

				//console.log(vm.contentlist)
				//console.log(vm.choosedcontent,vm.xlist)
				vm.show = true
			})
		},
	},
	mounted() {
		this.$nextTick(() => {
			//console.log('new')
			this.fetchData()
		})
	}
}
</script>