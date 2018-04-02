<template>
  <div id="commonset" v-if="showdata">
    <h3>不同城市畜禽类型数量统计图</h3>
   <el-form ref="form" inline >
    	<el-row :gutter="24">
     <el-col :span="6">
    		<el-form-item label="选择类型">
           <el-select class="form-control" v-model="pindex" @change='getall'>
                  <el-option v-for="(y,index) in plist" :value="index" :label="y.name"></el-option>
               </el-select>
        </el-form-item>
     </el-col>
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
							<th rowspan="2">畜禽（只）</th>
							<th :colspan="plist[pindex].value.length" class="text-center">城市</th>
						</tr>
						<tr>
							<th v-for='boiler in plist[pindex].value'>{{boiler.name}}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for='pollu in plist[pindex].value[0].list.length'>
							<td>{{plist[pindex].value[0].list[pollu-1].name}}</td>
							<td v-for='item in plist[pindex].value.length'>{{plist[pindex].value[item-1].list[pollu-1].value.toFixed(2)}}</td>
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
			showdata:false,
			pindex:0,
			plist:[],
			citylist:[],
			choosedcities:[],
			typeid:2
    }
  },
  computed: {
     legenddata:function(){
					var list=[];	
					for (var i = 0; i < this.plist[this.pindex].value[0].list.length; i++) {
						list.push(this.plist[this.pindex].value[0].list[i].name)
					};
					return list
				},
				xname:function(){
					var list=[];	
					for (var i = 0; i < this.choosedcities.length; i++) {
						list.push(this.citylist[this.choosedcities[i]].name)
					};

					return list
				}, 
       bardata:function(){
					var list=[];
					for (var i = 0; i < this.plist[this.pindex].value[0].list.length; i++) {
							var datalist = [];
							for (var j = 0; j < this.choosedcities.length; j++) {
							datalist.push(this.plist[this.pindex].value[this.choosedcities[j]].list[i].value)
						};
						
						list.push({
							name:this.plist[this.pindex].value[0].list[i].name,
							type:'bar',
							stack:'pollution',
							data:datalist,
						})	
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
      getall:function(){
					var vm=this;
					api.analyze.getByType('surface/poultrycity',vm.yid,vm.typeid).then(function(res){	
						console.log(res)	
						vm.plist = res.data.list;						
						vm.citylist=[];
						vm.choosedcities=[];
						for (var i = 0; i < vm.plist[vm.pindex].value.length; i++) {
						
								if(i==4||i==9||i==13)
								{
								vm.citylist.push({
									name:vm.plist[vm.pindex].value[i].name,
									id:i,
									value:true
								})
								
								}
								else{
										vm.citylist.push({
										name:vm.plist[vm.pindex].value[i].name,
										id:i,
										value:false
									})
									
								}
								vm.choosedcities=[4,9,13];							
						};
						vm.showdata = true
					})
				},  	
  },
  mounted () {
    this.$nextTick(() => {
    	this.pindex = 0
				this.getall()
    })
  }
}
</script>

