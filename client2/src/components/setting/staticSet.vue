<template>
	<div id="staticset">
		<h3>固定信息配置</h3>
		
		<el-row style="margin-bottom:10px;">
			<el-select v-model="showpage" @change="search">
				<el-option
					v-for="(item,key,index) in infolist"
					:label="item.text"
					:value="key">
				</el-option>
			</el-select>
			<el-button
        @click="addfirst"
        type="success">
        新增{{infolist[showpage].text}}
      </el-button>
		</el-row>
		<el-table
	    :data="showlist"
	    style="width: 100%"
	    @expand = "test">
	    <el-table-column type="expand" v-if="infolist[showpage].multi">
	      <template scope="props">
				  <el-table
				    :data="secondlist"
				    style="width: 100%"
				    @expand = "test">
				    <el-table-column
				      label="ID"
				      prop="id">
				    </el-table-column>
				    <el-table-column
				      label="名称">
				       <template scope="scope">
				      <div v-if="isedit && editid == scope.row.id">
			      		<el-input  v-model="name" style="padding:0;"></el-input>
			      	</div>
			      	<p v-else>{{scope.row.name}}</p>
			      	 </template>
				    </el-table-column>
				    <el-table-column
				      label="单位" v-if="showpage == 'fuel'">
				       <template scope="scope">
				      <div v-if="isedit && editid == scope.row.id">
			      		<el-input  v-model="unit" style="padding:0;"></el-input>
			      	</div>
			      	<p v-else>{{scope.row.unit}}</p>
			      	 </template>
				    </el-table-column>
				    <el-table-column
				      label="操作">
				      <template scope="scope"  >
				      	<div v-if="scope.row.name !='其它'">
				        <el-button
				          v-if="isedit && editid == scope.row.id"
				          @click="sureedit(scope.row.id)"
				          type="success"
				          size="small">
				          保存
				        </el-button>
				        <el-button
				          v-if="isedit && editid == scope.row.id"
				          @click="canceledit"
				          type=""
				          size="small">
				          取消
				        </el-button>
				        <el-button
				          v-if="(!isedit || (isedit && editid != scope.row.id))"
				          @click="edit(scope.row.id,scope.row.name,scope.row.unit)"
				          type=""
				          size="small">
				          编辑
				        </el-button>
				        <el-button
				          v-if="(!isedit || (isedit && editid != scope.row.id))"
				          @click="edit(scope.row.id,scope.row.name)"
				          type="danger"
				          size="small">
				          删除
				        </el-button>
				         </div>
				      </template>
				    </el-table-column>
				  </el-table>
	      </template>
	    </el-table-column>
	    <el-table-column
	      label="ID">
	      <template scope="scope">
	      	{{scope.row.id}}
	      </template >
	    </el-table-column>
	    <el-table-column
	      label="名称">
	      <template scope="scope">
	      	<div v-if="!showid && isedit && editid == scope.row.id">
	      		<el-input  v-model="name" style="padding:0;"></el-input>
	      	</div>
	      	<p v-else>{{scope.row.name}}</p>
	      </template >
	    </el-table-column>
	    <el-table-column
	      label="操作">
	      <template scope="scope"  >
				  <div v-if="scope.row.name !='其它'">
	        <el-button
	          v-if="!showid &&  isedit && editid == scope.row.id"
	          @click="sureedit(scope.row.id)"
	          type="success"
	          size="small">
	          保存
	        </el-button>
	        <el-button
	          v-if="isedit && editid == scope.row.id"
	          @click="canceledit"
	          type=""
	          size="small">
	          取消
	        </el-button>
	        <el-button
	          v-if="!showid && (!isedit || (isedit && editid != scope.row.id))"
	          @click="edit(scope.row.id,scope.row.name)"
	          type=""
	          size="small">
	          编辑
	        </el-button>
	        <el-button
	          v-if="!showid && (!isedit || (isedit && editid != scope.row.id))"
	          @click="edit(scope.row.id,scope.row.name)"
	          type="danger"
	          size="small">
	          删除
	        </el-button>
	        <el-button
	          v-if="infolist[showpage].multi && scope.row.id == showid && !isedit"
	          @click="addsecond(scope.row.id)"
	          type="primary"
	          size="small">
	          新建
	        </el-button>
	      </div>
	      </template>
	    </el-table-column>
	  </el-table>
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
			infolist:{
				elec:{text:'用电信息',api:'static/group/',gid:10,multi:false},
				fuel:{text:'燃料信息',api:'static/group/',gid:2,cgid:3,multi:true},
				boiler:{text:'锅炉类型',api:'static/group/',gid:1,cgid:4,multi:true},
				kiln:{text:'窑炉类型',api:'static/group/',gid:5,cgid:6,multi:true},
				facility:{text:'治理设施',api:'static/group/',gid:8,cgid:9,multi:true}
			},
			showpage:'elec',
			showlist:[],
			secondlist:[],
			showid:'',
			name:'',
			isedit:false,
			editid:'',
			unit:'',
			addsecid:''
		}
	},
	computed: {
	},
	watch: {
    '$route': 'fetchData'
  },
	methods: {
		addfirst:function () {
			console.log(this.showlist[0])
			this.showlist.unshift({name:'',id:''})
			this.isedit = true
			this.editid = ''
		},
		addsecond:function(pid){
			this.secondlist.unshift({name:'',id:'',unit:''})
			this.isedit = true
			this.editid = ''
		},
		fetchData () {
			console.log(this.$route)
			
			this.showpage = this.$route.query.type || 'elec'
			
			this.get()
		},
		test (row, expanded) {
			console.log(row)
			console.log(expanded)
			if (expanded) {
				this.serchsec(row.id,this.infolist[this.showpage].cgid)
			}else {
				this.showid = ''
			}
		},
		edit:function(id,name,unit){
			this.isedit = true;
			this.name = name;
			this.editid = id;
			if (unit) {
				this.unit = unit;
			}else this.unit = ''
			
		},
		canceledit:function(){
			this.isedit = false;
			this.editid = '';
		},
		sureedit:function(id){
			var vm = this;
			if (id) {
				this.$confirm('确定要修改这条信息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	api.staticinformation.add({
						id:id,
						name:vm.name,
						unit:vm.unit
					}).then(function(res){
						if (res.data.status === 0) {
							vm.$message({
		            type: 'success',
		            message: '修改成功!'
		          });
		          vm.get()	
							vm.canceledit();
						} else {
							vm.$message({
		            type: 'info',
		            message: res.data.msg
		          });  
						}
					},()=>{
						vm.$message({
	            type: 'info',
	            message: '已取消'
	          });  
					})
        }).catch(() => {
          vm.$message({
            type: 'info',
            message: '已取消'
          });          
        });
			} else {
				let gid = ''
				let pid = ''
				if (!this.showid) {//level 1
					gid = this.infolist[this.showpage].gid
				} else {
					gid = this.infolist[this.showpage].cgid
					pid = this.showid
				}
				console.log(gid)
				let data = {groupid:gid,pid:pid,name:this.name,unit:this.unit}
				if(!pid){
					console.log('no pid,first level')
					data.pid = 0
				}
				api.staticinformation.add(data).then(function(res){
					console.log(res)
					if(res.data.status == 0){
						vm.$message({
		          type: 'success',
		          message: '添加成功!'
		        });
		        if (!this.showid) {//level 1
							vm.get()	
						} else {
							vm.serchsec(pid,gid)
							this.showid = ''
						}
						vm.canceledit();
					}else{
						vm.$message.error(res.data.msg)
					}
				})
			}
		},
		search:function(){
			this.$router.push({
        query:{type:this.showpage}
      })
		},
		get:function(){
			var vm = this
			this.$http.get(this.infolist[this.showpage].api + this.infolist[this.showpage].gid ).then(function(res){
				console.log(res)
				vm.showlist  = res.data.staticlist						
			})
		},
		serchsec:function(pid,gid){
			this.canceledit()
			this.showid = pid
			var vm = this
			api.staticinformation.getbypidgid(pid,gid).then(function(res){
				console.log(res)	
				vm.secondlist  = res.data.staticlist	
			})
		},
		closesec:function(){
			this.showid = ''
		},
		
		del:function(id){
			var vm = this
			console.log(id)
			utils.confirm('确定要删除这条信息吗？').then(function(){
				console.log('yes')
				Vue.http.post(baseUrl + 'static/delete' ,{id:id}).then(function(res){
				if(res.data.status == 0){
					utils.success(res.data.msg)
					vm.get()
					vm.showid = ''
				}else{
					utils.danger(res.data.msg)
				}
			})
			},function(){
				console.log('no')
			})
		}
	},
	mounted() {
		this.$nextTick(() => {

			this.fetchData()	
		})
	}
}
</script>
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
.mytable {
  overflow-x:auto; 
}
		</style>