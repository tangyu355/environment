<template>
  <div id="engineering" v-if="showpage"> 
  	<el-collapse v-model="showindex"  @change="filltable2()" accordion>
      <el-collapse-item v-for="(fill,$index) in fills" :name="$index">
      	<template slot="title">
      		{{fill.cityName}}
      	  <el-tag v-if="fill.status == 3" type="success" >通过</el-tag>
          <el-tag v-if="fill.status == 2" type="warning" >待审核</el-tag>
          <el-tag v-if="fill.status == 1" type="danger" >未提交</el-tag>
        </template>
	    <table style="width:100%;">
	      <thead>
	        <tr>
	          <th rowspan="2"></th>
	          <th class="text-center">工地类型（m2</th>
	          <th v-for="a in arealist" colspan="3">{{a.name}}</th>
	        </tr>
	        <tr>
	          <th>机型</th>
	          <th>小型</th>
	          <th>中型</th>
	          <th>大型</th>
	          <th>小型</th>
	          <th>中型</th>
	          <th>大型</th>
	          <th>小型</th>
	          <th>中型</th>
	          <th>大型</th> 
	          <th>小型</th>
	          <th>中型</th>
	          <th>大型</th>                    
	          </th>
	        </tr>
	      </thead>
	      <tbody v-for="n in 9">
	        <tr>
	          <th rowspan="2"  id='eng0'>{{etypes[n-1].name}}</th>                     
	          <td>{{rnamelist[1]}}</td>
	          <td class="mechtype" v-for="x in 12">
	            <div  v-if="isedit == 1">
	              <el-input v-model="fobject[n-1].area[parseInt((x-1)/3)].model[(x-1) % 3].enumber"  style="padding:0;"></el-input>
	            </div>
	            <p v-else>{{fobject[n-1].area[parseInt((x-1)/3)].model[(x-1) % 3].enumber}}</p>
	          </td>
	        </tr>
	        <tr>
	          <td>{{rnamelist[2]}}</td>
	          <td class="mechtype" v-for="x in 12">
	             <div  v-if="isedit == 1">
	              <el-input v-model="fobject[n-1].area[parseInt((x-1)/3)].model[(x-1)%3].eduration"  style="padding:0;"></el-input>
	            </div>
	           
	            <p v-else>{{fobject[n-1].area[parseInt((x-1)/3)].model[(x-1)%3].eduration}}</p>
	          </td>
	        </tr>
	        </tbody>
	          <tbody>
	            <tr>
	              <th colspan="2">操作</th>
	              <td colspan="2">
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
     <h2 style="margin-left:15px;">搅拌站数量调查表</h2>
    <table style="width:100%;">
      <thead>
        <th>搅拌站序号</th>
        <th v-if="showpro">城市</th>
        <th>混凝土搅拌机机型</th>
        <th>数量</th>
        <th>时长小计/h</th>
        <th>操作</th>
      </thead>
      <tbody v-for="(item,bindex) in fills2" >
        <tr v-for="(corp,$index) in item.area">
        	<td v-if="$index == 0" :rowspan="item.area.length">
        		<p>{{bindex+1}}</p>
        	</td>
         <td v-if="$index == 0" :rowspan="item.area.length">
            <p >{{item.cityName}}</p>
          </td>
          <td>
            <div v-if="isedit2&& ((indexof === $index )&&(outsideIndex === bindex))">
              <el-input v-model="corp.emodel"  style="padding:0;"></el-input>
            </div>
            <p v-else>{{corp.emodel}}</p>  
          </td>
           <td>
            <div v-if="isedit2&& ((indexof === $index )&&(outsideIndex === bindex))">
              <el-input v-model="corp.enumber"  style="padding:0;"></el-input>
            </div>
            <p v-else>{{corp.enumber}}</p>  
          </td>  
          <td>
            <div v-if="isedit2&& ((indexof === $index )&&(outsideIndex === bindex))">
              <el-input v-model="corp.eduration"  style="padding:0;"></el-input>
            </div>
            <p v-else>{{corp.eduration}}</p>  
          </td> 
          <td>
            <el-button
              v-if="isedit2 && ((indexof === $index )&&(outsideIndex === bindex))"
              @click="saveChange2"
              type="success"
              size="small">
              保存
            </el-button>
            <el-button
              v-if="isedit2 && ((indexof === $index )&&(outsideIndex === bindex))"
              @click="isedit2 = 0"
              type="danger"
              size="small">
              取消
            </el-button>
            <el-button
              v-if="!isedit2||((indexof === $index )&&(outsideIndex === bindex))"
              @click="changeToedit2($index,bindex)"
              type="primary"
              size="small">
              编辑
            </el-button>
          </td>
        </tr>
        
      </tbody>
      <tbody>
        <tr>
          <th>审核结果</th>
          <td >
            <el-tag v-if="engs2.status==3" type="success ">已审核</el-tag>
            <el-tag v-if="engs2.status==2" type="warning ">审核中</el-tag>
            <el-tag v-if="engs2.status==1" type="danger ">未上报</el-tag>
          </td>
          <th>操作</th>
          <td colspan="2">
            <el-button
              @click="pass2"
              type="success"
              size="small">
              全部通过
            </el-button>
            <el-button
              @click="refuse2"
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
      isedit2:0,
      show:false,
      fobject:[],
      fobject2:{},
      fills:[],
      fills2:[],
      showpage: false,
      etypes:[],
      arealist:[],
      engs2:{},
      engs:{},
      indexof:'',
      outsideIndex:'',
      rnamelist:['机型','工地数量','时长小计/h'],
      statuslist:[{status:'未上报',color:'label-danger'},{status:'待审核',color:'label-warning'},{status:'已审核',color:'label-success'}],
      showindex:0,
      showpro:false
    }
  },
  computed: {
  },
 
  methods: {
    changeToedit:function(){
          this.isedit = 1;
        },
        changeToedit2:function(index,oindex){
          this.isedit2 = 1;
          this.indexof = index;     
          this.outsideIndex = oindex;
          this.fobject2 = this.fills2[this.outsideIndex].area[this.indexof];
          this.fobject2.accountid = this.params.gId;
          this.fobject2.city = this.fills2[this.outsideIndex].city
          console.log(this.fobject2)
        },
        saveChange:function(){
          let rdata = { 'area': [] }; 
          for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 4; j++) {
              for(var k = 0; k < 3; k++) {
              rdata.area[(i*4*3)+j*3+k] = {};
              rdata.area[(i*4*3)+j*3+k].area = this.fobject[i].area[j].area;
              rdata.area[(i*4*3)+j*3+k].etype=this.fobject[i].etype;
              rdata.area[(i*4*3)+j*3+k].eduration=this.fobject[i].area[j].model[k].eduration;
              rdata.area[(i*4*3)+j*3+k].enumber=this.fobject[i].area[j].model[k].enumber;
              rdata.area[(i*4*3)+j*3+k].emodel=k
              }
            }; 
          };
          rdata.accountid = this.params.gId;
          rdata.fillyear = this.params.year;
          rdata.city = this.fills[this.showindex].city;
          console.log(rdata)
          var vm = this;
          api.hand.addupbyListName(rdata,'equipment').then(function(res){
            console.log(res)
             if(res.data.status === 0) {
                vm.getfill(vm.params.year);
              } else {
                vm.$message.error(res.data.msg)
              }
            vm.isedit = 0;
          })
        },
        saveChange2:function(){
        var vm = this;
        console.log(vm.fobject2)
        api.hand.addup2byListName(vm.fobject2,'equipment').then(function(res){
          console.log(res)
          if(res.data.status === 0) {
            vm.gettable(vm.params.year);  
          }
          else {
             vm.$message.error(res.data.msg)
           }
          vm.isedit2 = 0;
        })
          
        },
        getfill:function(year){
          var vm = this;
          api.hand.getAllcitybyYearId('equipment',year,this.params.gId).then(function(res){
            console.log(res)
            if(res.data.status === 0&&res.data.data.length){
              vm.fills = res.data.data;
              vm.engs = res.data.data[0]
              console.log(vm.fills)
              vm.filltable(0)                            
            }
          })
        },
        gettable:function(year,callback){
          var vm = this;
          api.hand.gettablebyYearAid('equipment',year,this.params.gId).then(function(res){
            console.log(res)
            if(res.data.status==0&&res.data.data.length){              
              vm.fills2 = res.data.data;
              vm.engs2=res.data.data[0];
              vm.showpage = true;
              console.log(vm.fills2)
            } else{
              vm.fills2 = []
            }
          })
        },
        filltable2(){        	       	
        	this.filltable(this.showindex)
        },
        filltable:function(index){
          var vm = this
          for (var i = 0; i < 9; i++) {
            vm.fobject[i] = {
              etype:vm.etypes[i].id,
              area:[],
            }
            for (var j = 0; j < 4; j++) {
              
              vm.fobject[i].area[j] = {
                area: vm.arealist[j].id,
                model:[{enumber:'',eduration:''},{enumber:'',eduration:''},{enumber:'',eduration:''}]
              }
              	for(var t in vm.fills[index].area){
				    console.log(vm.fills[index].area)
              		if( vm.etypes[i].id == vm.fills[index].area[t].etype && vm.arealist[j].id == vm.fills[index].area[t].area){
	                  vm.fobject[i].area[j].model[vm.fills[index].area[t].emodel].enumber = vm.fills[index].area[t].enumber
	                  vm.fobject[i].area[j].model[this.fills[index].area[t].emodel].eduration = this.fills[index].area[t].eduration
	                }
              	}
                             
            };
          }
		  //console.log(vm.fobject)   
          vm.showpage = true
        },
        allpass:function(){
          var vm = this;
          api.hand.changeStatus('equipment',{
            accountid:vm.params.gId,
            fillyear:vm.params.year,
            type:0
          }).then(function(res){
            console.log(res)
            if(res.data.status === 0) {
              vm.getfill(vm.params.year);
            } else {
              vm.$message.error(res.data.msg)
            }
          },function(bad){})
        },
          pass2:function(){
          var vm = this;
          api.hand.changeStatus('equipment',{
            accountid:vm.params.gId,
            fillyear:vm.params.year,
            type:0
          }).then(function(res){
            if(res.data.status === 0) {
              vm.gettable(vm.params.year);
            } else {
              vm.$message.error(res.data.msg)
            }
          },function(bad){})
        },
        allrefuse:function(){
          var vm = this;
          api.hand.changeStatus('equipment',{
            accountid:vm.params.gId,
            fillyear:vm.params.year,
            type:1
          }).then(function(res){
           if(res.data.status === 0) {
              vm.getfill(vm.params.year);
            } else {
              vm.$message.error(res.data.msg)
            }
          },function(bad){})
        },
        refuse2:function(){
          var vm = this;
          api.hand.changeStatus('equipment',{
            accountid:vm.params.gId,
            fillyear:vm.params.year,
            type:1
          }).then(function(res){  
            if(res.data.status === 0) {
              vm.gettable(vm.params.year);
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
      if(vm.params.add=="住房城乡建设厅"){
      	vm.showpro = true
      } else{
      	vm.showpro = false
      }
      api.staticinformation.getbygid(20).then(function(res){
        vm.etypes = res.data.staticlist;
        console.log(vm.etypes)
        api.staticinformation.getbygid(21).then(function(res){
          vm.arealist = res.data.staticlist;
          vm.getfill(vm.params.year);
          vm.gettable(vm.params.year)
        }); 
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
