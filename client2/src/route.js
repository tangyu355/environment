import Home from 'components/views/home'
import role from 'components/views/role'
import manager from 'components/usermanage/manager'
import alter from 'components/usermanage/alter'
import invcode from 'components/usermanage/invcode'
import company from 'components/company/company'
import goverment from 'components/goverment/govermentpage'
import smallcompany from 'components/smallcompany/smallcompanypage'
import system from 'components/usermanage/system'
import fuelset from 'components/setting/fuelset'
import governset from 'components/setting/governset'
import uploadlist from 'components/goverment/uploadlist'
import handreps from 'components/handrep/rep'
import govset from 'components/govsettingfactor/commonset'
import result from 'components/setting/result'
import govsearch from 'components/search/govsearch'
import smallimport from 'components/smallcompany/smallimport'
import farmingsetting from 'components/govsettingfactor/farmingsetting'
import restaurantset from 'components/govsettingfactor/restaurantset'
import pollutionset from 'components/setting/pollutionset'
import govmonthly from 'components/govsettingfactor/govmonthly'
import staticset from 'components/setting/staticSet'
import govpullution from 'components/analyze/analyze'
import govpullutionpie from 'components/analyze/analypie'
import firewoodtype from 'components/analyze/firewoodtype'

import setvehicle from 'components/govsettingfactor/setvehicle'
import vehiclefactor from 'components/govsettingfactor/vehiclefactor'
import detailcompany from 'components/setting/detailcompany'
import productset from 'components/setting/productset'
import importpollu from 'components/search/importpollu'
import tradepollution from 'components/analyze/tradepollution'
import TradeDevices from 'components/analyze/TradeDevices'
import CityTradeTon from 'components/analyze/CityTradeTon'
import kilncontentanver from 'components/analyze/kilncontentanver'
import citytradefuel from 'components/analyze/kilncontentanver'
import monthlymaterial from 'components/analyze/monthlymaterial'
import simplePie from 'components/analyze/simplePie'
import tradematerial from 'components/analyze/tradematerial'
import tradekiln from 'components/analyze/tradekiln'
import factorset from 'components/setting/factorset'
import enginemachine from 'components/analyze/enginemachine'
import farmming from 'components/analyze/farmming'
import farmmingcity from 'components/analyze/farmmingcity'
import multipollution from 'components/analyze/multipollution'
import simpleline from 'components/analyze/simpleline'
import governmethod from 'components/analyze/governmethod'
import governmoney from 'components/analyze/governmoney'
import industryelectrity from 'components/analyze/industryelectrity'
import Tradefuel from 'components/analyze/Tradefuel'
import poultrycity from 'components/analyze/poultrycity'
import NfertilizerByCity from 'components/analyze/NfertilizerByCity'
import roadtype from 'components/analyze/roadtype'
import roadcity from 'components/analyze/roadcity'
import constructioncity from 'components/analyze/constructioncity'
import polludistrict from 'components/analyze/polludistrict'
import building from 'components/analyze/building'
import cityAnimal from 'components/analyze/cityAnimal'
import roadpollution from 'components/analyze/roadpollution'


export default {
  routes: [
  { path: '/home', component: Home },
  { path: '/role', component: role },
  { path: '/system', component: system },
	{ path: '/manager', component: manager },
	{ path: '/invcode', component: invcode},
	{ path: '/alter', component: alter},
	{ path: '/company', component: company},
	{ path: '/goverment', component: goverment},
  { path: '/smallcompany', component: smallcompany},
	{ path: '/fuelset', component: fuelset},
	{ path: '/restaurantset', component: restaurantset},
	{ path: '/governset', component: governset},
	{ path: '/farmingsetting', component: farmingsetting},
	{ path: '/result', component: result},
	{ path: '/govsearch', component: govsearch},
	{ path: '/govmonthly', component: govmonthly},
	{ path: '/governmoney', component: governmoney},
	{ path: '/monthlymaterial', component: monthlymaterial},
	{ path: '/industryelectrity', component: industryelectrity},
	{ path: '/smallimport', component: smallimport},
	{ path: '/tradekiln', component: tradekiln},
	{ path: '/farmming', component: farmming},
	{ path: '/movingsearch', component: govsearch},
	{ path: '/NfertilizerByCity', component: NfertilizerByCity},
	{ path: '/kilncontentanver/:analyname', component: kilncontentanver,name: 'kilncontentanver'},
	{ path: '/pollutionset', component: pollutionset},
	{ path: '/firewoodtype', component: firewoodtype},
	{ path: '/polludistrict', component: polludistrict},
	{ path: '/TradeDevices', component: TradeDevices},
	{ path: '/importpollu', component: importpollu},
	{ path: '/roadpollution', component: roadpollution},
	{ path: '/enginemachine', component: enginemachine},
	{ path: '/governmethod', component: governmethod},
	{ path: '/poultrycity', component: poultrycity},
	{ path: '/gov_upload_list/:gId/:tablename/:year:/upkeyword', component:uploadlist,name:'gov_upload_list'},
	//面源移动源手工填报审核页面
	{ path: '/handreps/:name/:gId/:add/:year:/status:/keyword', component: handreps, name:'handreps'},
	{ path: '/govset', component: govset, name:'govset'},
	{ path: '/tradepollution/:analyname/:isSmall', component: tradepollution, name:'tradepollution'},
	{ path: '/govpullution/:analyname/:isSmall', component: govpullution, name:'govpullution'},
	{ path: '/govpullutionpie/:analyname/:isSmall', component: govpullutionpie, name:'govpullutionpie'},
	{ path: '/simplePie/:analyname/:isSmall', component: simplePie, name:'simplePie'},
	{ path: '/multipollution/:analyname', component: multipollution, name:'multipollution'},
	{ path: '/simpleline/:analyname', component: simpleline, name:'simpleline'},
	{ path: '/Tradefuel/:analyname', component: Tradefuel, name:'Tradefuel'},
	{ path: '/staticset', component: staticset},
	{ path: '/productset', component: productset},
	{ path: '/CityTradeTon', component: CityTradeTon},
	{ path: '/setvehicle', component: setvehicle},
	{ path: '/tradematerial', component: tradematerial},
	{ path: '/roadtype', component: roadtype},
	{ path: '/roadcity', component: roadcity},
	{ path: '/building', component: building},
	{ path: '/cityAnimal', component: cityAnimal},
	{ path: '/farmmingcity', component: farmmingcity},
	{ path: '/constructioncity', component: constructioncity},
	{ path: '/factorset/:groupid', component: factorset, name:'factorset'},
	{ path: '/vehiclefactor', component: vehiclefactor},
	{ path: '/detailcompany/:comId/:year/:companyName', component: detailcompany,name:'detailcompany'},	
  	{ path: '/', redirect: '/home'}
  ]
}

