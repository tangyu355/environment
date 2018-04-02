<template>
  <div id="fuelset">
  	<h3>畜禽养殖排放因子配置</h3>	
			
			<span class="fa fa-volume-up" style="color:deepskyblue;margin-right: 10px;"></span>
		  <span style="color:deepskyblue">母猪、马、蛋鸡、蛋鸭、蛋鹅、肉鸡、肉鸭、肉鹅、兔以及肉牛、奶牛、山羊、绵羊的饲养周期大于或等于365天，肉猪饲养周期小于75天</span>时，排放因子请在下表填写。

			<div class="mytable">
				<table class = "table table-bordered">
					<thead >
						<tr>
							<th rowspan="2" class="text-center">畜禽种类</th>
							<th colspan="2" class="text-center">氨排放因子</th>
						</tr>
						<tr>
							<th class="text-center">规模化养殖</th>
							<th class="text-center">散养</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="y in obdata[0].list.length">
							<th>{{obdata[0].list[y-1].type_y2}}</th>
							<td><el-input type="number" min="0" class="form-control" v-model="obdata[0].list[y-1].value[0].listx2[0].factor"></el-input></td>
							<td><el-input type="number" min="0" class="form-control" v-model="obdata[1].list[y-1].value[0].listx2[0].factor"></el-input></td>
						</tr>
					</tbody>
				</table>			
			</div>	
			<el-row :gutter="24" style="margin-left:45%;margin-top:10px;">
				 <el-button type="primary" size="small" @click="save" >保存设置</el-button>
			</el-row>
				<span class="fa fa-volume-up" style="color:deepskyblue;margin-right: 10px;"></span>
				<span style="color:deepskyblue">当肉牛、奶牛、山羊、绵羊的饲养周期小于365天时，肉猪饲养周期大于75天</span>时，排放因子请在下表填写。

					<div class="mytable">
					<table class = "table table-bordered">
						
						<thead>
							<tr v-for="(xlist,index) in pname">
								<th v-for="name in pname[index]" :rowspan="name.rowspan" :colspan="name.colspan" class="text-center">{{name.name}}</th>
							</tr>
						</thead>
						<tbody v-for="(item,itemindex) in obdata2">
							<tr v-for="(y2,y2index) in item.list">
								<td style="min-width: 55px;" v-if="y2index === 0" rowspan="5">{{item.type_y}}</td>
								<td style="min-width: 55px;">{{y2.type_y2}}</td>
								<td v-for="(x,xindex) in valuelist2[y2index] "  style="min-width: 115px;">
									<el-input type="number" style="padding-right: 0;" min="0" v-model="valuelist2[(itemindex * item.list.length)+y2index][xindex].factor"></el-input>
								</td>
							</tr>
						</tbody>
					</table>

					</div>
       <el-row :gutter="24" style="margin-left:45%;margin-top:10px;">
				 <el-button type="primary" size="small" @click="save2" >保存设置</el-button>
			</el-row>	
	</div>
</template>
<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'
import { Message } from 'element-ui'

export default {
  components: {
  },
  data () {
    return {
      obdata:[{list:[]}],
      state:state,
			obdata2:[{list:[]}],
			valuelist:[],
			valuelist2:[],
			pname:[],
			showdata:false,
    }
  },
  computed: {
  },
  watch: {
  	'state.watchyear':{
		    handler: function (val, oldVal) {
		    	  this.changeData()
		  	},
		    deep: true
		  }
  },
  methods: {
       save:function(){
					var vm = this;
					console.log(this.obdata2)
					api.setting.govfactorset({
						typename:'animal1',
						list:this.obdata
					}).then(function(res){
						//console.log(res)
						if(res.data.status == 0){
							vm.$message({
		            type: 'success',
		            message: '修改成功!'
		          });
							vm.get('animal1');
						}else{
							vm.$message.error(res.data.msg)
						}
						
					})
				},
				save2:function(){
					var vm = this;
					for(var y in this.valuelist2){
						for( var x in this.valuelist2[y]){
							this.obdata2[this.valuelist2[y][x].y1].list[this.valuelist2[y][x].y2].value[this.valuelist2[y][x].x1].listx2[this.valuelist2[y][x].x2].factor = this.valuelist2[y][x].factor;
						}
					}
					console.log(this.obdata2)
					api.setting.govfactorset({
						typename:'animal2',
						list:this.obdata2
					}).then(function(res){
						//console.log(res)
						if(res.data.status == 0){
							vm.$message({
		            type: 'success',
		            message: '修改成功!'
		          });
							vm.get('animal2');
						}else{
							vm.$message.error(res.data.msg)
						}
						
					})
				},
				get:function(name,callback){
					
					api.setting.getgovfactor(name).then(callback)
				},
				getinputvalue:function(){
					this.valuelist2 = []
					for(var y1 in this.obdata2){
						for (var y2 in this.obdata2[y1].list){
							this.valuelist2.push([]);
							for(var x1 in this.obdata2[y1].list[y2].value){
								for (var x2 in this.obdata2[y1].list[y2].value[x1].listx2){
									this.valuelist2[y1*this.obdata2[y1].list.length+y2*1].push(
									{
										factor:this.obdata2[y1].list[y2].value[x1].listx2[x2].factor,
										x1:x1,
										x2:x2,
										y1:y1,
										y2:y2
									})
									//console.log(this.obdata[y1].list[y2].value[x1].listx2[x2])
								}
							}
						}
						
					}
					console.log(this.valuelist2)
				},
				changeData(){
					var vm = this
					this.get('animal1',function(res){
					console.log(res)
					vm.obdata = res.data.list;
					vm.showdata = true
					console.log(vm.obdata)	
				})
				this.get('animal2',function(res){
					vm.obdata2 = res.data.list;	
					console.log(vm.obdata2);
					vm.pname = [[{
								name:'饲养方式',
								colspan:1,
								rowspan:2
							},{
								name:'畜禽种类',
								colspan:1,
								rowspan:2
							}],[]];
						for(var x in vm.obdata2[0].list[0].value){
							var xhead = {};
							xhead = {
								name:vm.obdata2[0].list[0].value[x].type_x,
								colspan:vm.obdata2[0].list[0].value[x].listx2.length,
								rowspan:2
							}	
							if(vm.obdata2[0].list[0].value[x].listx2.length > 1){
								console.log(vm.obdata2[0].list[0].value[x].listx2.length)
								xhead.rowspan = 1
								for (var i = 0; i < vm.obdata2[0].list[0].value[x].listx2.length; i++) {
									if(vm.obdata2[0].list[0].value[x].listx2[i].type_x2){
									vm.pname[1].push({
										name:vm.obdata2[0].list[0].value[x].listx2[i].type_x2,
										colspan:1,
										rowspan:1
									});
									}
								};
							}
							console.log(xhead)
							vm.pname[0].push(xhead);
						}	
					  vm.getinputvalue();
				  })
				}
  },
  mounted () {
    this.$nextTick(() => {
				var vm = this;
				vm.changeData()
    })
  }
}
</script>
<style scoped>

</style>