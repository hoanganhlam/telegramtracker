<template>
  <header class="sticky top-0 border-b py-2 bg-black text-white -mx-4 px-4 z-10 font-bold">
    <div class="mx-auto max-w-4xl flex gap-4 items-center justify-between text-xs">
      <div class="flex-1 flex items-center gap-6">
        <div>
          <nuxt-link class="fill-white text-white flex items-center gap-2" to="/">
            <img class="w-10 h-10" src="/logo.svg" alt="Telegram Tracker">
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
          <div v-if="$route.params.type" class="hidden md:flex items-center gap-3 fill-gray-50 text-gray-50">
            <icon name="chevron-right"/>
            <nuxt-link class="text-sm capitalize" :to="`/${$route.params.type}`">{{$route.params.type}}</nuxt-link>
          </div>
          <div v-if="value" class="flex-1 hidden md:flex items-center gap-3 fill-gray-50 text-gray-50">
            <icon name="chevron-right"/>
            <div class="flex items-center gap-2 text-sm">
              <div class="h-6 w-6 flex items-center justify-center bg-gray-200 rounded-full">
                <img
                  v-if="value.photo"
                  class="h-6 w-6 rounded-full"
                  :src="value.photo"
                  alt="">
                <icon v-else class="sm fill-black" name="thumb"/>
              </div>
              <div class="font-medium truncate w-64">{{ value.name }}</div>
            </div>
          </div>
          <div
            class="z-10 top-0 left-0 right-0 absolute md:relative bg-white md:bg-transparent p-4 md:p-0 border-b md:border-b-0"
            :class="{
              'hidden md:block': !showSearch,
              'md:hidden': value
            }"
          >
            <div class="flex text-sm text-black">
              <div class="p-2 md:hidden cursor-pointer border border-r-0" @click="showSearch = false">
                <icon name="close"/>
              </div>
              <input
                v-model="name" class="border rounded-none md:border-r-0 outline-none p-1.5 px-4 w-full"
                type="text" placeholder="Channel or group"
              >
              <div class="button bg-green-600 fill-white" @click="search()">
                <icon name="search"/>
              </div>
            </div>
          </div>
        </client-only>
      </div>
      <div class="flex gap-4 items-center justify-end text-xs uppercase">
        <div class="flex gap-4 text-gray-50">
          <nuxt-link to="/">Book</nuxt-link>
        </div>
        <client-only v-if="false">
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
