<template>
  <div id="rep">  
    <h3>{{title[params.name].name}}</h3>
    <el-button type="primary" icon="arrow-left" @click="back" style="margin-bottom:10px;">返回</el-button>
    <el-card class="box-card" :body-style="{ padding: '0px' }">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px;"><h2>{{params.year}}年 <small>{{params.add}}</small></h2></span>
      </div>
      <div v-if="params.name == 'ap_construction'" >
        <el-table
          :data="fills"
          style="width: 100%;">
          <el-table-column
            prop="townname"
            label="区（县）"
            >
          </el-table-column>
          <el-table-column
            prop="completeArea"
            label="房屋建筑竣工面积（平方米）"
            >
            <template scope="scope">
              <div  v-if="isedit  && editindex == scope.$index">
                <el-input  v-model="fobject.completeArea" style="padding:0;"></el-input>
              </div>
              <p v-else>{{scope.row.completeArea}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="asphaltRoadArea"
            label="城市道路沥青铺路面积（平方米）"
            >
            <template scope="scope">
              <div  v-if="isedit  && editindex == scope.$index">
                <el-input  v-model="fobject.asphaltRoadArea" style="padding:0;"></el-input>
              </div>
              <p v-else>{{scope.row.asphaltRoadArea}}</p>
            </template>
          </el-table-column>
          <el-table-column  label="状态">
            <template scope="scope">
              <el-tag v-if="scope.row.status == 3" type="success" >通过</el-tag>
              <el-tag v-if="scope.row.status == 2" type="warning" >待审核</el-tag>
              <el-tag v-if="scope.row.status == 1" type="danger" >未提交</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180">
            <template scope="scope">
              <el-button
                v-if="isedit  && editindex == scope.$index"
                @click="saveChange(scope.$index, scope.row)"
                type="success"
                size="small">
                保存
              </el-button>
              <el-button
                v-if="isedit  && editindex ==  scope.$index"
                @click="isedit = 0"
                type=""
                size="small">
                取消
              </el-button>
              <el-button
                v-else
                @click="changeToedit(scope.$index, scope.row)"
                type="primary"
                size="small">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <table style="width:100%">
        <tbody>
          <tr >
              <td colspan="7" ></td>
              <td width="20%">
                 <el-button
                  v-if=" !isedit"
                  @click="pass"
                  type="success"
                  size="small">
                  全部通过
                </el-button>
                <el-button
                  v-if=" !isedit "
                  @click="refuse"
                  type="danger"
                  size="small">
                  全部不通过
                </el-button>
              </td>
            </tr></tbody>
            </table>
      </div>
      <div v-if="params.name == 'ap_pesticide'" class="mytable" >
        <table >
          <thead>
            <tr>
              <th rowspan="2" colspan="1">区(县)</th>
              <th rowspan="2" colspan="1">农作物类型</th>
              <th colspan="5" class="text-center">杀虫剂用量</th>
              <th colspan="5" class="text-center">除草剂用量</th>
              <th rowspan="2" width="8%">杀菌剂用量</th>
              <th rowspan="2" >杀菌剂用量单位</th>
              <th width="7%" class="text-center">状态</th>                 
            </tr>
            <tr>
              <th  width="8%">敌敌畏 </th>
              <th  width="8%">氧化乐果 </th>
              <th  width="8%">氯氰菊脂  </th>
              <th  >合计 </th>
              <th  >用量单位 </th>
              <th  width="8%">百草枯 </th>
              <th  width="8%">多菌灵 </th>
              <th  width="8%">草甘膦   </th>
              <th  >合计 </th>
              <th  >用量单位 </th>
              <th width="13%" class="text-center">操作</th>
            </tr>
          </thead>
          
          <tbody v-for="(town,tindex) in fills">
            <tr v-for="(ob,pindex) in town.crops">
              <td v-if="pindex === 0" :rowspan="town.crops.length">{{town.town}}</td>
              <td v-if="pindex!=7">
                {{ob.crop}}
              </td>
              <td v-if="pindex==7">
                合计
              </td>
              <td >
                <div  v-if="isedit && editindex == tindex&&pindex!=7">
                  <el-input v-model="fobject.crops[pindex].dd" style="padding:0;"></el-input>
                </div>
                <p v-else>{{ob.dd}}</p>
                <p v-if="pindex==7">{{ob.ddtotal}}</p>
              </td>
              <td>
                <div v-if="isedit && editindex == tindex&&pindex!=7">
                  <el-input  v-model="fobject.crops[pindex].omethoate" style="padding:0;"></el-input>
                </div>
                <p v-else>{{ob.omethoate}}</p>
                <p v-if="pindex==7">{{ob.omethoatetotal}}</p>
              </td>
              <td>
                <div v-if="isedit && editindex == tindex&&pindex!=7">
                  <el-input  v-model="fobject.crops[pindex].cypermethrin" style="padding:0;"></el-input>
                </div>
                <p v-else>{{ob.cypermethrin}}</p>
                <p v-if="pindex==7">{{ob.cypermethrintotal}}</p>
                
              </td>
              <td v-if='pindex!=7'>{{ob.wormtotal}}</td>
              <td v-if='pindex==7'>{{ob.wormtotaltotal}}</td>
              <td>吨</td>
              <td>
                <div v-if="isedit && editindex == tindex&&pindex!=7">
                  <el-input  v-model="fobject.crops[pindex].paraquat" style="padding:0;"></el-input>
                </div>
                <p v-else>{{ob.paraquat}}</p>
                <p v-if="pindex==7">{{ob.paraquattotal}}</p>
              </td>
              <td>
                <div v-if="isedit && editindex == tindex&&pindex!=7">
                  <el-input  v-model="fobject.crops[pindex].carbendazim" style="padding:0;"></el-input>
                </div>
                <p v-else>{{ob.carbendazim}}</p>
                <p v-if="pindex==7">{{ob.carbendazimtotal}}</p>
              </td>
              <td>
                <div v-if="isedit && editindex == tindex&&pindex!=7">
                  <el-input  v-model="fobject.crops[pindex].glyphosate" style="padding:0;"></el-input>
                </div>
                <p v-else>{{ob.glyphosate}}</p>
                <p v-if="pindex==7">{{ob.glyphosatetotal}}</p>
              </td>
              <td v-if='pindex!=7'>{{ob.grasstotal}}</td>
              <td v-if='pindex==7'>{{ob.grasstotaltotal}}</td>
              <td>吨</td>
              <td>
                <div v-if="isedit && editindex == tindex&&pindex!=7">
                  <el-input  v-model="fobject.crops[pindex].fungicide" style="padding:0;"></el-input>
                </div>
                <p v-else>{{ob.fungicide}}</p>
                <p v-if="pindex==7">{{ob.fungicidetotal}}</p>
              </td>
              <td>吨</td>
              <td v-if="pindex === 0" class="text-center">
                <el-tag v-if="town.status == 3" type="success" >通过</el-tag>
                <el-tag v-if="town.status == 2" type="warning" >待审核</el-tag>
                <el-tag v-if="town.status == 1" type="danger" >未提交</el-tag>
              </td>
              <td v-if="pindex === 1" :rowspan="town.crops.length - 1" class="text-center">
                <el-button
                  v-if="!isedit || (isedit && editindex != tindex)"
                  @click="changeToedit(tindex)"
                  type="primary"
                  size="small">
                  编辑
                </el-button>
                <el-button
                  v-if="isedit && editindex == tindex"
                  @click="saveChange(tindex)"
                  type="success"
                  size="small">
                  保存
                </el-button>
                <el-button
                  v-if="isedit && editindex == tindex"
                  @click="isedit = 0"
                  type="danger"
                  size="small"
                  style="margin-left:0;margin-top:10px;">
                  取消
                </el-button>
              </td>
            </tr>
          </tbody>
          <tbody>
          <tr >
              <td colspan="12" ></td>
              <td colspan="3">
                 <el-button
                  v-if=" !isedit"
                  @click="pass"
                  type="success"
                  size="small">
                  全部通过
                </el-button>
                <el-button
                  v-if=" !isedit "
                  @click="refuse"
                  type="danger"
                  size="small">
                  全部不通过
                </el-button>
              </td>
            </tr></tbody>
        </table>
      </div>
      <div v-if="params.name == 'ap_energy_consume'|| params.name == 'ap_energy_sell'" class="mytable" >
        <table >
          <thead>
            <tr>
              <th  >能源使用类型</th>
                <th  >区（县）</th>
                <th  >煤炭（吨）</th>
                <th  >天然气（万立方米）</th>
                <th  >液化石油气（万立方米）</th>
                <th  >燃料油（吨）</th>
                <th  >电（万千瓦时）</th>
                <th width="7%" class="text-center" >状态</th> 
                <th  width="13%" class="text-center">操作</th>                   
            </tr>
          </thead>
          
          <tbody v-for="(titem,tindex) in fills">
            <tr v-for="(ob,pindex) in titem.energy">
              <td v-if="pindex === 0" :rowspan="titem.energy.length">{{titem.purpose}}</td>
              <td >
                {{ob.townname}}
              </td>
              <td >
                <div  v-if="isedit && ((editindex == pindex) && (editoutindex == tindex))">
                  <el-input v-model="fobject.coal" style="padding:0;"></el-input>
                </div>
                <p v-else>{{ob.coal}}</p>
              </td>
              <td>
                <div v-if="isedit &&  ((editindex == pindex) && (editoutindex == tindex))">
                  <el-input  v-model="fobject.gas" style="padding:0;"></el-input>
                </div>
                <p v-else>{{ob.gas}}</p>
              </td>
              <td>
                <div v-if="isedit &&  ((editindex == pindex) && (editoutindex == tindex))">
                  <el-input  v-model="fobject.liquefied" style="padding:0;"></el-input>
                </div>
                <p v-else>{{ob.liquefied}}</p>
              </td>
              <td>
                <div v-if="isedit &&  ((editindex == pindex) && (editoutindex == tindex))">
                  <el-input  v-model="fobject.fueloil" style="padding:0;"></el-input>
                </div>
                <p v-else>{{ob.fueloil}}</p>
              </td>
              <td>
                <div v-if="isedit &&  ((editindex == pindex) && (editoutindex == tindex))">
                  <el-input  v-model="fobject.electricity" style="padding:0;"></el-input>
                </div>
                <p v-else>{{ob.electricity}}</p>
              </td>
              <td class="text-center">
                <el-tag v-if="ob.status == 3" type="success" >通过</el-tag>
                <el-tag v-if="ob.status == 2" type="warning" >待审核</el-tag>
                <el-tag v-if="ob.status == 1" type="danger" >未提交</el-tag>
              </td>
              <td class="text-center">
                
                <el-button
                  v-if="isedit &&  ((editindex == pindex) && (editoutindex == tindex))"
                  @click="saveChange(pindex,tindex)"
                  type="success"
                  size="small">
                  保存
                </el-button>
                <el-button
                  v-if="isedit &&  ((editindex == pindex) && (editoutindex == tindex))"
                  @click="isedit = 0"
                  type="danger"
                  size="small"
                  style="margin-left:0;margin-top:10px;">
                  取消
                </el-button>
                <el-button
                  v-else
                  @click="changeToedit(pindex,tindex)"
                  type="primary"
                  size="small">
                  编辑
                </el-button>
              </td>
            </tr>
          </tbody>
          <tbody>
          <tr v-if=" fills.length > 1">
              <td colspan="7"></td>
              <td colspan="2">
                 <el-button
                  v-if=" !isedit"
                  @click="pass"
                  type="success"
                  size="small">
                  全部通过
                </el-button>
                <el-button
                  v-if=" !isedit "
                  @click="refuse"
                  type="danger"
                  size="small">
                  全部不通过
                </el-button>
              </td>
            </tr></tbody>
        </table>
      </div>
      <div v-if="params.name == 'ap_constructiondust'" class="mytable" >
        <builddust :params="params"></builddust>
      </div>
      <div v-if="params.name == 'ap_household_fuel'" class="mytable" >
        <domesticfuel :params="params"></domesticfuel>
      </div>
      <div v-if="params.name == 'ap_cleaner'" class="mytable" >
        <drycleaner :params="params"></drycleaner>
      </div>
      <div v-if="params.name == 'ap_boat'" class="mytable" >
        <shiplist :params="params"></shiplist>
      </div>
      <div v-if="params.name == 'ap_equipment'" class="mytable" >
        <engineering :params="params"></engineering>
      </div>
      <div v-if="params.name == 'ap_equipment_farm'" class="mytable" >
        <farming :params="params"></farming>
      </div>
      <div v-if="params.name == 'ap_firewood'" class="mytable" >
        <firewood :params="params"></firewood>
      </div>
      <div v-if="params.name == 'ap_vehicle_repairing'" class="mytable" >
        <mechanics :params="params"></mechanics>
      </div>
      <div v-if="params.name == 'ap_nfertilizer'" class="mytable" >
        <nfertilizer :params="params"></nfertilizer>
      </div>
      <div v-if="params.name == 'ap_road_dust'" class="mytable" >
        <roaddust :params="params"></roaddust>
      </div>
    </el-card>
  </div>
</template>

<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'
import builddust from './builddust'
import domesticfuel from './domesticfuel'
import drycleaner from './drycleaner'

import mechanics from './mechanics'
import nfertilizer from './nfertilizer'
import roaddust from './roaddust'
import shiplist from './shiplist'
import engineering from './engineering'
import farming from './farming'
import firewood from './firewood'

export default {
  components: {
    builddust,
    domesticfuel,
    drycleaner,
    mechanics,
    nfertilizer,
    roaddust,
    shiplist,
    engineering,
    farming,
    firewood
  },
  data () {
    return {
      params:{
        add:"宜宾市",
        gId:2049,
        name:"ap_construction",
        year:2017,
        status:1,
        keyword:''
      },
      title:{
        'ap_energy_consume':{name:'能源消耗量调查表',field:'energy/consume'},
        'ap_pesticide':{name:'农药使用量调查表',field:'pesticide'},
        'ap_energy_sell':{name:'能源销售调查表',field:'energy/sell'},
        'ap_construction':{name:'房屋住建面积调查表',field:'construction'},
        'ap_household_fuel':{name:'民用燃料用量调查表'},
        'ap_constructiondust':{name:'施工扬尘源信息调查表'},
        'ap_cleaner':{name:'干洗店数量信息调查表'},
        'ap_boat':{name:'船舶活动调查表'},
        'ap_equipment':{name:'工程机械活动调查表'},
        'ap_equipment_farm':{name:'农业机械活动调查表'},
        'ap_firewood':{name:'秸秆和薪柴调查表'},
        'ap_vehicle_repairing':{name:'汽修企业数量调查表'},
        'ap_nfertilizer':{name:'氮肥施用调查表'},
        'ap_road_dust':{name:'道路扬尘源调查表'},
      },
      fills:[],
      fobject:{},
      isedit:0,
      editindex:'',
      editoutindex:'',
      state:state
    }
  },
  computed: {
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData() {
      console.log(this.$route)
      _.assign(this.params,this.$route.params)
      if( this.title[this.params.name].field ) {
        this.getfill(this.params.year);
      }
    },
    changeToedit:function(index,outindex){

          console.log(outindex)
          this.isedit = 1;
          this.editindex = index;
          
          this.editoutindex = outindex;
          

          switch(this.params.name){
            case 'ap_energy_consume':
              this.fobject = this.fills[outindex].energy[index];
              break
            case 'ap_energy_sell':
              this.fobject = this.fills[outindex].energy[index];
              break
            default:
              this.fobject = this.fills[index];
              break 
          }
          console.log(this.fobject)
        },
        saveChange:function(index){
          var vm = this;
          console.log(this.fills[this.editoutindex]);
          
          var obdata = {};
          

          switch(this.params.name){
            case 'ap_energy_consume':
              obdata.energy = [];
              obdata.energy.push(this.fobject);
              obdata.energy[0].typename = this.fills[this.editoutindex].purpose;
              break
            case 'ap_energy_sell':
              obdata.energy = [];
              obdata.energy.push(this.fobject);
              obdata.energy[0].typename = this.fills[this.editoutindex].purpose;
              break
            default:
              obdata = this.fobject;
              
              break 
          }
          obdata.accountid = this.params.gId;
          console.log(obdata)
          api.hand.addupbyListName(obdata,this.title[this.params.name].field).then(function(res){
            //console.log(res);
            vm.getfill(vm.params.year)
            vm.isedit = 0;            
          })
        },
    getfill:function(year){
      var vm = this;
      api.hand.getFillsbyYearAid(this.title[this.params.name].field,this.params.year,this.params.gId).then(function(res){
        console.log(res)
        if(res.data){
          vm.fills = res.data.data;
          console.log(vm.fills)
        }         
      })
    },
    back(){
    	this.$router.push('/goverment')
    	this.state.pagekey = this.params
    },
    pass:function(){
      var vm = this;
      api.hand.changeStatus(vm.title[vm.params.name].field,{
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
    refuse:function(){
      var vm = this;
      api.hand.changeStatus(vm.title[vm.params.name].field,{
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
      console.log('这页面刷新什么贵')
      this.fetchData()
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

.el-input {
  min-width: 100px;
}
</style>
