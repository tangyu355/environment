<template>
  <div id="commonset"  v-if="showdata">
    <h3>污染物行业分布统计图</h3>
   <el-form ref="form" :model="search" inline>
    	<el-row :gutter="24">
    	<!--<el-col :span="8">
      <el-form-item label="选择年份">
        <el-select v-model="yid">
         <el-option
            v-for="item in state.yearlist"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
     </el-col>-->
     <el-col :span="8">
	    		<el-form-item label="选择类别" >
	          <el-select v-model="typeid" @change="getall">
		         <el-option
		            v-for="item in state.typelist"
		            :label="item.name"
		            :value="item.id">
		          </el-option>
		        </el-select>
	        </el-form-item>       	
	      </el-col>
	    <el-col :span="8">
	    <el-form-item label="选择城市">
		   <el-cascader
			  :options="state.districtlist"
			  :props="props2"
			  v-model="selectedOptions2"
			  change-on-select
			  >
			 </el-cascader>
			</el-form-item>
			</el-col>
      <el-col :span="8">
      	 <el-form-item label="选择行业">
      	<el-cascader
			  :options="state.tradelist"
			  :props="props1"
			  v-model="selectedOptions1"
			  change-on-select
			  >
			 </el-cascader>
			  </el-form-item>
      </el-col>
      <el-col :span="8">
	    		<el-form-item label="勾选行业">
	          <el-select v-model="choosedindustry" multiple>
	      	   	<el-option
		            v-for="item in industrylist"
		            :label="item.name"
		            :value="item.id">
		          </el-option>
		        </el-select>
	        </el-form-item>       	
       	</el-col>
			</el-row>
			</el-form>
			<echart-bar :xname='xname' :bardata='bardata' :legenddata="legenddata"></echart-bar>
			<a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
			<Button type="primary" size="large" @click="exportExcel"  style="margin:5px 0 5px 0"><Icon type="ios-download-outline" style="color: #fff;"></Icon> 导出数据</Button>
			<div class="mytable">
			<table  v-if='cid!=-1'>
				<thead>
					<tr>
						<th rowspan="2">污染物</th>
						<th :colspan="alldata[0].list.length" class="text-center">{{alldata[cid].districtName}}各对应行业</th>
					</tr>
					<tr>
						<td v-for='city in alldata[0].list'>{{city.tradeName}}</td>
					</tr>
				</thead>
				<tbody>
					<tr v-for='pollu in alldata[0].list[0].list.length'>
						<td>{{alldata[cid].list[0].list[pollu-1].name}}</td>
						<td v-for='boiler in alldata[0].list.length'>{{alldata[cid].list[boiler-1].list[pollu-1].count.toFixed(2)}}</td>
					</tr>
				</tbody>
			</table>
			<table  v-if='cid==-1'>
				<thead>
					<tr>
						<th rowspan="2">污染物</th>
						<th :colspan="alldata[0].list.length" class="text-center">四川省各对应行业</th>
					</tr>
					<tr>
						<td v-for='city in alldata[0].list' style="background-color:#eef1f6;">{{city.tradeName}}</td>
					</tr>
				</thead>
				<tbody>
					<tr v-for='pollu in alldata[0].list[0].list.length'>
						<td style="text-align: center;">{{alldata[0].list[0].list[pollu-1].name}}</td>
						<td style="text-align: center;" v-for='boiler in alldata[0].list.length'>{{alldata[0].list[boiler-1].list[pollu-1].count.toFixed(2)}}</td>
					</tr>
				</tbody>
			</table> 
			<Table :columns="columnslist" :data="iviewdata" size="small" hidden ref="tableExcel"></Table>
			</div>
  </div>
</template>

<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'
import table2excel from './table2excel.js'

