<template>
  <div id="home">
  	<h3>角色管理</h3>
			<div class="pull-right" style="margin-bottom: 10px">
			  <el-button  type="primary" icon="plus" @click="add" size="small">添加</el-button>
			</div>  	
	<el-table
	    :data="state.showlist"
	    border
	    style="width: 100%;">
	    <el-table-column align="center"
	      prop="name"
	      label="角色名 "
	      >
	    </el-table-column>    
	    <el-table-column align="center"	      
	      label="操作">
	      <template scope="scope">
	      	<span v-if="scope.row.id !== state.user.id">
         <el-button @click="deleteop(scope.row.id)" type="text" size="small">删除</el-button>
         <el-button @click="getlist(scope.row.name,scope.row.id)" type="text"  size="small">编辑权限管理</el-button>
         </span>
	      </template>
	    </el-table-column>
	 </el-table>    
	 <my-pagination></my-pagination>  
    <el-dialog title="新增/编辑角色" v-model="dialogVisible" class="demo-ruleForm">
	  <el-form :model="ruleForm2" :label-position="right" label-width="100px" :rules="rules2" ref="ruleForm2">	
		  <el-form-item label="角色名" prop="name">
			    <el-input v-model="ruleForm2.name"></el-input>
			 </el-form-item> 
			<el-form-item label="勾选权限" prop="rolename" v-if="isedit">
				<el-tree v-if="isedit"
				  :data="powerlist"
				  show-checkbox
				  :default-checked-keys="checkedkeys"
				  node-key="id"
				  ref="tree"
				  highlight-current 
				  :props="defaultProps"
          >
				</el-tree>
			</el-form-item>
		</el-form>
  <div slot="footer" class="dialog-footer">
     <el-button  @click="resetForm()">取消</el-button> 	
     <el-button @click="submitForm('ruleForm2')" type="primary">确 定</el-button>
  </div>		
  </el-dialog>    
  </div>
</template>

<script>
import api from 'src/api'
import store from 'src/store'
import _ from 'lodash'

export default {
  components: {
  },
  data () {
    return {
      msg: 'hello word',
      action: store.actions,
      state: store.state,
      showlist: [],
      rolelist: [],
      dialogVisible: false,
      showoption: true,
      isedit: false,
      powerlist: [],
      checkedkeys: [],
      defaultProps: {
        children: 'list',
        label: 'pname'
      },
      ruleForm2: {
      	name: ''
      },
      rules2: {
        name: [
            { required: true, message: '不能为空', trigger: 'blur' },
         ]
      }
    }
  },
  computed: {
  },
  watch: {
     //'$route': 'fetchData',
     'state.listnow' (newValue, oldValue) {
      this.action.setShowList(this.rolelist)
    },
  },
  methods: {
  	getAll:function() {
      api.user.getAll().then((res) => {
      	console.log(res)
      	var vm = this
        if (res.data.status === 0) {
          this.rolelist = res.data.res
          this.action.setShowList(this.rolelist,1)
        } else {
          this.$message.error(res.data.msg)
        }
      })
  	},
  	add: function () {
  		this.dialogVisible = true
  		this.isedit = false
  		this.ruleForm2.name = ''
  	},
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm2)
          api.user.addup(JSON.stringify(this.ruleForm2)).then((res) => {
            console.log(res)
            if (res.data.status === 0) {      
            	this.dialogVisible = false
            	this.getAll()
            } else {
              this.$message.error(res.data.msg)
            }
          }, () => {})
          if(this.isedit){
          console.log(this.$refs.tree.getCheckedKeys())
          api.permission.addup(JSON.stringify({perids:this.$refs.tree.getCheckedKeys(),roleid:this.ruleForm2.id})).then((res) => {
            console.log(res)
            var vm = this
            if (res.data.status === 0) {
              this.dialogVisible = false
	            vm.$message({
	              type: 'success',
	              message: '操作成功!'
	            })              
              this.getAll()
            } else {
              vm.$message.error(res.data.msg)
            }
          }, () => {})
          }
        } else {
          vm.$message.error('信息不完善，操作失败！');
          return false;
        }
      });
    },
    resetForm() {
      this.dialogVisible = false
    },
    getlist: function (name,roleid) {
    	console.log(roleid)
    	this.dialogVisible = true
    	this.isedit = true
    	this.ruleForm2.name = name
    	if (this.isedit){
    	  this.ruleForm2.id = roleid
    	}
    	var vm = this
    	vm.checkedkeys = []
    	api.permission.getAll(JSON.stringify({roleid:roleid})).then((res) => {
      	console.log(res)
        if (res.data.status === 0) {
        	console.log(res)
        	vm.powerlist = _.cloneDeep(res.data.res.list)
          _.forEach(vm.powerlist, function (ob) {
          	if(ob.enable) {
          		vm.checkedkeys.push(ob.id)
          	} else {
          		_.forEach(ob.list, function (oob) {
          			if(oob.enable) {
          				vm.checkedkeys.push(oob.id)
          			} else{
          				_.forEach(oob.list, function (obj) {
          					if(obj.enable){
          						vm.checkedkeys.push(obj.id)
          					}
          				})
          			}
          		})
          	}
          })
        } else {
          vm.$message.error(res.data.msg)
        }
        console.log(vm.checkedkeys)
      })
    },
    deleteop: function (id) {
      console.log(id)
      this.$confirm('请确认是否删除本条记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.user.delRole(JSON.stringify({
          id: id
        })).then((res) => {
        	var vm = this
          console.log(res)
          if (res.data.status === 0) {
            vm.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getAll()
          } else {
            vm.$message({
              type: 'warning',
              message: res.data.msg
            })
          }
        }, () => {})
      }).catch(() => {
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 代码保证 this.$el 在 document 中
      this.getAll()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
.redtext {
  color: red;
}
.big {
  font-size: 140%;
}

.pull-right span{
	cursor: pointer;
}
</style>
