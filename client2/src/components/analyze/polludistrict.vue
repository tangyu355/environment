<template>
  <div id="home">
    <h3>污染物地域分布统计图</h3>
    <el-row :gutter="20" style="margin-bottom:10px;">
      <el-col :span="5">
        <el-cascader
          :options="state.tradelist"
          v-model="trade"
          change-on-select
          :show-all-levels="false"
          placeholder="请选择行业"
          ></el-cascader>
      </el-col>
      <el-col :span="5">
        <el-select v-model="search.pollutantid" placeholder="请选择污染物">
         <el-option
            v-for="item in plist"
            :label="item.pollutantName"
            :value="item.id">
          </el-option>
        </el-select>

      </el-col>
      <el-col :span="5">
        <el-radio-group v-model="search.type">
          <el-radio-button label="year" >年</el-radio-button>
          <el-radio-button label="season">季度</el-radio-button>
          <el-radio-button label="month">月</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="3">
        <el-select v-model="search.startyear" v-if="search.type === 'year'">
         <el-option
            v-for="item in state.yearlist"
            :label="item"
            :value="item">
          </el-option>
        </el-select>

      </el-col>

      <el-col :span="3" v-if="search.type === 'year'">
        <el-select v-model="search.endyear">
         <el-option
            v-for="item in state.yearlist"
            :label="item"
            :value="item">
          </el-option>
         </el-select>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" icon="getdata" @click="getdata">搜索</el-button>        
      </el-col>
    </el-row>
    <div id="map" style="width:100%;height:600px;"></div>
    <!--<div id="Bmap" style="width:100%;height:600px;" v-loading="loading" element-loading-text="地图加载中..." v-show="!showdetail"></div>-->
    <!--<div id="legend"><span id="min"></span><span id="max"></span><p id="indicate"><i id="indicator"></i></p></div>-->
  </div>
</template>

<script>
import 'src/lib/sichuan'
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
      echarts: '',
      loading: true,
      showdetail: false,
      mymap: '',
      search: {
        startyear: state.watchyear,
        endyear: state.watchyear,
        tradeid: 1,
        pollutantid: 1,
        type: 'month'
      },
      timelist: [],
      valuedata: [],
      maxvalue: '',
      mapname: 'sichuan' ,
      plist:[],
      trade:[132]
    }
  },
  computed: {
    typename () {
      let vm = this
      console.log(_.find(this.plist,{'id':this.search.pollutantid}).pollutantName)
      return _.find(this.plist,{'id':this.search.pollutantid}).pollutantName
    },
    option () {
      let vm = this
      let ob = {
        baseOption: {  

          timeline: {   
            autoPlay: true,  
            playInterval: 3000,  
            symbol: 'diamond',
            symbolSize: 12,
            right:'5%',
            left:'10%',
            lineStyle: {
              width: 1,
              type:'dashed'
            },
            checkpointStyle:{
              symbol:'diamond',
              symbolSize: 12,
            },
            itemStyle :{
              normal:{
                color: '#fff',
                borderColor :'#304654',

              }
            },
            data: vm.timelist,
          },  
          grid: { containLabel: true },  
          
          //tooltip: {}  
        },  
        options:vm.options
      }
      return ob
    },
    options () {
      let vm = this
      let list = []
      _.forEach(this.valuedata, function(t) {
        let ob = {
          color: ['red'],
          visualMap: {
            type:'piecewise',
            splitNumber: 9,
            bottom:'10%',
            inRange: {
              color: ['#4caf50','yellow', 'orangered'],
            },
            maxOpen:true           
          },
          tooltip: {
            trigger: 'item'
          },
          geo: {
            map: vm.mapname,
            roam: true,
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: 'rgba(255,255,255,1)'
                }
              }
            },
            itemStyle: {
              normal:{
                borderColor: 'rgba(0, 0, 0, 0.2)'
              },
              emphasis:{
                areaColor: null,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          series: [{
            type:'map',
            name: vm.typename,
            map:vm.mapname,
            geoIndex: 0,
            roam:true,
            
            data: vm.getshowdata(vm.mapname)[t.value]
          }]
        }
        ob.visualMap.max = parseInt(vm.maxvalue/9) * 9
        list.push(ob)
      })
      return list
    }
  },
  watch: {
    '$route': 'fetchData',
    'state.watchyear':{
    	handler: function (val, oldVal) {
    		console.log(val)
  			this.search.startyear = val
  		},
      deep: true
    }
  },
  methods: {
    getpoint (name) {
      let vm =this
      let data = {}
        _.forEach(this.valuedata,function(t){
          data[t.value] = []
          _.forEach(t.list,function(city){
            if (city.name === name || name === 'sichuan') {
              _.forEach(city.pointList,function(p) {
                data[t.value].push({value:[p.e_point,p.n_point,p.value],name:p.enterpriseName})
              })
            }
          })
        })
        console.log(data)
      return data
    },
    getshowdata(name){
      let vm =this
      let data = {}
      if (name === 'sichuan') {

        vm.maxvalue = 0
        _.forEach(this.valuedata,function(t){
          data[t.value] = []
          _.forEach(t.list,function(city){
            data[t.value].push({value: parseFloat(city.value.toFixed(2)),name:city.name})
          })
          if (_.maxBy(data[t.value],'value').value > vm.maxvalue) {
            vm.maxvalue = _.maxBy(data[t.value],'value').value
          }
        })

      } else {
        vm.maxvalue = 0
        _.forEach(this.valuedata,function(t){
          data[t.value] = []
          _.forEach(t.list,function(city){
            if (city.name === name) {
              _.forEach(city.list,function(town) {
                data[t.value].push({value:parseFloat(town.value.toFixed(2)),name:town.name})
              })
              if (_.maxBy(data[t.value],'value').value > vm.maxvalue) {
                vm.maxvalue = _.maxBy(data[t.value],'value').value
              }
            }
          })
        })
      }
      return data
    },
    showmap (name) {
      let vm = this
      this.mapname = name
    },
    getdata () {
      let vm = this
      if (this.search.type === 'year') {
        if (this.search.endyear <= this.search.staryear ) {
          this.$message.error('时间范围错误，请选择正确的查询年份！')
          return false
        }
      } else {
        this.search.endyear = this.search.startyear
      }
      this.search.tradeid = _.last(this.trade)
      api.analyze.getgisdata(JSON.stringify(this.search)).then((res) => {
        if (res.data.status === 0) {
          console.log(res.data)
          vm.valuedata = res.data.list
          vm.timelist = []
          _.forEach(vm.valuedata,function(time){
            vm.timelist.push(time.value)
          })
        }
      },(bad) => { })
      this.$watch('option',function(){
        vm.$http.get('/static/sichuanmap/'+vm.mapname+'.json').then((data) => {
          vm.echarts.registerMap(vm.mapname, data.data);
          vm.mymap.setOption(vm.option)
        }, (err) => {
          console.log(err)
          vm.showmap('sichuan')
        });
        
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      let vm = this
      api.staticinformation.getpollutantTen().then((res)=>{
        if (res.data.status === 0) {
          vm.plist = res.data.pollutant
        }
      })
      this.getdata()
      this.echarts = require('echarts');      // 创建echart
      this.mymap = this.echarts.init(document.getElementById('map'));
      vm.showmap('sichuan')
      vm.mymap.on('dblclick', function (params) {
        console.log(params);
	        if(params.name) {
	          vm.showmap(params.name)
	        } else {
	          vm.showmap('sichuan')
	        }
        }); 
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
.el-radio-button {
  font-weight: 400;
}
</style>
