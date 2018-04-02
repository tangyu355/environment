<template>
  <div id="builddust">  
    <table v-if="show" style="width:100%;">
      <thead>
        <tr>
          <th>地址</th>
          <th>农作物类型</th>
          <th>种植面积（亩）</th>
          <th>产量（吨）</th>
          <th>秸秆综合利用效率（%）</th>
          <th width="20%" class="text-center">操作</th>
          <th width="7%" class="text-center">状态</th>          
        </tr>
      </thead>
      <tbody v-for="(item,bindex) in map" >
        <tr v-for="(corp,$index) in item.crops">
          <td v-if="$index == 0" :rowspan="item.crops.length">
            <p >{{item.townname}}</p>
          </td>
          <td>
            <p >{{corp.cropName}}</p>  
          </td>
          <td>
            <div v-if="isedit && ((indexof === $index )&&(outsideIndex === bindex))">
              <el-input v-model="corp.area"  style="padding:0;"></el-input>
            </div>
            <p v-else>{{corp.area}}</p>  
          </td>
          <td>
            <div v-if="isedit && ((indexof === $index )&&(outsideIndex === bindex))">
              <el-input v-model="corp.yield"  style="padding:0;"></el-input>
            </div>
            <p v-else>{{corp.yield}}</p>  
          </td>
           <td>
            <div v-if="isedit && ((indexof === $index )&&(outsideIndex === bindex))">
              <el-input v-model="corp.utilization"  style="padding:0;"></el-input>
            </div>
            <p v-else>{{corp.utilization}}</p>  
          </td>          
          <td  class="text-center">
            <el-button
              v-if="isedit && indexof === $index"
              @click="saveChange"
              type="success"
              size="small">
              保存
            </el-button>
            <el-button
              v-if="isedit && indexof === $index"
              @click="isedit = 0"
              type="danger"
              size="small">
              取消
            </el-button>
            <el-button
              v-if="!isedit || indexof != $index"
              @click="changeToedit($index,bindex)"
              type="primary"
              size="small">
              编辑
            </el-button>
            <el-button
              v-if=" !isedit &&item.status<3"
              @click="pass($index,bindex)"
              type="success"
              size="small">
              通过
            </el-button>
            <el-button
              v-if=" !isedit &&item.status<3"
              @click="refuse($index,bindex)"
              type="danger"
              size="small">
              不通过
            </el-button>
          </td>
          <td class="text-center" :rowspan="item.crops.length" v-if="$index == 0">
            <el-tag v-if="corp.status == 3" type="success" >通过</el-tag>
            <el-tag v-if="corp.status == 2" type="warning" >待审核</el-tag>
            <el-tag v-if="corp.status == 1" type="danger" >未提交</el-tag>
          </td>
        </tr>
        
      </tbody>
      <tbody>
        <tr v-if=" map.length > 1">
          <td colspan="6"></td>
          <td colspan="2">
             <el-button
              v-if=" !isedit"
              @click="allpass"
              type="success"
              size="small">
              全部通过
            </el-button>
            <el-button
              v-if=" !isedit "
              @click="allrefuse"
              type="danger"
              size="small">
              全部不通过
            </el-button>
          </td>
        </tr>

      </tbody>
    </table>
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
      indexof:'',
      show:false,
      fobject:{},
      fills:[],
      indexof:'',
      outsideIndex:'',
      status:'',
      accountid:'',
      map:[]
    }
  },
  computed: {
  },
 
  methods: {
    changeToedit:function(index,oindex){
      this.indexof = index;
      this.isedit = 1;
      this.outsideIndex = oindex;
      this.fobject = this.map[this.outsideIndex];
      this.fobject.city = this.map[this.outsideIndex].town
      console.log('index =' +this.indexof+'outsideIndex = '+this.outsideIndex,this.fobject)
    },
    saveChange:function(){
      this.fobject.accountid = this.params.gId
      this.fobject.fillyear = this.params.year
      this.fobject.status = 1
      var vm = this;
      api.hand.addupbyListName(this.fobject,'firewood').then(function(res){
        vm.getfill(vm.params.year);
        vm.isedit = 0;
      })
    },
    getfill:function(year){
      var vm = this;
      api.hand.getFillsbyYearAid('firewood',year,this.params.gId).then(function(res){
        console.log(res)
        if(res.data.status === 0){
          vm.fills = res.data.data;
          vm.map = res.data.data.map;
          console.log(vm.fills)
          vm.show = true
        }
      })
    },
    pass:function(index,oindex){
      let vm = this;
      this.indexof = index;
      this.outsideIndex = oindex;
      this.fobject = this.map[this.outsideIndex]; 
      console.log(vm.fobject)
      vm.fobject.status = 3;
      vm.fobject.fillyear = this.params.year;
      vm.fobject.accountid=this.params.gId;   

      api.hand.addupbyListName(this.fobject,'firewood').then(function(res){
        if(res.data.status === 0) {
          vm.getfill(vm.params.year);
        } else {
          vm.$message.error(res.data.msg)
        }
      },function(bad){})
    },
    refuse:function(index,oindex){
      let vm = this;
      this.indexof = index;
      this.outsideIndex = oindex;
      this.fobject = this.map[this.outsideIndex]; 
      vm.fobject.status = 1;
      vm.fobject.fillyear = this.params.year;
      vm.fobject.accountid=this.params.gId;   

      api.hand.addupbyListName(this.fobject,'firewood').then(function(res){
        if(res.data.status === 0) {
          vm.getfill(vm.params.year);
        } else {
          vm.$message.error(res.data.msg)
        }
      },function(bad){})
    },
    allpass:function(){
      var vm = this;
      api.hand.changeStatus('firewood',{
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
      api.hand.changeStatus('firewood',{
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
