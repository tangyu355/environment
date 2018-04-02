<template>
  <div id="fuelset">
		<h3>机动车保有量数据</h3>	
		<el-card class="box-card">
		  <div slot="header" class="clearfix">
		    <span  v-if="yearlist.length !== 0" style="line-height: 36px;">{{yearlist[0] + 1}}年</span>
		    <span  v-else style="line-height: 36px;">提交初始样表</span>
		    <div style="float: right;">
		    	<a class="el-button" href="../../../static/机动车基础数据表格.xlsx" v-if="yearlist.length === 0" style="margin-right:10px;">下载初始数据样表</a>
		    	<el-upload
		    		style="display:inline;"
		    	  v-if="yearlist.length === 0"
					  action="apserver/excelup/vehicleFactor"
					  :on-remove="handleRemove"
					  :file-list="fileList"
					  :data = "{tabletype:'ap_motor_vehicle'}"
					  :name="filename"
					  :on-success ="success"
					  :before-upload="beforeUpload"
					  >
					  <el-button size="" type="primary">点击上传</el-button>
					</el-upload>
		    	<a class="el-button" href="../../../static/机动车每年更新数据表格.xlsx" v-if="yearlist.length!==0" >下载更新数据样表</a>
		    	<el-upload
		    		style="display:inline;"
		    	  v-if="yearlist.length !== 0"
					  action="apserver/excelup/vehicleFactor"
					  :on-remove="handleRemove"
					  :file-list="fileList"
					  :data = "{tabletype:'ap_vehicle_update'}"
					  :name="filename"
					  :on-success ="success"
					  :before-upload="beforeUpload"
					  >
					  <el-button size="" type="primary">点击上传</el-button>
					</el-upload>
		    </div>
		    
		  </div>
		  <p v-if="yearlist.length === 0">
				<span class="glyphicon glyphicon-volume-up"></span>
				选择初始数据年份上传机动车保有量初始数据，再将每年更新的数据上传。
			</p>
			<p v-if="yearlist.length">
				<span class="glyphicon glyphicon-volume-up"></span>
				请上传{{yearlist[0] + 1}}年的更新数据。
			</p>
		</el-card>
			<el-collapse v-model="showyear" accordion @change="showtable">

			  <el-collapse-item v-for="(year,$index) in yearlist" :name="year">
			    <template slot="title">
			      {{year}}年 
			      <div style="float:right;padding:0 20px;">
			      	<el-button style="display:inline;" v-if="$index === 0" type="danger" size="small" @click="del">删除</el-button>
			      	<el-upload
				    		style="display:inline;"
				    	  v-if="$index === 0 && yearlist.length > 1" 
							  action="apserver/excelup/vehicleFactor"
							  :on-remove="handleRemove"
							  :file-list="fileList"
							  :data = "{tabletype:'ap_vehicle_update'}"
							  :name="filename"
							  :on-success ="success"
							  :before-upload="beforeUpload"
							  >
							  <el-button size="small" type="success">重新上传更新数据</el-button>
							</el-upload>
							<el-upload
				    		style="display:inline;"
				       	v-if="$index === 0 && yearlist.length === 1" 
							  action="apserver/excelup/vehicleFactor"
							  :on-remove="handleRemove"
							  :file-list="fileList"
							  :data = "{tabletype:'ap_motor_vehicle'}"
							  :name="filename"
							  :on-success ="success"
							  :before-upload="beforeUpload"
							  >
							  <el-button size="small" type="success">重新上传初始数据</el-button>
							</el-upload>
						</div>
			    </template>
			    <div v-if="show && showyear === year" class="table-responsive" style="max-height:600px;overflow-y: auto">
					<table class = "table table-bordered">
						<thead>
							<tr>
								<th rowspan="2" style="min-width:100px;" class="text-center" >城市</th>
								<th rowspan="2" class="text-center" style="min-width:80px;">排放标准</th>
								<th :colspan = "vnum" class="text-center" >车型/保有量</th>
							</tr>
							<tr>
								<th v-for = "i in vnum" class="text-center" style="min-width:150px;">{{valuelist[0].list[0].list[i-1]["车型"]}}</th>
							</tr>
						</thead>
						<tbody v-for = "city in valuelist" >
							<tr v-for="(i,index) in city.list">
								<td :rowspan="snum" class="text-center" v-if="index === 0">{{city.cityname}}</td>
								<td class="text-center">{{i["standard"]}}</td>
								<td v-for="x in i.list" class="text-center">{{x["value"]}}</td>
							</tr>
						</tbody>
					</table>
				</div>			
			  </el-collapse-item>
			</el-collapse>
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
			pname:[],
			obdata:[{list:[]}],
			valuelist:[],
			yearlist:[],
			exlfile: '',
			cnum:'',
			snum:'',
			vnum:'',
			tabletype:'',
			address:'',
			showyear:'',
			show:false,
			fileList: [],
			upload: {
				tabletype:''
			},
			filename:'vehicle'
		}
	},
	computed: {},
	watch: {},
	methods: {
		handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    success(response, file, fileList){
    	let vm = this
    	console.log(response);
    	if(response.status==0){
    		vm.get()
    	  vm.fileList = fileList
    	} else{
    	  vm.$message.error('上传失败！')
    	}
    },
    beforeUpload(file){
    	console.log('准备上传')
    	// console.log(file)
    },
		
		get:function(){//获取已有年份数据
			var vm = this;
			api.setting.getvehicleyear().then(function(res){
				vm.yearlist = res.data.data;
			})
		},
		showtable: function(){
			var vm = this;
			this.show = false;
			//this.showyear = year;
			if(vm.valuelist.length && this.showyear === vm.valuelist[0].year){
				console.log(vm.valuelist[0].year)
				vm.show = true;
			}else if (this.showyear){
				this.getinfo(this.showyear);
			}	
		},
		getinfo:function(year){
			var vm = this;
			this.$http.get('vehicle/action/getbyyear/' + year).then(function(res){
					console.log(res)
					vm.valuelist = res.data.data;
					vm.cnum = vm.valuelist.length;
					vm.snum = vm.valuelist[0].list.length;
					vm.vnum = vm.valuelist[0].list[0].list.length;
					vm.show = true;
				})
		},
		del:function(){
			var vm = this;
			this.$http.post('vehicle/action/deletelast').then(function(res){
				console.log(res)
				if(res.data.status === 0){
					utils.success('删除成功')
					vm.get();
					vm.show = false;
				}
			})
		}
	},
	mounted() {
		this.$nextTick(() => {
			var vm = this;
			this.get();
			var url=window.location.href;
			this.address=url;
		})
	}
}
</script>
<style scoped>

</style>