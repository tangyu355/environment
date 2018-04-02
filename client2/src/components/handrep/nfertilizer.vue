<template>
  <div id="builddust">  
    <table v-if="show" style="width:100%;">
      <thead>
        <tr>
          <th rowspan="2">地址</th>
          <th rowspan="2">氮肥种类</th>
          <th rowspan="2">施肥方式</th>
          <th rowspan="2">施肥量</th>
          <th rowspan="2" v-if="showpro">每亩耕地施用量</th>          
          <th colspan="12" class="text-center" v-if="showpro">月份</th>  
          <th rowspan="2" class="text-center">状态</th>
          <th rowspan="2" class="text-center">操作</th>
        </tr>
        <tr v-if="showpro">
          <th v-for="n in 12">{{n}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,$index) in fills">
          <td v-if="item.addressStr!==null">
            <p >{{item.addressStr}}</p>
          </td>
          <td v-else>
          	<p >{{item.cityName}}</p>
          </td>
          <td>
            <p v-if="!isedit || indexof != $index">{{item.ferTypeName}}</p>
            <div   v-else>
              <el-select v-model="fobject.ferType"  style="padding:0;">
                <el-option v-for="x in nlist" 
                :key="x.id"
                :label="x.name"
                :value="x.id">
                </el-option>
              </el-select>
            </div>
          </td>
          <td>
            <p v-if="!isedit || indexof != $index">{{item.layingTypeName}}</p>
            <div   v-else>
              <el-select v-model="fobject.layingType"  style="padding:0;">
                <el-option v-for="x in methodlist" 
                :key="x.id"
                :label="x.name"
                :value="x.id">
                </el-option>
              </el-select>
            </div>
          </td>
          <td>
            <p>{{item.amountTotal}}(吨/年)</p>
          </td>
          <td v-if="showpro">
            <p v-if="!isedit || indexof != $index">{{item.amountMu}}(kg/亩)</p>
            <div   v-else>
              <el-input v-model="fobject.amountMu"  style="padding:0;"></el-input>
            </div>
          </td>          
          <td v-for="n in 12" v-if="showpro">
            <p v-if="!isedit || indexof != $index">{{item['m'+(n*1)]}}</p>
            <div   v-else>
              <el-input v-model="fobject['m'+(n*1)]"  style="padding:0;"></el-input>
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
      etypes:[],
      arealist:[],
      rnamelist:['机型','工地数量','时长小计/h'],
      show:false,
      fobject:{},
      fills:[],
      isedit:0,
      indexof:'',
      nlist:[],
      methodlist:[],
      showpro:false
    }
  },
  computed: {
  },
 
  methods: {
    changeToedit:function(index){
          this.indexof = index;
          this.isedit = 1;
          this.fobject = this.fills[this.indexof]
        },
        saveChange:function(){
          var vm = this;
          api.hand.addupbyListName(this.fobject,'nfertilizer').then(function(res){
            vm.getfill(vm.params.year);
            vm.isedit = 0;
          })
        },
        getfill:function(year){
          var vm = this;
          api.hand.getFillsbyYearAid('nfertilizer',year,this.params.gId).then(function(res){
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
          this.fobject = this.fills[this.indexof];
          this.fobject.status = 3; 
          this.fobject.accountid = this.params.gId
          var vm=this;
          api.hand.addupbyListName(fobject,'nfertilizer').then(function(res){
            if(res.data.status === 0) {
              vm.getfill(vm.params.year);
            } else {
              vm.$message.error(res.data.msg)
            }
          },function(bad){})
        },
        refuse:function(index){
          this.indexof = index;
          this.fobject = this.fills[this.indexof];
          this.fobject.accountid = this.params.gId
           
          this.fobject.status = 1; 
          var vm=this;
          api.hand.addupbyListName(this.fobject,'nfertilizer').then(function(res){
            if(res.data.status === 0) {
              vm.getfill(vm.params.year);
            } else {
              vm.$message.error(res.data.msg)
            }
          },function(bad){})
        },
        allpass:function(){

          var vm = this;
          api.hand.changeStatus('nfertilizer',{
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
          api.hand.changeStatus('nfertilizer',{
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
      console.log(this.params)
      if(this.params.add=="农业厅"){
      	vm.showpro = false
      } else{
      	vm.showpro = true
      }
      api.staticinformation.getbygid(11).then(function(res){
          vm.nlist = res.data.staticlist;
        });
        api.staticinformation.getbygid(12).then(function(res){
          vm.methodlist = res.data.staticlist;
        });
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

.el-input,.el-select{
  min-width: 100px;
}
.el-button{
  margin-top: 10px;
  margin-left: 10px; 
}
</style>
