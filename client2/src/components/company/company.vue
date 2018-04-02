<template>
  <div id="company">
  	<h3>企业报表审核</h3>
    <el-row :gutter="24" style="margin-bottom:10px;">
      <el-col :span="3">
        <!--<el-select v-model="startyear" placeholder="年份" disabled="true">
         <el-option
            v-for="item in state.yearlist"
            :label="item"
            :value="item">
          </el-option>
        </el-select>-->
      </el-col>
      <el-col :span="6">
        <el-cascader
          :options="state.tradelist"
          v-model="trade"
          change-on-select
          :show-all-levels="false"
          placeholder="选择行业"
          clearable>
        </el-cascader>
      </el-col>
      <el-col :span="6">
        <el-cascader
          :options="state.districtlist"  v-if="state.user.role_id==1"
          v-model="district"
          change-on-select
          :show-all-levels="true"
          placeholder="选择地区"
          clearable>
        </el-cascader>
        <el-cascader
          :options="state.Districtlist"  v-if="state.user.role_id==2"
          v-model="district"
          change-on-select
          :show-all-levels="true"
          placeholder="选择地区"
          clearable>
        </el-cascader>
      </el-col>
      <el-col :span="3">
        <el-select v-model="stateid" placeholder="审核状态" >
         <el-option
            v-for="item in statelist"
            :label="item.statename"
            :value="item.stateid">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" icon="search" @click="getcompany">搜索</el-button> 
      </el-col>
      <el-col :span="3">
		    			<a href="/apserver/workflow/industryport" class="el-button el-button--primary" type="primary" style="text-decoration:none;margin-left: 0.5em;margin-bottom: 5px;">导出数据</a>
		    		</el-col>
    </el-row>
    <el-row :gutter="0">
    	<el-col :span="7">
		    <div id="tree" style="height: 700px; overflow: auto;">
		    	<el-row :gutter="5">
		    		<el-col :span="16">
				    	<el-input
							  placeholder="关键字过滤"
							  v-model="keyword">
							  <el-button slot="append" icon="search" @click="getcompany"></el-button>
							</el-input>	
		    		</el-col>		    		
		    	</el-row>
					<el-tree
					  class="filter-tree"
					  :data="treedata"
					  :props="defaultProps"
					  accordion
					  node-key="id"
					  highlight-current
					  :expand-on-click-node="true"
					  :default-expanded-keys="[-1]"
					  :filter-node-method="filterNode"
					  ref="tree2"
					  @node-click="nodeClick"
					  :render-content="renderContent"
					  v-loading.body="loading"
					  >
					</el-tree>
		    </div>
	    </el-col>	    
	    <el-col :span="17">
		    <div id="detail" style="margin-left: 1em;">
		    	<detail v-if="showpage == 0" :comdetail="curnode.comdetail" @updatecom="updateComDetail"></detail>
		    	<devices v-if="showpage == 1" :comid="curnode.comid" :year="startyear"></devices>
		    	<product v-if="showpage == 2" :comid="curnode.comid" :year="startyear"></product>

		    	<facility v-if="showpage == 3" :comid="curnode.comid" :year="startyear"></facility>
		    	<outlet v-if="showpage == 4" :comid="curnode.comid" :year="startyear"></outlet>

		    	<elec v-if="showpage == 5" :comid="curnode.comid" :year="startyear"></elec>
		    </div>
	    </el-col>	    
    </el-row>
  </div>
</template>

<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'
import detail from './detail'
import devices from './devices'
import facility from './facility'
import product from './product'
import outlet from './outlet'
import elec from './elec'

