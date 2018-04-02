<template>
  <div id="fuelset">
    <h3>查询与导出污染物统计结果</h3>
    <el-row :gutter="10" style="margin-bottom:10px;">
        <!--<el-col :span="4">
            <el-select v-model='yid'>
              <el-option
                v-for="y in state.yearlist"
                :label="y"
                :value="y">
              </el-option>
            </el-select>
        </el-col>-->
        
        <el-col :span="4">
          <el-select v-model='deviceSerial'>
            <el-option value="" label="全部"></el-option>
            <el-option value="G" label="锅炉"></el-option>
            <el-option value="Y" label="窑炉"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
            <el-select v-model='month'>
              <el-option value="" label="全年"></el-option>
              <el-option
                v-for="y in 12"
                :label="y"
                :value="y">
                {{y}}月
              </el-option>
            </el-select>
        </el-col>
         <el-col :span="5">
            <el-input v-model="companyName"  placeholder="请输入企业名称"></el-input>
        </el-col>
         <el-col :span="5">
            <el-input v-model="productName" icon="search" :on-icon-click="search" placeholder="输入产品名关键字"></el-input>
        </el-col>
    </el-row> 
    <el-row :gutter="10" style="margin-bottom:10px;" >
      <el-col :span="6">
        <el-cascader
          placeholder="请选择地区"
          :options="state.districtlist"
          v-model="districts"
          change-on-select
        ></el-cascader>
      </el-col>
       
      <el-col :span="6">
        <el-cascader 
          placeholder="请选择行业"
          :options="state.tradelist"
          :show-all-levels="false"
          v-model="trades"
          change-on-select
        ></el-cascader>
      </el-col>
      <el-col :span="6">
          <el-select placeholder="请选择污染物" v-model='pollutantId'>
            <el-option
              v-for="y in plist"
              :label="y.pollutantName"
              :value="y.id">
              {{y.pollutantName}}&nbsp;————{{y.groupname}}
            </el-option>
          </el-select>
      </el-col>
      
     
        <el-col :span="6">
          <el-button  @click='search' icon="search" type="primary">搜索</el-button>
          <a  href="/apserver/details/excelport" class="el-button el-button--primary" type="primary" style="text-decoration:none;margin-left: 1em;margin-bottom: 5px;">导出数据</a>
        </el-col>
    </el-row> 
    <el-tabs v-model="showpage" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(t,index) in tabhead" :label="t" :name="(index)+''">

      </el-tab-pane>
    </el-tabs>
    <el-table
      v-loading.body="isloading"
      element-loading-text="拼命加载中"
      :data="state.showlist"
      border>
      <el-table-column
        v-for="item in orderedHeadList"
        :label="item.name"
        :prop="thead.headitem[item.order]"
        width="150"
        >
      </el-table-column>
    </el-table>
    <my-pagination></my-pagination>
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
      state: state,
      action: actions,
    	companyName:'',
      districts:[],
      trades:[],
      deviceSerial:'',
      productName:'',
      pollutantId:'',
      month:'',
      showprogress: false,
      yearlist:[],
      adsearch:false,
      list:[],
      uselist:[],
      showlist:[],
      plist:[],
      showexport:false,
      startyear: state.watchyear,
      thead : {
          headitem:[ 
          'companyName',
          'deviceName',
          'districtName2',
          'month',
          'productName',
          'materialName',
          'fuelName',
          'pollutantName',
          'statvalue',
          'tradeName',
          'exp',
          'factor',
          'valtype',
          'value',
          'dsrate'],
          headname:[
          '企业名称',
          '设备名称',
          '所属地区',
          '月份',
          '产品名称',
          '原料名称',
          '燃料名称',
          '污染物名',
          '污染物值',
          '所属行业',
          '计算公式',
          '因子值',
          '计算说明',
          '填写的值',
          '去除效率']           
        },
        theadtype : {
          companyName:{name:'企业名称',order:0},
          deviceName:{name:'设备名称',order:1},
          districtName2:{name:'所属地区',order:2},
          month:{name:'月份',order:3},
          productName:{name:'产品名称',order:4},
          materialName:{name:'原料名称',order:5},
          fuelName:{name:'燃料名称',order:6},
          pollutantName:{name:'污染物名',order:7},
          statvalue:{name:'污染物值',order:8},
          tradeName:{name:'所属行业',order:9},
          exp:{name:'计算公式',order:10},
          factor:{name:'因子值',order:11},
          valtype:{name:'计算说明',order:12},
          value:{name:'填写的值',order:13},
          dsrate:{name:'去除效率',order:14},
        },
        theadlist:[],
        tabhead:[],
        showpage:0,
        isloading: false               		
  	}
  },
  computed: {
    orderedHeadList () {
      console.log(this.theadlist)
      let list = []
      list = _.cloneDeep(this.theadlist)
      //console.log(list)
      function sort (a,b) {
        return a.order - b.order
      }
      list.sort(sort)
      console.log(list)
      return list
    },
    tradeList () {
      console.log(this.state.tradelist)
      let list = []
      _.forEach(this.state.tradelist,function(t){
        let childlist = []
        _.forEach(t.children,function(ch){
          childlist.push({
            label:ch.label,
            value:ch.value
          })
        })
        list.push({
          label:t.label,
          value:t.value,
          children:childlist
        })
      })
      return list
    }
  },
  watch: {
    showpage: function(newValue, oldValue) {
      console.log(newValue)
      this.changelist(parseInt(newValue));
    },
    'state.listnow' (newValue, oldValue) {
      console.log(newValue)
      this.action.setShowList(this.uselist)
    },
    'state.watchyear':{
		   handler: function (val, oldVal) {
		      this.startyear = val
		  	},
		    deep: true
		 }
  },
  methods: {
    
    handleClick(data) {
      //console.log(data)
      //this.changelist(parseInt(data.name))
    },
  	search () { 
      this.isloading = true
      console.log('dianji')              
      var vm = this;
      vm.showprogress = true;

      let rdata = {
        fillyear:this.startyear,
        districtId1:this.districts[0] || '',
        districtId2:this.districts[1] || '',
        districtId3:this.districts[2] || '',
        tradeId1:this.trades[0] || '',
        tradeId2:this.trades[1] || '',
        tradeId3:this.trades[2] || '',
        tradeId4:this.trades[3] || '',
        companyName:this.companyName,
        deviceSerial:this.deviceSerial,
        productName:this.productName,
        pollutantId:this.pollutantId,
        month:this.month,
        choose:1
      }
      api.analyze.searchpollution(JSON.stringify(rdata)).then(function(res){
        if (res.data.status===0) {
          vm.showprogress = false
          vm.tabhead = [];
          console.log(res.data.details[0]);
          vm.list = res.data.details[0];
          //console.log(res.data.details[0].products);
          if(res.data.details[0].devices && res.data.details[0].devices.length > 0){
            vm.tabhead.push('设备')
          }
          if(res.data.details[0].products && res.data.details[0].products.length > 0){
            vm.tabhead.push('产品')
          }          
          vm.changelist(0);
          vm.showpage = '0'
        }
        vm.isloading = false
        vm.showexport = true
      })                  
    },
    changelist:function(a){
    	console.log(this.tabhead)
      this.theadlist = []
      if (this.list.products || this.list.devices){
        if(this.tabhead.length > 1){
          if (a === 1) {
              this.uselist = this.list.products;
          }else{
              this.uselist = this.list.devices; 
          } 
        }else{
        	//console.log(111)
          if(this.list.devices.length){
              this.uselist = this.list.devices; 
          }else{
              this.uselist = this.list.products;
          }
        }
        //console.log(this.uselist)
        this.action.setShowList(this.uselist,1);
        
        for(var item in this.uselist[0]){
          this.theadlist.push(this.theadtype[item])
        }
        //console.log(this.theadlist)
      } 
    },

    show:function(){
        this.adsearch = !this.adsearch;
    },
    selectyear:function(){
        //console.log(this.yid)
    },
    orderKey:function(a,b){

        return this.theadtype[a.$key].order - this.theadtype[b.$key].order;
    },
    download:function(){
        api.download.proDevDetail().then(function(res){})
    }
  },
  mounted () {
    this.$nextTick(() => {
      var vm = this;
      api.staticinformation.getpollutant().then(function(res){
          console.log(res)
          vm.plist = res.data.pollutant;
      })

   })
  }
}
</script>
<style scoped>

</style>