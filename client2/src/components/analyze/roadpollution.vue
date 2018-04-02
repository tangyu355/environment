<template>
  <div id="commonset" v-if="showdata">
<h3>各等级道路扬尘排放</h3>
<el-form ref="form" :model="search" inline>
	<el-row :gutter="24">
		<el-col :span="6">
			<el-form-item label="选择污染物">
				<el-select class="form-control" v-model="pid" @change="getall" id="governtype">
					<el-option v-for="(item,index) in alldata[0].list" :value="index" :label="item.name"></el-option>
				</el-select>
			</el-form-item>
		</el-col>
		<el-col :span="6">
			<el-form-item label="选择城市">
				<el-select class="form-control" v-model="choosedcities" multiple>
					<el-option v-for="item in citylist" :value="item.id" :label="item.name"></el-option>
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
<echart-bar :xname='xname' :bardata='bardata' :legenddata="legenddata"></echart-bar>
<Button type="primary" size="large" @click="exportData(1)" style="margin:-15px 0 5px 0"><Icon type="ios-download-outline" style="color: #fff;"></Icon> 导出数据</Button>
<div class="mytable">
<table >
	<thead>
		<tr>
			<th>分类</th>
			<th v-for='boiler in alldata' class="text-center">{{boiler.districtName}}</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for='pollu in alldata[0].list[pid].list.length'>
			<td>{{alldata[0].list[pid].list[pollu-1].name}}</td>
			<td v-for='boiler in alldata.length'>{{alldata[boiler-1].list[pid].list[pollu-1].statvalue.toFixed(1)}}</td>
		</tr>
		<tr>
			<td>合计</td>
			<td v-for='boiler in alldata.length'>{{alldata[boiler-1].list[pid].list[0].statvalue2.toFixed(1)}}</td>
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
         state: state,
				 action: actions,
				 cid:0,
				 yid:state.watchyear,
				 industrylist:[],
				 choosedindustry:[],
				 alldata:[{list:[{list:[]}]}],
				 aname: '',
         showdata: false,
	       pindex: 0,
	       plist: [],
	       pid:0,
		     pollulist:[],
	      citylist: [],
	      choosedcities: [],
	      iviewdata:[],
	      columnslist:[],
	      typeid:2
    }
},
computed: {
		xname: function() {
			var list = [];
			for(var i=0;i<this.choosedcities.length;i++){
						list.push(this.citylist[this.choosedcities[i]].name)
			}
			return list
		},
		legenddata: function() {
			var list = [];
			for (var i = 0; i < this.alldata[0].list[0].list.length; i++) {
				list.push(this.alldata[0].list[0].list[i].name, this.alldata[0].list[0].list[0].fuelgroupname)
			}
			return list
		},
		bardata: function() {
				var list = [];
				for (var i = 0; i < this.alldata[0].list[0].list.length; i++) {
					var datalist = [];
					var linelist = [];
					for (var j = 0; j < this.choosedcities.length; j++) {
						datalist.push(this.alldata[this.choosedcities[j]].list[this.pid].list[i].statvalue);
						linelist.push(this.alldata[this.choosedcities[j]].list[this.pid].list[i].statvalue2);
					}
					console.log(datalist)
					list.push({
								name: this.alldata[0].list[0].list[i].name,
								type:'bar',
 			data: datalist
 		})
 	}
 	list.push({
 		name: this.alldata[0].list[0].list[0].fuelgroupname,
 		type: 'line',
 		data: linelist
 	})
 	return list
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
 		exportData (type) {
			  if (type === 1) {
			    this.$refs.reftable.exportCsv({
			      filename: this.yid+'年道路扬尘排放'+this.alldata[0].list[this.pid].name
			    });
			  }
		},
 		getall: function() {
 				var vm = this;
 				api.analyze.getByType('surface/roaddustPollutant',vm.yid,vm.typeid).then(function(res){	
						console.log(res)
						if(res.data.list.length!=0&&res.data.status==0){
						vm.alldata = res.data.list;
						vm.columnslist=[];	
						vm.citylist=[];	
						for (var i = 0; i < res.data.list.length; i++) {
						
								if(i==3||i==8||i==12)
								{
								vm.citylist.push({
									name:res.data.list[i].districtName,
									id:i,
									value:true
								})								
								}
								else{
									vm.citylist.push({
									name:res.data.list[i].districtName,
									id:i,
									value:false
								})
								}
								vm.columnslist.push({
									title:res.data.list[i].districtName,
									key:'a' + i
							  })
								vm.choosedcities=[3,8,12];	
								vm.showdata = true
						};
						vm.columnslist.unshift({title:'分类',key:'name'})
						vm.iviewdata = []					
					    for (var i = 0; i < res.data.list[0].list[0].list.length; i++) {
					       var obj = {}
					          for (var j = 0; j < res.data.list.length; j++) {          		
					          		obj['a' + j] = res.data.list[j].list[vm.pid].list[i].statvalue
					          		obj['name'] = res.data.list[j].list[vm.pid].list[i].name	  	          		
					          }	 
					       vm.iviewdata.push(obj)
					    }
						} else {
							vm.showdata = false
							vm.$message.error('没有数据！')
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