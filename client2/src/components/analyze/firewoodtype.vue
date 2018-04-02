<template>
  <div id="commonset" v-if="showdata">
    <h3>不同农作物类型总产量、平均综合利用效率统计图</h3>
   <el-row :gutter="24">
    	<el-form ref="" inline>
   <el-col :span="6">
   	<el-form-item label="选择城市" label-width="80px">
	    <el-cascader
			  :options="state.districtlist"
			  :props="props2"
			  v-model="selectedOptions2"
			  change-on-select
			  >
			 </el-cascader>
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
			<pie-bar :legendlist="legendlist" :serieslist="serieslist" :xname="xname"></pie-bar>
			<div class="mytable">
			<table  v-if="cid==-1">
				<thead>
					<tr>
						<th rowspan="2">分类</th>
						<th :colspan="alldata[0].list.length" class="text-center">四川省农作物类型</th>
					</tr>
					<tr>
						<th v-for='boiler in alldata[0].list'>{{boiler.districtName}}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for='pollu in alldata[0].list[0].list.length'>
						<td>{{alldata[0].list[0].list[pollu-1].name}}</td>
						<td v-for='item in alldata[0].list.length'>{{alldata[0].list[item-1].list[pollu-1].value.toFixed(2)}}</td>
					</tr>
				</tbody>
			</table>
			<table  v-if="cid!=-1">
				<thead>
					<tr>
						<th rowspan="2">分类</th>
						<th :colspan="alldata[0].list.length" class="text-center">{{alldata[cid].districtName}}农作物类型</th>
					</tr>
					<tr>
						<td v-for='boiler in alldata[0].list'>{{boiler.districtName}}</td>
					</tr>
				</thead>
				<tbody v-if="cid!=-1">
					<tr v-for='pollu in alldata[cid].list[0].list.length'>
						<td>{{alldata[cid].list[0].list[pollu-1].name}}</td>
						<td v-for='item in alldata[0].list.length'>{{alldata[cid].list[item-1].list[pollu-1].value.toFixed(2)}}</td>
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
	components: {},
	data() {
		return {
			alldata: [{
				list: [{
					list: []
				}]
			}],
			typeid:2,
			citylist: [],
			pollutionlist: [],
			choosedcities: [],
			choosedpollution: [],
			show: true,
			datalist1: [],
			datalist2: [],
			name: [],
			pid: '',
			cid: -1,
			state: state,
	    action: actions,
	    yid: state.watchyear,
	    showdata:false,
	    cityIndex:'',
	    props2:{
        label: 'label',
        value: 'value',
        children: 'children'      	
      },
      selectedOptions2:[1],
	    
    }
},
computed: {
		legendlist() {
			var list = [];
			for (var i = 0; i < this.alldata[0].list[0].list.length; i++) {
				list.push(this.alldata[0].list[0].list[i].name)
			};

			return list
		},
		xname: function() {
			var list = [];
			if (this.cid == -1) {
				for (var i = 0; i < this.alldata[0].list.length; i++) {
					list.push(this.alldata[0].list[i].districtName)
				};
			}
			return list
		},
		serieslist() {
			var list = [];
			if (this.cid == -1) {
				for (var i = 0; i < this.alldata[0].list[0].list.length; i++) {
					var datalist = [];
					var linelist = [];
					for (var j = 0; j < this.alldata[0].list.length; j++) {
						datalist.push(this.alldata[0].list[j].list[0].value);
						linelist.push(this.alldata[0].list[j].list[1].value);
					}
					console.log(datalist, linelist)
				}
                
				list.push({
					name: this.alldata[0].list[0].list[0].name,
					type:'bar',
					data: datalist
				})
				list.push({
					name: this.alldata[0].list[0].list[1].name,
					type: 'line',
					yAxisIndex: 1,
					data: linelist
				})
			} else {
				for (var i = 0; i < this.alldata[this.cid].list[0].list.length; i++) {
					var datalist = [];
					var linelist = [];
					for (var j = 0; j < this.alldata[this.cid].list.length; j++) {
						datalist.push(this.alldata[this.cid].list[j].list[0].value);
						linelist.push(this.alldata[this.cid].list[j].list[1].value);
					}
					console.log(datalist, linelist)
				}

				list.push({
					name: this.alldata[this.cid].list[0].list[0].name,
					type: 'bar',
					data: datalist
				})
				list.push({
					name: this.alldata[this.cid].list[0].list[1].name,
					type: 'line',
					yAxisIndex: 1,
					data: linelist
				})
			}
			return list
		},
	},
	watch: {
			'selectedOptions2'(list) {
        console.log(list)
        this.cityIndex = _.last(list)
        console.log(this.cityIndex)
        this.pid = 1
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
		getall: function() {
				var vm = this;
				api.analyze.getresultByType('surface/firewoodType', vm.yid, vm.pid,vm.typeid).then(function(res) {
				console.log(res)
				if (res.data.res.length != 0) {
					vm.alldata = res.data.res;
					console.log(_.findIndex(vm.alldata,{'id':vm.cityIndex}))
				  vm.cid = _.findIndex(vm.alldata,{'id':vm.cityIndex})
					console.log(vm.alldata)
					vm.showdata = true
				}
			})
		},
		selectyear: function() {
			this.getall();
		},
	},
	mounted() {
		this.$nextTick(() => {
			var vm = this
			vm.pid = 0
			_.forEach(vm.state.districtlist, function (ob) {
			      	console.log(ob)
			        	_.forEach(ob.children, function (oob) {
			        		if(oob.children.length){
			        			oob.children = ''
			        		}
			        	})
			   })
			vm.getall()
		})
	}
}</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
