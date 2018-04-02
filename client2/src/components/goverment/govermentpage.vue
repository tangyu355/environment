<template>
  <div id="manager"> 
    <h3 >{{tabhead[showpage]}}</h3>
    <el-tabs v-model="showpage" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(head,hindex) in tabhead" :label="head" :name="hindex+''">
      </el-tab-pane>
       <upload v-if="showpage=='1'"></upload>
        <report v-if="showpage=='0'" @return="getinfo"></report>
    </el-tabs>
    
    
  </div>
</template>

<script>
import store from 'src/store'
import upload from './upload'
import report from './report'

export default {
  components: {
    upload,
    report
  },
  data () {
    return {
      tabhead:['手工填报','批量导入'],
      userinfo: store.state.user,
      showpage: '0',
    }
  },
  computed: {
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData(to,from) {
      console.log(this.$route.query.tab)
      this.showpage = this.$route.query.tab || '0'
    },
    handleClick(tab, event){
      this.$router.push({
        query:{tab:tab.index}
      })
    },
    getinfo(){
    	console.log('给爸爸说')
    }
  },
  mounted () {
    this.$nextTick(() => {
      console.log(this.$route.query.tab)
      this.showpage = this.$route.query.tab || '0'
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
