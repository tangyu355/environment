<template>
  <div id="uploadlist">  
    <h3 >{{title}}</h3>
    <el-button type="primary" icon="arrow-left" @click="back" style="margin-bottom:10px;">返回</el-button>
    <div v-if="tablename!=='ap_motor_vehicle'">
    <el-table
    	v-loading.body="isloading"
      element-loading-text="拼命加载中"
      :data="showlist"
      style="width: 100%">
      <el-table-column 
        v-for="(header,hindex) in headerlist"
        :label="header"
        width="">
        <template scope="scope">
          {{scope.row[hindex]}}
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div v-if="tablename=='ap_motor_vehicle'" class="mytable">
    <table class = "table table-bordered" v-loading.body="isloading"
      element-loading-text="拼命加载中">
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
							<tr v-for="(i,index) in city.list" v-if="i.list.length">
								<td :rowspan="snum" class="text-center" v-if="index === 0">{{city.cityname}}</td>
								<td class="text-center">{{i["standard"]}}</td>
								<td v-for="x in i.list" class="text-center">{{x["value"]}}</td>
							</tr>
						</tbody>
				</table>
		</div>
  </div>
</template>

<script>
import {state, actions} from 'src/store'
import api from 'src/api'
import _ from 'lodash'

var tablemap = {
    ap_canyin_stat: {
      title: '餐饮服务提供者业态情况',
      api_base: '/canyin/stat',
      headerlist: ['指标', '地址', '特大型餐馆', '大型餐馆', '中餐馆', '小餐馆', '小吃店', '快餐店', '鲜奶吧', '饮品店', '事业单位食堂', '学校食堂', '建筑工地食堂', '合计', '营业额（万元）'],
      itemnames: ['certified', 'addressStr', 'canguan_huge', 'canguan_big', 'canguan_mid', 'canguan_small', 'snack', 'fastfood', 'milk', 'drink', 'shitang_shiye', 'shitang_school', 'shitang_gongdi', 'total', 'incoming'],
    },
    ap_canyin_certified: {
      title: '有证餐饮服务单位调查统计表',
      api_base: '/canyin/certified',
      headerlist: ['单位名称', '单位地址', '法人/负责人', '身份证号码', '联系人', '联系电话', '餐饮服务许可证号', '从业人员数', '许可类别', '发证单位', '量化分级年度等级', '年销售收入（万元）', '年缴税额（万元）', '备注'],
      itemnames: ["storename", "storeaddr", "legalPerson", "legalPersonID", "contact", "contactNo", "certifiedID", "staffNum", "certifiedType", "certifiedGov", "qlevel", "incoming", "tax", "remark"],
    },
    ap_canyin_nocert: {
      title: '无证餐饮服务单位调查统计表', 
      api_base: '/canyin/nocert',
      headerlist: ['生产经营类型','生产经营地址','姓名','身份证号','住址','联系电话','年平均生产销售额（万元）','生产经营食品种类','所在区域','备注'],
      itemnames: ["shoptype", "shopaddr", "name", "idnum", "homeaddr", "telephone", "incoming", "productType", "addressStr", "remark"],
    },
    ap_animals_farm: {
      title: '规模化畜禽养殖调查表',
      api_base: '/animals/farm',
      headerlist: ['养殖场名称','地址','养殖方式','肉牛/头','肉牛/饲养周期','奶牛/头','奶牛/饲养周期','山羊/头','山羊/饲养周期','绵羊/头','绵羊/饲养周期','肉猪/头','肉猪/饲养周期','肉鸡/头','肉鸡/饲养周期','肉鸭/头','肉鸭/饲养周期','肉鹅/头','肉鹅/饲养周期','蛋鸡','蛋鸭','蛋鹅','母猪','兔','马'],
      itemnames: ['farmname', 'addressStr', 'method', 'beef', 'beefcycle', 'cow', 'cowcycle', 'goat', 'goatcycle', 'sheep', 'sheepcycle', 'pig', 'pigcycle', 'chicken', 'chickencycle', 'duck', 'duckcycle', 'goose', 'goosecycle', 'hen', 'layingduck', 'layinggoose', 'sow', 'rabbit', 'horse'],
    },
    ap_animals_wild: {
      title: '散养畜禽养殖调查表',
      api_base: '/animals/wild',
      headerlist: ['地址','养殖方式','肉牛/头','肉牛/饲养周期','奶牛/头','奶牛/饲养周期','山羊/头','山羊/饲养周期','绵羊/头','绵羊/饲养周期','肉猪/头','肉猪/饲养周期','肉鸡/头','肉鸡/饲养周期','肉鸭/头','肉鸭/饲养周期','肉鹅/头','肉鹅/饲养周期','蛋鸡','蛋鸭','蛋鹅','母猪','兔','马'],
      itemnames: ['addressStr', 'method', 'beef', 'beefcycle', 'cow', 'cowcycle', 'goat', 'goatcycle', 'sheep', 'sheepcycle', 'pig', 'pigcycle', 'chicken', 'chickencycle', 'duck', 'duckcycle', 'goose', 'goosecycle', 'hen', 'layingduck', 'layinggoose', 'sow', 'rabbit', 'horse'],
    },
    ap_industry: {
      title: '第二产业企业名单调查表',
      api_base: '/industry',
      headerlist: ['单位详细名称','行业代码','地址','乡(镇)','街(村)','门牌号','企业营业状态','煤炭本年消费量/吨'],
      itemnames: ['companyName', 'industryCode', 'addressStr', 'countryname', 'streetname', 'houseNumber', 'openStatus', 'coalConsumption'],
    },
    ap_oildepot: {
      title: '油库调查表',
      api_base: '/oildepot',
      headerlist: ['油库名称','地址','乡(镇)','街(村)','汽油年吞吐量（吨）','柴油年吞吐量（吨）','发油台发油方式（上下装）','有无油气回收装置','油气回收装置类型','油气回收率（%）','油品输送类型'],
      itemnames: ['oildepotName', 'addressStr', 'countryname', 'streetname', 'gasolineGross', 'dieselGross', 'way', 'recycleDevice', 'deviceType', 'recovery', 'conveyType'],
    },
    ap_gasstation: {
      title: '加油站调查表',
      api_base: '/gasstation',
      headerlist: ['加油站名称','地址','乡(镇)','街(村)','汽油年吞吐量（吨）','柴油年吞吐量（吨）','天然气年吞吐量（m3）','汽油月平均销售量（吨/月）','柴油月平均销售量（吨/月）','天然气月平均销售量（m3/月）','加油枪（汽油）数量','加油枪（柴油）数量','加气枪（天然气）数量','有无油气回收装置','油气回收效率（%）'],
      itemnames: ['gasStationName', 'addressStr', 'countryname', 'streetname', 'gasolineGross', 'dieselGross', 'natgasGross', 'gasolineSellMonth', 'dieselSellMonth', 'natgasSellMonth', 'gasolineSpear', 'dieselSpear', 'natgasSpear', 'recycleDevice', 'recovery'],
    },
    ap_vehicle_action: {
      title: '机动车活动调查表',
      api_base: '/vehicle/action',
      headerlist: ['序号','车辆类型','号牌颜色','登记日期','测试日期','累计行驶里程','燃油类型'],
      itemnames: ['serial', 'vehicletype', 'platescolor', 'registerdate', 'checkdate', 'mileage', 'gastype'],
    },
    ap_gknumber: {
      title: '锅炉窑炉数量调查表',
      api_base: '/gknumber',
      headerlist: ['锅炉/窑炉使用企业名称','地址','乡(镇)','街(村)','型号','类型','蒸吨','燃料种类','燃料年用量','燃料用量单位','安装投产日期','烟囱高度（米）'],
      itemnames: ['companyName', 'addressStr', 'countryname', 'streetname', 'model', 'gktype', 'shippingTon', 'fuelType', 'yearlyFuel', 'unit', 'dateUsed', 'height'],
    },
    ap_plane: {
      title: '飞机调查表',
      api_base: '/plane',
      headerlist: ['城市','机场','生产厂商','飞机型号','全年升降架次(次/年)'],
      itemnames: ['addressStr', 'airport', 'factory', 'planemodel', 'numbers'],
    },
    ap_dump_field: {
      title: '污水垃圾场调查表',
      api_base: '/dump/field',
      headerlist: ['处理厂名称','处理厂类型','地(区、市、州、盟)','县(区、市、旗)','乡(镇)','街(村)、门牌号','垃圾焚烧年处理量（万吨）','垃圾填埋年处理量（万吨）','垃圾堆肥年处理量（万吨）','填埋场设计容量（立方米）','填埋场已填容量（立方米）','污水年处理量（万吨）'],
      itemnames: ['factoryname', 'factorytype', 'cityName', 'townName' ,'country', 'street','rubbish_burn','rubbish_bury','rubbish_hill','rubbish_capability','rubbish_used','sewerage_total'],
    }
  }

