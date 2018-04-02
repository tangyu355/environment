<template>
  <div id="app">
    <login v-if="state.isLogin === 0"></login>
    <div v-if="state.isLogin === 1" class="appcontainer">
      <div id="container">
    <div class="header">
      <div>
        <img src="./assets/sky3.png" class="img-responsive" style="width:100%;">

      </div>
      <div id="mainmenu" class="main_container" >
        <a @click="logout" class="logout-btn">
          <i class="fa fa-sign-out pull-right"></i> 
                 退出
        </a>
         <div style="float: right; padding: 3px 20px -3px 0">
          <el-select v-model="fill.watchyear" placeholder="当前年份" size="small" style="width:60%" @change="yearchange">
	         <el-option
	            v-for="item in state.yearlist"
	            :label="item"
	            :value="item">
	          </el-option>
	        </el-select>
	        </div>
	        <div style="float: right;margin-top:3px;font-size: 1.3em;margin-right: 8px;">当前年份:</div>
      </div>
    </div>
    <div class="content">
      <div class="left_block nav-md">
        <mymenu></mymenu>
      </div>
      <div class="right_col" role="main" style="margin-top: 0;">
        <router-view></router-view>
         <BackTop :height="100" :bottom="20">
		        <div class="top">返回顶部</div>
		    </BackTop>
      </div>
    </div>
    <div class="clear"><!--如何你上面用到float,下面布局开始前最好清除一下。--></div>
  </div>
      <!--div  class="side-nav">
        <mymenu></mymenu>
      </div>
      <div class="right-content">

        <section class="content">
          <router-view></router-view>
        </section>
      </div-->
    </div>
  </div>
</template>
<script>
import mymenu from './components/menu'
import login from './components/login/login'
import api from 'src/api'
import store from 'src/store'
import Locals from 'src/lib/locals'

export default {
  name: 'app',
  data () {
    return {
      state: store.state,
      action: store.actions,
      fill:{
      	watchyear:'2016'
      }
    }
  },
  watch: {
    '$route': 'fetchData'
  },
  components: {
    login,
    mymenu
  },
  methods: {
    identity () {
      api.user.me().then((res) => {
        console.log(res)
        if (res.data.status === 0) {
          store.actions.login(res.data.user,res.data.permission,res.data.years)
        } else {
          this.action.notLogin()
        }
      }, () => {})
    },
    logout () {
      api.user.signout().then((res) => {
        if (res.data.status === 0) {
          store.actions.logout()
        }
      }, () => {})
    },
   getchanged(obj){
  		  new Locals('startyear',obj) 
  		  this.state.watchyear = new Locals('startyear',obj).data.watchyear
  	        api.user.changeyear(obj.watchyear).then(function(res){
  	    	console.log(res)
	  		if(res.data.status==0){  
	  		}
	  	})
  	},
  	yearchange(){
  		this.action.yearchanged(this.fill)
  	},  	
    fetchData(){}
  },
  mounted () {
    this.$nextTick(() => {
      this.identity()
      if(this.state.isLogin){
      	console.log(111)
      	this.getchanged(this.fill)
      }
    })
  }
}
</script>

<style>
.header {
    height: 100%;
    border-bottom: 1px solid #AFD9EE;
}
.appcontainer{
	background-color: #FFFFFF;
}
#container {
    position: relative;
    min-height: 900px;
    margin: 0px auto;
    padding: 0px;
    max-width: 1360px;
    text-align: left;
    background-color: #F7F7F7;
}
.logout-btn {
  float: right;
    border: 1px dashed #20A0FF;
    border-radius: 20px;
    margin: 0px;
    padding: 2px 12px;
    color:#20A0FF;
    font-size: 15px;
}
.logout-btn i {
  padding-top: 3px;
}
.main_container {
  height: 33px;
}
.left_block {
    margin-left: 0px;
    float: left;
}

.nav-md {
    width: 230px;
    padding: 0;
    position: absolute;
    display: -ms-flexbox;
    display: flex;
    height: 0px;
}
.top{
        padding: 10px;
        background: rgba(0, 153, 229, .7);
        color: #fff;
        text-align: center;
        border-radius: 2px;
    }
</style>
