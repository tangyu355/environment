<template>
  <div id="commonset">
    <h3 v-if="aname">{{head[aname].title}}</h3>
   <el-form ref="form" inline v-loading="loading" element-loading-text="拼命加载中">
    	<el-row :gutter="24">
    		<!--<el-col :span="6">
    		<el-form-item label="选择年份">
          <el-select v-model="yid" @change="getall">
         <el-option
            v-for="item in state.yearlist"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        </el-form-item>
     </el-col>-->
     <el-col :span="6">
    		<el-form-item label="请选择">
          <el-select v-model="cid" @change="getall">
         <el-option
            v-for="(item,index) in alldata[0].list"
            :label="item.name"
            :value="index">
          </el-option>
        </el-select>
        </el-form-item>
     </el-col>
     <el-col :span="6">
	    <el-form-item label="请选择">
            <el-select v-model="choosedindustry" multiple>
	      	   	<el-option
		            v-for="item in industrylist"
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
		 <echart-bar :xname='xname' :bardata='bardata' :legenddata="legenddata"></echart-bar>
		 <Button type="primary" size="large" @click="exportData(1)" v-if="columnslist[aname]" style="margin:-15px 0 5px 0"><Icon type="ios-download-outline" style="color: #fff;"></Icon> 导出数据</Button>
		<div class="mytable">
			<table >
				<thead>
					<tr>
						<th rowspan="2">分类</th>
						<th :colspan="alldata.length" class="text-center" v-if="aname=='firewoodType'">农作物{{alldata[0].list[cid].name}}污染物分布情况</th>
						<th :colspan="alldata.length" class="text-center" v-if="aname=='MotorstatByMotorType'">城市</th>
						<th :colspan="alldata.length" class="text-center" v-else>污染物</th>
					</tr>
					<tr>
						<th v-for='trade in alldata'>{{trade.pollutantName}}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for='pollu in alldata[0].list[0].list.length'>
						<td style="text-align: center;">{{alldata[0].list[0].list[pollu-1].groupName}}</td>
						<td style="text-align: center;" v-for='trade in alldata.length'>{{alldata[trade-1].list[cid].list[pollu-1].statvalue.toFixed(2)}}</td>
					</tr>
				</tbody>
			</table> 
			<Table :columns="columnslist[aname]" :data="iviewdata" size="small" ref="reftable" hidden v-if="columnslist[aname]&&showdata"></Table>
    	</div>
    </el-form>
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
    	state: state,
			action: actions,
			cid:0,
			typeid:2,
			yid:state.watchyear,
			industrylist:[],
			choosedindustry:[],
			alldata:[{list:[{list:[]}]}],
			aname: '',
			iviewdata:[],
			loading:true,
			columnslist:{
				'firewoodType':[{title:'分类',key:'name'}],
				'MotorstatByMotorType':[{title:'分类',key:'name'}],
				'sourceTypecity':[{title:'分类',key:'name'}],
			},
			tabletitle:{
				'firewoodType': '',
				'MotorstatByMotorType': '',
				'sourceTypecity': ''
			},
			showdata:false,
			 head: {
				'sourceTypecity': {
					title:'某城市分污染源排放量'
				},
				'firewoodType': {
					title:'不同城市农作物污染物排放量'
				},
				'MotorstatByMotorType': {
					title:'机动车污染物按照车型分布统计图'
				},
			}
    }
  },
  computed: {
     legenddata:function(){
					var list=[];	
					for(var i=0;i<this.alldata[0].list[0].list.length;i++)
					    if(this.alldata[0].list[0].list[i].groupName!=='污染源合计')
						{							
							list.push(this.alldata[0].list[0].list[i].groupName);									    
								
						}
					return list
				},
				xname:function(){
					var list=[];	
					for (var i = 0; i < this.choosedindustry.length; i++) {
						list.push(this.industrylist[this.choosedindustry[i]].name)
					};

					return list
				}, 
       bardata:function(){
					var list=[];
					console.log(this.cid)
						for(var i=0;i<this.alldata[0].list[0].list.length;i++){
							var datalist = [];
							if(this.alldata[0].list[0].list[i].groupName!=='污染源合计'||this.alldata[0].list[0].list[i].groupName!=='农作物合计'){
							for (var k = 0; k < this.choosedindustry.length; k++)
								{							
									datalist.push(this.alldata[this.choosedindustry[k]].list[this.cid].list[i].statvalue);									    								
								}
							list.push({
								name:this.alldata[0].list[0].list[i].groupName,
								type:'bar',
								data:datalist,
								stack:'pollution',								
								})
						 }
						}				
						return list										
				},
  },
  watch: {
  	'$route': 'fetchData',
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
  	  fetchData () {
  	  	this.aname = this.$route.params.analyname
    	  this.getall()
  	  },
  	  exportData (type) {
      if (type === 1) {
         this.$refs.reftable.exportCsv({
            filename: this.yid+'年'+this.tabletitle[this.aname]+this.head[this.aname].title+'('+ this.alldata[0].list[this.cid].name +')'
         });
      }
      },
      getall:function(){
					var vm=this;
					api.analyze.getByType('surface/'+vm.aname,vm.yid,vm.typeid).then(function(res){	
						console.log(res)	
						vm.alldata = res.data.list;							
						vm.industrylist=[];
						vm.choosedindustry=[];
						vm.columnslist[vm.aname] = []
						for (var i = 0; i < res.data.list.length; i++) {
							
								if(i<3){
									vm.industrylist.push({
										name:res.data.list[i].pollutantName,
										id:i,
										value:true
									})
								}
								if(vm.columnslist[vm.aname]){	
								  vm.columnslist[vm.aname].push({
										title:res.data.list[i].pollutantName,
										key:'a' + i
								 })
							 }
							 else{
									vm.industrylist.push({
										name:res.data.list[i].pollutantName,
										id:i,
										value:false
									})								
								}
								vm.choosedindustry=[0,1,2];
						};
						vm.columnslist[vm.aname].unshift({title:'分类',key:'name'})
						vm.iviewdata = []					
		        for (var i = 0; i < res.data.list[0].list[0].list.length; i++) {
		          	var obj = {}
		          	for (var j = 0; j < res.data.list.length; j++) {          		
		          		obj['a' + j] = res.data.list[j].list[vm.cid].list[i].statvalue
		          		obj['name'] = res.data.list[j].list[vm.cid].list[i].groupName	  	          		
		          	}	 
		          	vm.iviewdata.push(obj)
		        } 
						vm.showdata = true
						vm.loading = false
					})
				},  	
  },
  beforeCreate(){
  	this.loading = true
  },
  mounted () {
    this.$nextTick(() => {
    	this.aname = this.$route.params.analyname   	
    	this.getall()
    })
  }
}
</script>
