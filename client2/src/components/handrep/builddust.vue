<template>
  <div id="builddust">
  	<el-collapse v-model="showindex"  @change="filltable()" accordion>
      <el-collapse-item v-for="(fill,$index) in fills"  :name="$index">
      	<template slot="title">
      		{{fill.cityName}}
      	  <el-tag v-if="fill.status == 3" type="success" >通过</el-tag>
          <el-tag v-if="fill.status == 2" type="warning" >待审核</el-tag>
          <el-tag v-if="fill.status == 1" type="danger" >未提交</el-tag>
        </template>
	    <table style="width:100%;">
	      <thead>
	        <tr>
	          <th colspan="2" rowspan="2" width='22%'>全市建筑施工面积（m²）</th>
	          <th colspan="2" rowspan="2" width='29%'>全市施工工地开工情况</th>
	          <th colspan="4" class="text-center">工地类别划分标准(m²)</th>                       
	        </tr>
	        <tr>
	          <th v-for="a in arealist" width="15%">{{a.name}}</th>
	        </tr>
	      </thead>
	      <tbody>
	        <tr v-for="n in 4">
	          <td>{{rnamelist[n-1]}}</td>
	          <td>
	            <div  v-if="isedit == 1">
	              <el-input v-model="fill[size[n-1]]"  style="padding:0;"></el-input>
	            </div>
	            <p v-else>{{fill[size[n-1]]}}</p>
	          </td>
	          
	          <th rowspan="2" v-if = "(n-1) % 2 === 0">{{((n-1) % 4 === 0) ? '已': '未'}}开工工地</th>
	          <td>{{((n-1) % 2 === 0)?'总建筑施工面积（m²）':'工地数量'}}</td>
	          <td v-for="m in 4">
	            <div  v-if="isedit == 1">
	              <el-input v-model="fill.area[m-1][etypes[n-1]]" style="padding:0;"></el-input>
	            </div>
	            <p v-else>{{fill.area[m-1][etypes[n-1]]}}</p>
	          </td>
	        </tr>
	        <tr>
	          <th colspan="4">年平均施工时长/天</th>
	          <td v-for="m in 4">
	            <div  v-if="isedit == 1">
	              <el-input v-model="fill.area[m-1].avgWorktime" style="padding:0;"></el-input>
	            </div>
	            <p v-else>{{fill.area[m-1].avgWorktime}}</p>
	          </td>
	        </tr>
	        <tr>
	          <th colspan="4">责任管理单位</th> 
	          <td colspan="4">
	            <div  v-if="isedit == 1">
	              <el-input v-model="fill.department" style="padding:0;"></el-input>
	            </div>
	            <p v-else>{{fill.department}}</p>
	          </td>                    
	        </tr>
	        <tr>
	          <th colspan="4">操作</th>
	          <td colspan="4" class="text-center">
	                <el-button
	                  v-if="isedit"
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
	                  @click="changeToedit"
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
      etypes:['hasStartedArea','hasStartNumber','notStartArea','notStartNumber'],
      size:['constructArea','buildingArea','startWorkArea','completeArea'],
      arealist:[],
      rnamelist:['规划施工面积','规划建筑面积','开工面积','竣工面积'],
      show:false,
      fobject:[],
      fills:[],
      isedit:0,
      statuslist:[{status:'未上报',color:'label-danger'},{status:'待审核',color:'label-warning'},{status:'已审核',color:'label-success'}],
      dataready:false,
      showindex:0
    }
  },
  computed: {
  },
 
  methods: {
    changeToedit:function(){
          this.isedit = 1;
        },
        filltable:function(){
          
        },
        saveChange:function(){
          var vm = this;
          //console.log(this.fills);
          api.hand.addupbyListName(this.fills[this.showindex],'constructionDust').then(function(res){
            //console.log(res);
            //vm.getfill(vm.params.year)
            vm.isedit = 0;            
          })
        },
        getfill:function(year){
          var vm = this;
          api.hand.getAllcitybyYearId('constructionDust',vm.params.year,vm.params.gId).then(function(res){
            console.log(res)
            if(res.data){
            vm.fills = res.data.data
            console.log(vm.fills)
            vm.dataready = true
          }         
        })
        },
        allpass:function(){
          var vm = this;
          api.hand.changeStatus('constructionDust',{
            accountid:vm.params.gId,
            fillyear:vm.params.year,
            type:0
          }).then(function(res){
            vm.getfill(vm.params.year)
          },function(bad){
            vm.$message 
          })
        },
        allrefuse:function(){
          var vm = this;
          api.hand.changeStatus('constructionDust',{
            accountid:vm.params.gId,
            fillyear:vm.params.year,
            type:1
          }).then(function(res){ 
            vm.getfill(vm.params.year)
          },function(bad){})
        }           
  },
  mounted () {
    this.$nextTick(() => {
      this.dataready = false
      var vm = this;
      api.staticinformation.getbygid(21).then(function(res){

        vm.arealist = res.data.staticlist;
        console.log(vm.arealist)
        vm.getfill()
      });
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
