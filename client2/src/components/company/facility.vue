<template>
	<div id="facility">
		<el-card class="box-card"  v-for="(dev, index) in devices">
			<div slot="header" class="clearfix" style="padding:0;">
				<span style="line-height: 26px;font-size:20px;">治理设施{{index+1}}</span>
				<span style="line-height: 26px;font-size:20px;">
					<el-tag  v-if="dev.status === 0">未填报</el-tag>
					<el-tag type="danger" v-if="dev.status === 1">未提交</el-tag>
					<el-tag type="warning" v-if="dev.status === 2">待审核</el-tag>
					<el-tag type="success" v-if="dev.status === 3">已审核</el-tag>
				</span>
				
			</div>
			<el-form :model="dev" label-width="100px">
				<el-row>
					<el-col :span="12">
						<el-form-item label="治理工艺">
							<el-cascader
						    :options="ftype"
						    v-model="dev.tech"
						    @change="changefuels(index)">
						  </el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="污染物">
							<el-select v-model="dev.pollutantId" placeholder="年份">
					         <el-option
					            v-for="item in ptypes"
					            :label="item.str"
					            :value="item.it">
					          </el-option>
					        </el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="设备型号">
							<el-input  size="small" v-model="dev.facilityModel">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="相关排放口">
							<el-tag>{{dev.outletSerial}}</el-tag>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="工段">
							<el-select v-model="dev.steplist" multiple placeholder="请选择">
							    <el-option
							      v-for="item in steps"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							  </el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="设备">
							<el-select v-model="dev.devlist" multiple placeholder="请选择">
							    <el-option
							      v-for="item in devs"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							  </el-select>
						</el-form-item>
					</el-col>
					
				</el-row>
				<div class="mytable">
					<table >  
						<thead>
							<tr align="center">
								<th rowspan="2">废气收集率(%)</th>
								<th colspan="5" v-if="dev.technique1 == 5001" class="text-center">脱硫情况</th>
								<th colspan="6" v-if="dev.technique1 == 5002" class="text-center">脱硝情况情况</th>
								<th colspan="3" v-if="dev.technique1 == 5003" class="text-center">除尘情况</th>
								<th colspan="2" v-if="dev.technique1 == 5004||dev.technique1 == 5005" class="text-center">其他污染物治理情况</th>
							</tr>
							<tr v-if="dev.technique1 == 5001">
						
								<th>主要脱硫剂名称</th>
								<th>主要脱硫剂消耗量(吨)</th>
								<th>脱硫设施运行费用(万元/年)</th>
								<th>脱硫效率(%)</th>
								<th>脱硫设备运行天数(天/年)</th>
							</tr>
							<tr v-if="dev.technique1 == 5002">
								
								<th>主要脱硝剂名称</th>
								<th>主要脱硝剂消耗量(吨)</th>
								<th>氨逃逸率(%)</th>
								<th>脱硝设施运行费用(万元/年)</th>
								<th>脱硝效率(%)</th>
								<th>脱硝设备运行天数(天/年)</th>
							</tr>
							<tr v-if="dev.technique1 == 5003">
								
								<th>除尘设施运行费用</th>
								<th>除尘效率(%)</th>
								<th>除尘设施运行天数(天/年)</th>
							</tr>
							<tr v-if="dev.technique1 == 5004||dev.technique1==5005">
								
								<th>去除效率(%)</th>
								<th>治理设施运行天数(天/年)</th>
							</tr>
						</thead>
						<tbody> 
							<tr >
								
								<td>
									
									<el-input  v-model="dev.cfill.collectRate"></el-input>
								</td>
								<td  v-if="dev.technique1 <= 5002">
									<el-input  v-model="dev.cfill.materialName"></el-input>
								</td>
								<td  v-if="dev.technique1 <= 5002">
									<el-input  v-model="dev.cfill.materialConsume"></el-input>
								</td>
								<td  v-if="dev.technique1 == 5002">
									<el-input  v-model="dev.cfill.nh3Release"></el-input>
								</td>
								<td v-if="dev.technique1 != 5004 && dev.technique1 != 5005">
									<el-input  v-model="dev.cfill.yearCost"></el-input>
								</td>
								<td>
									<el-input  v-model="dev.cfill.disRate"></el-input>
								</td>
								<td>
									<el-input  v-model="dev.cfill.daysPerYear"></el-input>
								</td>
							</tr>
						</tbody>
					</table> 
				</div>
				
		</el-form>
		<div style="float: right;margin:10px 0;" >
				<el-button type="primary" @click="save(index,null)">保存修改</el-button>
				<el-button type="success" @click="save(index,3)">保存并通过</el-button>
				<el-button type="warning" @click="save(index,1)">驳回</el-button>
				</div>
	</el-card>
