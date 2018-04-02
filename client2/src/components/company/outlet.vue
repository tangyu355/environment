<template>
	<div id="facility">
		<el-card class="box-card"  v-for="(dev, index) in devices">
			<div slot="header" class="clearfix" style="padding:0;">
				<span style="line-height: 26px;font-size:20px;">{{dev.outletSerial}}</span>
				<span style="line-height: 26px;font-size:20px;">
					<el-tag  v-if="dev.status === 0">未填报</el-tag>
					<el-tag type="danger" v-if="dev.status === 1">未提交</el-tag>
					<el-tag type="warning" v-if="dev.status === 2">待审核</el-tag>
					<el-tag type="success" v-if="dev.status === 3">已审核</el-tag>
				</span>
				
			</div>
			<el-form :model="dev" label-width="120px">
				<el-row>
					
					<el-col :span="12">
						<el-form-item label="排放高度">
							<el-input  size="small" v-model="dev.outletHeight">
							<template slot="append">米</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排放直径">
							<el-input  size="small" v-model="dev.outletDiameter">
							<template slot="append">米</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="经度">
							<el-input  size="small" v-model="dev.e_outlet">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="纬度">
							<el-input  size="small" v-model="dev.n_outlet">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排放口废气流速">
							<el-input  size="small" v-model="dev.ofill.outletVelocity">
							<template slot="append">m/s</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="废气排放流量">
							<el-input  size="small" v-model="dev.ofill.outletFlow">

							<template slot="append">标立方米/小时</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排放口废气温度">
							<el-input  size="small" v-model="dev.ofill.outletTemperature">
							<template slot="append">℃</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="年总废气排放量">
							<el-input  size="small" v-model="dev.ofill.outletTotal">
							<template slot="append">万标立方米</template>
							</el-input>
						</el-form-item>
					</el-col>
					<!--el-col :span="12">
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
					</el-col-->
					
				</el-row>
				<div class="mytable">
					<table >  
						<thead>
							<tr align="center">
								<th width="20%">污染物</th>
								<th>年排放量(吨/年)</th>
								<th>年均排放浓度(毫克/立方米)</th>
								<th v-for="n in 4">{{n}}季度</th>
							</tr>
						</thead>
						<tbody> 
							<tr v-for="item in dev.ofill.pollutants">
								<td>
									<el-tag>{{item.pollutantName}}</el-tag>
								</td>
								<td>
									<el-input size="small" v-model="item.totalAmount"></el-input>
								</td>
								<td>
									<el-input size="small" v-model="item.yearNongdu"></el-input>
								</td>
								<td v-for="i in 4">
									<el-input size="small" v-model="item['s'+i+'Nongdu']"></el-input>
								</td>
							</tr>
						</tbody>
					</table> 
				</div>
				
		</el-form>
		<div style="float: right;margin:10px 0;" >
				<el-button type="primary" @click="save(index)">保存修改</el-button>
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
			api.creport.getoutlet(this.comid,this.year).then(function(res){
				console.log(res)
				if(res.data.list.length){
				vm.devices = res.data.list;
				}
				else{
					vm.$message({
						type:'warning',
						message:'排放口没有数据!'
						})
				}
				console.log(vm.devices)
			},function(bad){})
		},
		save(index,status) {
			console.log('press')
			let vm = this
			if (status) {
				this.devices[index].ofill.status = status
			}
			
			api.creport.editOutInfo(this.devices[index]).then((res)=>{
				if(res.data.status === 0 ){
					api.creport.editOutfill(vm.devices[index].ofill).then(function(res){

						if (res.data.status === 0) {
							vm.editp(vm.devices[index].ofill.pollutants.length,index)
							
							setTimeout(function(){
								vm.$message({
									type:'success',
									message:'修改成功'
								})
								vm.getdevices()
							},1000)
							
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
		editp:function (i,index) {
					var vm = this
					var x = i
					if (i > 0) {
						vm.postp((i-1),index,function(res) {
							if (res.data.status == 0) {
								vm.editp(x-1)
							} else {
								return
							}
						})
					}
				},
				postp:function(i,index,callback){
					var vm = this
					api.creport.editPollutant({
						outletfillId:vm.devices[index].ofill.pollutants[i].outletfillId,
						pollutantId:vm.devices[index].ofill.pollutants[i].pollutantId,
						s1Nongdu:vm.devices[index].ofill.pollutants[i].s1Nongdu,
						s2Nongdu:vm.devices[index].ofill.pollutants[i].s2Nongdu,
						s3Nongdu:vm.devices[index].ofill.pollutants[i].s3Nongdu,
						s4Nongdu:vm.devices[index].ofill.pollutants[i].s4Nongdu,
						yearNongdu:vm.devices[index].ofill.pollutants[i].yearNongdu,
						totalAmount:vm.devices[index].ofill.pollutants[i].totalAmount
					}).then(callback,function(bad){})
				},

	},
	mounted() {
		this.$nextTick(() => {// 代码保证 this.$el 在 document 中
			this.getdevices()
			let vm = this
			
		})
	}
}
</script>
<style scoped>

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
