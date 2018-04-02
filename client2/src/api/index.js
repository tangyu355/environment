import Vue from 'vue'
import _ from 'lodash'

import user from './user'
import usermanage from './usermanage'
import creport from './creport'
import staticinformation from './staticinformation'
import hand from './hand'
import analyze from './analyze'
import setting from './setting'
import search from './search'
import permission from './permission'

let api = {
  user,
  usermanage,
  creport,
  staticinformation,
  hand,
  analyze,
  setting,
  search,
  permission
}

export let initApi = () => {
  /*
   * api 接口均继承 vue-resource 提供的 restful 方法
   */
  _.each(api, (__, apiname) => {
    let resourceApiname = _.kebabCase(apiname)
    api[apiname] = _.extend(Vue.resource(`${resourceApiname}{/id}`), api[apiname])
  })

  /*
   * 定义二级资源接口
   */
  // api.lesson.sentence = Vue.resource('lesson{/lesson_id}/sentence{/id}')
}

export default api

