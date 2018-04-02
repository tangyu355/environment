<template>
	<div id="upload">
		<h3>工艺治理算法配置</h3>
		<h5>去除效率格式如0.2代表20%,最大值为1</h5>
		<el-row :gutter="24" style="margin-bottom:10px;">
			<table id="exceltable" class="table table-striped jambo_table bulk_action">
				<thead>
					<tr>
						<th width='20%' class="text-center">工艺分类</th>
						<th width='30%' class="text-center">工艺方法</th>
						<th class="text-center" v-if="gid!==5003">去除效率</th>
						<th class="text-center" v-if="gid===5003">PM2.5去除效率</th>
						<th class="text-center" v-if="gid===5003">PM2.5-10去除效率</th>
						<th width="17%" class="text-center">操作</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<el-select v-model="governid" placeholder="请选择" @change="selectgovern">
					     <el-option
					      v-for="(item,index) in governlist"
					      :key="item.id"
					      :label="item.str"
					      :value="index">
					     </el-option>
	         </el-select>
						</td>
							<td class="cube_formula ">
								<el-input type="text" v-for='method in methodlist' class="form-control" v-model="method.name"></el-input>
							</td>
							<td class="cube_formula ">
								<el-input type="number" v-for='method in methodlist' max="1" class="form-control methods" v-model="method.unit"></el-input>
							</td>
							<td class="cube_formula " v-if="gid===5003">
								<el-input type="number" v-for='method in methodlist' max="1" class="form-control methods" v-model="method.remark"></el-input>
							</td>
						<td class="cube_formula text-center ">
							<el-button type="primary"  @click="saveChange">保存设置</el-button>
						</td>
					</tr>
				</tbody>
			</table>
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
      governlist:'',
			methodlist:'',
			governid:0,
			gid:'',
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
        saveChange:function(){
					var vm=this;
					var rdata=
						{
						name:vm.methodlist,
						};
					api.staticinformation.addup(rdata
						).then(function(res){
						console.log(res.data)
						if(res.data.status!=0){Message.error('去除效率是小于等于1的数字！');}
						else{
							Message.success('设置成功');
						}
					},function(bad){
						Message.error('设置失败')
					})
				},
				selectgovern:function(){
					var vm = this;
					vm.gid=vm.governlist[vm.governid].it;
					console.log(vm.gid)
					api.staticinformation.getbyppid(vm.gid).then(function(res){
					console.log(res)
					vm.methodlist = res.data.staticlist;
					console.log(vm.methodlist)
					})
				},
  },
  mounted () {
    this.$nextTick(() => {
          var vm=this;
					api.staticinformation.getTech().then(function(res){
					console.log(res)
					vm.governlist = res.data.staticlist;
					console.log(vm.governlist)
					vm.gid=vm.governlist[vm.governid].it;
					console.log(vm.governid,vm.gid)
					api.staticinformation.getbypid(vm.gid).then(function(res){
					console.log( res.data.staticlist.length)
					vm.methodlist = res.data.staticlist;
					console.log(vm.methodlist)
      })
     })
	  })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-select,.el-input,.el-cascader{
    width: 240px;
}
.text-center{
	text-align: center;
}
</style>
