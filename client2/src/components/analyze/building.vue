<template>
  <div id="commonset" v-if="showdata">
    <h3>某城市已开工、未开工工地建筑面积</h3>
   <el-form ref="form" inline >
    	<el-row :gutter="24">
	        <el-col :span="6">
	    		<el-form-item label="选择城市">
	          <el-select v-model="cid" @change="getall">
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
          <el-select v-model="tid" @change='getall'>
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
    <div v-if = "!showchart" class="text-center">
		<h3>没有数据</h3>
	</div>
    <echart-bar :xname='xname' :bardata='bardata' :legenddata="legenddata" v-if="showchart"></echart-bar>
	<div class="mytable" v-if="showchart">
		<table >
			<thead>
				<tr>
					<th rowspan="2">分类</th>
					<th :colspan="alldata.length" class="text-center">城市</th>
				</tr>
				<tr>
					<th v-for='boiler in alldata'>{{boiler.name}}</th>
				</tr>
			</thead>
			<tbody v-if="tid==0">
				<tr v-for='pollu in alldata[0].list.length' v-if="alldata[0].list[pollu-1].area" rowspan="2">
					<td>{{alldata[0].list[pollu-1].area}}建筑面积（km2）</td>
					<td v-for='item in alldata.length'>{{alldata[item-1].list[pollu-1].value}}</td>
				</tr>
				<tr v-for='pollu0 in alldata[0].list.length' v-if="alldata[0].list[pollu0-1].num">
					<td>{{alldata[0].list[pollu0-1].num}}工地数量（个）</td>
					<td v-for='item0 in alldata.length'>{{alldata[item0-1].list[pollu0-1].value2}}</td>
				</tr>
			</tbody>
			<tbody v-if="tid==1">
				<tr v-for='pollu in alldata[0].list2.length' v-if="alldata[0].list[pollu-1].area" rowspan="2">
					<td>{{alldata[0].list2[pollu-1].area}}建筑面积（km2）</td>
					<td v-for='item in alldata.length'>{{alldata[item-1].list2[pollu-1].value}}</td>
				</tr>
				<tr v-for='pollu0 in alldata[0].list2.length' v-if="alldata[0].list2[pollu0-1].num">
					<td>{{alldata[0].list2[pollu0-1].num}}工地数量（个）</td>
					<td v-for='item0 in alldata.length'>{{alldata[item0-1].list2[pollu0-1].value2}}</td>
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
			typelist:[{id:0,name:'已开工工地建筑面积'},{id:1,name:'未开工工地建筑面积'}],
			showdata:false,
			alldata:[{list:[]}],
			cid:0,
			tid:0,
			typeid:2,
			showchart:false
    }
},
computed: {
	    legenddata: function() {
			var list = ['建筑面积','工地数量']
			return list
		},
		bardata: function() {
			var list = [];
			var datalist = [];
			var linelist = [];

			if (this.tid == 1) {
				for (var i = 0; i < this.alldata[0].list2.length; i++) {
					if (i < 4) {
						datalist.push(this.alldata[this.cid].list2[i].value);
					} else {
						linelist.push(this.alldata[this.cid].list2[i].value2);
					}
				}
			} else {
				for (var i = 0; i < this.alldata[0].list.length; i++) {
					if (i < 4) {
						datalist.push(this.alldata[this.cid].list[i].value);
					} else {
						linelist.push(this.alldata[this.cid].list[i].value2);
					}
				}
			}
			console.log(datalist)
			list.push({
			  name: '建筑面积',
				type: 'bar',
				data: datalist
			})
			list.push({
				name: '工地数量',
				type: 'line',
				data: linelist
			})
			return list
		},
		xname: function() {
			var list = [];
			for (var i = 0; i < this.alldata[0].list.length-4; i++) {
				list.push(this.alldata[0].list[i].area)
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
				api.analyze.getByType('surface/constructioncity/stat',vm.yid,vm.typeid).then(function(res){	
						console.log(res)
						if(res.data.list.length!=0){
						  vm.alldata = res.data.list;
						  vm.showchart = true
						} else{
							vm.showchart = false
							vm.alldata = []
						}
						vm.showdata = true
				})
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.getall()
		})
	}
}
</script>
