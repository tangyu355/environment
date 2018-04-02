<template>
  <div id="compage">
    <el-row :gutter="20" style="margin-bottom:10px;">
      <el-col :span="6"> 
        <el-input
          placeholder="请搜索用户"
          icon="search"
          v-model="searchname"
          :on-icon-click="findall">
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button icon="search" @click='findall' type="primary">搜索</el-button>
      </el-col>
    </el-row>
   
    <el-table
      :data="state.showlist"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="用户名"
        >
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="企业名"
        >
      </el-table-column>
      <el-table-column
        prop="contact"
        label="联系人"
        >
      </el-table-column>
      <el-table-column
        prop="contactNo"
        label="联系方式"
        >
      </el-table-column>
      <el-table-column
        prop="completedTime"
        label="注册时间"
        >
      </el-table-column>
      <el-table-column label="操作"
      width="180">
        <template scope="scope">
          <el-button
            size="small"
            @click="compedit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="delcomp(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑企业用户" v-model="editDialog" size="tiny">
      <el-form :model="client" label-position="left"  ref="client">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="client.name" style="width: 100%;"></el-input>
        </el-form-item>    
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="client.password" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="企业名" prop="companyName">
          <el-input v-model="client.companyName" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="client.contact" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="contactNo">
          <el-input v-model="client.contactNo" style="width: 100%;"></el-input>
        </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="editDialog = false">取消</el-button>   
        <el-button type="primary" @click="compsure()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {state, actions} from 'src/store'
import api from 'src/api'
export default {
  components: {
  },
  data () {
    return {
      action: actions,
      state: state,
      listinfo: state.listinfo,
      editDialog:false,
      client:{
        name:'',
        companyName:'',
        password:'',
        contact:'',
        contactNo:'',
        id:'',
      },
      complist:[],
      searchname: ''
    }
  },
  computed: {
  },
  
  methods: {
    fetchData() {},
    compedit:function(num,item){
      this.editDialog = true
      console.log(item) 
      this.client = {
        name:item.name,
        companyName:item.companyName,
        password:item.password,
        contact:item.contact,
        contactNo:item.contactNo,
        id:item.id
      }  
      
    },        
    compsure:function(){
      var vm = this;
      api.usermanage.creatcomp(this.client).then(function(res){
        vm.$message({
          type: 'success',
          message: '提交成功!'
        })   
        vm.editDialog = false
        vm.findall();
      },function(bad){})        
    },
    delcomp:function(num,item) {
      var vm = this;
      var name = item.name;
      this.$confirm('请确认是否删除本条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.usermanage.delcomp(name).then((res) => {
          if (res.data.status === 0) {
            vm.$message({
              type: 'success',
              message: '删除成功!'
            })
            vm.compfreshlist()
          } else {
            vm.$message({
              type: 'warning',
              message: res.data.msg
            })
          }
        },() => {})
      }).catch(() => {})
    },
    findall:function() {
      var vm = this;
      var name = vm.searchname;
      if(vm.searchname ===''){
      vm.compfreshlist();
        }
      else{
        api.usermanage.searchcomp(name).then(function(res){
        console.log(res)
        if(res.data.companylist.length != 0){
          vm.complist = res.data.companylist;
          vm.action.setShowList(vm.complist,1);
        }
        else{
          vm.$message.error('没有结果！')
        }
      })
     }
    },        
    compfreshlist : function () {
      var vm = this;
      api.usermanage.getcomp().then(function(res){
        console.log(res)
        if(res.data.status === 0) {
          vm.complist = res.data.companylist;
        } else {
          vm.complist = []
        }
        vm.action.setShowList(vm.complist,vm.state.listnow.currentPage);
      },function(bad){})          
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.compfreshlist()
      // 代码保证 this.$el 在 document 中
    })
  },
  watch: {
    '$route': 'fetchData',
    'state.listnow' (newValue, oldValue) {
      this.action.setShowList(this.complist)
    },
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
