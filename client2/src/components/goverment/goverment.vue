<template>
  <div id="manager">  
    {{showpage}}
    <h3 >{{tabhead[showpage]}}{{showpage}}</h3>
    <el-tabs v-model="showpage" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(head,hindex) in tabhead" :label="head" :name="hindex+''">
        <upload v-if="showpage=='1'"></upload>
        <report v-if="showpage=='0'" :getgover="getgover"></report>
      </el-tab-pane>
    </el-tabs>
    
    
  </div>
</template>

<script>
import {state, actions} from 'src/store'
import upload from './upload'
import report from './report'

export default {
  components: {
    upload,
    report
  },
  data () {
    return {
      action: actions,
      tabhead:['手工填报','批量导入'],
      userinfo: store.state.user,
      showpage: '0'
    }
  },
  computed: {
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData() {},
    handleClick(tab, event){
      console.log(tab.index)
      router.push({quary:{tab:tab.index}})
      // this.showpage = tab.index
      
    }
  },
  mounted () {
    this.$nextTick(() => {
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
