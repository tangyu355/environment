<template>
  <div id="commonset"  v-if="showdata">
    <h3>不同地区、行业产品产量</h3>
   <el-form ref="form" :model="search" inline>
    	<el-row :gutter="24">
    	<!--<el-col :span="6">
      <el-form-item label="选择年份">
        <el-select v-model="yid">
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
	    		<el-form-item label="选择类别" >
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
			</el-row>
			</el-form>
	<echart-bar :xname='xname' :bardata='bardata' :legenddata="legenddata"></echart-bar>
	<div class="mytable">
	<table >
		<thead>
			<tr>
				<th rowspan="2">产品分类</th>
				<th rowspan="2">单位</th>
				<th :colspan="alldata.length" class="text-center">城市</th>
			</tr>
			<tr>
				<td v-for='city in alldata' style="background-color:#eef1f6;">{{city.districtName}}</td>
			</tr>
		</thead>
		<tbody>
			<tr v-for='pollu in alldata[0].list.length'>
				<td>{{alldata[0].list[pollu-1].productName}}</td>
				<td>{{alldata[0].list[pollu-1].unit}}</td>
				<td v-for='boiler in alldata.length'>{{alldata[boiler-1].list[pollu-1].sum}}</td>
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
			cid: -1,
			props1: {
				label: 'label',
				value: 'value',
				children: 'children'
			},
			selectedOptions1: [1],
			typeid: 0,
			pid: '',
			industryid: '',
			citylist: [],
			choosedcity: [],
			showdata: false,
			aname: ''
		}
	},
	computed: {
		xname: function() {
			var list = [];
			for (var i = 0; i < this.choosedcity.length; i++) {
				list.push(this.citylist[this.choosedcity[i]].name)
			};
			console.log(list) 
			return list
		},
		legenddata: function() {
			var list = [];
			for (var j = 0; j < this.alldata[0].list.length; j++) {
				for (var i = 0; i < this.choosedcity.length; i++) {
					list.push(this.alldata[this.choosedcity[i]].list[j].productName)
				};
			}
			console.log(list) 
			return list
		},
		bardata: function() {
			var list = [];
			for (var j = 0; j < this.alldata[0].list.length; j++) {
				var datalist = [];
				for (var i = 0; i < this.choosedcity.length; i++) {
					datalist.push(this.alldata[this.choosedcity[i]].list[j].sum)
				};
				console.log(datalist) 
				list.push({
					name: this.alldata[0].list[j].productName,
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
		getall: function() {
			var vm = this;
			api.analyze.getgoverncost('surface/facilitiesYearCost', vm.typeid, vm.pid, vm.yid,vm.industryid).then(function(res) {
				console.log(res) 
				vm.alldata = res.data.res;
				vm.citylist = [];
				vm.choosedcity = [];
				for (var i = 0; i < res.data.res.length; i++) {
					if(i==3||i==9||i==12){
						vm.citylist.push({
							name:res.data.res[i].districtName,
							id:i,
							value:true
						})								
					}
					else{
						vm.citylist.push({
							name:res.data.res[i].districtName,
							id:i,
							value:false
						})
					}
					vm.choosedcity=[3,9,12];							    
				};
				vm.showdata = true
			})
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.pid = 0 
			this.industryid = 1
			this.getall()
		})
	}
}</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
