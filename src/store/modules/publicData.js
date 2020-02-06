
const state = {
  model: {
    dataSourceTypeOptions: [], // 数据源分类
    updatePlanOptions: { // 更新时间 选项
      hour: [],
      times: []
    },
    tagCategory: [], // 标签分类
    tags: [], // 标签
    contentTag: [], // 内容标签
    examineStatus: [], // 审批状态
    businessSource: [] // 业务频道 业务源
  }
}

const mutations = {
/*  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }*/
}

const actions = {
/*  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }*/
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

