<template>
  <div id="shiplist"> 
  	<el-collapse v-model="showindex"  @change="filltable()" accordion>
      <el-collapse-item v-for="(fill,$index) in fills" :name="$index">
      	<template slot="title">
      		{{fill.addressStr!==null?fill.addressStr:fill.cityName}}
      	  <el-tag v-if="fill.status == 3" type="success" >通过</el-tag>
          <el-tag v-if="fill.status == 2" type="warning" >待审核</el-tag>
          <el-tag v-if="fill.status == 1" type="danger" >未提交</el-tag>
        </template>
			    <table style="width:100%;">
			      <thead>
			        <tr>
			          <th rowspan="2" width='12%'>船舶类型</th>
			          <th rowspan="2" width='11%'>船渡量</th>
			          <th rowspan="2" width='8%'>单位</th>
			          <th colspan="12" class="text-center">月份</th>  
			        </tr>
			        <tr>
			          <th v-for="n in 12" width="5%">{{n}}</th>
			        </tr>
			      </thead>
			      <tbody v-for="(boat,bindex) in boatlist">
			        <tr v-for = "(a,aindex) in boat.account">
			          <td v-if="aindex == 0" rowspan="2" >{{boat.boatname}}</td>
			          <td >{{a.type}}</td>
			          <td id='unit0'>{{a.unit}}</td>
			          <td v-for="n in 12" class="text-center">
			           <div v-if="isedit == 1">			           	 
			              <el-input v-model="fill.boattype[(bindex*2)+aindex]['m'+(n*1)]"  style="padding:0;"></el-input>
			            </div>
			            <p v-else>{{fill.boattype[(bindex*2)+aindex]['m'+(n*1)]}}</p>
			          </td>
			        </tr>			        
			      </tbody>
			      <tbody>
			      	<tr>
			      		<th colspan="3" class="text-center">操作</th>
			          <td colspan="9" class="text-center">
			            <el-button
			              v-if="isedit"
			              @click="saveChange"
			              type="success"
			              size="small">
			              保存
			            </el-button>
			            <el-button
			              v-if="isedit "
			              @click="isedit = 0"
			              type="danger"
			              size="small">
			              取消
			            </el-button>
			            <el-button
			              v-if="!isedit "
			              @click="changeToedit($index)"
			              type="primary"
			              size="small">
			              编辑
			            </el-button>
			          </td>
			      	</tr>
			      </tbody>
			    </table>
			    </el-collapse-item>
      <el-row style="margin:10px 5px">
             <el-button
              @click="allpass"
              type="success"
              size="small">
              全部通过
            </el-button>
            <el-button
              @click="allrefuse"
              type="danger"
              size="small">
              全部不通过
            </el-button> 
      </el-row>
    </el-collapse>
    <div v-for="(fill,$index) in fills">
      
      
    </div>
  </div>
</template>

<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'

export default {
  components: {
  },
  props:['params'],
  data () {
    return {
      isedit:0,
      show:false,
      etypes:[],
      arealist:[],
      rnamelist:['机型','工地数量','时长小计/h'],
      boatlist:[{boatname:'机动船',account:[{type:'旅客周转量',unit:'万人公里'},{type:'货物周转量',unit:'万吨公里'}]},
      {boatname:'驳船',account:[{type:'旅客周转量',unit:'万人公里'},{type:'货物周转量',unit:'万吨公里'}]},
      {boatname:'营业性机动船',account:[{type:'机动船客渡量',unit:'万人'},{type:'机动船货渡量',unit:'万吨'}]},
      {boatname:'营业性非机动船',account:[{type:'机动船客渡量',unit:'万人'},{type:'机动船货渡量',unit:'万吨'}]},
      {boatname:'非营业性机动船',account:[{type:'机动船客渡量',unit:'万人'},{type:'机动船货渡量',unit:'万吨'}]},
      {boatname:'非营业性非机动船',account:[{type:'机动船客渡量',unit:'万人'},{type:'机动船货渡量',unit:'万吨'}]},
      ],
      fobject:{},
      fills:[],
      showindex:0,
    }
  },
  computed: {
  },
 
  methods: {
    changeToedit:function(){
          this.isedit = 1;
        },
    saveChange:function(){
      var vm = this
      var rdata = {
        boat:vm.fills[this.showindex].boattype,
        accountid:this.params.gId,
        fillyear:this.params.year,
        city:vm.fills[this.showindex].city
      }
      api.hand.addupbyListName(rdata,'boat').then(function(res){
        if(res.data.status === 0) {
          vm.getfill(vm.params.year)
          vm.isedit = 0;     
        } else {
          vm.$message.error(res.data.msg)
        }                
      })

    },
    filltable:function(){
    	console.log(this.fills[this.showindex])
    },
    getfill:function(year){
      var vm = this;
      api.hand.getAllcitybyYearId('boat',year,this.params.gId).then(function(res){
        console.log(res)
        if(res.data){
          vm.fills = res.data.data;
          vm.show = true
          console.log(vm.fills)
        }
        
      })
    },
    allpass:function(){
      var vm = this;
      api.hand.changeStatus('boat',{
        accountid:this.params.gId,
        fillyear:this.params.year,
        type:0
      }).then(function(res){
        if(res.data.status === 0) {
          vm.getfill(vm.params.year);
        } else {
          vm.$message.error(res.data.msg)
        }
      },function(bad){})
    },
    allrefuse:function(){
      var vm = this;
      api.hand.changeStatus('boat',{
        accountid:this.params.gId,
        fillyear:this.params.year,
        type:1
      }).then(function(res){  
        if(res.data.status === 0) {
          vm.getfill(vm.params.year);
        } else {
          vm.$message.error(res.data.msg)
        }
      },function(bad){})
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.show = false
      var vm = this;
      this.getfill(this.params.year);
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

.el-input {
  min-width: 100px;
}
</style>
