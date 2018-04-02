<template>
  <div id="govpage">
    <el-row :gutter="20" style="margin-bottom:10px;">
      <el-col :span="6"> <el-input
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
        prop="typename"
        label="机构名称"
        >
      </el-table-column>
      <el-table-column
        prop="contact"
        label="联系人">
      </el-table-column>
      <el-table-column
        prop="contactNo"
        label="联系方式"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="详细地址">
      </el-table-column>
      <el-table-column label="操作"
      width="180">
        <template scope="scope">
          <el-button
            size="small"
            @click="govedit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="delcomp(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑政府用户" v-model="editDialog" size="tiny">
      <el-form :model="govuser" label-position="left"  ref="govuser" label-width="100px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="govuser.name" :disabled="true"></el-input>
        </el-form-item>    
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="govuser.password" ></el-input>
        </el-form-item>
        <el-form-item label="机构名称" prop="typename">
          <el-input v-model="govuser.typename" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="govuser.contact"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="contactNo">
          <el-input v-model="govuser.contactNo" ></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="govaddress">
          <el-input v-model="govuser.address" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="editDialog = false">取消</el-button>   
        <el-button type="primary" @click="govsure()">确 定</el-button>
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
      searchname:'',
      govuser: {
        id:'',
        name:'',
        password:'',
        typename:'',
        contact:'',
        contactNo:'',
        address:'',
      },
      goverlist:[]
    }
  },
  computed: {
    
  },
  watch: {
    '$route': 'fetchData',
     'state.listnow' (newValue, oldValue) {
      console.log(newValue)
      this.action.setShowList(this.goverlist)
    },
  },
  methods: {
    fetchData() {},
    govedit:function(num,item){
      this.editDialog = true
      _.assign(this.govuser,item)
      this.govuser.password = ''
    },
    delcomp:function(num,item){
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
            vm.govfreshlist()
          } else {
            vm.$message({
              type: 'warning',
              message: res.data.msg
            })
          }
        },() => {})
      }).catch(() => {})
    },
    govsure:function(){
      let vm = this;
      let data =  {
        id:vm.govuser.id,
        name:vm.govuser.name,
        typename:vm.govuser.typename,
        contact:vm.govuser.contact,
        contactNo:vm.govuser.contactNo,
        address:vm.govuser.address,
      }
      if (this.govuser.password) {
        data.password = this.govuser.password
      }
      api.usermanage.creatgovern(data).then(function(res){
        console.log(res)
        vm.$message({
          type: 'success',
          message: '操作成功!'
        })
        vm.editDialog = false;
        vm.findall();
      },function(bad){})    
    },
    findall:function() {
      var vm = this;
      var name = vm.searchname;
      if(vm.searchname ===''){
        vm.govfreshlist();
      }
      else{
        api.usermanage.searchgov(name).then(function(res){
        console.log(res)
        if(res.data.govlist.length!=0){
          vm.goverlist = res.data.govlist;
          vm.action.setShowList(vm.goverlist,1)
        }
        else{
          vm.$message.error('没有结果！')
          vm.showlist = [];
          vm.all = 0
        }
      })
     }
    },        
    govfreshlist: function (){
      var vm = this;
      api.usermanage.getgovern().then(function(res){
        if(res.data.status === 0) {
          vm.goverlist = res.data.govlist;
        } else {
          vm.goverlist = []
        }
        
        vm.action.setShowList(vm.goverlist,vm.state.listnow.currentPage);
      },function(bad){})
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.govfreshlist();
      // 代码保证 this.$el 在 document 中
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
.el-select,.el-input,.el-cascader{
    width: 260px;
}
</style>
