<template>
  <div id="smallcompany">
  	<el-row :gutter="20" style="margin-bottom:10px;">
      <el-col :span="3">
        <el-select v-model="search.fillyear" placeholder="年份">
         <el-option
            v-for="item in state.yearlist"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-cascader
          :options="state.tradelist"
          v-model="trade"
          change-on-select
          :show-all-levels="false"
          placeholder="选择行业"
          clearable
          ></el-cascader>
      </el-col>
      <el-col :span="5">
        <el-cascader
          :options="state.districtlist"
          v-model="district"
          change-on-select
          :show-all-levels="false"
          placeholder="选择地区"
          clearable
          ></el-cascader>
      </el-col>
      <el-col :span="3">
        <el-select v-model="search.num" placeholder="审核状态" >
         <el-option
            v-for="item in statuslist"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
      	<el-input v-model="keyword" placeholder="关键字">
        </el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" icon="search" @click="getall">搜索</el-button>        
      </el-col>
    </el-row>
    
    <el-row :gutter="0">
    	<el-col :span="7">
		    <div id="tree" style="height: 700px; overflow: auto;">
		    	<el-input
					  placeholder="关键字过滤"
					  v-model="filterText">
					</el-input>
					<el-tree
					  class="filter-tree"
					  :data="treedata"
					  :props="defaultProps"
					  accordion
					  node-key="id"
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
		    </div>
	    </el-col>
    </el-row>
    
    
  <el-table :data="state.showlist"  @selection-change="handleSelectionChange" ref="multipleTable" stripe tooltip-effect="dark">
    <el-table-column type="selection" width="65">
    </el-table-column>
    <el-table-column label="小散企业填报详情">
    	<template scope="scope">
    		<el-card class="box-card">
    			<el-form :model="scope.row" label-width="100px">
    				<el-row>
							<el-col :span="8">
								<el-form-item label="企业名称">
									<el-input v-model="scope.row.companyName" size="small"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="联系人">
									<el-input v-model="scope.row.name" size="small"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="联系电话">
									<el-input v-model="scope.row.contact" size="small"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="6">
								<el-form-item label="工业总产值">
									<el-input v-model="scope.row.clist.gdp" size="small"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="年生产时间">
									<el-input v-model="scope.row.clist.totalHour" size="small"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="年用电量">
									<el-input v-model="scope.row.clist.totalElec" size="small"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
    			</el-form>
    		</el-card>
    	</template>
    </el-table-column>
    <!--
    <el-table-column
      label="工业总产值"
      >
      <template scope="scope">
      	<span v-if="scope.row.clist">{{scope.row.clist.gdp}}(万元)</span>
      	<span v-else></span>
      </template>
    </el-table-column>
    <el-table-column
      label="年生产时间"
      >
      <template scope="scope">
      	<span v-if="scope.row.clist">{{scope.row.clist.totalHour}}(小时)</span>
      	<span v-else></span>
      </template>
    </el-table-column>
    <el-table-column
      label="年用电量"
      >
      <template scope="scope">
      	<span v-if="scope.row.clist">{{scope.row.clist.totalElec}}(万千瓦时)</span>
      	<span v-else></span>
      </template>
    </el-table-column>
    <el-table-column
      label="燃料"
      >
      <template scope="scope">
      	<tr v-for="(line,index) in scope.row.plist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.fuelName}}
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="燃料计量单位"
      >
      <template scope="scope">
      	<tr v-for="(line,index) in scope.row.plist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.fuelunit}}
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="燃料消耗量"
      >
      <template scope="scope">
      	<tr v-for="(line,index) in scope.row.plist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.fuelValue}}
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="原料"
      >
      <template scope="scope">
      	<tr v-for="(line,index) in scope.row.plist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.materialName}}
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="产品"
      >
      <template scope="scope">
      	<tr v-for="(line,index) in scope.row.plist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.productName}}
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="产品计量单位"
      >
      <template scope="scope">
      	<tr v-for="(line,index) in scope.row.plist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.productUnit}}
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="产品产量"
      >
      <template scope="scope">
      	<tr v-for="(line,index) in scope.row.plist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.realOutput}}
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="锅炉编号"
      >
      <template scope="scope">
      	<tr v-for="(line,index) in scope.row.dlist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.deviceSerial}}
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="锅炉规模"
      >
      <template scope="scope">
      	<tr v-for="(line,index) in scope.row.dlist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.shippingTon}}(蒸吨/小时)
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="锅炉型号"
      >
       <template scope="scope">
      	<tr v-for="(line,index) in scope.row.dlist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.deviceModel}}(蒸吨/小时)
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="锅炉燃料"
      >
      <template scope="scope">
      	<tr v-for="(line,index) in scope.row.dlist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.fuelName}}
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="燃料单位"
      >
      <template scope="scope">
      	<tr v-for="(line,index) in scope.row.dlist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.unit}}
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="燃料消耗量"
      >
       <template scope="scope">
      	<tr v-for="(line,index) in scope.row.dlist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.fuelcost}}
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="投运时间"
      >
      <template scope="scope">
      	<tr v-for="(line,index) in scope.row.dlist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.serviceLife}}
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="脱硫工艺"
      >
      <template scope="scope">
      	<tr v-for="(line,index) in scope.row.slist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.techniqueName1}}
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="脱硝工艺"
      >
      <template scope="scope">
      	<tr v-for="(line,index) in scope.row.slist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.techniqueName2}}
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="除尘工艺"
      >
       <template scope="scope">
      	<tr v-for="(line,index) in scope.row.slist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.techniqueName3}}
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      label="有机物治理工艺"
      >
       <template scope="scope">
      	<tr v-for="(line,index) in scope.row.slist" style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
	      	<td style="border-bottom:1 px solid #C8C8C8;background:rgba(0, 0, 0, 0);">
          	{{line.techniqueName4}}
           </td>
        </tr>
      </template>
    </el-table-column>
    <el-table-column
      label="状态"
      >
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="150"
      >
      <template scope="scope">
        <el-button  type="text" size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
        <el-button type="text" size="small" @click="handlepass(scope.$index,scope.row)">通过</el-button>
        <el-button type="text" size="small" @click="handleunpass(scope.$index,scope.row)" >不通过</el-button>
      </template>
    </el-table-column>
    -->
  </el-table>
  <el-dialog
  :title="notes"
  :visible.sync="dialogVisible"
  size="large"
  :before-close="handleClose">
 <el-table
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column
      prop="date"
      label="日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table>
