define([], function() {
  return {
    mcontent: [{
      title: '',
      list: [{/*系统设置*/
        name: '系统设置',
        icon: 'fa-home',
        typeid: 'A',
        isshow:true,
        list: [{
          name: '账号管理',
          typeid: 1,
          link: {
            path: '/manager'
          }
        }, {
          name: '密码修改',
          typeid: 0,
          link: '/alter'
        }, {
          name: '邀请码生成',
          typeid: 1,
          link: '/invcode'
        }, {
          name: '系统配置',
          typeid: 1,
          link: '/system'
        }]
      },{/*填报查询与审核*/
        name: '填报查询与审核',
        icon: 'fa-edit',
        typeid: 'B',
        isshow: false,
        list: [{
          name: '工业源填报审核',
          typeid: 0,
          permit: 'cpermit',
          link: '/company'
        },
        {
          name: '小散企业填报审核',
          typeid: 0,
          permit: 'cpermit',
          link: '/smallcompany'
        },
        {
          name: '小散企业批量导入',
          typeid: 0,
          permit: 'cpermit',
          link: '/smallimport'
        },{
          name: '面源移动源填报审核',
          typeid: 0,
          permit: 'gpermit',
          link: '/goverment'
        }]
      },{/*因子配置与计算*/
        name: '因子配置与计算',
        typeid: 'C',
        icon: 'fa-wrench',
        isshow: false,
        list: [
        {
          name: '固定信息修改',
          typeid: 1,
          link: '/staticset'
        },  {
          name: '污染物信息修改',
          typeid: 1,
          link: '/pollutionset'
        }, {
          name: '工业源因子配置',
          typeid: 1,
          icon: 'fa-wrench',
          isshow: false,
          list: [{/*产品分类算法配置*/
            name: '产品分类算法',
            typeid: 1,
            link: '/productset'
          }, {
            name: '燃料算法',
            typeid: 1,
            link: '/fuelset'
          }, {
            name: '去除效率',
            typeid: 1,
            link: '/governset'
          }, {
            name: '硫分、灰分配置',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'configuration'
              }
            }
          }]
        }, {/*面源因子配置*/
          name: '面源因子配置',
          typeid: 1,
          icon: 'fa-wrench',
          isshow: false,
          list: [{
            name: '畜禽养殖',
            typeid: 1,
            link: '/farmingsetting'
          }, {
            name: '餐饮',
            typeid: 1,
            link: '/restaurantset'
          }, {
            name: '氮肥施用',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'nfertigation'
              }
            }
          }, {
            name: '秸秆和薪柴',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'firewood'
              }
            }
          }, {
            name: '民用生活燃料用量',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'dfuel'
              }
            }
          }, {
            name: '加油站',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'gasstation'
              }
            }
          }, {
            name: '油库',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'oildepot'
              }
            }
          }, {
            name: '汽修',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'garage'
              }
            }
          }, {
            name: '干洗店',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'laundry'
              }
            }
          }, {
            name: '道路扬尘',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'roaddust'
              }
            }
          }, {
            name: '施工扬尘',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'constructiondust'
              }
            }
          }, {
            name: '农药用量 ',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'pesticide'
              }
            }
          }, {
            name: '能源销售 ',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'energysell'
              }
            }
          }, {
            name: '垃圾场污水厂 ',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'waste'
              }
            }
          }, {
            name: '房屋建筑 ',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'build'
              }
            }
          }, {
            name: '能源消耗 ',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'energyconsume'
              }
            }
          }]
        },{//面源每月系数
          name: '每月系数配置',
          typeid: 1,
          link: '/govmonthly'
        },{/*移动源因子配置*/
          name: '移动源因子配置',
          typeid: 1,
          icon: 'fa-wrench',
          isshow: false,
          list: [{
            name: '工程机械保有量',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'constructionmachinenumber'
              }
            }
          },{
            name: '工程机械因子',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'constructionmachine'
              }
            }
          }, {
            name: '农业机械',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'agriculturemachine'
              }
            }
          }, {
            name: '船舶',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'boat'
              }
            }
          }, {
            name: '机动车保有量',
            typeid: 1,
            link: '/setvehicle'
          }, {
            name: '机动车排放因子',
            typeid: 1,
            link: '/vehiclefactor'
          }, {
            name: '飞机',
            typeid: 1,
            link: {
              path: '/govset',
              query: {
                listname: 'airplane'
              }
            }
          }]
        },{
          name: '污染物计算',
          typeid: 1,
          link: '/result'
        }, {
          name: '工业源计算结果查询',
          typeid: 1,
          link: '/importpollu'
        }, {
          name: '面源计算结果查询',
          typeid: 1,
          link: '/govsearch'
        }, {
          name: '移动源计算结果查询',
          typeid: 1,
          link: '/movingsearch'
        }]
      },{/*工业源统计分析*/
        name: '工业源统计分析',
        typeid: 'D',
        icon: 'fa-table',
        isshow: false,
        list: [{
          name: '污染物',
          typeid: 1,
          isshow: false,
          list: [
          {
            name: '地域分布',
            typeid: 1,
            link: '/polludistrict'
          },{
            name: '地区分布',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'district',
                isSmall:true
              }            	
            }
          }, {
            name: '行业分布',
            typeid: 1,
            link: {
            	name: 'tradepollution',
              params:{
                analyname:'result',
                isSmall:true
              }
            }
          }, {
            name: '锅炉排放',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'glpollutantstat',
                isSmall:true
              }            	
            }
          }, {
            name: '每月排放',
            typeid: 1,
            link: {
            	 name: 'govpullution',
               params:{
                analyname:'month',
                isSmall:true
              } 
            }
          }]
        }, {
          name: '锅炉',
          typeid: 1,
          isshow: false,
          list: [{
            name: '不同类型台数占比',
            typeid: 1,
            link: {
              name: 'simplePie',
              params:{
                analyname:'devices',
                isSmall:true
              }
            }
          }, {
            name: '不同范围蒸吨占比',
            typeid: 1,  
            link: {
            	name: 'simplePie',
              params:{
                analyname:'DeviceTonCount',
                isSmall:true
              }
            }
          }, {
            name: '不同地区锅炉个数',
            typeid: 1,
            link: {
            	name: 'govpullution',
              params:{
                analyname:'CityDevices',
                isSmall:true
              }
            }
          }, {
            name: '不同行业锅炉个数',
            typeid: 1,
            link: '/TradeDevices'
          }, {
            name: '不同地区行业蒸吨',
            typeid: 1,
            link: '/CityTradeTon'
          }]
        }, {
          name: '窑炉',
          typeid: 1,
          isshow: false,
          list: [{
            name: '不同行业窑炉占比',
            typeid: 1,
            link: '/tradekiln'
          }, {
            name: '不同地区窑炉台数',
            typeid: 1,
            link: {
            	name: 'govpullution',
              params:{
                analyname:'CityDeviceCount',
                isSmall:false
              }
            }
          }]
        }, {
          name: '产品及原辅料',
          typeid: 1,
          isshow: false,
          list: [{
            name: '不同地区行业产量',
            typeid: 1,
            link:'/tradematerial'
          }, {
            name: '主要产品产量月分布',
            typeid: 1,
            link:'/monthlymaterial'
          }]
        }, {
          name: '治理设施',
          typeid: 1,
          isshow: false,
          list: [{
            name: '不同地区行业占比',
            typeid: 1,
            link: '/governmethod'
          }, {
            name: '计算平均费用',
            typeid: 1,
            link: '/governmoney'
          }]
        }, {
          name: '用电量',
          typeid: 1,
          isshow: false,
          list: [{
            name: '不同地区行业电量',
            typeid: 1,
            link: '/industryelectrity'
          }]
        }, {
          name: '锅炉燃料',
          typeid: 1,
          isshow: false,
          list: [{
            name: '不同地区燃料消耗',
            typeid: 1,
            link: {
            	 name: 'govpullution',
               params:{
                analyname:'CityFuel',
                isSmall:false
              }
            }
          }, {
            name: '不同行业燃料消耗',
            typeid: 1,
            link: {
            	name: 'Tradefuel',
               params:{
                analyname:'TradeFeul'
              }
            }
          }, {
            name: '不同月份锅炉燃煤占比',
            typeid: 1,
            link: {
            	 name: 'simplePie',
               params:{
                analyname:'MonthFeul',
                isSmall:false
              }
            }
          }, {
            name: '分类型燃煤锅炉消耗',
            typeid: 1,
            link: {
            	name: 'simplePie',
               params:{
                analyname:'CoalGl',
                isSmall:false
              }
            }
          }, {
            name: '分地区行业的燃煤平均成分',
            typeid: 1,
            link: {
            	 name: 'kilncontentanver',
               params:{
                analyname:'CityTradeAS'
              }
            }
          }]
        }, {
          name: '窑炉燃料',
          typeid: 1,
          isshow: false,
          list: [
          {
            name: '不同地区燃料消耗',
            typeid: 1,
            link: {
            	 name: 'govpullution',
               params:{
                analyname:'DeviceCityFuel',
                isSmall:false
              }
            }
          }, {
            name: '不同行业燃料消耗',
            typeid: 1,
            link: {
            	name: 'Tradefuel',
               params:{
                analyname:'DeviceTradeFeul'
              }
            }
          }, {
            name: '每月燃煤消耗占比',
            typeid: 1,
            link: {
            	name: 'simplePie',
               params:{
                analyname:'DeviceMonthFeul',
                isSmall:false
              }
            }
          }, {
            name: '分地区行业的燃煤平均成分',
            typeid: 1,
            link: {
            	name: 'kilncontentanver',
               params:{
                analyname:'DeviceCityTradeAS'
              }
            }
          }]

        }]
      },{/*面源统计分析*/
        name: '面源统计分析',
        typeid: 'D',
        icon: 'fa-table',
        isshow: false,
        list: [
        {
          name:'农业源',
          typeid:1,
          isshow:false,
          list:[{
            name: '畜禽类型占比图',
            typeid: 1,
            link: {
            	name: 'govpullutionpie',
              params:{
                analyname:'poultrytype',
                isSmall:false
              }
            }
          },{
            name: '畜禽分地区数量统计图',
            typeid: 1,
            link:'/poultrycity'
          },{
            name: '秸秆和薪柴',
            typeid: 1,
            link: '/firewoodtype'
          }, {
            name: '氮肥施用类型占比图',
            typeid: 1,
            link: {
            	name: 'simplePie',
               params:{
                analyname:'Nfertilizer',
                isSmall:false
              }
            }
          }, {
            name: '分地区每亩耕地氮肥均值',
            typeid: 1,
            link: '/NfertilizerByCity'
          }, {
            name: '氮肥月施肥量均值',
            typeid: 1,
            link: {
            	name: 'govpullution',
              params:{
                analyname:'NfertilizerByMonth',
                isSmall:false
              }
            }
          }]
        }, {
          name:'扬尘源',
          typeid:1,
          isshow:false,
          list:[
          {
            name: '全省、某城市扬尘占比',
            typeid: 1,
            link: '/roadtype'
          },{
            name: '全省、某城市道路长度组成',
            typeid: 1,
            link: '/roadcity'
          },{
            name: '某城市已开工、未开工工地',
            typeid: 1,
            link: '/building'
          },{
            name: '全省分地区建筑情况',
            typeid: 1,
            link:'/constructioncity'            
          }]
        },{
          name: '餐饮锅炉',
          typeid: 1,
          isshow: false,
          list:[{
            name: '餐饮类型占比图',
            typeid: 1,
            link: {
            	name: 'simplePie',
              params:{
                analyname:'cateringtype',
                isSmall:false
              }
            }
            },{
            name: '分地区餐饮类型数量',
            typeid: 1,
            link:{
            	name: 'govpullution',
              params:{
                analyname:'cateringcity',
                isSmall:false
              }
            }
            
          },{
            name: '锅炉类型占比图',
            typeid: 1,
            link: {
            	name: 'simplePie',
              params:{
                analyname:'boilerton',
                isSmall:false
              }
            },
          },{
            name: '分地区锅炉类型数量统计',
            typeid: 1,
            link:{
            	name: 'govpullution',
              params:{
                analyname:'boilercity',
                isSmall:false
              }
            }
          },]
        },{
          name:'储存运输源',
          typeid:1,
          isshow:false,
          list:[
          {
            name: '加油站',
            typeid: 1,
            link: {
            	name: 'govpullution',
              params:{
                analyname:'GasStationByCity',
                isSmall:false
              }
            }
          },{
            name: '油库',
            typeid: 1,
            link: {
            	name: 'govpullution',
              params:{
                analyname:'OildepotByCity',
                isSmall:false
              }
            }
          }]
        }, {
          name: '面源污染物',
          typeid: 1,
          isshow: false,
          list: [{
            name: '各城市排放量',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'cityPollutant',
                isSmall:false
              }
            }
          },{
            name: '餐饮排放量',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'cityRestaurant',
                isSmall:false
              }
            }
          }, {
            name: '农作物排放量',
            typeid: 1,
            link: {
            	name: 'multipollution',
              params:{
                analyname:'firewoodType',
                isSmall:false
              }
            }
          },{
            name: '分地区农作物排放量',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'cityFirewood',
                isSmall:false
              }
            }
          }, {
            name: '氮肥施用氨排放量',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'nfertigation',
                isSmall:false
              }
            }
          },{
            name: '分地区氮肥氨排放量',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'cityNfertigation',
                isSmall:false
              }
            }
          },{
            name: '民用燃烧排放来源',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'dfuelType',
                isSmall:false
              }
            }
          },{
            name: '各城市民用燃烧排放量',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'cityDfuel',
                isSmall:false
              }
            }
          },{
            name: '各城市农业源氨排放量',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'cityTypefarming',
                isSmall:false
              }
            }
          },{
            name: '各类型汽修VOCs排放',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'cityGarage',
                isSmall:false
              }
            }
          },{
            name: '各畜禽种类NH3排放',
            typeid: 1,
            link: '/cityAnimal'
          },{
            name: '道路扬尘排放量',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'roaddusttype',
                isSmall:false
              }
            }
          }, {
            name: '各等级道路扬尘排放',
            typeid: 1,
            link: '/roadpollution'
          },{
            name: '道路扬尘贡献占比',
            typeid: 1,
            link: {
              name: 'govpullutionpie',
              params:{
                analyname:'cityRoaddust',
                isSmall:false
              }
            }
          },{
            name: '施工扬尘贡献占比',
            typeid: 1,
            link: {
              name: 'govpullutionpie',
              params:{
                analyname:'cityConstrucdust',
                isSmall:false               
              }
            }
          }]
        }]
      },{/*移动源统计分析*/
        name: '移动源统计分析',
        icon: 'fa-table',
        typeid: 'D',
        isshow:false,
        list: [{
          name: '飞机',
          typeid: 1,
          link: {
          	name: 'govpullution',
              params:{
                analyname:'planeType',
                isSmall:false               
              }
          }
        },{
          name: '机动车不同城市年均活动水平',
          typeid: 1,
          link: {
          	name: 'govpullution',
              params:{
                analyname:'motorcity',
                isSmall:false               
              }
          }
        }, {
          name: '全省不同车型机动车活动水平',
          typeid: 1,
          link: {
          	name: 'simpleline',
              params:{
                analyname:'motortype',
                isSmall:false               
              }
          }
        }, {
          name: '船舶燃油消耗量占比图',
          typeid: 1,
          link:{
          	name: 'simplePie',
              params:{
                analyname:'boatType',
                isSmall:false               
              }
          }
        },{
          name: '分地区船舶燃油消耗量',
          typeid: 1,
          link: {
          	name: 'simpleline',
              params:{
                analyname:'boatCity',
                isSmall:false               
              }
          }
        },{
          name: '分月份船舶燃油消耗量',
          typeid: 1,
          link: {
          	name: 'simpleline',
              params:{
                analyname:'boatMonth',
                isSmall:false               
              }
          }
        }, {
          name: '工程机械',
          typeid: 1,
          link: '/enginemachine'
        },{
          name: '全省农业机械类型',
          typeid: 1,
          link: '/farmming'
        },{
          name: '各城市农业机械类型',
          typeid: 1,
          link: '/farmmingcity'
        },{
          name: '污染物',
          typeid: 1,
          isshow: false,
          list:[{
            name: '每月船舶污染物排放量',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'boatMonths',
                isSmall:false
              }
            }
          },{
            name: '各城市船舶污染物排放',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'cityBoat',
                isSmall:false
              }
            }
          },{
            name: '全省农业机械尾气排放',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'cityAgricultural',
                isSmall:false
              }
            }
          },{
            name: '全省工程机械尾气排放',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'cityConstruction',
                isSmall:false
              }
            }
          },{
            name: '工程机械全省污染物占比',
            typeid: 1,
            link: {
              name: 'govpullutionpie',
              params:{
                analyname:'pollutantConstruction',
                isSmall:false
              }
            }
          },{
            name: '工程机械城市排放占比',
            typeid: 1,
            link: {
              name: 'govpullutionpie',
              params:{
                analyname:'moving',
                isSmall:false
              }
            }
          },{
            name: '工程机械尾气排放量',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'constructPollutant',
                isSmall:false
              }
            }
          },{
            name: '农业机械全省污染物占比',
            typeid: 1,
            link: {
              name: 'govpullutionpie',
              params:{
                analyname:'pollutantMachine1',
                isSmall:false
              }
            }
          },
          {
            name: '农业机械城市排放占比',
            typeid: 1,
            link: {
              name: 'govpullutionpie',
              params:{
                analyname:'agricult',
                isSmall:false
              }
            }
          },{
            name: '各类农业机械尾气排放',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'machinePollutant',
                isSmall:false
              }
            }
          }, {
            name: '分城市飞机污染物排放',
            typeid: 1,
            link: {
              name: 'govpullution',
              params:{
                analyname:'planeType',
                isSmall:false
              }
            }
          }, {
            name: '机动车分城市污染物',
            typeid: 1,
            link: {
            	name: 'govpullution',
              params:{
                analyname:'motorpollution',
                isSmall:false
              }
            }
          }, {
            name: '机动车分车型污染物',
            typeid: 1,
            link: {
            	 name: 'multipollution',
               params:{
                analyname:'MotorstatByMotorType',
                isSmall:false
              }
            }
          }, {
            name: '机动车分燃油污染物',
            typeid: 1,
            link: {
            	 name: 'govpullutionpie',
               params:{
                analyname:'MotorstatByGas',
                isSmall:false
              }
            }
          }]
        }]
      },{/*污染源统计分析*/
        name: '污染源统计分析',
        typeid: 'D',
        icon: 'fa-table',
        isshow: false,
        list: [{
          name: '某污染物的来源构成',
          typeid: 1,
          link: {
            name: 'govpullution',
            params:{
              analyname:'sourceTypeall',
               isSmall:false
            }
          }
        },{
          name: '全省不同面源排放量',
          typeid: 1,
          link: {
            name: 'govpullution',
              params:{
              analyname:'sourceType',
              isSmall:false
            }
          }
        },
        {
          name: '全省分污染源排放量',
          typeid: 1,
          link: {
            name: 'govpullution',
              params:{
              analyname:'sourceTypeall'
            }
          }
        },
        {
          name: '某城市分污染源排放量',
          typeid: 1,
          link: {
          	 name: 'multipollution',
              params:{
              analyname:'sourceTypecity'
            }
          }
        }]
      }]
    }]
  }
})
