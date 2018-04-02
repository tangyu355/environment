<template>
  <div id="commonset"  v-if="showdata">
    <h3>不同行业锅炉个数统计图</h3>
   <el-form ref="form" :model="search" inline>
    	<el-row :gutter="24">
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
  <div class="mytable">
	<table >
		<thead>
			<tr>
				<th rowspan="2" width='10%'>锅炉分类</th>
				<th :colspan="alldata.length" v-if='alldata.length!=0' class="text-center">当年各行业对应的锅炉个数(个)</th>
			</tr>
			<tr>
				<td v-for='trade in alldata' style="background-color:#eef1f6;">{{trade.tradeName}}</td>
			</tr>
		</thead>
		<tbody>
			<tr v-for='pollu in alldata[0].list.length'>
				<td style="text-align: center;">{{alldata[0].list[pollu-1].name}}</td>
				<td style="text-align: center;" v-for='boiler in alldata.length'>{{alldata[boiler-1].list[pollu-1].count}}</td>
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
      yid:state.watchyear,
      cid:-1,
      props1:{
        label: 'label',
        value: 'value',
        children: 'children'      	
      },
      selectedOptions1:[1],
      typeid:0,
      pid:'',
      industryid: '',
      pname: '四川省',
      choosedindustry:'',
      industrylist: [],
      showdata:false,
      aname:''
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
					for(var i = 0; i < this.alldata[0].list.length; i++) {
					list.push(this.alldata[0].list[i].name)
				 };

					return list
				},
       bardata:function(){
					var list=[];	
					for(var j = 0; j < this.alldata[0].list.length; j++) {
					var datalist = [];
					for(var i = 0; i < this.choosedindustry.length; i++) {
						//console.log(this.choosedindustry0[i])
						datalist.push(this.alldata[this.choosedindustry[i]].list[j].count)
							//console.log(datalist)
					};
					list.push({
						name: this.alldata[0].list[j].name,
						stack: this.alldata[0].list[j].name,
						type: 'bar',
						data: datalist
					})
				};
					return list										
			},						
  },
  watch: {
  	'selectedOptions1'(list) {
	   this.industryid = _.last(list)
	   console.log(this.industryid)
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
			api.analyze.getgoverncost('surface/'+vm.aname, vm.typeid, vm.pid, vm.yid, vm.industryid).then(function(res) {
				console.log(res)
				vm.alldata = res.data.res;
				vm.industrylist=[];
						vm.choosedindustry=[];
					for (var i = 0; i < res.data.res.length; i++) {
						if (i < 5) {
							vm.industrylist.push({
								name: res.data.res[i].tradeName,
								id: i,
								value: true
							})
							vm.choosedindustry.push(i);
						} else {
							vm.industrylist.push({
								name: res.data.res[i].tradeName,
								id: i,
								value: false
							})
						}
				
					};
						vm.showdata = true
			})
		},
},
mounted() {
	this.$nextTick(() => {
		this.pid = 0
		this.industryid = 1
		this.aname = this.$route.path
		console.log(this.aname)
		this.getall()
	})
}
}
</script>
