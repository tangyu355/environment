<template>
	<div id="devices">
		<el-card class="box-card"  v-for="(dev, index) in devices">
			<div slot="header" class="clearfix" style="padding:0;">
				<span style="line-height: 26px;font-size:20px;">{{dev.deviceSerial}}</span>
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
						<el-form-item label="投入使用年份">
							<el-tag>{{dev.serviceLife}}</el-tag>
							<el-tag v-if="dev.enabled==1" type="success">在用</el-tag>
							<el-tag v-else type="danger">停用</el-tag>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="铭牌型号">
							<el-input size="small" v-model="dev.deviceModel"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="设备类型">
							<el-cascader
								v-if="dev.devClass === 0"
						    :options="dtype"
						    v-model="dev.devs">
						  </el-cascader>
						  <el-cascader
								v-if="dev.devClass === 1"
						    :options="ytype"
						    v-model="dev.devs">
						  </el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="燃料">
							<el-cascader
						    :options="ftype"
						    v-model="dev.devfill.fuels"
						    @change="changefuels(index)">
						  </el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="硫份">
							<el-input  size="small" v-model="dev.devfill.scontent">
								<template slot="append">%</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="灰份">
							<el-input size="small" v-model="dev.devfill.ashContent">
								<template slot="append">%</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="挥发份">
							<el-input size="small" v-model="dev.devfill.vocContent">
								<template slot="append">%</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12" v-if="">
						<el-form-item label="工作频率">
							<el-input size="small" v-model="dev.devfill.daysPerYear">
    						<template slot="append">天/年</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label=""><el-input size="small" v-model="dev.devfill.hoursPerDay"><template slot="append">小时/天</template></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="dev.devClass === 1">
					<el-col :span="12" v-if="">
						<el-form-item label="产品名称">
							<el-input size="small" v-model="dev.devfill.productName">
    						
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="">
						<el-form-item label="产量">
							<el-input size="small" v-model="dev.devfill.productTotalYear">
    						<template slot="append">{{dev.devfill.productUnit}}</template>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="原料">
							<el-input size="small" v-model="dev.devfill.materialName">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="原料">
							<el-input size="small" v-model="dev.devfill.materialConsume">
								<template slot="append">{{dev.devfill.materialUnit}}</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="mytable inlinetr">
					<table>
					<thead>
						<tr>
							<th v-for="i in 6"><span>{{i}}月</span><el-input size="mini" style="width:60px;" v-model="dev.devfill['m'+i]"></el-input></th>
							<th>总计</th>
						</tr>
						<tr>
							<th v-for="i in 6"><span>{{(i+6)}}月</span><el-input size="mini" style="width:60px;" v-model="dev.devfill['m'+(i+6)]"></el-input></th>
							<th><el-input size="mini" style="width:60px;" v-model="dev.devfill.mTotalYear"></el-input></th>
						</tr>
					</thead>
					
					
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
			dtype:[],
			ytype:[],
			ftype:[],
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
			api.creport.getdevice(this.comid,this.year).then(function(res){
				console.log(res)
				if(res.data.devicelist.length){
				vm.devices = res.data.devicelist;
				for (var i = vm.devices.length - 1; i >= 0; i--) {
					vm.$set(vm.devices[i],'devs',[vm.devices[i].deviceTypeId,vm.devices[i].deviceTypeId2])
					vm.$set(vm.devices[i].devfill,'fuels',[vm.devices[i].devfill.fuelPid,vm.devices[i].devfill.fuelId])
				};
				} else{
					vm.$message({
						type:'warning',
						message:'锅炉没有数据!'
						})
				}
				console.log(vm.devices)
			},function(bad){})
		},
		save(index,status) {
			console.log('press')
			let vm = this
			if (status) {
				this.devices[index].devfill.status = status
			}
			this.devices[index].deviceTypeId = this.devices[index].devs[0]
			if (this.devices[index].devs.length === 2){
				this.devices[index].deviceTypeId2 = this.devices[index].devs[1]
			}
			api.creport.editdeviceinfo(this.devices[index]).then((res)=>{
				if(res.data.status === 0 ){
					vm.devices[index].devfill.fuelPid = this.devices[index].devfill.fuels[0]
					if (vm.devices[index].devfill.fuels.length === 2){
						vm.devices[index].devfill.fuelId = vm.devices[index].devfill.fuels[1]
					}
					api.creport.editdevicefill(vm.devices[index].devfill).then(function(res){
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
		}

	},
	mounted() {
		this.$nextTick(() => {// 代码保证 this.$el 在 document 中
			this.getdevices()
			let vm = this
			api.staticinformation.getGroupList(1).then((res)=>{if(res.data.status === 0){vm.dtype = res.data.list}})
			api.staticinformation.getGroupList(2).then((res)=>{if(res.data.status === 0){vm.ftype = res.data.list}})
			api.staticinformation.getGroupList(5).then((res)=>{if(res.data.status === 0){vm.ytype = res.data.list}})
		})
	}
}
</script>
<style scoped>
td .el-input {
	width: 55px;
}
.el-form-item {
	margin-bottom: 5px;
}
.inlinetr table td, table th {
	padding: 5px 5px;
}
.inlinetr table tr{
	height: 25px !important;
}

</style>