export default {
  components: {

  },
  data () {
    return {
      gid: 0,
      selected_year: 0,
      tablename: '',
      headerlist: [],
      itemlist: [],
      showlist:[],
      params:{
      	year:2017,
        upkeyword:''
      },
      state:state,
      isloading: false,
      valuelist:[],
      cnum:'',
      snum:'',
      vnum:'',
    }
  },
  computed: {
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData(to, from) {
      //console.log(this.$route)
    },
    getinfo:function(year,cid){
			var vm = this;
			vm.isloading = true
			vm.$http.get('vehicle/action/getbyyear/' + year+'/'+cid).then(function(res){
					console.log(res)
					if(res.data.status==0){
					  vm.valuelist = res.data.data;
					  vm.cnum = vm.valuelist.length;
					  vm.snum = vm.valuelist[0].list.length;
					  vm.vnum = vm.valuelist[0].list[0].list.length;
					  vm.isloading = false
					} else{
						vm.isloading = false
						vm.$message.error("没有数据");
					}
				})
		},
    getdata: function() {
    	this.isloading = true
      var vm = this;
      vm.showlist = [];
      vm.itemlist = [];

      api.hand.getFillsbyYearAid('./'+tablemap[vm.tablename].api_base, vm.selected_year, vm.gid).then(function(res) {
        console.log(res)
        if(res.data.status != 0) {
          this.$message.error(res.data.msg);
          return;
        }
        if(res.data.data.length <= 0) {
          vm.$message.error("没有数据");
          vm.isloading = false
          return;
        }

        vm.title = tablemap[vm.tablename].title;
        vm.headerlist = tablemap[vm.tablename].headerlist;
        vm.datalist = res.data.data;
        vm.all = vm.datalist.length;

        _.each(vm.datalist, function(element, index, list) {
          var item = [];
          _.each(tablemap[vm.tablename].itemnames, function(e, i, l) {
            item.push(element[e]);
          });
          vm.showlist.push(item);
          vm.isloading = false
        });

        console.log(vm.showlist);
      }, function(bad) {
        vm.$message.error(bad);
      });
    },
    back(){
    	this.$router.go(-1)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.gid = this.$route.params.gId;
      this.tablename = this.$route.params.tablename;
      this.selected_year = this.$route.params.year      
      this.state.pagekey.upkeyword = this.$route.params.upkeyword
      if(this.tablename!=='ap_motor_vehicle')
       {
       	 this.getdata();
       }else{
       	 this.getinfo(this.$route.params.year,this.$route.params.gId)
       }     
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
.mytable{
	max-height: 750px;
}
</style>