</el-dialog>
  <my-pagination></my-pagination>
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
      props1:{
        label: 'label',
        value: 'value',
       children: 'children'
    },
    tableData: [],
    dialogVisible:false,
    search: {
	fillyear: 2015,
	companyName: '',
	num: 0,
	province: '',
	city: '',
	town: '',
	tradeid: '',
	tradeid2: '',
	tradeid3: '',
	tradeid4: '',
	notes: ''
  }, 
  isapply: false,
	props2: {
		label:'label',
        value: 'value',
        children: 'children'      	
      },
      multipleSelection: [],
      statuslist:[{id:0,name:'所有'},{id:1,name:'未审核'},{id:2,name:'待审核'},{id:3,name:'已审核'}],
      trade:[],
      district:[],
    }
  },
  computed: {
  },
  watch: {
    'trade'(list){
  		console.log(list)
  		this.search.province = list[0]
  		this.search.city = list[1]
  		this.search.town = list[2]
  	},
  	'district'(list) {
	console.log(list)
	this.search.tradeid = list[0]
	this.search.tradeid2 = list[1]
	this.search.tradeid3 = list[2]
	this.search.tradeid4 = list[3]
},
},
methods: {
		getall() {
			api.creport.getAllsmallcompany(this.search).then((res) => {
				console.log(res)
				if (res.data.status == 0) {
					this.showdata = true
					this.recordlist = res.data.list
					this.action.setShowList(this.recordlist)
				}
			})
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		handleEdit(index, row) {
			this.dialogVisible = true
			this.notes = '编辑企业：'+ row.companyName
			console.log(index, row)
		},
		handlepass(index, row) {

		},
		handleunpass(index, row) {

		},
		save() {
			console.log(this.recordlist)
			var vm = this
			api.creport.companyFill(JSON.stringify({
				list: this.recordlist
			})).then((res) => {
				if (res.data.status == 0) {
					vm.$message({
						type: 'success',
						message: '修改成功!'
					});
					vm.isedit = false
					vm.getall();
				} else {
					vm.$message.error(res.data.msg)
				}
			})
		},
	},
	mounted() {
		this.$nextTick(() => {// 代码保证 this.$el 在 document 中
      this.getall()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
.redtext {
  color: red;
}
.big {
  font-size: 140%;
}
.pull-right span{
	cursor: pointer;
}
.box-card{
	margin-bottom: 10px;
}
.el-card__body{
	padding:10px;
}
.tabcss{
	margin:10px;
}
</style>
