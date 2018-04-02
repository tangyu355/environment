<template>
<div id="detail">
	<el-card class="box-card">
		<el-form :model="scope.row" label-width="100px">
			<el-row>
					<el-col :span="8">
						<el-form-item label="企业名称">
							<el-input v-model="scope.row.companyName" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="联系人">
							<el-input v-model="scope.row.name" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="联系电话">
							<el-input v-model="scope.row.contact" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">
						<el-form-item label="工业总产值">
							<el-input v-model="scope.row.clist.gdp" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="年生产时间">
							<el-input v-model="scope.row.clist.totalHour" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="年用电量">
							<el-input v-model="scope.row.clist.totalElec" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
		</el-form>
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
	},
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
	}
}
</script>