<template>
  <div id="userpage">
    <el-row :gutter="24" style="margin-bottom:10px;">
      <el-col :span="6"> <el-input
          placeholder="请搜索用户"
          icon="search"
          v-model="searchname"
          :on-icon-click="findall">
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button icon="search" @click='findall' type="primary">搜索</el-button>
        <el-button type="primary" @click='add' icon="plus">添加管理员</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="state.showlist"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="用户名"
        >
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色名"
        >
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column label="操作"
      width="180">
        <template scope="scope">
          <el-button
            size="small"
            @click="useredit(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="scope.row.username !== 'admin'"
            size="small"
            type="danger"
            @click="deluser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增/编辑管理用户" v-model="editDialog" size="tiny">
      <el-form :model="user" label-position="right" ref="user" label-width="100px">
        <el-form-item label="用户名" prop="username" >
          <el-input v-model="user.username" :disabled="isedit" style="width: 100%;"></el-input>
        </el-form-item>    
        <el-form-item label="账号密码" prop="password">
          <el-input v-model="user.password" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="user.remark" style="width: 100%;"></el-input>
        </el-form-item> 
        <el-form-item label="选择角色" prop="role_id">
         <el-select v-model="user.role_id" style="width: 100%;">
          <el-option
            v-for="item in roles"
            :label="item.name"
            :value="item.id">
          </el-option>
          </el-select>
        </el-form-item > 
        <div v-if="user.username !== 'admin'">
          <el-form-item label="帐号类型">
          <el-select v-model="user.govid" style="width: 100%;">
            <el-option
              v-for="item in govlist"
              :label="item.typename"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item > 
        <el-form-item label="帐号归属" v-if="user.govid > 2">
          <el-cascader style="width: 100%;"
            :options="options"
            v-model="user.place"
            change-on-select
            @change = "placechange"
          ></el-cascader>
        </el-form-item > 
        </div>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="editDialog = false">取消</el-button>   
        <el-button type="primary" @click="usersure()">确 定</el-button>
      </div>
    </el-dialog>
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
      action: actions,
      state: state,
      listinfo: state.listinfo,
      editDialog:false,
      userlist:[],
      citylist: [],
      searchname:'',
      user: {
        username:'',
        password:'',
        id:'',
        remark:'',
        govid:'',
        place:[],
        role_id:'',
        checkedCities1:[]
      },
      roles:[],
      govlist:[],
      options:[],
      isedit:false
    }
  },
  computed: {
  },
  watch: {
    '$route': 'fetchData',
    'state.listnow' (newValue, oldValue) {
      console.log(newValue)
      this.action.setShowList(this.userlist)
    },
  },
  methods: {
    fetchData() {},
    placechange (data) {
      console.log(data)
    },
    checkboxchange (data) {
      console.log(data)
    },
    getuser () {
      var vm = this;
      api.usermanage.creatuser({}).then(function(res){
        vm.userfreshlist();
      },function(bad){})
    },
    getdistrict:function(pid) {
      var vm = this;
      api.staticinformation.getAllDistrict().then(function(res){
        console.log(res)
        if(res.data.status === 0){
            vm.options = res.data.list;
            console.log(vm.options)
        }
      },function(bad){})
    },
    findall(){
    	var vm = this;
      var name = vm.searchname;
      if(vm.searchname ===''){
        vm.userfreshlist();
      }
      else{
        api.usermanage.searchuser(name).then(function(res){
        console.log(res)
        if(res.data.data.length!=0){
          vm.userlist = res.data.data;
          vm.action.setShowList(vm.userlist,1)
        }
        else{
          vm.$message.error('没有结果！')
        }
      })
     }
    },
    getgovlist: function() {
      var vm = this;
      api.staticinformation.getaccounttype('govenment').then(function(res){
      	console.log(res)
        if(res.data.status === 0){
          vm.govlist = res.data.data;
        }
      },function(bad){})
    },
    useredit:function(num,item){
      let vm = this
      console.log(item)
      this.user = {
        username:item.username,
        password:'',
        id:item.id,
        remark:item.remark,
        govid:item.typeid,
        checkedCities1:[],
        role_id:item.role_id
      }
      if (item.typeid > 2) {
      	if(item.town==null){item.town = 0}
        this.user.place = [item.province,item.city,item.town]
      }
      _.forEach(item.targetlist,function(t){
        vm.user.checkedCities1.push(t)
      })
      this.isedit = true;
      this.editDialog = true;
    },
    usersure:function(){
      var vm = this;
      var userdata = {
        username:this.user.username,
        typeid:this.user.govid,
        remark:this.user.remark,
        targetRange:[],
        role_id:this.user.role_id
        
      };
      console.log(vm.user.govid)
      if (vm.user.govid > 2) {
        if (this.user.place.length < 2) {
          this.$message.error('政府部门帐号必须设置归属地区!');
          return;
        }
        userdata.province = this.user.place[0];
        userdata.city = this.user.place[1];
        if (this.user.place.length === 3) {
          userdata.town = this.user.place[2];
        }
        //userdata.functions = ['A','B']
                
      }
      if (vm.user.govid == 1) {
        //userdata.functions = ['A','B','C','D']
      };
      if (vm.user.password != '') {
        userdata.password = vm.user.password;
      }
      if (!this.isnewuser){
        userdata.id = this.user.id;
      }
      _.forEach(this.user.checkedCities1,function(item){
        userdata.targetRange.push(item)
      })
      //console.log(this.cpermit + '+' + this.gpermit)
      console.log(JSON.stringify(userdata))
      api.usermanage.creatuser(JSON.stringify(userdata)).then(function(res){
        if (res.data.status === 0){
          vm.$message({
              type: 'success', 
              message: '操作成功!'
            })
          vm.editDialog = false;
          vm.findall();
        } else {
          vm.$message.error(res.data.msg);
        }
      },function(bad){})
    },
    
    deluser:function(num,item){
      var vm = this;
      var name = item.username;
      this.$confirm('请确认是否删除本条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.usermanage.deluser(name).then((res) => {
          if (res.data.status === 0) {
            vm.$message({
              type: 'success',
              message: '删除成功!'
            })
            vm.userfreshlist()
          } else {
            vm.$message({
              type: 'warning',
              message: res.data.msg
            })
          }
        },() => {})
      }).catch(() => {})
    },
    add:function(){
      /*值保存*/
      this.user = {
        username:'',
        password:'',
        id:'',
        remark:'',
        govid:'',
        role_id: '',
        place:[],
        checkedCities1:[]
      }
      this.isedit = false;
      this.editDialog = true;
      
    },
    getrole () {
      api.user.getAll().then((res) => {
        console.log(res.data.res)
        if (res.data.status === 0) {
          this.roles = res.data.res
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    userfreshlist: function (){
      var vm = this;
      api.usermanage.getuser().then(function(res){
      	console.log(res)
        if(res.data.status === 0){
          vm.userlist = res.data.userlist; 
        } else {
          vm.userlist = []
        }
        vm.action.setShowList(vm.userlist,vm.state.listnow.currentPage);
      },function(bad){})
    }
  },
  mounted () {
    this.$nextTick(() => {
        this.getdistrict(0);
        this.userfreshlist();
        this.getgovlist();
        this.getrole()
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
