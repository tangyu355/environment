<template>
  <div id="commonset">
    <h3>全省农业机械统计图</h3>
    <el-form ref="form"  inline>
    	<el-row :gutter="24">
          <el-col :span="6">
         <el-form-item label="选择类型">
         	<el-select v-model="pid" @change="selectyear">
	         <el-option
	            v-for="item in typelist" 
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
		<div v-if = "!showchart" class="text-center">
		<h3>没有数据</h3>
	</div>
		<echart-bar :xname='xname' :bardata='bardata' v-if="showchart"></echart-bar>
		<div class="mytable" v-if="showchart">
			<table >
				<thead>
					<tr>
						<th rowspan="2"></th>
						<th :colspan="alldata.length" class="text-center">当年农业机械类型</th>
					</tr>
					<tr>
						<th v-for='boiler in alldata'>{{boiler.name}}</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>数量</td>
						<td v-for='boiler in alldata.length'>{{alldata[boiler-1].value}}</td>
					</tr>
				</tbody>
			</table>
    	</div>
    </el-form>
    </div>
</template>
<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'

export default {
	components: {},
	data() {
		return {
			state: state,
			action: actions,
			yid: state.watchyear,
			alldata:[{list:[{'list':''}]}],
			citylist:[],
			pollutionlist:[],
			choosedcities:[],
			choosedpollution:[],	
			show:true,
			cid:0,
			pid:0,
			typeid:2,
			showchart:false,
			pname:'',
			typelist:[{id:0,name:'农业机械保有量/台'},{id:1,name:'农业机械保有量/kw'},{id:2,name:'农业机械油消耗量/吨'}]
		}
},
computed: {
		bardata: function() {
			var list = [];
			var datalist = [];
						for (var i = 0; i < this.alldata.length; i++) {
							datalist.push(this.alldata[i].value)
						
						};
						list.push({
							//name:this.alldata[i].name,
							type:'bar',
							//stack:this.alldata[0].list[j].pname,
							data:datalist,
						})	
			console.log(list)
			return list
		},
		xname: function() {
			var list = [];
			for (var i = 0; i < this.alldata.length; i++) {
						list.push(this.alldata[i].name)
					};
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
		getall: function() {
				var vm = this;
				console.log(vm.pid)
				api.analyze.getdirect(vm.pname, vm.yid,vm.typeid).then(function(res) {
				console.log(res)
				if(res.data.res.length){
				   vm.alldata = res.data.res;
				   vm.showchart = true
				} else{
			      vm.alldata = []
			      vm.showchart = false
				}				
				console.log(vm.yid, vm.pid, vm.cid)
			})
		},
		selectyear:function(){
			this.selecttype()
		},
		selecttype:function(){
					if(this.pid==0){
						this.pname='farming';
						this.getall();
					}
					if(this.pid==1){
						this.pname='farming2';
						this.getall();
					}
					
					if(this.pid==2){
						this.pname='farming3';
						this.getall();
					}
				},
	},
	mounted() {
		this.$nextTick(() => {
			this.pname='farming'
			this.getall()
		})
	}
}
</script>



