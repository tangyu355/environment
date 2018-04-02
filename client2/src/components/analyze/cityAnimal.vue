<template>
  <div id="commonset" v-if="showdata">
    <h3>分地区畜禽种类NH3排放</h3>
    <el-form ref="form"  inline>
    	<el-row :gutter="24">
          <el-col :span="6">
         <el-form-item label="选择城市" v-if = "showchart">
         	<el-select v-model="cid" @change="changecity">
	         <el-option
	            v-for="item in citylist" 
	            :label="item.name"
	            :value="item.id">
	          </el-option>
	        </el-select>
         </el-form-item>
         </el-col>
          <el-col :span="6">
         <el-form-item label="选择畜禽种类" v-if = "showchart">
         	<el-select v-model="tid" @change="changetype">
	         <el-option
	            v-for="item in animallist" 
	            :label="item.name"
	            :value="item.id">
	          </el-option>
	        </el-select>
         </el-form-item>
         </el-col>
         <el-col :span="6">
				<el-form-item label="选择统计类型">
					<el-select v-model="typeid" @change="getall">
						<el-option v-for="item in state.typeidList" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
       </el-row>
     </el-form>
     <div v-if = "!showchart" class="text-center">
			<h3>没有数据</h3>
		</div>
		<echart-pie :legenddata="legenddata" :piedata="serieslist" v-if = "showchart"></echart-pie>
		<Button type="primary" size="large" @click="exportData(1)" v-if="showchart" style="margin:5px 0 5px 0"><Icon type="ios-download-outline" style="color: #fff;"></Icon> 导出数据</Button>
		<div class="mytable">
		<table v-if = "showchart">
			<thead>
				<tr>
					<th rowspan="2">类别</th>
					<th :colspan="alldata.length" class="text-center">{{animallist[tid].name}}</th>
				</tr>
				<tr>
					<th v-for='boiler in alldata'>{{boiler.name}}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for='pollu in alldata[0].typelist[0].nferlist.length'>
					<td>{{alldata[0].typelist[tid].nferlist[pollu-1].nfertigaName}}
					</td>
					<td v-for='boiler in alldata.length'>{{alldata[boiler-1].typelist[tid].nferlist[pollu-1].statvalue.toFixed(2)}}</td>
				</tr>
			</tbody>
		</table>
		<Table :columns="columnslist" :data="iviewdata" size="small" ref="reftable" hidden></Table>
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
  data () {
    return {
    	   state:state,	
           action: actions,
           yid:state.watchyear,
           iviewdata:[],
           alldata:[{typelist:[{nferlist:[]}]}],
			citylist:[],	
			showdata:false,
			boilerlist:[],
		    cid:0,
			pname:'',
			animallist:[],
			pievalue:[],
			tid:0,
			showchart:true,
			columnslist:[],
			typeid:2
  }
},
computed: {
		serieslist: function() {
			var list = [];
			list.push({
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: this.pievalue,
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			})
			console.log(list)
			return list
		},
		legenddata: function() {
			var list = [];
			for (var i = 0; i < this.pievalue.length; i++) {
				list.push(this.pievalue[i].name)
			};
			return list
			console.log(list)
		},
	},
	watch: {
		'state.watchyear':{
		    	handler: function (val, oldVal) {
		    		console.log(val)
		    		this.yid = val
		  			this.getall()
		  		},
		      deep: true
		    }
	},
	methods: {
               changecity:function(){
					this.changetype()
				},
				changetype:function(){
					this.getall()
				},
				exportData (type) {
			      if (type === 1) {
			         this.$refs.reftable.exportCsv({
			            filename: this.yid+'年'+this.animallist[this.tid].name+'NH3排放'
			         });
			      }
			    },
				getall:function(){
					var vm=this;
						api.analyze.getByType('surface/cityAnimal',vm.yid,vm.typeid).then(function(res){	
						console.log(res)
						vm.alldata = res.data.list;	
						vm.citylist = []
						vm.columnslist = []
                        for (var i = 0; i < res.data.list.length; i ++) {
							vm.citylist.push({
								name: res.data.list[i].name,
								id: i,
							})
							vm.columnslist.push({
								title:res.data.list[i].name,
								key:'a' + i
							})
						};
						vm.columnslist.unshift({title:'分类',key:'name'})
						vm.animallist = []
						if(res.data.list[0].typelist.length==1){
							 vm.showdata = true
							 vm.showchart = false
							  vm.animallist = []
						} else{
							for (var i = 0; i < res.data.list[0].typelist.length; i ++) {
							if(res.data.list[0].typelist[i].typeName!=='合计'){
								vm.animallist.push({
									name: res.data.list[0].typelist[i].typeName,
									id: i,
								})
							 } 
						  };
						  vm.boilerlist=[];
							vm.pievalue=[];
							for(var i=0;i<vm.alldata[0].typelist[0].nferlist.length;i++){
								console.log(vm.tid)
								if(vm.alldata[vm.cid].typelist[vm.tid].nferlist[i].statvalue!=0&&vm.alldata[vm.cid].typelist[vm.tid].nferlist[i].nfertigaName!='合计'){
									vm.boilerlist.push(vm.alldata[vm.cid].typelist[vm.tid].nferlist[i].nfertigaName);
									vm.pievalue.push({
										value:vm.alldata[vm.cid].typelist[vm.tid].nferlist[i].statvalue,
										name:vm.alldata[vm.cid].typelist[vm.tid].nferlist[i].nfertigaName
									})	
								}
							}
						   vm.boilerlist.push('其他');
							 vm.pievalue.push({
								value:0,
								name:'其他'
								});
								vm.showdata = true
								vm.showchart = true
							console.log(vm.boilerlist)
						}
						vm.iviewdata = []					
					        for (var i = 0; i < res.data.list[0].typelist[0].nferlist.length; i++) {
					          	var obj = {}
					          	for (var j = 0; j < res.data.list.length; j++) {          		
					          		obj['a' + j] = res.data.list[j].typelist[vm.tid].nferlist[i].statvalue
					          		obj['name'] = res.data.list[j].typelist[vm.tid].nferlist[i].nfertigaName	  	          		
					          	}	 
					          	vm.iviewdata.push(obj)
					        } 
						})
				},		
	},
	mounted() {
		this.$nextTick(() => {
			this.getall()
    })
  }
}
</script>	