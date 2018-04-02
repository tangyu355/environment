<template>
<div id="container" style="text-align: center;">
  <img src="../../assets/sky2.png" style="width:100%;" />
  <h1>四川省大气污染源排放清单数字化管理后台</h1>
  
  <section style="max-width:350px;margin:auto;padding-top: 1em;">
   
    <form>
      <h2 style="color:deepskyblue;margin-top:45px">账号登录</h2>
      <div class="login-group">
        <el-input v-model="username" style="margin-botton:20px;">
          <template slot="prepend"><i class="fa fa-user"></i></template>
        </el-input>
      </div>
      <div class="login-group">
        <el-input v-model="password" type="password" @keyup.enter.native="submit">
          <template slot="prepend"><i class="fa fa-lock"></i></template>
        </el-input>
      </div>
      <el-button type="primary" @click="submit" class="login-btn">登录</el-button>
    
      <div class="clearfix"></div>    
      <div>
        <div style="padding-top: 2em;">
          <h3 class="text-center" style="margin-top:45px">
            四川省环境保护科学研究院
          </h3>         
        </div>
        <el-row style="margin-top: 3em;">
        	<el-col :span="12">
        		<a href="/index.php">返回前台登录</a>
        	</el-col>
        	<el-col :span="12">
        		<a href="/admin/index.htm">切换到旧版后台</a>
        	</el-col>
        </el-row>
      </div>
    </form>
  </section>
</div>
</template>

<script>
import api from 'src/api'
import store from 'src/store'

export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      action: store.actions
    }
  },
  methods: {
    submit () {
      let vm = this
      api.user.signin({
        username: vm.username,
        password: vm.password 
      }).then((res) => {
          console.log(res);
          if(res.data.status !== 0) {
            vm.$message.error('账号或密码错误');
            vm.$router.push('home')
          }else{
            vm.action.login(res.data.user,res.data.permission,res.data.years)
            vm.$router.push('/home')
          }                                     
      }, (bad) => {
        vm.$message.error(bad);     
      })
    }
  },
   mounted () {
    this.$nextTick(() => {      
    })
  }
}
</script>

<style scoped>
i {
  width:15px;
}
.login-group {
  margin-bottom: 15px;
}
.login-btn {
  width:350px;
}
</style>
