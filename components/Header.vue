<template>
  <header class="sticky top-0 border-b py-4 -mx-4 px-4 bg-white z-10 font-bold">
    <div class="mx-auto flex gap-4 items-center justify-between text-xs">
      <div class="flex-1 flex items-center gap-6">
        <div>
          <nuxt-link class="fill-green-800 flex items-center gap-2" to="/">
            <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path
                d="M39.175,10.016c1.687,0,2.131,1.276,1.632,4.272c-0.571,3.426-2.216,14.769-3.528,21.83 c-0.502,2.702-1.407,3.867-2.724,3.867c-0.724,0-1.572-0.352-2.546-0.995c-1.32-0.872-7.984-5.279-9.431-6.314 c-1.32-0.943-3.141-2.078-0.857-4.312c0.813-0.796,6.14-5.883,10.29-9.842c0.443-0.423,0.072-1.068-0.42-1.068 c-0.112,0-0.231,0.034-0.347,0.111c-5.594,3.71-13.351,8.859-14.338,9.53c-0.987,0.67-1.949,1.1-3.231,1.1 c-0.655,0-1.394-0.112-2.263-0.362c-1.943-0.558-3.84-1.223-4.579-1.477c-2.845-0.976-2.17-2.241,0.593-3.457 c11.078-4.873,25.413-10.815,27.392-11.637C36.746,10.461,38.178,10.016,39.175,10.016 M39.175,7.016L39.175,7.016 c-1.368,0-3.015,0.441-5.506,1.474L33.37,8.614C22.735,13.03,13.092,17.128,6.218,20.152c-1.074,0.473-4.341,1.91-4.214,4.916 c0.054,1.297,0.768,3.065,3.856,4.124l0.228,0.078c0.862,0.297,2.657,0.916,4.497,1.445c1.12,0.322,2.132,0.478,3.091,0.478 c1.664,0,2.953-0.475,3.961-1.028c-0.005,0.168-0.001,0.337,0.012,0.507c0.182,2.312,1.97,3.58,3.038,4.338l0.149,0.106 c1.577,1.128,8.714,5.843,9.522,6.376c1.521,1.004,2.894,1.491,4.199,1.491c2.052,0,4.703-1.096,5.673-6.318 c0.921-4.953,1.985-11.872,2.762-16.924c0.331-2.156,0.603-3.924,0.776-4.961c0.349-2.094,0.509-4.466-0.948-6.185 C42.208,7.875,41.08,7.016,39.175,7.016L39.175,7.016z"/>
            </svg>
            <span class="hidden md:block uppercase">Telegram Tracker</span>
          </nuxt-link>
        </div>
        <client-only>
          <div
            class="cursor-pointer md:hidden p-2"
            @click="showSearch = !showSearch"
          >
            <icon name="search"/>
          </div>
          <div v-if="value" class="flex-1 hidden md:flex items-center gap-3">
            <icon name="chevron-right"/>
            <div class="flex items-center gap-2 text-sm">
              <div class="h-6 w-6 flex items-center justify-center bg-gray-200 rounded-full">
                <img
                  v-if="value.photo"
                  class="h-6 w-6 rounded-full"
                  :src="value.photo"
                  alt="">
                <icon v-else name="thumb"/>
              </div>
              <div class="font-medium text-gray-900 truncate w-64">{{ value.name }}</div>
            </div>
          </div>
          <div
            class="z-10 top-0 left-0 right-0 absolute md:relative bg-white md:bg-transparent p-4 md:p-0 border-b md:border-b-0"
            :class="{
              'hidden md:block': !showSearch,
              'md:hidden': value
            }"
          >
            <div class="flex text-sm">
              <div class="p-2 md:hidden cursor-pointer border border-r-0" @click="showSearch = false">
                <icon name="close"/>
              </div>
              <input
                v-model="name" class="border md:border-r-0 outline-none p-2 px-4 w-full"
                type="text" placeholder="Channel or group"
              >
              <div class="button bg-green-600 text-white fill-white" @click="search()">
                <icon name="search"></icon>
              </div>
            </div>
          </div>
        </client-only>
      </div>
      <div class="flex gap-4 items-center justify-end text-xs uppercase">
        <div class="flex gap-4 text-gray-500">
          <nuxt-link to="/">Book</nuxt-link>
        </div>
        <client-only>
          <div
            v-if="!loggedIn"
            class="p-2 px-3 flex items-center border cursor-pointer dark:border-stone-500"
            @click="openConnect()"
          >
            <div class="dark:fill-white">
              <icon name="user"/>
            </div>
            <icon name="drag"/>
            <span class="px-1">{{ getUserName }}</span>
          </div>
          <tippy v-else arrow interactive trigger="click" placement="bottom-start">
            <template v-slot:trigger>
              <div class="p-2 px-3 flex items-center border cursor-pointer dark:border-stone-500">
                <div class="fill-white">
                  <img class="w-5 h-5" :src="`/wallets/${connectedWallet}.png`" alt="">
                </div>
                <icon name="drag"/>
                <span class="px-1">{{ getUserName }}</span>
              </div>
            </template>
            <div class="w-36 text-left">
              <div class="py-1 px-2 cursor-pointer hover:bg-stone-900 duration-300 rounded" @click="openConnect">Change
                Wallet
              </div>
              <div class="py-1 px-2 cursor-pointer hover:bg-stone-900 duration-300 rounded" @click="disconnect">
                Disconnect
              </div>
            </div>
          </tippy>
        </client-only>
      </div>
    </div>
  </header>
</template>

<script>
import {debounce} from "lodash";
import {mapGetters} from "vuex";

export default {
  name: "PHeader",
  components: {},
  props: {
    dark: {
      default: false
    }
  },
  data() {
    return {
      name: null,
      showSearch: false
    }
  },
  methods: {
    openConnect() {
      this.$store.commit('config/SET_MODAL', {
        name: 'connect'
      })
    },
    disconnect() {
      this.$ck.set('apt_wallet', null);
      this.$store.dispatch("auth/setAuth", {
        account: null, network: null, wallet: null
      });
    },
    search: debounce(function () {
      this.$store.commit('config/SET_SEARCH', this.name)
    }, 800)
  },
  watch: {
    name() {
      this.search()
    }
  },
  computed: {
    ...mapGetters('auth', [
      'getUserName',
      'loggedIn',
      'connectedWallet'
    ]),
    value() {
      return this.$store.state.config.room
    }
  }
}
</script>

<style scoped>
</style>