</div>
</template>

<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'

export default {
	components: {
	},
	props:["comid","year"],
	data () {
		return {
			devices:[],
			ptypes:[],
			ftype:[],
			devs:[],
			steps:[],
		}
	},
	watch: {
		'comid': 'getdevices'
	},	
	methods : {
		changefuels(index){
			console.log(index)
		},
		getdevices () {
			console.log('get d')
			this.getdevice()
		},
		saveChange(data){
			var vm = this;
		},
		getdevice () {
			var vm = this;
			console.log(this.comid,this.year)
			api.creport.getfacility(this.comid,this.year).then(function(res){
				console.log(res)
				if(res.data.list.length){
				vm.devices = res.data.list;
				for (var i = vm.devices.length - 1; i >= 0; i--) {
					vm.$set(vm.devices[i],'tech',[vm.devices[i].technique1,vm.devices[i].technique2])
					vm.$set(vm.devices[i],'steplist',[])
					vm.$set(vm.devices[i],'devlist',[])
					_.forEach(vm.devices[i].steps,function(s){
						vm.devices[i].steplist.push(s.stepId)
					})
					_.forEach(vm.devices[i].devices,function(s){
						vm.devices[i].devlist.push(s.deviceId)
					})
				};
				}
			 else{
					vm.$message({
						type:'warning',
						message:'治理设施没有数据!'
						})
				}
				console.log(vm.devices)
			},function(bad){})
		},
		save(index,status) {
			console.log(this.devices[index])
			let vm = this
			if (status) {
				this.devices[index].cfill.status = status
			}
			this.devices[index].technique1 = this.devices[index].tech[0]
			if (this.devices[index].tech.length === 2){
				this.devices[index].technique2 = this.devices[index].tech[1]
			}
			this.devices[index].enterpriceId = this.comid;
			this.devices[index].id = this.devices[index].cfill.facilityId;
			this.devices[index].cfill.enterpriceId = this.comid;
			console.log(this.devices[index])
			api.creport.editFacility(this.devices[index]).then((res)=>{
				if(res.data.status === 0 ){
					vm.addstep(vm.devices[index].facilityid,vm.devices[index].steplist)
					vm.adddevice(vm.devices[index].facilityid,vm.devices[index].devlist)
					api.creport.editFacilityFill(vm.devices[index].cfill).then(function(res){
						if (res.data.status === 0) {
							vm.$message({
								type:'success',
								message:'修改成功'
							})
							vm.getdevices()
						} else {
							vm.$message.error('chucuo')
						}
						
					},function(bad){})
				} else {
					vm.$message.error(res.data.msg)
				}
			},function(bad){
				
			})
		},
		addstep:function(id,step){
			var vm = this
			var dobject = { 
					data:{
						stepid:step,
						facilityid:id
					}
				}
			api.creport.addstep(JSON.stringify(dobject)).then(function(res){							
			})
		},
		adddevice:function(id,device){
			var vm = this;
			var dobject = {
				data:{
					deviceid:device,
					facilityid:id
				}
			}
			api.creport.adddevice(JSON.stringify(dobject)).then(function(res){
			})
		}
	},
	mounted() {
		this.$nextTick(() => {// 代码保证 this.$el 在 document 中
			this.getdevices()
			let vm = this
			api.staticinformation.getGroupList(8).then((res)=>{if(res.data.status === 0){vm.ftype = res.data.list}})
			api.staticinformation.getAllpollutant().then((res)=>{if(res.data.status === 0){
				console.log(res)
				vm.ptypes = res.data.pollutant
			}})
			api.creport.getownstep(this.year,this.comid).then((res)=>{
				if(res.data.status === 0){
					console.log(res.data)
					vm.steps = []
					for(var i = 0; i < res.data.steps.length; i++) {
						vm.steps.push({
							label: res.data.steps[i].stepSerial,
							value: res.data.steps[i].stepId
						})
					}
					console.log(vm.steps)
				}
			},(bad)=>{})
			api.creport.getowndevice(vm.comid).then(function(res){
				if(res.data.status === 0){
					console.log(res)
					vm.devs = [];
					for(var i = 0; i < res.data.devicelist.length; i++) {
						vm.devs.push({
							label: res.data.devicelist[i].deviceSerial,
							value: res.data.devicelist[i].id
						})
					}
					console.log(vm.devs)
				}
			},function(bad){})
		})
	}
}
</script>
<style scoped>
.myclass {
  overflow-x:auto; 
}
td .el-input {
	width: 75px;
}
.el-form-item {
	margin-bottom: 5px;
}
table td, table th {
	padding: 5px 5px;
	text-align: center;
}
table tr{
	height: 25px !important;
}

</style>
