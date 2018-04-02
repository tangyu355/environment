<template>
   <div id="fuelset">
	 <h3>{{head[aname].name}}</h3>
    <el-row :gutter="24">
	  <el-form ref="" inline label-width="100px">		
          <el-col :span="6">
			<el-form-item :label="head[aname].contname">
				<el-select v-model="choosedcontent" @change="selectcon">
					<el-option v-for="item in contentlist" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
		</el-col>
		<el-col :span="6" v-if="head[aname].ispro">
				<el-form-item label="选择统计类型">
					<el-select v-model="Type" @change="getall">
						<el-option v-for="item in state.typeidList" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
		</el-form>
	  </el-row>
   <div v-if = "!showchart" class="text-center">
		<h3>没有数据</h3>
	</div>
       <echart-pie :legenddata="legenddata" :piedata="serieslist" v-if = "showchart"></echart-pie>
       <Button type="primary" size="large" @click="exportData(1)" v-if="columnslist[aname]&&showchart" style="margin:5px 0 5px 0"><Icon type="ios-download-outline" style="color: #fff;"></Icon> 导出数据</Button>
       <div class="mytable">      	
			<table v-if="showchart">
				<thead>
					<tr>
						<th rowspan="2" style="min-width:80px">{{head[aname].ytitle}}</th>
						<th :colspan="alldata.length" class="text-center">{{head[aname].contname}}</th>
					</tr>
					<tr>
						<th v-for='x in contentlist' style="min-width:80px">{{x.name}}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="y in alldata[0].list.length">
						<td style="text-align: center;">{{alldata[0].list[y-1][head[aname].contrastobject]}}</td>
						<td style="text-align: center;" v-for='item in alldata'>
							<p>{{item.list[y-1][head[aname].valuename].toFixed(2)}}</p>
						</td>
					</tr>
				</tbody>
			</table>
			<Table :columns="columnslist[aname]" :data="iviewdata" size="small" ref="reftable" hidden v-if="columnslist[aname]&&showchart"></Table>
		</div>
   </div>	
</template>			

<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'

