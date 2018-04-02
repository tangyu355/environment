<template>
  <div id="commonset">
    <h3>某城市不同大小建筑工地施工机械统计图</h3>
    <el-form ref="form"  inline>
    	<el-row :gutter="24">
     <el-col :span="6">
      <el-form-item label="选择城市">
        <el-select v-model="cid">
         <el-option
            v-for="(item,index) in alldata"
            :label="item.name"
            :value="index">
          </el-option>
        </el-select>
      </el-form-item>
     </el-col>
     <el-col :span="6">
      <el-form-item label="选择分类">
        <el-select v-model="pid" @change='getall'>
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
    </el-form>
		<echart-bar :xname='xname' :bardata='bardata' :legenddata="legenddata"></echart-bar>
		<div class="mytable" v-if="pid==0">
			<table >
				<thead>
					<tr>
						<th rowspan="2">不同建筑面积范围使用数量（个）</th>
						<th :colspan="alldata.length" class="text-center">{{alldata[cid].name}}施工机械分类</th>
					</tr>
					<tr>
						<th v-for='boiler in alldata[0].list'>{{boiler.name}}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for='pollu in alldata[0].list[0].list.length'>
						<td>{{alldata[cid].list[0].list[pollu-1].name}}
						</td>
						<td v-for='boiler in alldata[0].list.length'>{{alldata[cid].list[boiler-1].list[pollu-1].num}}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="mytable" v-if="pid==1">
			<table >
				<thead>
					<tr>
						<th rowspan="2">不同建筑面积范围使用时长（h）</th>
						<th :colspan="alldata.length" class="text-center">{{pname}}施工机械分类</th>
					</tr>
					<tr>
						<th v-for='boiler0 in alldata[0].list'>{{boiler0.name}}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for='pollu in alldata[0].list[0].list.length'>
						<td>{{alldata[cid].list[0].list[pollu-1].name}}
						</td>
						<td v-for='boiler in alldata[0].list.length'>{{alldata[cid].list[boiler-1].list[pollu-1].hours}}</td>
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
			pname:'',
			typelist:[{id:0,name:'施工机械使用数量（个）'},{id:1,name:'施工机械使用时长（h）'}]
		}
	},
	computed: {
		bardata: function() {
			var list = [];
			var datalist = [];

			for (var j = 0; j < this.alldata[0].list[0].list.length; j++) {
				var datalist = [];
				if (this.pid == 0) {
					for (var i = 0; i < this.alldata[0].list.length; i++) {
						datalist.push(this.alldata[this.cid].list[i].list[j].num)
					}
				} else {

					for (var i = 0; i < this.alldata[0].list.length; i++) {
						datalist.push(this.alldata[this.cid].list[i].list[j].hours)
					}
					console.log(this.alldata[this.cid].list[0].list[0].hours)
				}
				list.push({
					name: this.alldata[0].list[0].list[j].name,
					type: 'bar',
					data: datalist,
				})
			}
			console.log(list)
			return list
		},
		legenddata: function() {
			var list = [];
			for (var i = 0; i < this.alldata[0].list[0].list.length; i++) {
				list.push(this.alldata[0].list[0].list[i].name)
			};
			return list
		},
		xname: function() {
			var list = [];
			for (var i = 0; i < this.alldata[0].list.length; i++) {
				list.push(this.alldata[0].list[i].name)
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
				api.analyze.getdirect('equipment', vm.yid,vm.typeid).then(function(res) {
				console.log(res)
				if (vm.pid == 0) {
					vm.alldata = res.data.list;
					vm.pname = vm.alldata[0].name
				}
				if (vm.pid == 1) {
					vm.alldata = res.data.list2;
					vm.pname = vm.alldata[0].name
				}
				console.log(vm.yid, vm.pid, vm.cid)
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

