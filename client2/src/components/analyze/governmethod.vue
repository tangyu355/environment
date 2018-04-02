<template>
  <div id="commonset" v-if="showdata">
    <h3>不同地区、行业产品产量</h3>
   <el-form ref="form" :model="search" inline>
    	<el-row :gutter="24">
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
	          <el-select class="form-control" v-model="pid" @change="changetype" id="governtype">
								<el-option v-for="item in plist" :value="item.id" :label="item.name"></el-option>
							</el-select>
	        </el-form-item>       	
	      </el-col>
	    <el-col :span="6">
	    	<el-form-item label="选择城市">
           <el-select class="form-control" v-model="cityid" @change="changecity">
								<el-option v-for="(y,index) in citylist" :value="index" :label="y.name"></el-option>
							</el-select>
		      </el-form-item>
		</el-col>
			</el-row>
	</el-form>
	<div class="text-center" style="text-align: center;">
		<h3>{{notes}}</h3>
	</div>
	<echart-pie :piedata="serieslist" :legenddata="legenddata"></echart-pie>
	<div class="mytable">
		<table >
			<thead>
				<tr>
					<th rowspan="2" width='10%'>治理设施分类</th>
					<th :colspan="alldata[0].list.length" v-if='alldata[0].list.length!=0' class="text-center">各行业对应治理设施</th>
				</tr>
				<tr>
					<td v-for='boiler in alldata[0].list' style="background-color:#eef1f6;">{{boiler.tradeName}}</td>
				</tr>
			</thead>
			<tbody>
				<tr v-for='pollu in alldata[cityid].list[0].list.length'>
					<td style="text-align: center;">{{alldata[cityid].list[0].list[pollu-1].name}}</td>
					<td style="text-align: center;" v-for='city in alldata[0].list.length'>{{alldata[cityid].list[city-1].list[pollu-1].count}}</td>
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
		    notes:'',
			showdata: false,
			pievalue: [],
			boilerlist: [],
			cityIndex:'',
			tradeIndex:''
   }
},
computed: {
		legenddata() {
			var list = [];
			for (var i = 0; i < this.pievalue.length; i++) {
				list.push(this.pievalue[i].name)
			};
			return list
		},
		serieslist: function() {
			var list = [];
			list.push({
				type: 'pie',
				radius: '65%',
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
	},
	watch: {
		  'selectedOptions1' (list) {
			this.industryid = _.last(list) 
			console.log(this.industryid)			
			this.getall(this.industryid,this.pid);
		}
	},
	methods: {
		getplist:function(){
					var vm = this;
                    api.staticinformation.getTech().then(function(res){
                    	console.log(res)
                    	vm.plist=[]
                    	for(var i=0; i< res.data.staticlist.length;i++){
                    		vm.plist.push({
                    			id:res.data.staticlist[i].it,
                    			name:res.data.staticlist[i].str
                    		})
                    	}
                vm.pid=vm.plist[0].id
				        vm.cityid=0
				        vm.industryid=1
				        vm.getall(vm.industryid,vm.pid)
              });
    },
    changetype () {
    	this.getall(this.industryid,this.pid)
    },
		getall: function(tid,pid) {
			var vm = this;
			  api.analyze.getresults('surface/CityTradeTech',tid,pid).then(function(res) {
				console.log(res) 
				vm.alldata = res.data.res;
				vm.tradeIndex = _.findIndex(vm.alldata[vm.cityid].list,{'tradeid':vm.industryid})
				console.log(vm.tradeIndex)
				vm.citylist=[];					
						for (var i = 0; i < res.data.res.length; i++) {
								vm.citylist.push({
									name:res.data.res[i].districtName,
									  id:res.data.res[i].cityid	
								})
						};
						vm.getdata(vm.cityid,vm.tradeIndex);
			})
		},
		changecity () {
			var vm = this
			vm.getdata(vm.cityid,vm.tradeIndex);
		},
    getdata:function(index,pindex){
					
					console.log('index='+index,'pindex='+pindex)
					var vm=this;
					vm.pievalue=[];		
					vm.boilerlist=[];
					//console.log(vm.alldata)
					vm.notes =vm.alldata[index].districtName +vm.alldata[index].list[pindex].tradeName+'占比图'
					if(vm.alldata[index].list[pindex].list.length!=0){
					console.log(vm.alldata[index].list[pindex].list)
						for(var i=0;i<vm.alldata[index].list[pindex].list.length;i++){	
							if(vm.alldata[index].list[pindex].list[i].count!=0){
							vm.boilerlist.push(vm.alldata[index].list[pindex].list[i].name)
								vm.pievalue.push({
									value:vm.alldata[index].list[pindex].list[i].count,
									name:vm.alldata[index].list[pindex].list[i].name
								})	
							}															
						}
					
						vm.boilerlist.push('其他')
						vm.pievalue.push({
									value:0,
									name:'其他'
						})	
					}
					vm.showdata = true
				},		
	},
	mounted() {
		this.$nextTick(() => {
			var vm=this
			vm.getplist()
		})
	}
}</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
