<template>
  <div id="smallcompany">
  	<h3>小散企业填报审核</h3>
  	<el-row :gutter="20" style="margin-bottom:10px;">
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
      <el-col :span="5" v-if="state.roleId==1">
        <el-cascader
          :options="state.districtlist"
          v-model="district"
          change-on-select
          :show-all-levels="true"
          placeholder="选择地区"
          clearable>
        </el-cascader>
      </el-col>
      <el-col :span="5">
        <el-select v-model="search.num" placeholder="审核状态" >
         <el-option
            v-for="item in statuslist"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
      	<el-input v-model="search.companyName" placeholder="关键字">
        </el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" icon="search" @click="getall">搜索</el-button>        
      </el-col>
    </el-row>

    <el-row class="tabcss">
   	 <el-button type="success" @click="handlepass(checkvalue)" size="small">全部通过</el-button>
     <el-button type="danger"  @click="handleunpass(checkvalue)" size="small">全部不通过</el-button>
   </el-row>   
   <div class="mytable">
    <table v-loading.body="isloading"
      element-loading-text="拼命加载中">
      <thead>
        <tr>
          <th>
            <el-checkbox  v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
          </th>
          <th>企业名称</th>
          <th>工业总产值</th>
          <th>年生产时间</th>
          <th>年用电量</th>
          <th>燃料名</th>
          <th>燃料消耗量</th>
          <th>原料</th>
          <th>产品</th>
          <th>产品产量</th>         
          <th>锅炉编号</th>
          <th>锅炉规模</th>
          <th>锅炉型号</th>
          <th>锅炉燃料</th>
          <th>燃料消耗量</th>
          <th>投运时间</th>
          <th>脱硫工艺</th>
          <th>脱硝工艺</th>
          <th>除尘工艺</th>
          <th>有机物治理工艺</th>
        </tr>
      </thead>
      <tbody v-for="com in state.showlist">
        <tr v-for="i in height([com.dlist.length,com.plist.length,com.slist.length])">
          <td v-if = "i === 1" :rowspan="height([com.dlist.length,com.plist.length,com.slist.length])">
            <label class="el-checkbox" >
              <span :class="[ischeck[com.id]?'is-checked':'','el-checkbox__input']" >
                <span class="el-checkbox__inner" ></span>
                <input type="checkbox" :id="com.id" :value="com.id" v-model="checkvalue"/>
              </span>
            </label>
          </td>
          <td v-if = "i === 1" :rowspan="height([com.dlist.length,com.plist.length,com.slist.length])">
            <el-popover trigger="hover" placement="top">
              <p>{{ com.companyName }}<el-tag :type="statustype[com.clist.all_status].type">{{statustype[com.clist.all_status].label}}</el-tag></p>
              <p>联系人: {{ com.contact }}</p>
              <p>联系电话: {{ com.contactNo }}</p>
              <el-button  type="text" size="small" @click="handleEdit(com)">编辑</el-button>
              <el-button type="text" size="small" @click="handlepass(com.id)">通过</el-button>
              <el-button type="text" size="small" @click="handleunpass(com.id)" >不通过</el-button>
              <div slot="reference" class="name-wrapper">
                <el-tag :type="statustype[com.all_status].type">{{ com.companyName}}</el-tag>
              </div>
            </el-popover>
          </td> 
          <td v-if = "i === 1" :rowspan="height([com.dlist.length,com.plist.length,com.slist.length])">
            <p v-if="com.clist">{{com.clist.gdp}}(万元)</p>
          </td>
          <td v-if = "i === 1" :rowspan="height([com.dlist.length,com.plist.length,com.slist.length])">
            <p v-if="com.clist">{{com.clist.totalHour}}(小时)</p>
          </td :rowspan="height([com.dlist.length,com.plist.length,com.slist.length])">
          <td v-if = "i === 1" :rowspan="height([com.dlist.length,com.plist.length,com.slist.length])">
            <p v-if="com.clist">{{com.clist.totalElec}}(万千瓦时)</p>
          </td >
          <td >
            <p v-if = "i <= com.plist.length">{{com.plist[i-1].fuelName}}</p>
            <p v-else></p>
          </td>
          <td >
            <p v-if = "i <= com.plist.length">{{com.plist[i-1].fuelValue}}{{com.plist[i-1].fuelunit}}</p>
            <p v-else></p>
          </td>
          <td >
            <p v-if = "i <= com.plist.length">{{com.plist[i-1].materialName}}</p>
            <p v-else></p>
          </td>
          <td >
            <p v-if = "i <= com.plist.length">{{com.plist[i-1].productName}}</p>
            <p v-else></p>
          </td>
           <td >
            <p v-if = "i <= com.plist.length">{{com.plist[i-1].realOutput}}{{com.plist[i-1].productUnit}}</p>
            <p v-else></p>
          </td>          

          <td >
            <p v-if = "i <= com.dlist.length">{{com.dlist[i-1].deviceSerial}}</p>
            <p v-else></p>
          </td>
          <td >
            <p v-if = "i <= com.dlist.length">{{com.dlist[i-1].shippingTon}}(蒸吨/小时)</p>
            <p v-else></p>
          </td>
          <td >
            <p v-if = "i <= com.dlist.length">{{com.dlist[i-1].deviceModel}}</p>
            <p v-else></p>
          </td>
          <td >
            <p v-if = "i <= com.dlist.length">{{com.dlist[i-1].fuelName}}</p>
            <p v-else></p>
          </td>
          <td >
            <p v-if = "i <= com.dlist.length">{{com.dlist[i-1].fuelcost}}{{com.dlist[i-1].unit}}</p>
            <p v-else></p>
          </td>
          <td >
            <p v-if = "i <= com.dlist.length">{{com.dlist[i-1].serviceLife}}</p>
            <p v-else></p>
          </td>
          
          <td >
            <p v-if = "i <= com.slist.length">{{com.slist[i-1].techniqueName1}}</p>
            <p v-else></p>
          </td>
          <td >
            <p v-if = "i <= com.slist.length">{{com.slist[i-1].techniqueName2}}</p>
            <p v-else></p>
          </td>
          <td >
            <p v-if = "i <= com.slist.length">{{com.slist[i-1].techniqueName3}}</p>
            <p v-else></p>
          </td>
          <td >
            <p v-if = "i <= com.slist.length">{{com.slist[i-1].techniqueName4}}</p>
            <p v-else></p>
          </td>
        </tr>
      </tbody>
   </table>
   </div>
  <el-dialog
  :title="notes"
  class="fixz"
  :modal = "false"
  v-model="dialogVisible"
  size="large">
  <el-form  v-if="editdata.clist">
    <el-row :gutter= "10">
      <el-col :span="6">
        <el-form-item label="年生产总值" :label-width="formLabelWidth">
          <el-input v-model="editdata.clist.gdp" auto-complete="off"><template slot="append">万元</template></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="年生产时间" :label-width="formLabelWidth">
          <el-input v-model="editdata.clist.totalHour" auto-complete="off"><template slot="append">小时</template></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="年用电量" :label-width="formLabelWidth">
          <el-input v-model="editdata.clist.totalElec" auto-complete="off"><template slot="append">万千瓦时</template></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-table
      v-if="editdata.plist.length > 0"
      :data="editdata.plist"
      stripe
      style="width: 100%">
        <el-table-column
        label="原料名称"
        >
        <template scope="scope">
          <el-input v-model="scope.row.materialName"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="产品"
        width="180">
        <template scope="scope">
          <el-input v-model="scope.row.productName"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="产量">
        <template scope="scope">
          <el-input v-model="scope.row.realOutput"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="单位">
        <template scope="scope">
          <el-input v-model="scope.row.productUnit"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="editdata.plist.length > 0"
      :data="editdata.plist"
      stripe
      style="width: 100%">
       <el-table-column
        label="燃料">
        <template scope="scope">
          <el-select v-model="scope.row.fuelId">
            <el-option v-for="m in fuellist" :label="m.name" :value="m.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="燃料计量单位">
        <template scope="scope">
          <el-input v-model="scope.row.fuelunit"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="燃料消耗量"
        >
        <template scope="scope">
          <el-input v-model="scope.row.fuelValue"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="editdata.dlist.length > 0"
      :data="editdata.dlist"
      stripe
      style="width: 100%">
      <el-table-column
        label="锅炉编号"
        width="180">
        <template scope="scope">
          <el-input v-model="scope.row.deviceSerial"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="锅炉规模">
        <template scope="scope">
          <el-input v-model="scope.row.shippingTon"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="锅炉型号">
        <template scope="scope">
          <el-input v-model="scope.row.deviceModel"></el-input>
        </template>
      </el-table-column>
      <!--<el-table-column
        label="锅炉类型">
        <template scope="scope">
          <el-cascader
            :options="devtype"
            v-model="scope.row.devs"
            @active-item-change="changedev">
          </el-cascader>
        </template>
      </el-table-column>-->
      <el-table-column
        label="燃料">
        <template scope="scope">
          <el-cascader
            :options="ftype"
            v-model="scope.row.fuels"
            >
          </el-cascader>
        </template>
      </el-table-column>
      <el-table-column
        label="燃料消耗量">
        <template scope="scope">
          <el-input v-model="scope.row.fuelcost"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="投运时间">
        <template scope="scope">
          <el-input v-model="scope.row.serviceLife"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="editdata.slist.length > 0"
      :data="editdata.slist"
      stripe
      style="width: 100%">
      <el-table-column
        label="脱硫工艺">
        <template scope="scope">
          <el-select v-model="scope.row.technique1">
            <el-option v-for="m in m1" :label="m.name" :value="m.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="脱硫工艺">
        <template scope="scope">
          <el-select v-model="scope.row.technique2">
            <el-option v-for="m in m2" :label="m.name" :value="m.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="脱硫工艺">
        <template scope="scope">
          <el-select v-model="scope.row.technique3">
            <el-option v-for="m in m3" :label="m.name" :value="m.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="脱硫工艺">
        <template scope="scope">
          <el-select v-model="scope.row.technique4">
            <el-option v-for="m in m4" :label="m.name" :value="m.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
 <div slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="save">保 存</el-button>
  </div>
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
     
      checkAll:false,
      dialogVisible:false,
      checkvalue:[],
      isloading:false,
      search: {
      	fillyear: state.watchyear,
      	companyName:  null,
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
      statustype:{'0':{label:'未填报',type:'danger'},'1':{label:'未提交',type:'danger'},'2':{label:'待审核',type:'warning'},'3':{label:'通过',type:'success'}},
      statuslist:[{id:0,name:'所有'},{id:1,name:'未审核'},{id:2,name:'待审核'},{id:3,name:'已审核'}],
      editdata:{},
      m1:[],
      m2:[],
      m3:[],
      m4:[],
      devtype:[],
      ftype:[],
      trade:[],
      district:[],
      notes:'',
      formLabelWidth:'120px',
      fuellist:[],
      companyId:''
    }
  },
  computed: {
    ischeck() {
      let list = {}
      _.forEach(this.checkvalue,function(o){
        list[o] = o
      })
      console.log(list)
      return list
    }
  },
  watch: {
    'district'(list){
  		console.log(list)
  		this.search.province = list[0]
  		this.search.city = list[1]
  		this.search.town = list[2]
  	},
  	'trade'(list) {
    	console.log(list)
    	this.search.tradeid = list[0]
    	this.search.tradeid2 = list[1]
    	this.search.tradeid3 = list[2]
    	this.search.tradeid4 = list[3]
    },
    'state.listnow' (newValue, oldValue) {
      this.action.setShowList(this.recordlist)
    },
    'state.watchyear':{
		    handler: function (val, oldVal) {
		    	this.search.fillyear = val
		  	},
		    deep: true
		  }
  },
  methods: {
    handleCheckAllChange(event){
      let vm = this
      this.checkvalue = []
      if (event.target.checked) {
        _.forEach(this.state.showlist,function(s){
          vm.checkvalue.push(s.id)
        })
      }
    },
    height(list) {
      let maxlength = _.max(list)
      return (maxlength || 1)
    },
		getall() {
			   this.isloading = true
				api.creport.getAllsmallcompany(this.search).then((res) => {
					console.log(res)
					if (res.data.status == 0&&res.data.list) {
						this.isloading = false
						this.recordlist = res.data.list
						this.action.setShowList(this.recordlist)
					} else{
						this.$message.error(res.data.msg)
					}
				})
		},
		handleEdit(com) {
			this.dialogVisible = true
			this.notes = '编辑企业：'+ com.companyName
			console.log(com)
      this.editdata = com
      for (var i = this.editdata.dlist.length - 1; i >= 0; i--) {
        this.$set(this.editdata.dlist[i],'devs',[this.editdata.dlist[i].deviceTypeId])
        if (this.editdata.dlist[i].deviceTypeId2 !== 0) {
          this.editdata.dlist[i].devs.push(this.editdata.dlist[i].deviceTypeId2)
        }
        this.$set(this.editdata.dlist[i],'fuels',[this.editdata.dlist[i].fuelId2,this.editdata.dlist[i].fuel])
      };
		},
		handlepass(id) {
	      console.log(id)
	      if(id.length){
	      	this.companyId = id
	      } else{
	      	this.companyId = [id]
	      }
	      var vm = this;
	      api.creport.companychecked(JSON.stringify({
	        fillyear:this.search.fillyear,
	        companyId:this.companyId
	      })).then((res) => {
	        if (res.data.status == 0) {
	          vm.$message({
	            type: 'success',
	            message: '成功!'
	          });
	          vm.checkvalue= []
	          vm.getall();
	        } else {
	          vm.$message.error(res.data.msg)
	        }
	      })
		},
		handleunpass(id) {
		 console.log(id)
		    if(id.length){
	      	this.companyId = id
	      } else{
	      	this.companyId = [id]
	      }
	      var vm = this;
	      api.creport.companyrollback(JSON.stringify({
	        fillyear:this.search.fillyear,
	        companyId:this.companyId
	      })).then((res) => {
	        if (res.data.status == 0) {
	          vm.$message({
	            type: 'success',
	            message: '成功!'
	          });
	          vm.checkvalue= []
	          vm.getall();
	        } else {
	          vm.$message.error(res.data.msg)
	        }
	      })
		},
		save() {
			console.log(this.editdata)
			var vm = this
      _.forEach(this.editdata.dlist,function(d){
        d.deviceTypeId = d.devs[0]
        if (d.devs[0] === 1001) {
           d.deviceTypeId2 = d.devs[1]
        }
        d.fuel = d.fuels[1]
        delete d.devs
        delete d.fuels
      })
      this.editdata.fillyear = this.search.fillyear
      console.log(JSON.stringify(this.editdata))
			api.creport.updateSmallCom(JSON.stringify(this.editdata)).then((res) => {
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
        vm.dialogVisible = false
			})
		},
    changedev(value){
      console.log(value)
    }
	},
	mounted() {
		this.$nextTick(() => {// 代码保证 this.$el 在 document 中
			if(this.state.roleId>1){
	       	 this.district = [1,this.state.cityId]
	       } else{
	         this.district = []
	       }
	      this.getall()
	      let vm = this
	      api.staticinformation.getbypid(5001).then((res)=>{if(res.data.status === 0){vm.m1 = res.data.staticlist}})
	      api.staticinformation.getbypid(5002).then((res)=>{if(res.data.status === 0){vm.m2 = res.data.staticlist}})
	      api.staticinformation.getbypid(5003).then((res)=>{if(res.data.status === 0){vm.m3 = res.data.staticlist}})
	      api.staticinformation.getbypid(5005).then((res)=>{if(res.data.status === 0){vm.m4 = res.data.staticlist}})
	      api.staticinformation.getGroupList(2).then((res)=>{if(res.data.status === 0){console.log(res);vm.ftype = res.data.list}})
	      api.staticinformation.getGroupList(1).then((res)=>{if(res.data.status === 0){console.log(res);vm.devtype = res.data.list}})
	      api.staticinformation.getfuel().then((res)=>{if(res.data.status === 0){vm.fuellist = res.data.staticlist}})
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
.myclass {
  overflow-x:auto; 
}
td {white-space: nowrap}
.el-checkbox__input input{
    opacity: 0;
    outline: 0;
    position: absolute;
    margin: 0;
    left: -999px;
}
.fixz {
  z-index: 2002 !important;
}
</style>