export default {
  components: {
  },
  data () {
    return {
    	state: state,
      action: actions,
      yid:state.watchyear,
      cid:-1,
      props1:{
        label: 'label',
        value: 'value',
        children: 'children'      	
      },
      selectedOptions1:[1],
      props2:{
        label: 'label',
        value: 'value',
        children: 'children'      	
      },
      selectedOptions2:[1],
      typeid:0,
      pid:'',
      industryid: '',
      pname: '四川省',
      choosedindustry:'',
      industrylist: [],
      showdata:false,
      aname:'',
      cityIndex:'',
      columnslist:[],
      iviewdata:[]
    }
  },
  computed: {
  	   xname:function(){
					var list = [];
						for (var i = 0; i < this.choosedindustry.length; i++) {
							list.push(this.industrylist[this.choosedindustry[i]].name)
						};
					console.log(list)
					return list
				},
			legenddata:function(){
					var list=[];	
					for(var i=0;i<this.alldata[0].list[0].list.length;i++)
						{							
							list.push(this.alldata[0].list[0].list[i].name);									    
								
						}

					return list
				},
       bardata:function(){
					var list=[];
					console.log(this.cid)
					if(this.cid==-1){
						for(var i=0;i<this.alldata[0].list[0].list.length;i++){
							var datalist = [];
							for (var k = 0; k < this.choosedindustry.length; k++)
								{							
									datalist.push(this.alldata[0].list[this.choosedindustry[k]].list[i].count);									    
								
								}
						list.push({
							name:this.alldata[0].list[0].list[i].name,
							type:'bar',
							data:datalist,
							//stack:'pollution',								
							})
						}
					}
					else{
						for(var i=0;i<this.alldata[this.cid].list[0].list.length;i++){
							var datalist = [];
							for (var k = 0; k < this.choosedindustry.length; k++)
								{							
									datalist.push(this.alldata[this.cid].list[this.choosedindustry[k]].list[i].count);									    
								
								}
						list.push({
							name:this.alldata[this.cid].list[0].list[i].name,
							type:'bar',
							data:datalist,
							//stack:'pollution',								
							})
						}
					}					
						return list										
			},						
  },
  watch: {
  	'selectedOptions1'(list) {
	   this.industryid = _.last(list)
	   console.log(this.industryid)
	   this.getall()
     },
     'selectedOptions2'(list) {        
        this.cityIndex = _.last(list)       
        console.log(this.cityIndex)
        if(this.cityIndex==1){
        	this.pid = 0
        } else{
        	this.pid = 1
        }
		this.getall()
     },
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
	    exportData (type) {
			if (type === 1) {
				if(this.cid==-1){
				    this.$refs.reftable.exportCsv({
				        filename: this.yid+'年四川省各对应行业污染物排放'
				    });
			  } else{
			  	  this.$refs.reftable.exportCsv({
				        filename: this.yid+'年'+this.alldata[this.cid].districtName+'各对应行业污染物排放'
				  });
			  }
			}
		},
		exportExcel () {
			 if(this.cid==-1){
				  let filename = this.yid+'年四川省各对应行业污染物排放'
			 } else{
				  let filename = this.yid+'年'+this.alldata[this.cid].districtName+'各对应行业污染物排放'
			  }
            table2excel.transform(this.$refs.tableExcel, 'hrefToExportTable', filename)
        },
		getall: function() {
			var vm = this;
			api.analyze.getgoverncost('surface/'+vm.aname, vm.typeid, vm.pid, vm.yid, vm.industryid).then(function(res) {
				console.log(res)
				vm.alldata = res.data.res;
				console.log(_.findIndex(vm.alldata,{'cityid':vm.cityIndex}))
				vm.cid = _.findIndex(vm.alldata,{'cityid':vm.cityIndex})
				vm.industrylist=[];
						vm.choosedindustry=[];
						vm.columnslist = []
						for (var i = 0; i < res.data.res[0].list.length; i++) {
							
								if(i<5){
									vm.industrylist.push({
										name:res.data.res[0].list[i].tradeName,
										id:i,
										value:true
									})
									vm.choosedindustry.push(i);	
								}
								else{
									vm.industrylist.push({
										name:res.data.res[0].list[i].tradeName,
										id:i,
										value:false
									})								
								}	
								vm.columnslist.push({
								title:res.data.res[0].list[i].tradeName,
								key:'a' + i
							})
						};	
						vm.columnslist.unshift({title:'分类',key:'name'})
						vm.iviewdata = []
						if(vm.cid==-1){
					        for (var i = 0; i < res.data.res[0].list[0].list.length; i++) {
					          	var obj = {}
					          	for (var j = 0; j < res.data.res[0].list.length; j++) {          		
					          		obj['a' + j] = res.data.res[0].list[j].list[i].count
					          		obj['name'] = res.data.res[0].list[j].list[i].name	  	          		
					          	}	 
					          	vm.iviewdata.push(obj)
					       } 
					  } else{
					  	for (var i = 0; i < res.data.res[0].list[0].list.length; i++) {
					          	var obj = {}
					          	for (var j = 0; j < res.data.res[0].list.length; j++) {          		
					          		obj['a' + j] = res.data.res[vm.cid].list[j].list[i].count
					          		obj['name'] = res.data.res[vm.cid].list[j].list[i].name	  	          		
					          	}	 
					          	vm.iviewdata.push(obj)
					       }
					  }
					vm.showdata = true
			})
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.pid = 0
			this.industryid = 1
			this.aname = this.$route.params.analyname
			console.log(this.aname)
			_.forEach(this.state.districtlist, function (ob) {
			      	console.log(ob)
			        	_.forEach(ob.children, function (oob) {
			        		if(oob.children.length){
			        			oob.children = ''
			        		}
			        	})
			   })
			this.getall()
		})
	}
}</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

