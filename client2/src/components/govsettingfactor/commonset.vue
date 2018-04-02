<template>
  <div id="alter">
    <h3>{{listnames[listname].name}}</h3>
    <span class="fa fa-volume-up" style="color:deepskyblue;margin-right: 10px;"></span>
	{{listnames[listname].infomation}}
    </el-row>
    	<div class="mytable">
				<table class = "">
					<thead>
						<tr v-for="(xlist,index) in pname" v-if="xlist.length > 0">
							<th v-if="xlist.length" ></th>
							<th v-if="xlist.length && isy2"></th>

							<th v-for="name in pname[index]" :rowspan="name.rowspan" :colspan="name.colspan" class="text-center">{{name.name}}</th>
						</tr>
					</thead>
					<tbody v-for="(item,itemindex) in obdata">
						<tr v-for="(y2,y2index) in item.list">
							<td v-if="y2index === 0" :rowspan="item.list.length">{{item.type_y}}</td>
							<td v-if="item.list.length > 1">{{item.list[y2index].type_y2}}</td>
							<td v-for="(x,xindex) in valuelist[y2index] " track-by="$index" style="min-width: 75px;">
								<el-input type="number" style="padding-right: 0;"  v-model="valuelist[(itemindex * item.list.length)+y2index][xindex].factor"></el-input>
							</td>
						</tr>
					</tbody>
				</table> 
			</div>
    <el-row :gutter="24" style="margin-left:45%;margin-top:10px;">
    	<el-button type="primary" size="small" @click="save">保存设置</el-button>
    </el-row>
  </div>
  
</template>
<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'
import { Message } from 'element-ui';

export default {
  components: {
  },
  data () {
				return {
					pname:[],
					state:state,
					obdata:[{list:[]}],
					valuelist:[],
					listname:'dfuel',
					listnames:{
						dfuel:{name:'民用生活燃料因子配置',infomation:'污染物:SO2、NOx、VOCs、CO、PM2.5、PM10'},
						oildepot:{name:'油库',infomation:'污染物：VOCs'},
						nfertigation:{name:'氮肥施用',infomation:'污染物：NH3'},
						firewood:{name:'秸秆和薪柴',infomation:'污染物SO2、NOx、NH3、CH4、VOCs、CO、PM2.5、PM10、EC、OC'},
						gasstation:{name:'加油站',infomation:'污染物：VOCs'},
						garage:{name:'汽修',infomation:'污染物：VOCs'},
						laundry:{name:'干洗店',infomation:'污染物：VOCs'},
						//restaurant:{name:'餐馆',infomation:''},
						roaddust:{name:'道路扬尘',infomation:'污染物：PM10、PM2.5'},
						constructiondust:{name:'施工扬尘',infomation:'污染物：PM10、PM2.5'},
						constructionmachine:{name:'工程机械',infomation:'污染物：PM、COx、NOx、SO2、THC'},
						agriculturemachine:{name:'农业机械',infomation:'污染物：PM、COx、NOx、SO2、THC'},
						boat:{name:'船舶',infomation:'污染物：CO、HC、NOx、PM2.5和PM10'},
						airplane:{name:'飞机',infomation:'污染物：CO、HC、NOx、PM2.5和PM10'},
						constructionmachinenumber:{name:'工程机械保有量',infomation:''},
						pesticide:{name:'农药用量',infomation:'污染物：VOCs'},
						energysell:{name:'能源销售',infomation:'污染物：VOCs'},
						waste:{name:'垃圾场污水厂 ',infomation:'污染物：VOCs'},
						build:{name:'房屋建筑',infomation:'污染物：VOCs'},					
						energyconsume:{name:'能源消耗',infomation:'污染物：VOCs'},
						configuration:{name:'硫分、灰分配置',infomation:'最大值为1，0.2代表比例20%'},
					},
					isy2: false
				}  	
    },
		watch: {
		'$route': 'fetchData',
		'state.watchyear':{
		    handler: function (val, oldVal) {
		    	this.get(this.listname);
		  	},
		    deep: true
		  }
		},
			methods : {		
				save:function(){
					for(var y in this.valuelist){
						for( var x in this.valuelist[y]){
							this.obdata[this.valuelist[y][x].y1].list[this.valuelist[y][x].y2].value[this.valuelist[y][x].x1].listx2[this.valuelist[y][x].x2].factor = this.valuelist[y][x].factor;
						}
					}
					var vm = this;
					api.setting.govfactorset({
						typename:this.listname,
						list:this.obdata
					}).then(function(res){
						if(res.data.status == 0){
							Message.success('操作成功')
						}else{
							Message.error('操作失败请重试！')
						}
						vm.get(vm.listname);
					})
				},
				fetchData () {
					console.log(this.$route)
					this.listname = this.$route.query.listname;
					this.get(this.$route.query.listname);
				},
				get:function(name){
					var vm = this;
					api.setting.getgovfactor(name).then(function(res){
						console.log(res)
						vm.obdata = res.data.list;
						console.log(vm.obdata)
						vm.pname = [[],[]];
						for(var x in vm.obdata[0].list[0].value){
							var xhead = {};
							xhead = {
								name:vm.obdata[0].list[0].value[x].type_x,
								colspan:vm.obdata[0].list[0].value[x].listx2.length,
								rowspan:2
							}	
							if(vm.obdata[0].list[0].value[x].listx2.length > 1){
								xhead.rowspan = 1
								for (var i = 0; i < vm.obdata[0].list[0].value[x].listx2.length; i++) {
									if(vm.obdata[0].list[0].value[x].listx2[i].type_x2){
										vm.pname[1].push({
											name:vm.obdata[0].list[0].value[x].listx2[i].type_x2,
											colspan:1,
											rowspan:1
										});
									}
								};
							}
							vm.pname[0].push(xhead);
							console.log(xhead)
						}
						vm.getinputvalue();
						if (vm.obdata[0].list.length > 1) {
							vm.isy2 = true
						}else{
							vm.isy2 = false
						}
						console.log(vm.pname)
					})

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
									//console.log(this.obdata[y1].list[y2].value[x1].listx2[x2])
								}
							}
						}
					}
				}
			},	
  mounted () {
    this.$nextTick(() => {
    	console.log(this.$route)
    	this.listname = this.$route.query.listname
    	this.get(this.$route.query.listname)
    })
  }			
}
</script>
<style scoped>
	
</style>