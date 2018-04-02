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
		<el-table
		    :data="dev.devices"
		    stripe
		    style="width: 100%">
		    <el-table-column
		      prop="elecDeviceName"
		      label="用电设备"
		      >
		    </el-table-column>
		    <el-table-column
		      label="日用电量(千瓦时)"
		     >
		      <template scope="scope">
		       	<el-input size="small" v-model="scope.row.elecPerDay"></el-input>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="年用电量(千瓦时)">
		      <template scope="scope">
		       	<el-input size="small" v-model="scope.row.elecPerYear"></el-input>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="操作"
		     >
		      <template scope="scope">
		       	<el-button type="primary" size="small" @click="save(scope.$index)">保存</el-button>
				
		      </template>
		    </el-table-column>
		  </el-table>
		  <div style="float: right;margin:10px 0;" >
			<el-button type="success" @click="pass(0)">通过</el-button>
			<el-button type="warning" @click="pass(1)">驳回</el-button>
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
			api.creport.getelec(this.comid,this.year).then(function(res){
				console.log(res)
				if(res.data.fills.length){
				  vm.devices = res.data.fills
				}
				else{
					vm.$message({
						type:'warning',
						message:'用电设备没有数据!'
						})
				}
				console.log(vm.devices)
			},function(bad){})
		},
		save(index) {
			let vm = this
			
			this.devices[0].devices[index].companyid = this.comid
			console.log(this.devices[0].devices[index])
			api.creport.editElec(this.devices[0].devices[index],this.year).then((res)=>{
				if(res.data.status === 0 ){
					
					vm.$message({
						type:'success',
						message:'修改成功'
					})
					vm.getdevices()
						
				} else {
					vm.$message.error(res.data.msg)
				}
			},function(bad){
				
			})
		},
		pass(type){
			let vm = this
			api.creport.changeElecStatus({
					enterpriceId:this.comid,
					fillyear:this.year,
					type:type
				}).then(function(res){
					if (res.data.status === 0) {
							vm.$message({
								type:'success',
								message:'操作成功'
							})
							vm.getdevices()
						} else {
							vm.$message.error(res.data.msg)
						}
					
				},function(bad){})
		}

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
