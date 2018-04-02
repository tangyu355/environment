<template>
  <div id="alter">
    <h3>邀请码</h3>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card class="box-card">
          <label style="padding:6px;color: #858585;">工业源、面源使用的邀请码：</label>
          <div style="font-size: 40px;font-weight: 600;color: #73879C;">{{icode}}</div>
          <el-form v-if="state.user.username === 'admin'">
            <el-form-item label="设置新的邀请码">
              <el-input v-model="newcode"  ></el-input>
            </el-form-item>
            <el-form-item >
              <el-button @click="setcode" type="success">设置邀请码</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="8" >
        <el-card class="box-card">
          <label style="padding:6px;color: #858585;">小散企业使用的邀请码：</label>
          <div style="font-size: 40px;font-weight: 600;color: #73879C;">{{smallcode}}</div>
          <el-form v-if="state.user.username === 'admin'">
            <el-form-item label="设置小散企业邀请码">
              <el-input v-model="newSmallcode" ></el-input>
            </el-form-item>
            <el-form-item >
              <el-button @click="setcode" type="success" >设置邀请码</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="8" >
        <el-card class="box-card">
          <label style="padding:6px;color: #858585;">省级账号使用的邀请码：</label>
          <div style="font-size: 40px;font-weight: 600;color: #73879C;">{{province}}</div>
          <el-form v-if="state.user.username === 'admin'">
            <el-form-item label="设置省级账号邀请码">
              <el-input v-model="province" ></el-input>
            </el-form-item>
            <el-form-item >
              <el-button @click="setcode" type="success" >设置邀请码</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
     </el-row>
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
      codelist:[],
      newcode:'',
      newSmallcode: '',
      icode:'',
      smallcode:'',
      province:''
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
        setcode:function(){
          var vm = this;
          api.usermanage.creatcode({code:this.newcode,smallcode:this.newSmallcode,province:this.province}).then(function(res){
            console.log(res);
            if(res.data.status == 0){
              vm.$message({
                type: 'success',
                message: '设置成功!'
              })
            }else{
              vm.$message.danger(res.data.msg)
            }
            vm.showcode();
          },function(bad){})

        },
        showcode : function (){
          var vm = this;
          api.usermanage.getcode().then(function(res){
          	console.log(res)
            vm.icode = res.data.code;
            vm.smallcode = res.data.smallcode
            vm.province = res.data.province
          },function(bad){})
        }
  },
  mounted () {
    this.$nextTick(() => {
      this.showcode();
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
