<template>
	<div id="devices">
		<el-card class="box-card"  v-for="(dev, index) in datalist">
			<div slot="header" class="clearfix" style="padding:0;">
				<span style="line-height: 26px;font-size:20px;">{{dev.stepSerial}}-{{dev.product.productName}}</span>
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
						<el-form-item label="工段">
						<el-input size="small" v-model="dev.stepName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="设备名称">
							<el-input size="small" v-model="dev.mainDevices"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="">
						<el-form-item label="工作频率">
							<el-input size="small" v-model="dev.product.daysPerYear">
    						<template slot="append">天/年</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label=""><el-input size="small" v-model="dev.product.hoursPerDay"><template slot="append">小时/天</template></el-input>
						</el-form-item>
					</el-col>
					
				</el-row>
			</el-form>
			<div class="mytable inlinetr">
					<table>
						<thead>
							<tr>
								<th >原辅料名称</th>
								<th>年消耗量</th>
								<th>单位</th>
							</tr>
						</thead>	
						<tbody>
							<tr v-for="m in dev.material">
								<td>{{m.materialName}}</td>
								<td><el-input size="small" v-model="m.consumeOfYear"></el-input></td>
								<td>{{m.unit}}</td>
							</tr>
						</tbody>
					</table>
					<table>
						<thead>
							<tr>
								<th v-for="i in 6"><span>{{i}}月</span><el-input size="mini" style="width:60px;" v-model="dev.product['m'+i]"></el-input></th>
								
							</tr>

							<tr>
								<th v-for="i in 6"><span>{{(i+6)}}月</span><el-input size="mini" style="width:60px;" v-model="dev.product['m'+(i+6)]"></el-input>
								</th>
							</tr>
							<tr>
								<th>设计年产量</th>
								<th colspan="2"><el-input size="mini"  v-model="dev.product.designOutput"><template slot="append">{{dev.product.unit}}</template></el-input></th>
								<th>真实年总产量</th>
								<th colspan="2"><el-input size="mini"  v-model="dev.product.realOutput"><template slot="append">{{dev.product.unit}}</template></el-input></th>
							</tr>
						</thead>
					</table>
					</div>
		<div style="float: right;margin:10px 0;" >
				<el-button type="primary" @click="save(index)">保存修改</el-button>
				<el-button type="success" @click="save(index,3)">通过</el-button>
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
			datalist:[],
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
		get () {
			var vm = this;
			console.log(this.comid,this.year)
			api.creport.getstep(this.comid,this.year).then(function(res){
				console.log(res)
				if(res.data.status==0){
					if(res.data.steplist.length){
					   vm.datalist = res.data.steplist;
					}
				    else{
						vm.$message({
							type:'warning',
							message:'产品没有数据!'
							})
					}
			   }
				console.log(vm.datalist)
			},function(bad){})
		},
		save(index,status) {
			console.log('press')
			let vm = this
			if (status) {
				this.datalist[index].product.status = status || 2
			}
			
			api.creport.editStepInfo(this.datalist[index]).then((res)=>{
				if(res.data.status === 0 ){
					vm.datalist[index].product.id = vm.datalist[index].id
					api.creport.editProductFill(vm.datalist[index].product).then(function(res){
						if (res.data.status === 0) {
							for (var i = 0; i < vm.datalist[index].material.length; i++) {
									api.creport.editMaterial({
										id:vm.datalist[index].id,
										materialId:vm.datalist[index].material[i].materialId,
										consumeOfYear:vm.datalist[index].material[i].consumeOfYear,
										unit:vm.datalist[index].material[i].unit,
									}).then(function(res){},function(bad){})
								};
								setTimeout(function(){
									vm.$message({
										type:'success',
										message:'修改成功'
									})
									vm.get()
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
		}

	},
	mounted() {
		this.$nextTick(() => {// 代码保证 this.$el 在 document 中
			this.get()
			let vm = this
			api.staticinformation.getGroupList(1).then((res)=>{if(res.data.status === 0){vm.dtype = res.data.list}})
			api.staticinformation.getGroupList(2).then((res)=>{if(res.data.status === 0){vm.ftype = res.data.list}})
			api.staticinformation.getGroupList(5).then((res)=>{if(res.data.status === 0){vm.ytype = res.data.list}})
		})
	}
}
</script>
<style scoped>

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
