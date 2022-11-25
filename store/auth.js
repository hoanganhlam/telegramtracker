export default {
  namespaced: true,
  state: () => ({
    account: null,
    network: null,
    wallet: null
  }),
  mutations: {
    ['SET_ACCOUNT'](state, account) {
      state.account = account;
    },
    ['SET_NETWORK'](state, network) {
      state.network = network;
    },
    ['SET_WALLET'](state, wallet) {
      state.wallet = wallet;
    }
  },
  actions: {
    setAuth(context, {account, network, wallet}) {
      context.commit('SET_ACCOUNT', account)
      context.commit('SET_NETWORK', network)
      context.commit('SET_WALLET', wallet)
    }
  },
  getters: {
    getUserName: state => {
      return state.account ?
        `${state.account.address.substr(0, 4)}...${state.account.address.substr(60, 66)}` :
        'Connect';
    },
    loggedIn: state => {
      return !!Boolean(state.account)
    },
    connectedWallet: state => {
      return state.wallet
    },
    activeNetwork: state => {
      return state.network
    }
  }
}
