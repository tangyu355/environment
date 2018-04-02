<template>
	<div id="fuelset">
		<h3>污染物计算</h3>
		<h5>污染物计算会把前端填报的内容与污染物因子根据特定的公式计算出实际排放的污染物数量，并以此为依据进行污染物统计与汇总。请完成相应步骤再点击计算按钮。</h5>
		<el-form ref="form" inline>
			<el-row :gutter="24">
				<el-col :span="8">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span style="line-height: 36px;">工业源</span>
							<el-popover ref="popover1" placement="bottom" width="160" v-model="visible1">
								<p>确定开始计算吗？</p>
								<div style="text-align: right; margin: 0">
									<el-button size="mini" type="text" @click="visible1 = false">取消</el-button>
									<el-button type="primary" size="mini" @click="visible1 = false; calculate(1);">确定</el-button>
								</div>
							</el-popover>
							<el-button style="float: right;" type="primary" size="small" v-popover:popover1>点击计算</el-button>
						</div>
						<div class="text item">
							<span class="fa fa-volume-up" style="color:deepskyblue;margin-right: 10px;"></span>步骤一：审核填报。
							<router-link :to="{path:'/company'}">前往审核</router-link>
						</div>
						<div class="text item">
							<span class="fa fa-volume-up" style="color:deepskyblue;margin-right: 10px;"></span>步骤二：配置因子。
							<router-link :to="{path:'/productset'}">前往配置</router-link>
						</div>
						<div class="text item">
							<span class="fa fa-volume-up" style="color:deepskyblue;margin-right: 10px;"></span>步骤三：配置每月系数。
							<router-link :to="{path:'/govmonthly'}">前往配置</router-link>
						</div>
						<div class="text item">
							<p style="text-align: center; font-weight: bold;">{{text1}}</p>
							<el-progress :text-inside="true" :stroke-width="18" :percentage="percent1" :status="status1"></el-progress>
						</div>
					</el-card>
				</el-col>
				<el-col :span="8">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span style="line-height: 36px;">面源</span>
							<el-popover ref="popover2" placement="bottom" width="160" v-model="visible2">
								<p>确定开始计算吗？</p>
								<div style="text-align: right; margin: 0">
									<el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
									<el-button type="primary" size="mini" @click="visible2 = false; calculate(2);">确定</el-button>
								</div>
							</el-popover>
							<el-select v-model="typeid0" placeholder="" style="width:50%">
								<el-option
							      v-for="item in typelist"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							</el-select>
							<el-button style="float: right;" type="primary" size="small" v-popover:popover2>点击计算</el-button>
						</div>
						<div class="text item">
							<span class="fa fa-volume-up" style="color:deepskyblue;margin-right: 10px;"></span>步骤一：审核填报。
							<router-link :to="{path:'/goverment'}">前往审核</router-link>
						</div>
						<div class="text item">
							<span class="fa fa-volume-up" style="color:deepskyblue;margin-right: 10px;"></span>步骤二：配置因子。
							<router-link :to="{path:'/farmingsetting'}">前往配置</router-link>
						</div>
						<div class="text item">
							<span class="fa fa-volume-up" style="color:deepskyblue;margin-right: 10px;"></span>步骤三：配置每月系数。
							<router-link :to="{path:'/govmonthly'}">前往配置</router-link>
						</div>
						<div class="text item">
							<p style="text-align: center; font-weight: bold;">{{text2}}</p>
							<el-progress :text-inside="true" :stroke-width="18" :percentage="percent2" :status="status2"></el-progress>
						</div>
					</el-card>
				</el-col>
				<el-col :span="8">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span style="line-height: 36px;">移动源</span>
							<el-popover ref="popover3" placement="bottom" width="160" v-model="visible3">
								<p>确定开始计算吗？</p>
								<div style="text-align: right; margin: 0">
									<el-button size="mini" type="text" @click="visible3 = false">取消</el-button>
									<el-button type="primary" size="mini" @click="visible3 = false; calculate(3);">确定</el-button>
								</div>
							</el-popover>
							<el-select v-model="typeid" placeholder="" style="width:50%;">
								<el-option
							      v-for="item in typelist"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							</el-select>
							<el-button style="float: right;" type="primary" size="small" v-popover:popover3>点击计算</el-button>
						</div>
						<div class="text item">
							<span class="fa fa-volume-up" style="color:deepskyblue;margin-right: 10px;"></span>步骤一：审核填报。
							<router-link :to="{path:'/goverment'}">前往审核</router-link>
						</div>
						<div class="text item">
							<span class="fa fa-volume-up" style="color:deepskyblue;margin-right: 10px;"></span>步骤二：配置因子。
							<router-link :to="{path:'/vehiclefactor'}">前往审核</router-link>
						</div>
						<div class="text item">
							<span class="fa fa-volume-up" style="color:deepskyblue;margin-right: 10px;"></span>注意：机动车的计算,请确保以下工作：
							<p style="margin-left:30px">1.上传机动车保有量数据表格并导入。</p>
							<p style="margin-left:30px">2.上传机动车的排放因子表格并导入。</p>
						</div>
						<div class="text item">
							<p style="text-align: center; font-weight: bold;">{{text3}}</p>
							<el-progress :text-inside="true" :stroke-width="18" :percentage="percent3" :status="status3"></el-progress>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</el-form>
	</div>
	</div>
