<template>
  <div id="commonset" v-if="show">
    <h3>全省、某城市道路组成情况</h3>
    <el-row :gutter="24">
    	<el-form ref="" inline>
		     <el-col :span="6">
		        <el-form-item label="选择城市">
				   <el-select class="form-control" v-model="cid" @change='changecity'> 
		                <el-option selected :value='-1' :label="pname"></el-option>
		                <el-option v-for="(c,index) in alldata" :value="index" :label="c.districtName"></el-option>
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
       </el-form>
    </el-row>
    <echart-bar :xname='xname' :bardata='bardata' :legenddata="legenddata"></echart-bar>
    <div class="mytable">
	<table  v-if="cid!=-1">
		<thead>
			<tr>
				<th rowspan="2">道路类型(m)</th>
				<th :colspan="alldata[0].list.length-1" class="text-center">{{alldata[cid].districtName}}不同等级道路</th>
			</tr>
			<tr>
				<td style="background-color:#eef1f6;">快速路</td>
				<td style="background-color:#eef1f6;">主干道</td>
				<td style="background-color:#eef1f6;">次干道</td>
				<td style="background-color:#eef1f6;">支路</td>
			</tr>
		</thead>
		<tbody v-if="alldata[0].list[0].value">
			<tr v-for='pollu in alldata[0].list[0].value.length'>
				<td>{{alldata[0].list[0].value[pollu-1].name}}</td>
				<td v-for='boiler in alldata[0].list.length-1'>{{alldata[cid].list[boiler-1].value[pollu-1].value}}</td>
			</tr>
			<tr>
				<td>未铺装道路总计</td>
				<td :colspan="alldata[0].list.length-1">{{alldata[cid].list[4].value}}</td>
			</tr>
		</tbody>
	</table>
	<table  v-if="cid==-1">
		<thead>
			<tr>
				<th rowspan="2">类别</th>
				<th :colspan="alldata.length" class="text-center">城市</th>
			</tr>
			<tr>
				<td v-for='boiler in alldata' style="background-color:#eef1f6;">{{boiler.districtName}}</td>
			</tr>
		</thead>
		<tbody>
			<tr v-for='pollu in alldata[0].list.length'>
				<td>{{alldata[0].list[pollu-1].name}}(m)
				</td>
				<td v-for='boiler in alldata.length'>{{alldata[boiler-1].list[pollu-1].value}}</td>
			</tr>
		</tbody>
	</table>
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
        alldata:[{list:[{value:[],'value':''}]}],
		citylist:[],
		pollutionlist:[],
		choosedcities:[],
		choosedpollution:[],
		show:false,
		boilerlist:[],
		cid:0,
		pname:'四川省',
		typeid:2
	}
},
computed: {
		bardata: function() {
			var list = [];
			if (this.cid == -1) {
				for (var i = 0; i < this.alldata[0].list.length; i++) {
					var datalist = [];
					for (var j = 0; j < this.alldata.length; j++) {
						datalist.push(this.alldata[j].list[i].value)
					}
					list.push({
						name: this.alldata[0].list[i].name,
						type: 'bar',
						stack: 'pollution',
						data: datalist,
					})
				}
			} else {
				for (var i = 0; i < this.alldata[0].list[0].value.length; i++) {
					var datalist = [];
					for (var j = 0; j < this.alldata[0].list.length - 1; j++) {
						datalist.push(this.alldata[this.cid].list[j].value[i].value)
					};
					datalist.push()
					list.push({
						name: this.alldata[this.cid].list[0].value[i].name,
						type: 'bar',
						stack: 'pollution',
						data: datalist,
					})
				};
			}
			return list
		},
		legenddata: function() {
			var list = [];
			if (this.cid == -1) {
				for (var i = 0; i < this.alldata[0].list.length; i++) {
					list.push(this.alldata[0].list[i].name)
				};
				return list
			} else {
				for (var i = 0; i < this.alldata[0].list[0].value.length; i++) {
					list.push(this.alldata[0].list[0].value[i].name)
				};
			}
			return list
		},
		xname: function() {
			var list = [];
			if (this.cid == -1) {
				for (var i = 0; i < this.alldata.length; i++) {
					list.push(this.alldata[i].districtName)
				};
			} else {
				for (var i = 0; i < this.alldata[0].list.length - 1; i++) {
					list.push(this.alldata[0].list[i].name)
				};
			}
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
		changecity: function() {
			this.getall()
		},
		getall: function() {
				var vm = this;
				if (vm.cid == -1) {
					api.analyze.getByType('surface/roadbycity', vm.yid,vm.typeid).then(function(res) {
					console.log(res)
					if(res.data.status==0&&res.data.res.length){
					    vm.alldata = res.data.res;
					}else{
						vm.$message.error('没有数据！')
					}
					console.log(vm.alldata)
				})
			} else {
				api.analyze.getByType('surface/roadcity', vm.yid,vm.typeid).then(function(res) {
					console.log(res)
					if(res.data.status==0&&res.data.res.length){
					  vm.alldata = res.data.res;
					}else{
					  vm.$message.error('没有数据！')
					}
					console.log(vm.alldata)
				})
			}
			vm.show = true
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.getall()
		})
	}
}
</script>	


