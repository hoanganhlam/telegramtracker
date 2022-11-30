const defaultRes = {
  results: [],
  count: 0,
  page_size: 10,
  num_pages: 0,
  links: {
    next: null,
    previous: null
  }
}

export default {
  namespaced: true,
  state: () => ({
    search: null,
    meta: {
      title: "",
      desc: ""
    },
    modal: null,
    response: defaultRes,
    response2: defaultRes,
    response3: defaultRes,
    resSnap: [],
    resPost: [],
    room: null
  }),
  mutations: {
    ['SET_META'](state, data) {
      state.meta = data;
    },
    ["SET_MODAL"](state, payload) {
      state.modal = payload;
    },
    ["SET_RESPONSE"](state, payload) {
      state.response = payload ? payload : defaultRes;
    },
    ["SET_RESPONSE2"](state, payload) {
      state.response2 = payload ? payload : defaultRes;
    },
    ["SET_RESPONSE3"](state, payload) {
      state.response3 = payload ? payload : defaultRes;
    },
    ["SET_RESPONSE_SNAPSHOT"](state, payload) {
      state.resSnap = payload;
    },
    ["SET_RESPONSE_POST"](state, payload) {
      state.resPost = payload;
    },
    ["SET_ROOM"](state, payload) {
      state.room = payload;
    },
    ["SET_SEARCH"](state, payload) {
      state.search = payload;
    }
  },
  getters: {
    getMeta: state => {
      return state.meta;
    },
  }
}
