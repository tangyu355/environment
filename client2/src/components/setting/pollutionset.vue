<template>
	<div id="upload">
		<h3>污染物信息修改</h3>
      <el-row >
      	<el-col :span="24">
      		<el-button style="float: right;margin-bottom:10px;" type="primary" size=""  @click="addfirst = true">新增污染物</el-button>
      	</el-col>
			</el-row>		
		<div class="mytable">
		<table class="table table-striped jambo_table bulk_action">
						<thead>
							<tr >
								<th width="10%">id</th>
								<th>污染物名称</th>
								<th>污染物类型</th>
								<th width="15%">操作</th>
							</tr>
						</thead>
						<tbody v-if="addfirst">
							<tr >
								<td ></td>
								<td ><el-input class="form-control" v-model="name" placeholder="请输入新增污染物名称"></el-input></td>
								<td ></td>
								<td>
									<el-button size="small" type="success" @click = "addnew">确 定</el-button>
									<el-button size="small" @click = "addfirst = false">取 消</el-button>
								</td>
							</tr >
						</tbody>
						<tbody v-for ="info in showlist">
							<tr >
								<td >
									<p>{{info.id}}</p>
								</td>
								<td >
									<el-input v-if="isedit && editid == info.id" v-model="name" ></el-input>
									<p v-else>{{info.pollutantName}}</p>
								</td>
								<td >
									<p>{{info.groupname}}</p>
								</td>
								<th v-if="showpage == 'fuel'">
								</th>
								<td v-if="info.name !='其它'">
									<el-button size="small" type="" v-if="!showid && (!isedit || (isedit && editid != info.id)) "  @click="edit(info.id,info.pollutantName)">编 辑</el-button>
									<el-button size="small" type="success" v-if="!showid && isedit && editid == info.id" @click="sureedit(info.id)">保 存</el-button>

									<el-button size="small" type="primary" v-if="!showid && isedit && editid == info.id" @click="canceledit">取 消</el-button>
									<el-button v-if="!showid  && (!isedit || (isedit && editid != info.id))" @click="del(info.id)" size="small" type="danger">删 除</el-button>
								</td>
								<td v-else></td>
							</tr >
						</tbody>
					</table>			  
				</div>
	</div>			
</template>	
<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'
import { Message } from 'element-ui'

export default {
  components: {
  },
  data () {
    return {
        addfirst:false,
		name:'',
		isedit:false,
		editid:'',
showlist: [],
}
},
computed: {},
	watch: {},
	methods: {
		edit: function(id, name) {
			this.isedit = true;
			this.name = name;
			this.editid = id;
		},
		canceledit: function() {
			this.isedit = false;
			this.editid = '';
		},
		sureedit: function(id) {
			var vm = this;
			this.$confirm('确定要修改这条信息吗？').then(function() {
				api.staticinformation.addpollutant({
					id: id,
					pollutantName: vm.name
				}).then(function(res) {
					console.log(res)
					if (res.data.status == 0) {
						Message.success('操作成功!')
						vm.get()
						vm.addfirst = false
						vm.isedit = false
					} else {
						Message.error(res.data.msg)
					}
				})
			})
		},
		get: function() {
			var vm = this
			api.staticinformation.getpollutant().then(function(res) {
				console.log(res)
				vm.showlist = res.data.pollutant
			})
		},
		addnew: function() {
			var vm = this
			var data = {
				pollutantName: this.name
			}
			api.staticinformation.addpollutant(data).then(function(res) {
				console.log(res)
				if (res.data.status == 0) {
					Message.success('操作成功!')
					vm.get()
					vm.addfirst = false;
					vm.canceledit();
				} else {
					Message.error(res.data.msg)
				}
			})
		},
		del: function(id) {
			var vm = this
			console.log(id)
			this.$confirm('确定要删除这条信息吗？').then(function() {
				console.log('yes')
				api.staticinformation.pollutantDel({
					id: id
				}).then(function(res) {
					if (res.data.status == 0) {
						Message.success('操作成功!')
						vm.get()
						vm.addfirst = false;
					} else {
						Message.error(res.data.msg)
					}
				})
			}, function() {
				console.log('no')
			})
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.get()
		})
	}
}
</script>
<style scoped>
.table{
  width:100%;
}
table {
  display: table;
  border-collapse: separate;
  border-spacing: 0px;
  border-color: grey;
  border: 1px solid #dfe6ec;
  width:100%;
  overflow:auto;
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