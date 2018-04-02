<template>
 	<div id="fuelset" v-loading.body="isloading" element-loading-text="加载中...">
	<h3 >{{head[aname].name}}</h3>
    <el-row :gutter="24">
    	<el-form ref="" label-width="80px">
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
	      <el-col :span="6" v-if="aname==='glpollutantstat'">
	      		<el-button type="primary"  @click="getboiler" style="margin-bottom:10px;" size="small">查看燃煤锅炉</el-button>
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
		<echart-bar :xname='xname' :bardata='bardata' :legenddata="legenddata"></echart-bar>
		    <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
		    <Button type="primary" size="large" @click="exportExcel" v-if="columnslist[aname]" style="margin:5px 0 5px 0"><Icon type="ios-download-outline" style="color: #fff;"></Icon> 导出数据</Button>
				<div class="mytable">
				<table  v-if="showtable">
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
										{{boiler.list[y-1][head[aname].valuename]}}({{boiler.list[y-1].statvalue.toFixed(2)}}%)
									</p>
									<p v-else>{{boiler.list[y-1][head[aname].valuename].toFixed(2)}}</p>
								</div>

							</td>
						</tr>
					</tbody>
				</table>
				<table  v-if="showboiler">
					<thead>
						<tr>
							<th rowspan="2"></th>
							<th :colspan="alldata.length" class="text-center">污染物</th>
						</tr>
						<tr>
							<td v-for='item in alldata'>{{item.name}}</td>
						</tr>
					</thead>
					<tbody>
						<tr v-for='item in alldata[0].list[0].list.length'>
							<td>{{alldata[0].list[0].list[item-1].pname}}</td>
							<td v-for='month in alldata.length'>{{alldata[month-1].list[0].list[item-1].total.toFixed(2)}}</td>
						</tr>
					</tbody>
				</table>
				<Table :columns="columnslist[aname]" :data="iviewdata" size="small" ref="tableExcel" hidden v-if="columnslist[aname]"></Table>
			</div>
	</div>
</template>

<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'
import table2excel from './table2excel.js';

