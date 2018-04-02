<template>
  <div id="commonset"  v-if="showdata">
    <h3>分地区行业的燃煤平均成分</h3>
   <el-form ref="form" :model="search" inline>
    	<el-row :gutter="24">
    	<!--<el-col :span="8">
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
     <el-col :span="8">
	    	<el-form-item label="选择成分" >
	          <el-select v-model="ponentid" @change='selectponent'>
		         <el-option
		            v-for="item in ponentlist"
		            :label="item"
		            :value="item">
		          </el-option>
		        </el-select>
	        </el-form-item>       	
	      </el-col>
	    <el-col :span="8">
	    <el-form-item label="选择城市">
            <el-select v-model="choosedcity" multiple>
	      	   	<el-option
		            v-for="item in citylist"
		            :label="item.name"
		            :value="item.id">
		          </el-option>
		        </el-select>
			</el-form-item>
			</el-col>
      <el-col :span="8">
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
      <el-col :span="8">
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
						<th :colspan="alldata.length" class="text-center">城市对应行业平均{{ponentid}}（吨）</th>
					</tr>
					<tr>
						<td v-for='city in alldata' style="background-color:#eef1f6;">{{city.districtName}}</td>
					</tr>
				</thead>
				<tbody>
					<tr v-for='pollu in alldata[0].list.length'>
						<td>{{alldata[0].list[pollu-1].tradeName}}</td>
						<td v-for='boiler in alldata.length' v-if="ponentid=='硫分'">{{alldata[boiler-1].list[pollu-1].avgS.toFixed(1)}}</td>
						<td v-for='boiler in alldata.length' v-if="ponentid=='灰分'">{{alldata[boiler-1].list[pollu-1].avgAsh.toFixed(1)}}</td>
						<td v-for='boiler in alldata.length' v-if="ponentid=='挥发分'">{{alldata[boiler-1].list[pollu-1].avgVoc.toFixed(1)}}</td>
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
			props1: {
				label: 'label',
				value: 'value',
				children: 'children'
			},
			ponentlist: ['硫分', '灰分', '挥发分'],
			selectedOptions1: [1],
			typeid: 1,
			pid: '',
			industryid: '',
			choosedindustry: '',
			industrylist: [],
			showdata: false,
			aname: '',
			choosedcity: [],
			citylist: [],
			showdata:false,
			ponentid: ''
		}
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

			return list
		},
		bardata: function() {
			var list = [];
			for (var j = 0; j < this.choosedindustry.length; j++) {
				var datalist = [];
				if (this.ponentid == '灰分') {
					for (var i = 0; i < this.choosedcity.length; i++) {
						datalist.push(this.alldata[this.choosedcity[i]].list[this.choosedindustry[j]].avgAsh)
					}
				} else if (this.ponentid == '硫分') {
					for (var i = 0; i < this.choosedcity.length; i++) {
						datalist.push(this.alldata[this.choosedcity[i]].list[this.choosedindustry[j]].avgS)
					}
				} else {
					for (var i = 0; i < this.choosedcity.length; i++) {
						datalist.push(this.alldata[this.choosedcity[i]].list[this.choosedindustry[j]].avgVoc)
					}
				}
				console.log(datalist)
				list.push({
					name: this.industrylist[this.choosedindustry[j]].name,
					type: 'bar',
					data: datalist
				})
			};
			return list
		},
	},
	watch: {
		'selectedOptions1' (list) {
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
		fetchData () {
		  this.aname = this.$route.params.analyname
		  this.getall()
		},
		getall: function() {
			var vm = this;
			api.analyze.gettradefuel('surface/'+vm.aname, vm.yid, vm.industryid).then(function(res) {
				console.log(res)
				if (res.data.list.length != 0) {
					vm.alldata = res.data.list;
					vm.getallcity()
					vm.citylist = [];
					vm.industrylist = [];
					vm.choosedindustry = []
					vm.choosedcity = []
					for (var i = 0; i < res.data.list.length; i++) {
						if (i == 3 || i == 9 || i == 12) {
							vm.citylist.push({
								name: res.data.list[i].districtName,
								id: i,
								value: true
							})

						} else {
							vm.citylist.push({
								name: res.data.list[i].districtName,
								id: i,
								value: false
							})
						}
						vm.choosedcity = [3, 9, 12];

					};
					for (var i = 0; i < res.data.list[0].list.length; i++) {
						if (i < 5) {
							vm.industrylist.push({
								name: res.data.list[0].list[i].tradeName,
								id: i,
								value: true
							})
							vm.choosedindustry.push(i)
						} else {
							vm.industrylist.push({
								name: res.data.list[0].list[i].tradeName,
								id: i,
								value: false
							})
						}

					};
				}
				vm.showdata = true
			})
		},
		selectponent () {
			console.log(this.ponentid)
		},
		getallcity: function() {
			var vm = this;
			api.analyze.gettradefuel('surface/'+vm.aname+'2', vm.yid, vm.industryid).then(function(res) {
				vm.alldata.push(res.data.list[0])
			})
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.industryid = 1
			this.ponentid='灰分'			
			this.fetchData()						
		})
	}
}</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
