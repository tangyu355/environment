<template>
  <div id="builddust">  
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
          <tr colspan="3">
            <th >分类</th>
            <td>道路长度/m</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="x in 8">
            <td v-if="((x-1) % 2) === 0" rowspan="2" width='15%'>{{rnamelist[(x-1)/2]}}</td>
            <td >{{rstylelist[((x-1)%2)]}}</td>
            <td>
              <p v-if="isedit !== 1">{{fobject[x-1]}}</p>
              <div   v-else>
                <el-input v-model="fobject[x-1]"  style="padding:0;"></el-input>
              </div>
            </td>
          </tr>
          <tr>
            <th colspan="1">未铺装道路总计/m</th>
            <td >
              <div v-if="isedit == 1">
                <el-input v-model="ksNotShop"  style="padding:0;"></el-input>
              </div>
              <p v-else>{{fill.ksNotShop}}</p>
            </td>
            <th colspan="1">操作</th>
          </tr>
          <tr>
            <th colspan="1">控制措施</th>
            <td >
              <div  v-if="isedit == 1">
                <el-select v-model="controlType"  style="padding:0;">
                  <el-option v-for="c in controls" :key="c.id" :value="c.id" :label="c.name"></el-option>
                </el-select>
              </div>
              <p v-else>{{fill.control}}</p>
            </td>
            <td  class="text-center">
              <el-button
                v-if="isedit "
                @click="saveChange"
                type="success"
                size="small">
                保存
              </el-button>
              <el-button
                v-if="isedit"
                @click="isedit = 0"
                type="danger"
                size="small">
                取消
              </el-button>
              <el-button
                v-if="!isedit"
                @click="changeToedit($index)"
                type="primary"
                size="small">
                编辑
              </el-button>
              <el-button
                v-if=" !isedit && fill.status<3"
                @click="pass($index)"
                type="success"
                size="small">
                通过
              </el-button>
              <el-button
                v-if=" !isedit && fill.status<3"
                @click="refuse($index)"
                type="danger"
                size="small">
                不通过
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
      rnamelist:['快速路','主干道','次干道','支路'],
      rstylelist:['沥青铺装道路扬尘源/m','水泥铺装道路扬尘源/m'],
      fobject:[],
      fills:[],
      isedit:0,
      controls:[],
      showindex:0,
      ksNotShop:'',
      controlType:'',
      statuslist:[{status:'未上报',color:'label-danger'},{status:'待审核',color:'label-warning'},{status:'已审核',color:'label-success'}]
    }
  },
  computed: {
  },
  methods: {
    changeToedit:function(index){
      this.isedit = 1
    },
    filltable:function(){
        console.log(this.fills[this.showindex])
        this.fobject[0]=this.fills[this.showindex].ksPitch
        this.fobject[1]=this.fills[this.showindex].ksCement
        this.fobject[2]=this.fills[this.showindex].zgPitch
        this.fobject[3]=this.fills[this.showindex].zgCement
        this.fobject[4]=this.fills[this.showindex].cgPitch
        this.fobject[5]=this.fills[this.showindex].cgCement
        this.fobject[6]=this.fills[this.showindex].zPitch
        this.fobject[7]=this.fills[this.showindex].zCement
        this.ksNotShop = this.fills[this.showindex].ksNotShop
        this.controlType= this.fills[this.showindex].controlType
      console.log(this.fobject)
    },
    saveChange:function(){
      this.fills[this.showindex].ksPitch = this.fobject[0]
      this.fills[this.showindex].ksCement=this.fobject[1]
      this.fills[this.showindex].zgPitch=this.fobject[2]
      this.fills[this.showindex].zgCement=this.fobject[3]
      this.fills[this.showindex].cgPitch=this.fobject[4]
      this.fills[this.showindex].cgCement=this.fobject[5]
      this.fills[this.showindex].zPitch=this.fobject[6]
      this.fills[this.showindex].zCement=this.fobject[7]
      this.fills[this.showindex].ksNotShop=this.ksNotShop
      this.fills[this.showindex].controlType=this.controlType
      var vm = this;
      api.hand.addupbyListName(this.fills[this.showindex],'road/dust').then(function(res){
        vm.getfill(vm.params.year);
        vm.isedit = 0;
      })
    },
    getfill:function(year){
      var vm = this;
      api.hand.getFillsbyYearAid('road/dust',year,this.params.gId).then(function(res){
        console.log(res)
        if(res.data.status === 0){
          vm.fills = res.data.data;
          vm.filltable(vm.showindex)
          console.log(vm.fills)
          vm.show = true
        }
      })
    },
    pass:function(index){
      var vm = this;
      this.fills[this.showindex].status = 3;
      api.hand.addupbyListName(this.fills[this.showindex],'road/dust').then(function(res){
        if(res.data.status === 0) {
          vm.getfill(vm.params.year);
        } else {
          vm.$message.error(res.data.msg)
        }
      },function(bad){})
    },
    refuse:function(index){
      this.fills[this.showindex].status = 1;
      var vm=this;
      api.hand.addupbyListName(this.fills[this.showindex],'road/dust').then(function(res){
        if(res.data.status === 0) {
          vm.getfill(vm.params.year);
        } else {
          vm.$message.error(res.data.msg)
        }
      },function(bad){})
    },
    allpass:function(){
      var vm = this;
      api.hand.changeStatus('road/dust',{
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
      api.hand.changeStatus('road/dust',{
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
      api.staticinformation.getbygid(19).then(function(res){
          vm.controls = res.data.staticlist;
          console.log(vm.controls)
        })
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
