<template>
  <div id="fuelset">
    <h3>工业源燃料算法配置</h3>
    <el-row :gutter="10" style="margin-bottom:10px;">
      	<el-col :span="6">
						<el-select  @change="changeindustry" v-model='industryId' id="industry">
						<el-option
					      v-for="item in tradelist"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
						</el-select>
			  </el-col>
			  <el-col :span="6">   		
				 		<el-select v-model="pollutantStyleId" @change='selectpollutantcount'>
				    	<el-option
				      	v-for="(item,index) in pollutantcount"
				      	:key="index"
				      	:label="item.fName"
				      	:value="index">
				    	</el-option>
				  	</el-select>
			  </el-col>
			  <el-col :span="6">
	 					<el-select v-model="pollutantIdx" @change='selectpollutant'> 	
	    				<el-option
					      v-for="(fuel,pindex) in array0"
					      :key="pindex"
					      :label="fuel.fName"
					      :value="pindex">
					    </el-option>
	  				</el-select> 
	  		</el-col>	  
	  </el-row> 
	  <el-card class="box-card">
		  <div slot="header" class="clearfix">
		    <span style="line-height: 36px;">您现在选择的是</span>
		    <el-button style="float:right;" type="primary" @click='setpollutantcount' >保存设置</el-button>
		  </div>
		  <el-input v-model='note' class="form-control" disabled> </el-input>
		</el-card> 
		<table style="width:100%">
			<thead>
				<tr>
					<th>污染物</th>
					<th>排放因子/飞灰比系数(1~100)</th>
					<th width='50%'>计算公式</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="pollutant in array1">
					<td>{{pollutant.pollutantName}}</td>
					<td>
						<div v-if="pollutant.pollutantName=='SO2'&&pollutantStyleId<4">
							<el-input  value="无" disabled></el-input> 
						</div>
						<div v-else>
							<el-input type="number" v-model="pollutant.factor"  ></el-input>
						</div>
					</td>
					<td>
						<div v-if="pollutantStyleId < 3">
							<div v-if="pollutant.pollutantName=='SO2'">
								<el-input value="燃煤消耗量(吨)x平均含硫量(%)×17x（1-去除效率）/1000" disabled>
								</el-input>
							</div>
							<div v-if="pollutant.pollutantName=='PM10'||pollutant.pollutantName=='PM2.5'||pollutant.pollutantName=='PM2.5-10' ">
								<el-input value="燃煤消耗量(吨)x灰分x飞灰比系数x(1-去除效率)/1000" disabled>
								</el-input>
							</div>
							<div  v-if="pollutant.pollutantName!='PM2.5-10'&&pollutant.pollutantName!='PM2.5'&&pollutant.pollutantName!='PM10'&&pollutant.pollutantName!='SO2' ">
								<el-input value="燃煤消耗量(吨)x排放因子（g/kg）x(1-去除效率)/1000" disabled>
								</el-input>
							</div>
						</div>
						<div v-if="pollutantStyleId =='3' && pollutant.pollutantName =='SO2' ">
								<el-input value="燃油消耗量(吨)x平均含硫量(%)×20x（1-去除效率）/1000" disabled></el-input>
						</div>
						<div v-if="pollutantStyleId=='4'">
								<el-input  value="燃气量（万立方米）*0.7129*排放因子(g/kg)*（1-去除效率）/100" disabled></el-input>
						</div>
						<div v-if="pollutantStyleId > 2 && pollutant.pollutantName != 'SO2'&&pollutantStyleId !=4|| pollutantStyleId > 4">
								<el-input value="燃料消耗量（吨）×排放因子（g/kg）×（1-去除效率）/100" disabled></el-input>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	  
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
      industryId: 1,
      pollutantcount:[],
			pollutantStyleId:0,
			pollutantIdx:0,
			array0:'',
			array1:'',
			fId:0,
			sId:0,
			fobject:{},
			pollutantindex:[],
			pollutant:[],
			tradelist:[{id:1,name:'制造业'},{id:2,name:'电力、热力、燃气及生产和供应业'}],
			note:'',      
    }
  },
  computed: {
  },
  methods: {
		gettrade: function(tid, callback) {
			api.setting.getpollutantcount(tid).then(callback);
		},
		selectpollutantcount: function() {
			this.pollutantIdx = 0;
			this.array0 = this.pollutantcount[this.pollutantStyleId].map;
			this.fId = this.pollutantcount[this.pollutantStyleId].fId;
			this.array1 = this.pollutantcount[this.pollutantStyleId].map[this.pollutantIdx].map;
			if(!this.array1[0].formulaId){
				 _.forEach(this.array1, (m1) => {
				 	_.assign(m1,{'formulaId':m1.productId})
				 })
			}
			console.log(this.array1)
			this.sId = this.array0[this.pollutantIdx].fId;
			this.note =  _.find(this.tradelist,{'id':this.industryId}).name + '----' + this.pollutantcount[this.pollutantStyleId].fName + '----' + this.array0[this.pollutantIdx].fName;
		},
		selectpollutant: function() {
			//console.log(this.pollutantcount[this.pollutantStyleId].map)
			this.array1 = this.pollutantcount[this.pollutantStyleId].map[this.pollutantIdx].map;
			if(!this.array1[0].formulaId){
				 _.forEach(this.array1, (m1) => {
				 	_.assign(m1,{'formulaId':m1.productId})
				 })
			}
			this.sId = this.array0[this.pollutantIdx].fId;
			this.note = _.find(this.tradelist,{'id':this.industryId}).name + '----' + this.pollutantcount[this.pollutantStyleId].fName + '----' + this.array0[this.pollutantIdx].fName;
			//console.log(this.note, this.array1.length)
		},
		setpollutantcount: function() {
			var vm = this;
			var rdata = {
				industryId: vm.industryId,
				fId: vm.fId,
				sId: vm.sId,
				pollutant: vm.array1
			};
			//console.log(rdata)
			api.setting.setpollutantcount(rdata).then(function(res) {
				console.log(res)
				if(res.data.status == 0){
					vm.$message({
            type: 'success',
            message: '修改成功!'
            });
             //vm.changeindustry();
				}else{
					vm.$message.error(res.data.msg)
				}
			},function(bad) {
				vm.$message.error(bad)
					//utils.danger('设置失败')
			})
		},
				changeindustry: function() {
					var vm = this;
					api.setting.getpollutantcount(132).then(function(res) {
						//console.log(res)
						vm.pollutantcount = res.data.pollutantcount;
						console.log(vm.pollutantcount)
						vm.array0 = vm.pollutantcount[vm.pollutantStyleId].map;
						vm.fId = vm.pollutantcount[vm.pollutantStyleId].fId;
						vm.array1 = vm.pollutantcount[vm.pollutantStyleId].map[vm.pollutantIdx].map;
						vm.sId = vm.array0[vm.pollutantIdx].fId;
						console.log(vm.array0)
						vm.note = _.find(vm.tradelist,{'id':vm.industryId}).name + '----' + vm.pollutantcount[vm.pollutantStyleId].fName + '----' + vm.array0[vm.pollutantIdx].fName;
						//console.log(vm.note)
					})
					if (this.industryId == 2) {
						var vm = this;
						api.setting.getpollutantcount(809).then(function(res) {
							vm.pollutantcount = res.data.pollutantcount;
							//console.log(vm.pollutantcount)
							vm.array0 = vm.pollutantcount[vm.pollutantStyleId].map;
							vm.fId = vm.pollutantcount[vm.pollutantStyleId].fId;
							vm.array1 = vm.pollutantcount[vm.pollutantStyleId].map[vm.pollutantIdx].map;
							vm.sId = vm.array0[vm.pollutantIdx].fId;
							vm.note =  _.find(vm.tradelist,{'id':vm.industryId}).name + '----' + vm.pollutantcount[vm.pollutantStyleId].fName + '----' + vm.array0[vm.pollutantIdx].fName;
							//console.log(vm.note)
						})
					}
				},
				},
				mounted() {
					this.$nextTick(() => {
						 this.changeindustry();
					})
				}
				}</script>
<style scoped>
.item {
    padding: 18px 0;
  }
  table {
  display: table;
  border-collapse: separate;
  border-spacing: 0px;
  border-color: grey;
  border: 1px solid #dfe6ec;
}
table thead {
  background-color: #eef1f6;
}
table tr {
  height: 40px;
}
table th {
  background-color: #eef1f6;
  text-align: left;
  
}
table td {
  background-color: #fff;
  text-align: left;
  
}
table th,td {
  padding: 5px 15px;
  border-bottom: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
}
</style>