export default {
	props: {
       searchtype: Number
    },
	components: {},
	data() {
		return {
			iviewdata:[],
			head: {
				'cityConstrucdust': {
					name: '全省各市州施工扬尘贡献占比',
					contrastobject: 'districtName',
					coname: '',
					valuename: 'statvalue',
					contname: '扬尘类型',
					unit: '吨',
					ispro:true
				},
				'cityRoaddust': {
					name: '全省21市州道路扬尘贡献占比',
					contrastobject: 'districtName',
					coname: '',
					valuename: 'statvalue',
					contname: '扬尘类型',
					unit: '吨',
					ispro:true
				},
				'pollutantConstruction': {
					name: '全省工程机械污染物贡献占比',
					contrastobject: 'firewoodName',
					coname: '',
					valuename: 'statvalue',
					contname: '污染物',
					unit: '吨',
					ispro:true
				},
				'sourceTypeall': {
					name: '全省某个污染物的污染源来源构成',
					contrastobject: 'groupName',
					coname: '',
					valuename: 'statvalue',
					contname: '污染物',
					unit: '吨',
					ispro:true
				},
				'pollutantMachine1': {
					name: '全省农业机械污染物贡献占比',
					contrastobject: 'name',
					coname: '',
					valuename: 'statvalue',
					contname: '污染物',
					unit: '吨'
				},
				'pollutantMachine1': {
					name: '全省农业机械污染物贡献占比',
					contrastobject: 'name',
					coname: '',
					valuename: 'statvalue',
					contname: '污染物',
					unit: '吨',
					ispro:true
				},
				'poultrytype': {
					name: '全省畜禽类型占比统计图',
					contrastobject: 'name',
					coname: '',
					valuename: 'statvalue',
					contname: '养殖类型',
					unit: '吨',
					ispro:true
				},
				'moving': {
					name: '各城市污染物排放占比',
					contrastobject: 'districtName',
					coname: '',
					valuename: 'statvalue',
					contname: '城市',
					unit: '吨',
					ispro:true
				},
				'agricult': {
					name: '各城市污染物排放占比',
					contrastobject: 'districtName',
					coname: '',
					valuename: 'statvalue',
					contname: '城市',
					unit: '吨',
					ispro:true
				},
				'MotorstatByGas': {
					name: '机动车各个城市污染物燃油种类分布统计图',
					contrastobject: 'name',
					coname: '',
					valuename: 'statvalue',
					contname: '城市',
					unit: '吨',
					ispro:true
				},
			},
			columnslist:{
				'cityRoaddust':[{title:'分类',key:'name'}],
				'cityConstrucdust':[{title:'分类',key:'name'}],
				'pollutantConstruction':[{title:'分类',key:'name'}],
				'moving':[{title:'分类',key:'name'}],
				'pollutantMachine1':[{title:'分类',key:'name'}],
				'agricult':[{title:'分类',key:'name'}],
				'MotorstatByGas':[{title:'分类',key:'name'}],
				'sourceTypeall':[{title:'分类',key:'name'}],
			},
			tabletitle:{
				'cityRoaddust': '',
				'cityConstrucdust': '',
				'pollutantConstruction': '',
				'moving': '',
				'pollutantMachine1': '',
				'agricult': '',
				'MotorstatByGas': '',
				'sourceTypeall': '',
			},
			state: state,
	        action: actions,
			aname: 'cityConstrucdust',
            //有数据的年份表
			yid: state.watchyear, //选择的年份
			alldata: '', //获取的所有数据
			contentlist: [], //统计内容
			choosedcontent: 0,
			pievalue: [],
			showchart: false,
			isSmall: false,
	 		show:false,
	 		typeid:1,
            Type:2,
			}
			},
			computed: {
					legenddata () {
						var list = [];
						for (var i = 0; i < this.pievalue.length; i++) {
							list.push(this.pievalue[i].name)
						};
						return list
					},
                  serieslist () {
            		var list=[{
            			name:this.head[this.aname].coname,
            			type:'pie',
            			radius : '55%',
            			center: ['50%', '60%'],
            			data:this.pievalue,
            			itemStyle: {
            				emphasis: {
            					shadowBlur: 10,
            					shadowOffsetX: 0,
            					shadowColor: 'rgba(0, 0, 0, 0.5)'
            				}
            			}
            		}]
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
	            fetchData() {			
				  this.show = false
					//console.log(this.$route.params)
					this.aname = this.$route.params.analyname
					if(this.$route.params.isSmall.toString() === "true" ){
						this.isSmall = true
					} else {
						this.isSmall = false
					}
					//console.log(this.$route.params.isSmall)
					//console.log(this.isSmall)
		    	   this.getall()
		       },
               selectyear () {
					this.getall()
				},
				exportData (type) {
			      if (type === 1) {
			         this.$refs.reftable.exportCsv({
			            filename: this.yid+'年'+this.tabletitle[this.aname]+this.head[this.aname].name
			         });
			      }
			    },
                selectcon () {
					this.pievalue = [];
					console.log(this.alldata[this.choosedcontent]);
					var x = 0;
					for(var i in this.alldata[this.choosedcontent].list){
						if(this.alldata[this.choosedcontent].list[i].statvalue!=0&&this.alldata[this.choosedcontent].list[i][this.head[this.aname].contrastobject]!=='污染源合计'){
							this.pievalue.push({
								value:this.alldata[this.choosedcontent].list[i].statvalue,
								name:this.alldata[this.choosedcontent].list[i][this.head[this.aname].contrastobject]
							})						    
						}else{
							x ++
						}
					}
					console.log(this.pievalue)
					console.log('x:'+x,'length:'+ this.alldata[this.choosedcontent].list.length)
					if(x > 0 && x < this.alldata[this.choosedcontent].list.length){
						this.showchart = true;
						console.log('x:'+x,'length:'+ this.alldata[this.choosedcontent].list.length)
						this.pievalue.push({
							value:0,
							name:'其他'
						})
						console.log(this.pievalue)
					}else if(x === this.alldata[this.choosedcontent].list.length){
						this.showchart = false;
					}else if(x ===  0){
						this.showchart = true;
					}
				},
				showtype () {
					console.log(111)
				},
                getall () {
                	let vm = this
					let address = this.aname
					let param = this.yid
					console.log('isSmall:',this.isSmall)
					if(this.isSmall){
					  address =  this.typeid+'/'+this.aname
		            }
					if(this.head[this.aname].ispro){
						param = this.yid + '/' +this.Type
					}
					api.analyze.getall('surface/' + address, param).then(function(res) {	
						console.log(res.data.list.length)
						if(res.data.list.length){
						vm.alldata = res.data.list;						
						vm.contentlist = [];
						vm.columnslist[vm.aname] = []
						for (var i = 0; i < res.data.list.length; i ++) {
							vm.contentlist.push({
								name: res.data.list[i].name,
								id: i,
							})
							if(vm.columnslist[vm.aname]){
							vm.columnslist[vm.aname].push({
								title:res.data.list[i].name,
								key:'a' + i
							})
						}
						};
						vm.columnslist[vm.aname].unshift({title:'分类',key:'name'})
						vm.iviewdata = []					
					    for (var i = 0; i < res.data.list[0].list.length; i++) {
					        var obj = {}
					        for (var j = 0; j < res.data.list.length; j++) {          		
					          		obj['a' + j] = res.data.list[j].list[i][vm.head[vm.aname].valuename]
					          		obj['name'] = res.data.list[j].list[i][vm.head[vm.aname].contrastobject]	  	          		
					        }	 
					        vm.iviewdata.push(obj)
					    } 
						if(!vm.head[vm.aname]){
							var str = '' + vm.aname
							vm.aname = str.split('/')[0]
					    }
						if(vm.isSmall){
							vm.showtype()
						} else{
						   vm.selectcon()
						}
						}
						else{
							vm.$message.error('没有数据！')
						}
					})
				},				
			},
			mounted() {
				this.$nextTick(() => {
				   this.fetchData()
				})
				}
			}
</script>	