</template>
<script>
	import { state, actions } from 'src/store'
	import api from 'src/api'
	import _ from 'lodash'
	import { Message } from 'element-ui';

	export default {
		components: {},
		data() {
			return {
				percent1: 0,
				percent2: 0,
				percent3: 0,
				status1: "success",
				status2: "success",
				status3: "success",
				text1: "",
				text2: "",
				text3: "",
				visible1: false,
				visible2: false,
				visible3: false,
				state: state,
				yid: state.watchyear,
				typeid:'2',
				typeid0:'2',
				typelist:[
				{
					label:'市级计算',
					value:'2'
				},
				{
					label:'省级计算',
					value:'1'
				},
				]
			}
		},
		computed: {},
		watch: {
			'state.watchyear': {
				handler: function(val, oldVal) {
					this.yid = val
				},
				deep: true
			}
		},
		methods: {
			selectyear: function() {
				this.fillyear = this.yid
			},
			calculate: function(w) {
				var vm = this;
				switch(w) {
					case 1:
						api.setting.getresult(vm.yid).then(function() {
							vm.checkstatus1();
						}, (bad) => {
							vm.$message.error(bad);
						});
						break;
					case 2:
						api.setting.getcompute(vm.yid,vm.typeid0).then(function() {
							vm.checkstatus2();
						}, (bad) => {
							vm.$message.error(bad);
						});
						break;
					case 3:
						api.setting.getmotor(vm.yid,vm.typeid).then(function() {
							vm.checkstatus3();
						}, (bad) => {
							vm.$message.error(bad);
						});
						break;
				}
			},
			cresult: function(res, num) {
				var vm = this;
				if(res.data.process == null)
					res.data.process = 0;

				var status = eval("(this.status" + num + ")");
				var text = eval("(this.text" + num + ")");

				if (typeof(res.data.process) == "undefined" || (res.data.process > 0 && res.data.process < 100)) {
					eval("this.percent" + num + " = res.data.process");
					eval("this.status" + num + " = 'success'");
					eval("this.text" + num + " = '正在计算...'");
					return true;
				} else if(res.data.process >= 100) {
					eval("this.percent" + num + " = res.data.process");
					eval("this.status" + num + " = 'success'");
					eval("this.text" + num + " = '计算完成'");
					return false;
				} else if(res.data.process < 0) {
					eval("this.percent" + num + " = 0");
					eval("this.status" + num + " = 'exception'");
					eval("this.text" + num + " = '计算失败'");
					return false;
				} else if (res.data.process == 0) {
					return false;
				}
				return false;
			},
			checkstatus1: function() {
				var vm = this;
				api.setting.getstatus(vm.yid).then((res) => {
					var ret = vm.cresult(res, 1);
					if(vm.isme() && ret)
						vm.timeout1 = setTimeout(vm.checkstatus1, 2000);
				}, (bad) => {
					vm.$message.error(bad);
				});
			},
			checkstatus2: function() {
				var vm = this;
				api.setting.getcomputestatus(vm.yid,vm.typeid0).then((res) => {
					var ret = vm.cresult(res, 2);
					if(vm.isme() && ret)
						vm.timeout2 = setTimeout(vm.checkstatus2, 2000);
				}, (bad) => {
					vm.$message.error(bad);
				});
			},
			checkstatus3: function() {
				var vm = this;
				api.setting.getstatusMotor(vm.yid,vm.typeid).then((res) => {
					var ret = vm.cresult(res, 3);
					if(vm.isme() && ret)
						vm.timeout3 = setTimeout(vm.checkstatus3, 2000);
				}, (bad) => {
					vm.$message.error(bad);
				});
			},
			isme: function() {
				if(this.$route.path == "\/result")
					return true;
				return false;
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.checkstatus1();
				this.checkstatus2();
				this.checkstatus3();
			})
		}
	}
</script>
<style scoped>
	.item {
		padding: 18px 0;
	}
</style>