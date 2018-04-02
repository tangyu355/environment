<template>
  <div id="fuelset">
			<h3>餐饮排放因子配置</h3>	
			<el-row :gutter="24">
				<span class="fa fa-volume-up" style="color:deepskyblue;margin-right: 10px;"></span>
					<span>污染物：PM10、PM2.5、VOCs</span>
			</el-row>
			<el-row :gutter="24">
				<div class="mytable">
					<table class = "table table-bordered">
						
						<thead>
							<tr v-for="(xlist,index) in pname">
								<th v-for="name in pname[index]" :rowspan="name.rowspan" :colspan="name.colspan" class="text-center">{{name.name}}</th>
							</tr>
						</thead>
						<tbody v-for="(item,itemindex) in obdata">
							<tr v-for="(y2,y2index) in item.list">
								<td style="min-width: 75px;" v-if="y2index === 0" :rowspan="item.list.length">{{item.type_y}}</td>
								<td style="min-width: 75px;">{{y2.type_y2}}</td>
								<td v-for="(x,xindex) in valuelist[y2index] " track-by="$index" style="min-width: 75px;">
									<el-input type="number" style="padding-right: 0;" min="0" v-model="valuelist[(itemindex * item.list.length)+y2index][xindex].factor"></el-input>
								</td>
							</tr>
						</tbody>
					</table>	
					</div>
			</el-row>		
			<el-row :gutter="24" style="margin-left:45%;margin-top:10px;">
				<el-button type="primary" size="small" @click="save" >保存设置</el-button>
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
				valuelist:[],
				pname:[],    	
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
      save:function(){
			var vm = this;
			for(var y in this.valuelist){
				for( var x in this.valuelist[y]){
					this.obdata[this.valuelist[y][x].y1].list[this.valuelist[y][x].y2].value[this.valuelist[y][x].x1].listx2[this.valuelist[y][x].x2].factor = this.valuelist[y][x].factor;
				}
			}
			console.log(this.obdata)
			api.setting.govfactorset({
				typename:'restaurant',
				list:this.obdata
			}).then(function(res){
				//console.log(res)
				if(res.data.status == 0){
					utils.success('保存成功');
					location.reload();
				}else{
					utils.danger('失败请重试')
				}
				vm.get('restaurant');
			})
		},
		get:function(name,callback){
			
			api.setting.getgovfactor(name).then(callback)
		},
		getinputvalue:function(){
			this.valuelist = []
			for(var y1 in this.obdata){
				for (var y2 in this.obdata[y1].list){
					this.valuelist.push([]);
					for(var x1 in this.obdata[y1].list[y2].value){
						for (var x2 in this.obdata[y1].list[y2].value[x1].listx2){
							this.valuelist[y1*this.obdata[y1].list.length+y2*1].push(
							{
								factor:this.obdata[y1].list[y2].value[x1].listx2[x2].factor,
								x1:x1,
								x2:x2,
								y1:y1,
								y2:y2
							})
						}
					}
				}	
			}
		}  	
  },
  mounted () {
    this.$nextTick(() => {
        var vm = this;
				this.get('restaurant',function(res){
					vm.obdata = res.data.list;	
					console.log(vm.obdata);
					vm.pname = [[{
								name:'污染物',
								colspan:2,
								rowspan:2
							}],[]];
						for(var x in vm.obdata[0].list[0].value){
							var xhead = {};
							xhead = {
								name:vm.obdata[0].list[0].value[x].type_x,
								colspan:vm.obdata[0].list[0].value[x].listx2.length,
								rowspan:2
							}	
							if(vm.obdata[0].list[0].value[x].listx2.length > 1){
								console.log(vm.obdata[0].list[0].value[x].listx2.length)
								xhead.rowspan = 1
								for (var i = 0; i < vm.obdata[0].list[0].value[x].listx2.length; i++) {
									if(vm.obdata[0].list[0].value[x].listx2[i].type_x2){
									vm.pname[1].push({
										name:vm.obdata[0].list[0].value[x].listx2[i].type_x2,
										colspan:1,
										rowspan:1,
										
									});
									}
								};
							}
							console.log(xhead)
							vm.pname[0].push(xhead);
						}	
						console.log(vm.pname)
					  vm.getinputvalue();
				})    	
    })
  }
}
</script>
<style scoped>

</style>