<template>
  <div id="manager">  
    <h3 >{{tabhead[showpage]}}</h3>
    <el-tabs v-model="showpage" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(head,index) in tabhead" :label="head" :name="index+''">
       
      </el-tab-pane>
       <compage  v-if="showpage == '0'"></compage>
        <govpage  v-if="showpage == '1'"></govpage>
        <userpage v-if="showpage == '2'"></userpage>

        <my-pagination></my-pagination>
    </el-tabs>
    
    
  </div>
</template>

<script>
import store from 'src/store'
import compage from './compage'
import govpage from './govpage'
import userpage from './userpage'

export default {
  components: {
    compage,
    govpage,
    userpage
  },
  data () {
    return {
      msg: 'hello word',
      userinfo: store.state.user,
      showpage: '0',
    }
  },
  computed: {
    tabhead:function(){
      var list =[];
      if (this.userinfo.username == 'admin'){
        list = ['企业账号管理','政府账号管理','用户管理']
      }else if(this.userinfo.typeid==1&&this.userinfo.username != 'admin'){
        list = ['企业账号管理','政府账号管理']
      };
      return list
    }
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData() {},
    handleClick(tab, event){
      console.log(tab.index)
      this.showpage = tab.index
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.activeName2 = this.tabhead[this.showpage]
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
</style>
