<template>
  <div id="report">
    <el-row :gutter="20" style="margin-bottom:10px;">
      <!--<el-col :span="3">
        <el-select v-model="searchdata.fillyear">
         <el-option
            v-for="item in state.yearlist"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>-->
      <el-col :span="6">
      <el-select v-model="searchdata.status">
         <el-option
            v-for="item in statuslist"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input
          placeholder="请输入关键字"
          icon="search"
          v-model="searchdata.name"
          :on-icon-click="search">
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button icon="search" @click='search' type="primary">搜索</el-button>
      </el-col>
    </el-row>

    <div class="mytable">
    <table style="width:100%;">
    <thead>
      <tr>
        <th>用户名</th>
        <th>所属机构</th>
        <th>所属地区</th>
        <th>联系人</th>
        <th>联系电话</th>
        <th>报表类型</th>
        <th>状态</th>
      </tr>
    </thead>
    <tbody v-for="item in state.showlist">
      <tr v-for="(table,findex) in item.list">
        <td v-if="findex == 0" :rowspan="item.list.length">{{item.name}}</td>
        <td v-if="findex == 0" :rowspan="item.list.length">{{item.govname}}</td>
        <td v-if="findex == 0&&item.cityName!==null" :rowspan="item.list.length">{{item.provinceName + " " + item.cityName}}</td>
        <td v-if="findex == 0&&item.cityName==null" :rowspan="item.list.length">省级账号</td>
        <td v-if="findex == 0" :rowspan="item.list.length">{{item.contact}}</td>
        <td v-if="findex == 0" :rowspan="item.list.length">{{item.contactNo}}</td>

        <td v-if="table.count > 0">
        	<span v-if="item.cityName!==null">
             <router-link :to="{name:'handreps',params:{name:table.reportname,gId:item.id,add:item.cityName,year:searchdata.fillyear,status:searchdata.status,keyword:searchdata.name}}" tag="a" >{{table.reportdesp}}</router-link>
           </span>
           <span v-else>
           	<router-link :to="{name:'handreps',params:{name:table.reportname,gId:item.id,add:item.govname,year:searchdata.fillyear,status:searchdata.status,keyword:searchdata.name}}" tag="a" >{{table.reportdesp}}</router-link>
           </span>
        </td>
        <td v-else>{{table.reportdesp}}</td>
        
        <td align="center">
          <el-tag v-if="table.count <= 0"  type="danger">未填报</el-tag>
          <el-tag v-if="table.nocert > 0"  type="warning">待审核</el-tag>
          <el-tag v-if="table.nocert == 0 && table.cert > 0" type="success">已审核</el-tag>
        </td>
      </tr>
    </tbody>
  </table>
    </div>
    <my-pagination></my-pagination>
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
      action: actions,
      statuslist:[{id: 0, name: '未填报'}, {id: 1, name: '待审核'}, {id: 2, name: '已审核'}],
      searchdata:{
        name:'',
        fillyear:state.watchyear,
        status:1        
      },
      tablelist:[]
    }
  },
  computed: {
  },
  watch: {
    'state.listnow' (newValue, oldValue) {
      console.log(newValue)
      this.action.setShowList(this.tablelist)
    },
    'state.watchyear':{
    	handler: function (val, oldVal) {
    		console.log(val)
  			this.searchdata.fillyear = val
  		},
      deep: true
    }
  },
  methods: {
    search () {
      let vm = this
      api.creport.searchhand(this.searchdata).then((res) => {
        console.log(res)
        if (res.data.status === 0) {
            vm.tablelist = res.data.data
          	vm.action.setShowList(vm.tablelist,1)
        }
      })
    }
  },
  created (){
  	if(this.state.pagekey.keyword){
  		console.log(this.state.pagekey)
  		this.searchdata.status = this.state.pagekey.status
  		this.searchdata.name = this.state.pagekey.keyword
  		this.searchdata.fillyear = this.state.pagekey.year
  	}
  },
  mounted () {
    this.$nextTick(() => {
      this.search()      
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
    width:100%;
}
a {
    color: #337ab7;
    text-decoration: none;
}

</style>