export default {
  components: {
  	detail,
  	devices,
  	product,
  	facility,
  	outlet,
  	elec
  },
  data () {
  	return {
  		state: state,
      action: actions,
  		startyear: state.watchyear,
  		trade: [],
  		district: [1,2],
  		stateid: 2,
  		keyword: "",
  		treedata: [],
  		statelist: [{
  			stateid: 0,
  			statename: "所有",
  		},{
  			stateid: 1,
  			statename: "未上报",
  		},{
  			stateid: 2,
  			statename: "待审核",
  		},{
  			stateid: 3,
  			statename: "已审核",
  		}],
  		defaultProps: {
        children: 'children',
        label: 'label'
     	},
     	showpage: -1,
     	Districtlist:[],
     	curnode: {id:0, comdetail:null,comid:''},
     	loading:false
  	}
  },
  watch: {
  	'state.watchyear':{
		    handler: function (val, oldVal) {
		    	this.startyear = val
		  	},
		    deep: true
		  }
	},
  methods: {
  	getcompany (){
			var vm = this;
			this.loading = true
			console.log(vm.district)
			api.creport.getcompany({
					companyName: vm.keyword,
					province: vm.district[0],
					city: vm.district[1],
					town: vm.district[2],
					tradeid: vm.trade[0],
					tradeid2: vm.trade[1],
					tradeid3: vm.trade[2],
					tradeid4: vm.trade[3],
					num: vm.stateid,
					fillyear: vm.startyear
			}).then(function(res){	
			    console.log(res)
				if(res.data.status===0){
					var rootnode = {id:-1, label: "企业列表"+'('+res.data.data.length+')'};
					vm.doTreeData(res.data.data);
					rootnode.children = res.data.data;
					vm.treedata = [rootnode];
					//vm.showpage = -1
				}
				vm.loading = false
			},function(bad){this.loading = false})
		},
		doTreeData(data) {
			_.each(data, function(n){
				//console.log(n)
				n.label = n.companyName;
				n.children = [{id:1, label: "锅炉窑炉",comid:n.id}, {id:2, label: "产品及原辅料",comid:n.id}, 
				{id:3, label: "治理设施",comid:n.id}, {id:4, label: "排放口",comid:n.id}, {id:5, label: "用电",comid:n.id}];
			});
		},
		updateComDetail(data) {
			//this.curnode.comdetail = data;
			this.updateClick(data)
			//this.getcompanyinfo(this.curnode);
			this.getcompany();	
		},
		updateClick(node){
			this.getcompanyinfo(node);
		},
		filterNode(value, data, node) {
			if (!value) return true;
	    return data.label.indexOf(value) !== -1;
		},
		nodeClick(node, tnode, tree){
			console.log(tnode);
			console.log(node);
			this.showpage = node.id;
			this.state.showcom = true;
			this.curnode = node;
			//console.log(this.treedata)
			if (tnode.level == 2) {
				if (tnode.expanded == true || !node.comdetail)
					this.getcompanyinfo(node);
				else
					this.showpage = 0;
			}
		},
		getcompanyinfo(node){
			console.log(node)
			var vm = this;
			
			node.comdetail = {
				cominfo:{
					companyName: node.label,
					contact:"",
					contactNo:"",
					legalPerson:"",
					legalPersonPhone:"",
					addressStr:"",
					remark:""
				},
				comFill:{
					fillyear: vm.startyear,
					gdp:"",
					daysOfWork:"",
					hoursOfDay:""
				}};
			let id = node.id || node.comFill.id
			api.creport.companyinformation(id).then(function(res){
				console.log(res)
				if (res.data.company != null) {
					node.comdetail.cominfo = res.data.company;
					
					api.creport.getcompanyFill(id, vm.startyear).then(function(res){
						console.log(res)
						if (res.data.data != null) {
							node.comdetail.comFill = res.data.data;
						}	
						vm.showpage = 0;
					},function(bad){
						vm.showpage = 0;
					})
				}
			},function(bad){
				vm.showpage = 0;
			})
			
		},
		getdevices(node) {
			var vm = this;
			api.creport.getdevice(node.id, vm.startyear).then(function(res){
				node.devices = res.data.devicelist;
				//console.log(vm.devices)
			},function(bad){})
		},
		renderContent(h, { node, data, store }) {
			if (data.level == 2) {
				return (
		    	<el-badge value="">{node.label}</el-badge>
		    );
			}
			else if (data.level == 3) {
		    return (
		    	<el-badge value="" class="item_font">{node.label}</el-badge>
		    );
			}
			
			return (<span>{node.label}</span>);
	  },
  },
  created(){	
  	console.log(this.state.Districtlist)
  },
  mounted () {
    this.$nextTick(() => { 
	     var vm = this
		   if(vm.state.user.role_id==2){       	     
			 vm.district = [1,vm.state.cityId] 
		   }else if(vm.state.user.role_id>2){
		    vm.district = [1,vm.state.cityId,vm.state.town] 
		   }
		   else{
			 vm.district = [1,2]
		   }    
		})
  }
}
</script>
<style>
.item_font {
	color: blueviolet;
}
</style>