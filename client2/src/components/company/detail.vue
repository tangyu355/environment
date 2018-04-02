<template>
<div id="detail">
	<el-card class="box-card">
		<el-row v-if="comdetail.comFill && comdetail.cominfo" style="margin-bottom: 1em;">
		  <el-col :span="24">
		  	<h3 style="padding-left: 70px;">
		  		{{comdetail.comFill.fillyear}}年<el-input v-model="comdetail.cominfo.companyName" style="width:55%"></el-input>企业信息
		  		<span >
					<el-tag type="danger" v-if="comdetail.cominfo.status === 0&&!comdetail.comFill.status">未提交</el-tag>
					<el-tag type="warning" v-if="comdetail.comFill.status === 2">待审核</el-tag>
					<el-tag type="success" v-if="comdetail.comFill.status === 3">已审核</el-tag>
				</span>
		  	</h3>
		  </el-col>
		</el-row>
	
		<el-row>
			<el-col :span="16">
				<el-form :model="comdetail" ref="ruleForm" label-width="120px" class="">
					<div v-if="comdetail.cominfo">
						<el-form-item label="联系人" prop="contact">
							<el-input v-model="comdetail.cominfo.contact"></el-input>
						</el-form-item>
						<el-form-item label="联系方式" prop="contactNo">
							<el-input v-model="comdetail.cominfo.contactNo"></el-input>
						</el-form-item>
						<el-form-item label="法人" prop="legalPerson">
							<el-input v-model="comdetail.cominfo.legalPerson"></el-input>
						</el-form-item>
						<el-form-item label="法人联系方式" prop="legalPersonPhone">
							<el-input v-model="comdetail.cominfo.legalPersonPhone"></el-input>
						</el-form-item>
						<el-form-item label="公司地址" prop="addressStr">
							<el-input v-model="comdetail.cominfo.addressStr"></el-input>
						</el-form-item>
						<el-form-item label="备注" prop="remark" style="display: none;">
							<el-input type="textarea" v-model="comdetail.cominfo.remark"></el-input>
						</el-form-item>
					</div>
					<div v-if="comdetail.comFill">
						<el-form-item label="年生产总值" prop="gdp">
							<el-input v-model="comdetail.comFill.gdp">
								<template slot="append">万元</template>
							</el-input>
						</el-form-item>
						<el-form-item label="年生产天数" prop="daysOfWork">
							<el-input v-model="comdetail.comFill.daysOfWork">
							<template slot="append">天</template>
							</el-input>
						</el-form-item>
						<el-form-item label="日生产小时" prop="hoursOfDay">
							<el-input v-model="comdetail.comFill.hoursOfDay"><template slot="append">小时</template></el-input>
						</el-form-item>
					</div>
					
						<el-button type="primary" @click="submitForm(comdetail)">保存修改</el-button>
						<el-button type="success" @click="passAll">企业全部通过</el-button>
						<el-button type="danger" @click="refuseAll">企业全部不通过</el-button>
	
				</el-form>
		  </el-col>
		</el-row>
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
	props:["comdetail"],
	data () {
		return {
			rules: {
				contact: [
					{ required: true, message: '请输入联系人', trigger: 'blur' },
				],
				contactNo: [
					{ required: true, message: '请输入联系方式', trigger: 'blur' },
				],
				legalPerson: [
					{ required: true, message: '请输入法人', trigger: 'blur' },
				],
				legalPersonPhone: [
					{ required: true, message: '请输入法人联系方式', trigger: 'blur' },
				],
				addressStr: [
					{ required: true, message: '请输入公司地址', trigger: 'blur' },
				],
				gdp: [
					{ required: true, message: '请输入年生产总值', trigger: 'blur' },
				],
				daysOfWork: [
					{ required: true, message: '请输入年生产天数', trigger: 'blur' },
				],
				hoursOfDay: [
					{ required: true, message: '请输入日生产小时', trigger: 'blur' },
				],
			},
			state:state,
  		}
  	},
  	watch:{
  	  'comdetail.comFill':{
  	  	 handler: function (val, oldVal) {
		    console.log(val)
		  },
		   deep: true
		}
  	},
  	methods : {
		saveChange(data){
			var vm = this;
			console.log(data);
			api.creport.editcompany(data.cominfo).then(function(res){
				console.log(res)
				if (res.data.status === 0) {
					api.creport.editcompany2(data.comFill).then(function(res){
						//console.log(res);
						vm.$message({message:'保存成功', type:"success"});
						vm.$emit('updatecom', data);
					})
				} else {
					vm.$message.error(res.data.msg);
				}
				
			})
		},
		submitForm(data) {
			var vm = this;
			vm.$refs["ruleForm"].validate((valid) => {
				console.log(valid)
				if (valid) {
					vm.saveChange(data);
				} else {
					vm.$message({message:'保存失败', type:"success"});
					return false;
				}
	        });
		},
		passAll () {
			let vm = this
			console.log({accountid:this.comdetail.comFill.enterpriceId,fillyear:this.comdetail.comFill.fillyear})
			api.creport.allpass(this.comdetail.comFill.fillyear,{accountid:this.comdetail.cominfo.id,fillyear:this.comdetail.comFill.fillyear}).then(function(res){
				vm.$message({message:'审核通过！', type:"success"});
				vm.$emit('updatecom');
				vm.state.showcom = false;
			},function(bad){})
		},
		refuseAll () {
			let vm = this
			console.log(this.comdetail)
			this.$prompt('审核失败的原因是？', '请填写', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消'
	        }).then(({ value }) => {
	          this.$message({
	            type: 'success',
	            message: '你的审核意见是: ' + value
	          });
	          this.comdetail.cominfo.remark = value
	          api.creport.editcompany(this.comdetail.cominfo).then(function(res){
							console.log(res)
						})
						api.creport.allrollback({accountid:this.comdetail.cominfo.id,fillyear:this.comdetail.comFill.fillyear}).then(function(res){
							vm.$emit('updatecom');
							vm.state.showcom = false;
						},function(bad){})
	        }).catch(() => {
	          vm.$message({
	            type: 'info',
	            message: '取消输入'
	          });       
	        });
		},
	},
	created(){
		console.log(this.comdetail.cominfo,this.comdetail.comFill)
	}
}
</script>