export default {
	props: {
    searchtype: String
  },
  components: {
  },
  data () {
    return {
	    state: state,
		  action: actions,
		  showboiler:false,
		  yid: state.watchyear,
		  typeid:0,
		  showchart: true,
		  typeid:2,
		  iviewdata:[],
		  isloading:false,
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
					unit: '吨',
					ispro:true
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
					unit: '吨',
					ispro:true
				},
				'CityDeviceCount': {
					name: '分地区分窑炉类型台数统计图',
					yname: 'name',
					ytitle: '窑炉类型',
					xtitle: '城市',
					chooseY: true,
					y: [1, 2, 0],
					mutichooseY: true,
					chooseX: true,
					x: [0, 17],
					valuename: 'count',
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
					unit: '吨',
					ispro:true
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
					unit: '吨',
					ispro:true
				},
				'month': {
					name: '全省每月污染物排放统计图',
					yname: 'pollutionName',
					ytitle: '污染物',
					xtitle: '月份',
					chooseY: false,
					chooseX: false,
					valuename: 'total',
					type: 'line',
					unit: '吨'
				},
				'cityNfertigation': {
					name: '不同地区氮肥NH3排放量（吨）及占比',
					yname: 'nfertigaName',
					ytitle: '氮肥分类',
					xtitle: '城市',
					chooseY: false,
					chooseX: true,
					x: [0, 5, 8, 12, 15, 17],
					valuename: 'statvalue2',
					type: 'bar',
					onestack: true,
					unit: '%',
					percent: true,
					ispro:true
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
					unit: '吨',
					ispro:true
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
					unit: '吨',
					ispro:true
				},
				'CityFuel': {
					name: '分地区分燃料种类的燃料消耗量统计图',
					yname: 'name',
					ytitle: '污染物',
					xtitle: '城市',
					chooseY: true,
					y: [1, 2, 0],
					mutichooseY: true,
					chooseX: true,
					x: [0, 1],
					valuename: 'sum',
					type: 'bar',
					unit: '吨'
				},
				'DeviceCityFuel': {
					name: '分地区分燃料种类的燃料消耗量统计图',
					yname: 'name',
					ytitle: '污染物',
					xtitle: '城市',
					chooseY: true,
					y: [1, 2, 0],
					mutichooseY: true,
					chooseX: true,
					x: [0, 1],
					valuename: 'sum',
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
					x: [0],
					valuename: 'statvalue',
					type: 'bar',
					unit: '吨',
					ispro:true
				},
				'motorcity': {
					name: '机动车不同城市年均活动水平',
					yname: 'name',
					ytitle: '城市',
					xtitle: '车型',
					chooseY: true,
					y: [1, 2, 0],
					mutichooseY: true,
					chooseX: true,
					x: [0, 1],
					valuename: 'value',
					type: 'bar',
					unit: '吨',
					ispro:true
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
					ytitle: '锅炉类型',
					xtitle: '污染物',
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
					unit: '吨',
					ispro:true
				},
				'gasstation': {
					name: '各城市加油站VOCs污染物排放',
					yname: 'name',
					ytitle: '污染物',
					xtitle: '城市',
					chooseY: false,
					chooseX: true,
					x: [0,3,12],
					valuename: 'sum',
					type: 'bar',
					unit: '吨',
					ispro:true
				},
				'oildepot': {
					name: '各城市油库VOCs污染物排放',
					yname: 'name',
					ytitle: '污染物',
					xtitle: '城市',
					chooseY: false,
					chooseX: true,
					x: [0,3,12],
					valuename: 'sum',
					type: 'bar',
					unit: '吨',
					ispro:true
				},
				'laundry': {
					name: '各城市干洗店VOCs污染物排放',
					yname: 'name',
					ytitle: '污染物',
					xtitle: '城市',
					chooseY: false,
					chooseX: true,
					x: [0,3,12],
					valuename: 'sum',
					type: 'bar',
					unit: '吨',
					ispro:true
				},
				'pesticide': {
					name:'各城市农药使用VOCs污染物排放',
					yname: 'name',
					ytitle: '污染物',
					xtitle: '城市',
					chooseY: false,
					chooseX: true,
					x: [0,3,12],
					valuename: 'sum',
					type: 'bar',
					unit: '吨',
					ispro:true
				},
				'energysell': {
					name: '各城市能源销售VOCs污染物排放',
					yname: 'name',
					ytitle: '污染物',
					xtitle: '城市',
					chooseY: false,
					chooseX: true,
					x: [0,3,12],
					valuename: 'sum',
					type: 'bar',
					unit: '吨',
					ispro:true
				},
				'waste': {
					name: '各城市污水厂VOCs污染物排放',
					yname: 'name',
					ytitle: '污染物',
					xtitle: '城市',
					chooseY: false,
					chooseX: true,
					x: [0,3,12],
					valuename: 'sum',
					type: 'bar',
					unit: '吨',
					ispro:true
				},
				'build': {
					name: '各城市房屋建筑VOCs污染物排放',
					yname: 'name',
					ytitle: '污染物',
					xtitle: '城市',
					chooseY: false,
					chooseX: true,
					x: [0,3,12],
					valuename: 'sum',
					type: 'bar',
					unit: '吨',
					ispro:true
				},
				'energyconsume': {
					name: '各城市能源消耗VOCs污染物排放',
					yname: 'name',
					ytitle: '污染物',
					xtitle: '城市',
					chooseY: false,
					chooseX: true,
					x: [0,3,12],
					valuename: 'sum',
					type: 'bar',
					unit: '吨',
					ispro:true
				},
				'CityDevices': {
					name: '不同地区锅炉个数统计图',
					yname: 'name',
					ytitle: '城市',
					xtitle: '锅炉分类',
					chooseY: true,
					y: [1, 2, 0],
					mutichooseY: true,
					chooseX: false,
					valuename: 'count',
					type: 'bar',
					unit: '吨'
				},
				'sourceType': {
					name: '全省不同面源排放量',
					yname: 'groupName',
					ytitle: '污染源',
					xtitle: '污染物',
					chooseY: true,
					y: [5, 6, 7],
					mutichooseY: true,
					chooseX: false,
					valuename: 'statvalue',
					type: 'bar',
					unit: '吨',
					ispro:true
				},
				'constructioncity': {
					name: '全省不同面源排放量',
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
				'GasStationByCity': {
					name: '汽油年吞吐量、柴油年吞吐量、天然气年吞吐量统计图',
					yname: 'name',
					ytitle: '城市',
					xtitle: '分类',
					chooseY: true,
					y: [5, 6, 7],
					mutichooseY: true,
					chooseX: false,
					valuename: 'value',
					type: 'bar',
					unit: '吨',
					ispro:true
				},
				'OildepotByCity': {
					name: '汽油年吞吐量、柴油年吞吐量统计图',
					yname: 'name',
					ytitle: '城市',
					xtitle: '分类',
					chooseY: true,
					y: [5, 6, 7],
					mutichooseY: true,
					chooseX: false,
					valuename: 'value',
					type: 'bar',
					unit: '吨',
					ispro:true
				},
				'boatMonths': {
					name: '四川省各月份船舶污染物排放量（吨）',
					yname: 'pollutantName',
					ytitle: '污染物',
					xtitle: '月份',
					chooseY: true,
					y: [0],
					mutichooseY: false,
					chooseX: false,
					valuename: 'statvalue',
					type: 'line',
					unit: '吨',
					ispro:true
				},
				'motorpollution': {
					name: '机动车不同城市污染物排放统计图',
					yname: 'name',
					ytitle: '城市',
					xtitle: '污染物',
					chooseY: true,
					y: [0],
					mutichooseY: false,
					chooseX: false,
					valuename: 'sum',
					type: 'bar',
					unit: '吨',
					ispro:true
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
					unit: '吨',
					ispro:true
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
					unit: '吨',
					ispro:true
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
					unit: '吨',
					ispro:true
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
					unit: '吨',
					ispro:true
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
					unit: '吨',
					ispro:true
				},
				'NfertilizerByMonth': {
					name: '全省氮肥施肥量月均值',
					yname: 'name',
					ytitle: '月份',
					xtitle: '氮肥分类',
					chooseY: false,
					chooseX: false,
					valuename: 'value',
					type: 'line',
					unit: '吨',
					ispro:true
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
					unit: '吨',
					ispro:true
				},
				'planeType': {
					name: '分城市飞机污染物排放量（吨）',
					yname: 'pollutantName',
					ytitle: '污染物',
					xtitle: '飞机起驾循环次数（次）',
					chooseY: true,
					y: [0],
					mutichooseY: false,
					chooseX: false,
					valuename: 'statvalue',
					type: 'line',
					unit: '吨',
					ispro:true
				},
				'sourceTypeall': {
					name: '全省分污染源排放量',
					yname: 'groupName',
					ytitle: '污染源',
					xtitle: '污染物',
					chooseY: true,
					y: [5, 6, 7],
					mutichooseY: true,
					chooseX: false,
					valuename: 'statvalue',
					type: 'bar',
					unit: '吨',
					ispro:true
				},
				'boilercity': {
					name: '分地区锅炉类型数量统计',
					yname: 'name',
					ytitle: '城市',
					xtitle: '分类',
					chooseY: true,
					y: [5, 6, 7],
					mutichooseY: true,
					chooseX: false,
					valuename: 'value',
					type: 'bar',
					unit: '吨',
					ispro:true
				},
				'cateringcity': {
					name: '分地区餐饮类型数量统计图',
					yname: 'name',
					ytitle: '城市',
					xtitle: '分类',
					chooseY: true,
					y: [5, 6, 7],
					mutichooseY: true,
					chooseX: false,
					valuename: 'value',
					type: 'bar',
					unit: '吨',
					ispro:true
				},
			},
			columnslist:{
				'cityPollutant':[],
				'cityRestaurant':[],
				'cityFirewood':[],
				'nfertigation':[],
				'cityNfertigation':[],
				'dfuelType':[],
				'cityDfuel':[],
				'cityTypefarming':[],
				'cityGarage':[],
				'roaddusttype':[],
				'gasstation':[],
				'oildepot':[],
				'laundry':[],
				'pesticide':[],
				'energysell':[],
				'waste':[],
				'build':[],
				'energyconsume':[],
				'boatMonths':[],
				'cityBoat':[],
				'cityAgricultural':[],
				'cityConstruction':[],
				'constructPollutant':[],
				'machinePollutant':[],
				'planeType':[],
				'motorpollution':[],
				'sourceType':[],
				'sourceTypeall':[],
				'district':[],
				'glpollutantstat':[],
				'month':[],
			},
			tabletitle:{
				'cityPollutant': '',
				'cityRestaurant': '',
				'cityFirewood': '',
				'nfertigation': '',
				'cityNfertigation':'',
				'dfuelType':'',
				'cityDfuel':'',
				'cityTypefarming':'',
				'cityGarage':'',
				'roaddusttype':'',
				'gasstation':'',
				'oildepot':'',
				'laundry':'',
				'pesticide':'',
				'energysell':'',
				'waste':'',
				'build':'',
				'energyconsume':'',
				'boatMonths':'',
				'cityBoat':'',
				'cityAgricultural':'',
				'cityConstruction':'',
				'constructPollutant':'',
				'machinePollutant':'',
				'planeType':'',
				'motorpollution':'',
				'sourceType':'',
				'sourceTypeall':'',
				'district':'',
				'glpollutantstat':'',
				'month':'',
			},
		 	aname: 'cityPollutant',
			alldata: '', //获取的所有数据
		 	xlist: [], //X轴向内容（可能是城市或者污染物等）
		 	contentlist: [], //统计内容（Y轴向内容）
		 	choosedx: [],
	 		choosedcontent: [],
	 		isSmall: false,
	 		show:false,
	 		showtable:true,
	 		isVocs:false
	 	}
	},
	computed: {
	 		xname() {
	 			var list = [];
	 			if(!this.showboiler){
	 			if (this.choosedx.length) {
	 				for (var i = 0; i < this.choosedx.length; i++) {
	 					list.push(this.xlist[this.choosedx[i]].name)
	 				};
	 			} else {
	 				for (var i = 0; i < this.alldata.length; i++) {
	 					list.push(this.alldata[i].name)
	 				}
	 			}
	 			} else{
	 				for (var i = 0; i < this.alldata.length; i++) {
				      list.push(this.alldata[i].name)
			        };
	 			}
	 			if(this.aname=='motorcity'){
	 				list.push('均值')
	 			} else{
	 			  list.push('合计')
	 			}
	 			return list
	 		},
	 		legenddata: function() {
	 			var list = [];
	 			if(!this.showboiler){
	 			for (var i = 0; i < this.choosedcontent.length; i++) {
	 				if (this.contentlist[this.choosedcontent[i]].name !== '合计') {
	 					list.push(this.contentlist[this.choosedcontent[i]].name)
	 				}
	 			};
	 			} else{
	 				for (var i = 0; i < this.alldata[0].list[0].list.length; i++) {
				       list.push(this.alldata[0].list[0].list[i].pname)
			        };
	 			}
	 			return list
	 		},
	 		bardata() {
	 			var list = [];
	 			if(!this.showboiler){
	 			//console.log(this.alldata)
	 			if (this.alldata.length) {
	 				for (var j = 0; j < this.choosedcontent.length; j++) {
	 					var datalist = [];
	 					if (this.choosedx.length) {
	 						for (var i = 0; i < this.choosedx.length; i++) {
	 							//console.log(this.alldata[this.choosedx[i]].list[this.choosedcontent[j]][this.head[this.aname]])
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
	 				if(this.aname=='motorcity'){
	 					list[i].data.push(total/this.choosedx.length)
	 				} else{
	 				  list[i].data.push(total)
	 				}
	 			};
	 			} else{
	 				for(var j = 0;j<this.alldata[0].list[0].list.length;j++){
			     	 	 var datalist = [];
			     	 	 for (var i = 0; i < this.alldata.length; i++) {
			     	 		datalist.push(this.alldata[i].list[0].list[j].total)
			     	 	}
			     	 	list.push({
							name:this.alldata[0].list[0].list[j].pname,
							type:'bar',
							data:datalist
					    })
			     	}
	 			}
	 			return list
	 		},
	 	},
	 	watch: {
	 		'$route': 'fetchData',
	 		'state.watchyear':{
		    	handler: function (val, oldVal) {
		    		this.yid = val
		  			this.getall()
		  		},
		      deep: true
		    }
        },
      methods: {
		fetchData() {
			this.show = false
			console.log(this.searchtype)
			this.aname = this.$route.params.analyname
			if(this.$route.params.isSmall && this.$route.params.isSmall.toString() === "true" ){
				this.isSmall = true
			} else {
				this.isSmall = false
			}
			if(this.$route.params.isSmall && this.$route.params.isSmall.toString() !== "true" && this.$route.params.isSmall.toString() !== "false"){
				this.isVocs = true
			} else {
				this.isVocs = false
			}
			//console.log(this.$route.params.isSmall)
			//console.log(this.isSmall)
    	this.getall()
		},
		selectyear() {
			this.getall()
		},
		getboiler () {
		  this.showboiler = true
		  this.showtable = false
		  console.log(this.alldata)
		},
		exportData (type) {
          if (type === 1) {
	         this.$refs.reftable.exportCsv({
	            filename: this.yid+'年'+this.tabletitle[this.aname]+this.head[this.aname].name
	         });
         }
       },
       exportExcel () {
            table2excel.transform(this.$refs.tableExcel, 'hrefToExportTable', this.yid+'年'+this.tabletitle[this.aname]+this.head[this.aname].name);
        },
		getall () {
			let vm = this
			vm.showboiler = false
			let address = this.aname
			let param = this.yid
			//console.log('isSmall:',this.isSmall)
			if(this.isSmall){
			  address = this.aname + '/' + this.typeid
          }
			if(this.isVocs){
			  address = this.aname + '/' + this.$route.params.isSmall.toString()
          }
			if(this.head[this.aname].ispro){
				param = this.yid + '/' +this.typeid
			}
			//console.log(address,this.isSmall)
			api.analyze.getall('surface/' + address, param).then(function(res) {
				console.log(res)
				if (res.data.status == 0 && res.data.list.length !== 0) {
					vm.alldata = res.data.list;					
					vm.xlist = [];
					vm.contentlist = [];
					vm.columnslist[vm.aname] = []
					for (var i = 0; i < res.data.list.length; i++) {
						vm.xlist.push({
							name: res.data.list[i].name,
							id: i,
							value: false
						})						
						if(vm.columnslist[vm.aname]){						
							vm.columnslist[vm.aname].push({
								title:res.data.list[i].name,
								key:'a' + i
							})							
						}
					};
					vm.columnslist[vm.aname].unshift({title:'分类',key:'name'})
					vm.iviewdata = []					
	        for (var i = 0; i < res.data.list[0].list.length; i++) {
	          	var obj = {}
	          	for (var j = 0; j < res.data.list.length; j++) {          		
	          		obj['a' + j] = res.data.list[j].list[i][vm.head[vm.aname].valuename] 
	          		obj['name'] = res.data.list[j].list[i][vm.head[vm.aname].yname]	  	          		
	          	}	 
	          	vm.iviewdata.push(obj)
	        } 
	        //console.log(vm.iviewdata)
					if(!vm.head[vm.aname]){
							var str = '' + vm.aname
							vm.aname = str.split('/')[0]
					}
					if (res.data.list[0].list.length) {
						for (var i = 0; i < res.data.list[0].list.length; i++) {
							//console.log(res.data.list[0].list[i],vm.aname)
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
							//console.log(vm.xlist,vm.choosedx)
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
						//console.log(vm.contentlist)
						for (var i in vm.choosedcontent) {
							vm.contentlist[vm.choosedcontent[i]].value = true
						}
					}
					vm.showtable = true;
					vm.showchart = true
				} else {
					vm.showchart = false
					vm.showtable = false
				}

				//console.log(vm.contentlist)
				//console.log(vm.choosedcontent,vm.xlist)
				vm.show = true
				vm.isloading = false
			})
		},
	},
	mounted() {
		this.$nextTick(() => {
			//console.log('new')
			this.fetchData()
			this.isloading = true
		})
	}
}
</script>
