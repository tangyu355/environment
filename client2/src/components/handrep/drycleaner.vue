<template>
  <div id="builddust">  
    <table v-if="show" style="width:100%;">
      <thead>
        <tr>
          <th>地址</th>
          <th>干洗店数量（家）</th>
          <th width="7%" class="text-center">状态</th>
          <th width="20%" class="text-center">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,$index) in fills">
          <td v-if="item.addressStr!==null">
            <p >{{item.addressStr}}</p>
          </td>
          <td v-else>
          	<p>{{item.cityName}}</p>
          </td>
          <td>
            <p v-if="!isedit || indexof != $index">{{item.cleanerNumber}}</p>
            <div   v-else>
              <el-input v-model="account"  style="padding:0;"></el-input>
            </div>
          </td>
          <td class="text-center">
            <el-tag v-if="item.status == 3" type="success" >通过</el-tag>
            <el-tag v-if="item.status == 2" type="warning" >待审核</el-tag>
            <el-tag v-if="item.status == 1" type="danger" >未提交</el-tag>
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
              @click="changeToedit($index)"
              type="primary"
              size="small">
              编辑
            </el-button>
            <el-button
              v-if=" !isedit &&item.status<3"
              @click="pass($index)"
              type="success"
              size="small">
              通过
            </el-button>
            <el-button
              v-if=" !isedit &&item.status<3"
              @click="refuse($index)"
              type="danger"
              size="small">
              不通过
            </el-button>
          </td>
        </tr>
        <tr v-if=" fills.length > 1">
          <td colspan="8"></td>
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
      <tbody>
        

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
      fobject:[],
      fills:[],
      isedit:0,
      indexof:'',
      account:''
    }
  },
  computed: {
  },
 
  methods: {
    changeToedit:function(index){
          this.indexof = index;
          this.isedit = 1;
          this.account =  this.fills[this.indexof].cleanerNumber;
        },
        saveChange:function(){
          var rdata = {
            accountid:this.params.gId,
            province:1,
            id:this.fills[this.indexof].id,
            city:this.fills[this.indexof].city,
            town:this.fills[this.indexof].town,
            cleanerNumber:this.account
          }
          var vm = this;
          api.hand.addupbyListName(rdata,'cleaner').then(function(res){
            console.log(rdata)
            vm.getfill(vm.params.year);
            vm.isedit = 0;
          })
        },
        getfill:function(year){
          var vm = this;
          api.hand.getFillsbyYearAid('cleaner',year,this.params.gId).then(function(res){
            console.log(res)
            if(res.data.status === 0){
              vm.fills = res.data.data;
              console.log(vm.fills)
              vm.show = true
            }
          })
        },
        pass:function(index){
          this.indexof = index;
          var rdata = {
            accountid:this.params.gId,
            province:1,
            id:this.fills[this.indexof].id,
            city:this.fills[this.indexof].city,
            town:this.fills[this.indexof].town,
            cleanerNumber:this.fills[this.indexof].cleanerNumber               
          }
          rdata.status = 3; 
          var vm=this;
          api.hand.addupbyListName(rdata,'cleaner').then(function(res){
            if(res.data.status === 0) {
              vm.getfill(vm.params.year);
            } else {
              vm.$message.error(res.data.msg)
            }
          },function(bad){})
        },
        refuse:function(index){
          this.indexof = index;
          var rdata = {
            accountid:this.params.gId,
            province:1,
            id:this.fills[this.indexof].id,       
          }
          rdata.status = 1; 
          var vm=this;
          api.hand.addupbyListName(rdata,'cleaner').then(function(res){
            if(res.data.status === 0) {
              vm.getfill(vm.params.year);
            } else {
              vm.$message.error(res.data.msg)
            }
          },function(bad){})
        },
        allpass:function(){
          var vm = this;
          var rdata = {
            accountid:this.params.gId,
            fillyear:this.params.year,
            type:0       
          }
          api.hand.changeStatus('cleaner',rdata).then(function(res){
            if(res.data.status === 0) {
              vm.getfill(vm.params.year);
            } else {
              vm.$message.error(res.data.msg)
            }
          },function(bad){})
        },
        allrefuse:function(){
          var vm = this;
          var rdata = {
            accountid:this.params.gId,
            fillyear:this.params.year,
            type:1       
          }
          api.hand.changeStatus('cleaner',rdata).then(function(res){  
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
