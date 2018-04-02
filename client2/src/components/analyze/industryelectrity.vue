<template>
  <div id="commonset" v-if="showdata">
    <h3>分地区分行业总用电量统计图</h3>
   <el-form ref="form" :model="search" inline>
   	<el-row :gutter="24">
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
	    	<el-form-item label="选择城市">
           <el-select class="form-control" v-model="choosedcity" multiple>
								<el-option v-for="item in citylist" :value="item.id" :label="item.name"></el-option>
							</el-select>
		      </el-form-item>
		</el-col>
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
			</el-row>
	</el-form>
	<echart-bar :xname='xname' :bardata='bardata' :legenddata="legenddata"></echart-bar>
	<div class="mytable">
		<table >
			<thead>
				<tr>
					<th rowspan="2">行业</th>
					<th :colspan="alldata.length" class="text-center">城市对应行业用电量(kw/h)</th>
				</tr>
				<tr>
					<td v-for='city in alldata' style="background-color:#eef1f6;">{{city.districtName}}</td>
				</tr>
			</thead>
			<tbody>
				<tr v-for='pollu in alldata[0].list.length'>
					<td>{{alldata[0].list[pollu-1].tradeName}}</td>
					<td v-for='boiler in alldata.length'>{{alldata[boiler-1].list[pollu-1].sum.toFixed(2)}}</td>
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
			alldata:[{list:[{list:[]}]}],
			props1: {
				label: 'label',
				value: 'value',
				children: 'children'
			},
			selectedOptions1: [1],
			industryid:'',
       name:'',
			citylist:[],
			cityid:'',
			pid:'',
		  plist: [],
			showdata: false,
			pievalue: [],
			boilerlist: [],
			cityIndex:'',
			tradeIndex:'',
		  choosedcity: [],
			industrylist: [],
			choosedindustry: [],
			citylist: []
}
},
computed: {
		bardata: function() {
			//this.selectponent();

			var list = [];
			for (var j = 0; j < this.choosedindustry.length; j++) {
				var datalist = [];
				for (var i = 0; i < this.choosedcity.length; i++) {
					datalist.push(this.alldata[this.choosedcity[i]].list[this.choosedindustry[j]].sum)
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
		legenddata: function() {
			var list = [];
			if (this.choosedindustry.length) {
				for (var i = 0; i < this.choosedindustry.length; i++) {
					list.push(this.industrylist[this.choosedindustry[i]].name)
					console.log(this.industrylist[this.choosedindustry[i]].name);
				};
			}
			return list
		},
		xname: function() {
			var list = [];
			if (this.choosedcity.length) {
				for (var i = 0; i < this.choosedcity.length; i++) {
					list.push(this.citylist[this.choosedcity[i]].name)
				};
			}
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
		    		console.log(val,this.state.changed)
		    		this.yid = val    			
		  			this.getall()
		  		},
		      deep: true
		    }
	},
	methods: {
      getall:function(){
					var vm=this;	
					api.analyze.gettradefuel('surface/CityTradeElecSum',vm.yid,vm.industryid).then(function(res){	
						console.log(res)
						if(res.data.res.length!=0){
						vm.alldata = res.data.res;
						vm.getallcity()
						vm.citylist=[];
						vm.choosedcity = []
						vm.industrylist = []
						vm.choosedindustry = []
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
						for (var i = 0; i < res.data.res[0].list.length; i++) {
								if(i<5){
								vm.industrylist.push({
									name:res.data.res[0].list[i].tradeName,
									id:i,
									value:true
								})
								vm.choosedindustry.push(i)
								}
								else{
									vm.industrylist.push({
									name:res.data.res[0].list[i].tradeName,
									id:i,
									value:false
								})
								}
								
							
						};
						vm.showdata = true
					}
					})
				},
		getallcity:function(){
					var vm=this;	
					api.analyze.gettradefuel('surface/CityTradeElecSum2',vm.yid,vm.industryid).then(function(res){
						console.log(res)
						vm.alldata.push(res.data.res[0])
					})
	 },		
	},
	mounted() {
		this.$nextTick(() => {
			var vm=this
			vm.industryid=1;    
      vm.getall();
		})
	}
}</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
