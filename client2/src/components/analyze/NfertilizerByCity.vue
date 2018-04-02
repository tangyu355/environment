<template>
  <div id="commonset" v-if="showdata">
    <h3>不同城市畜禽类型数量统计图</h3>
   <el-form ref="form" inline >
    	<el-row :gutter="24">
        <el-col :span="6">
	    <el-form-item label="选择城市">
            <el-select v-model="choosedcities" multiple>
	      	   	<el-option
		            v-for="item in citylist"
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
	<div class="mytable">
		<table >
			<thead>
				<tr>
					<th rowspan="2">施用量类型</th>
					<th v-for='boiler in alldata' class="text-center">{{boiler.districtName}}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for='pollu in alldata[0].list.length'>
					<td>总{{alldata[0].list[pollu-1].name}}施用量</td>
					<td v-for='boiler in alldata.length'>{{alldata[boiler-1].list[pollu-1].sumValue.toFixed(1)}}</td>
				</tr>
				<tr v-for='pollu in alldata[0].list.length'>
					<td>每亩耕地{{alldata[0].list[pollu-1].name}}施用量</td>
					<td v-for='boiler in alldata.length'>{{alldata[boiler-1].list[pollu-1].avgValue.toFixed(1)}}</td>
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
	         citylist: [],
	         choosedcities: [],
	         typeid:2
   }
  },
computed: {
		xname: function() {
			var list = [];
			for (var i = 0; i < this.alldata[0].list.length; i++) {
				list.push(this.alldata[0].list[i].name)
			};
			return list
		},
		legenddata: function() {
			var list = [];
			for (var j = 0; j < this.choosedcities.length; j++) {
				list.push(this.citylist[this.choosedcities[j]].name + '' + this.alldata[0].list[0].sumName, this.citylist[this.choosedcities[j]].name + '' + this.alldata[0].list[0].avgName)
			}
			return list
		},
		bardata: function() {
			var list = [];

			for (var j = 0; j < this.choosedcities.length; j++) {
				var datalist = [];
				var linelist = [];
				for (var i = 0; i < this.alldata[0].list.length; i++) {
					datalist.push(this.alldata[this.choosedcities[j]].list[i].sumValue);
					linelist.push(this.alldata[this.choosedcities[j]].list[i].avgValue);
				}
				console.log(datalist)
				list.push({
					name: this.citylist[this.choosedcities[j]].name + '' + this.alldata[0].list[0].sumName,
					type: 'bar',
					data: datalist
				})
				list.push({
					name: this.citylist[this.choosedcities[j]].name + '' + this.alldata[0].list[0].avgName,
					type: 'line',
					//yAxisIndex: 1,
					data: linelist
				})
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
		getall: function() {
			var vm = this;
				api.analyze.getByType('surface/NfertilizerByCity', vm.yid,vm.typeid).then(function(res) {
				console.log(res)
				if (res.data.list.length != 0) {
					vm.alldata = res.data.list;
					vm.citylist = [];
					for (var i = 0; i < res.data.list.length; i++) {

						if (i == 3 || i == 9 || i == 12) {
							vm.citylist.push({
								name: res.data.list[i].districtName,
								id: i,
								value: true
							})

						} else {
							vm.citylist.push({
								name: res.data.list[i].districtName,
								id: i,
								value: false
							})
						}
						vm.choosedcities = [3, 9, 12];
					};
					vm.showdata = true
					console.log(vm.alldata)
				}
			})
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.getall()
		})
	}
}</script>
