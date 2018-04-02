<template>
	<div id="productset">
		<h3>工业源产品算法配置</h3>
		<el-card class="box-card" v-if="show">
		  <div slot="header" class="clearfix">
		    <span style="line-height: 36px;font-size: 24px;">{{groupname}}</span>
		    <el-button style="float: right;margin-left:10px;" type="" @click="$router.go(-1)">返回</el-button>
		    <el-button style="float: right;" type="success" @click="saveset">保存</el-button>

		  </div>
		  
		 	<div v-for="(p,pindex) in pobject" >
		 		<el-row >
				  <el-col :span="4"><el-tag>{{p.pollutantName}}</el-tag></el-col>
				  <el-col :span="20">
				  	<div  class="form-group" v-for="(f,findex) in p.formulas" >
							<el-row :gutter="10">
								<el-col :span="6">
									<el-cascader 
									  :options="factortype"
									  :props="props"
									  v-model="f.type"
									  placeholder="请选择"
									  clearable
									></el-cascader>
								</el-col>

								<el-col :span="1">
									<p style="text-align:center;">×</p>
								</el-col>
								<el-col :span="4">
									<el-input type="number"   v-model="f.factor" :disabled="canedit"></el-input>
								</el-col>
								<el-col :span="8">
									<p >×  (1-α(去除效率))/1000
									</p>
								</el-col>
								<el-col :span="3" >
								<el-button v-if="findex >= 1 " @click="deleteFormula(pindex)" type="danger">-</el-button>
									<el-button v-if="findex == pobject[pindex].formulas.length-1" @click="addFormula(pindex)">+</el-button>
									
								</el-col>
							</el-row>
						</div>
					</el-col>
				</el-row>
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
	data () {
		return {
			state: state,
			actions:actions,
			tradelist:[],
			classlist:[],
			groupname:'',
			pobject:[],
			boxchoosed:false,
			isedit:false,
			grouplist:[],
			groupid:'',
			s2:false,
			factortype:[],
			show:false,
			ftype: [],
			props:{
				label:'name',
				value:'id',
				children:'list'
			}
		}
	},
	computed: {
		
	},
	watch: {
		'$route':'fetchData'
	},
	methods: {
		fetchData () {
			this.show = false
			let vm = this
			this.groupid = this.$route.params.groupid
			
			api.setting.getFactorType({groupid:this.groupid}).then(function(res){
				vm.show = false
				console.log(res)
				vm.factortype = res.data.factorType;
				_.forEach(vm.factortype,function(f){
					f.id = parseInt(f.typeId)
					f.name = f.typeName
				})
				console.log(vm.factortype)
				vm.getFactor()
			})
		},
		getFactor:function(){
			let vm = this
			api.setting.getprofactor(this.$route.params.groupid).then(function(res){
				console.log(res)
				vm.pobject = res.data.factorList.list;
				if(res.data.factorList.groupName){
					vm.groupname = res.data.factorList.groupName
				} else if(res.data.factorList.productName){
					vm.groupname = res.data.factorList.productName
				}
				
				for (var i = 0; i < vm.pobject.length; i++) {
					console.log(vm.pobject.length,vm.pobject[i].formulas.length)
					if(vm.pobject[i].formulas.length == 0){
						vm.addFormula(i)
					} else {
						for (var j = 0; j < vm.pobject[i].formulas.length;j++) {
							console.log(vm.pobject[i].formulas[j])
							let li = [vm.pobject[i].formulas[j].typeid]
							if (vm.pobject[i].formulas[j].typeid > 2) 
								li.push(vm.pobject[i].formulas[j].typeid2)
							vm.$set(vm.pobject[i].formulas[j],'type',li)
						};
					}
				};
				console.log(vm.pobject)
				vm.show = true
			})
		},
		addFormula:function(index){
			this.pobject[index].formulas.push({type:[2],factor:0})
			console.log(this.pobject)
		},
		deleteFormula:function(index){
			let list = _.cloneDeep(this.pobject[index].formulas)
			_.pullAt(list,(index+1));
			this.pobject[index].formulas = []
			this.$set(this.pobject[index],'formulas',list)
		},
				changeGroupName:function(){
					var vm = this;
					var data = {
						groupId:this.pobject.groupId,
						groupName:this.pobject.groupName,
					}
					api.setting.updateGroup(JSON.stringify(data)).then(function(res){
						if(res.data.status == 0){
							this.$message({message:'修改成功！',type:'success'})
							vm.$parent.getgroup();
							vm.showcube = '';
						}else{
							this.$message.error('修改失败！')
						}
					})
				},
		saveset:function(){
			let vm = this;
			_.forEach(this.pobject,function(p){
				_.forEach(p.formulas,function(f){
					console.log(f.type)
					f.typeid = f.type[0]
					if (f.type.length = 2) {
						f.typeid2 = f.type[1]
					}
				})
			})
			api.setting.setProductFactor(JSON.stringify({groupId:this.groupid,pollutantList:vm.pobject})).then(function(res){
				if(res.data.status == 0){
					vm.$message({type:'success',message:'设置成功'});
				}
			})
			
		},
	},
	mounted() {
		this.$nextTick(() => {
			console.log('kaishi')
			this.fetchData()
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