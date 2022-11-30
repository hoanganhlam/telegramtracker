<template>
  <div class="max-w-4xl mx-auto py-8">
    <div class="space-y-4">
      <div
        v-if="false && !$route.params.id_string"
        class="md:flex gap-3 space-y-4 md:space-y-0"
      >
        <div class="relative flex-1 border p-3">
          <div class="absolute bg-white px-2 -top-2 left-4 uppercase font-bold text-xs">Country</div>
          <div v-if="false" class="flex gap-1 flex-wrap">
            <nuxt-link
              v-tippy="{arrow: true}"
              v-for="item in nations" :key="item.code"
              :content="item.name"
              :to="`/${type}/nation/${item.code}`"
            >
              <img class="w-4 h-4" :src="`/flags/${item.code.toLowerCase()}.svg`" alt="">
            </nuxt-link>
          </div>
        </div>
        <div class="relative md:w-1/4 border p-3">
          <div class="absolute bg-white px-2 -top-2 left-4 uppercase font-bold text-xs">Category</div>
          <div class="space-y-1 text-sm">
            <div v-for="item in categories" :key="item.id">
              <nuxt-link :to="`/${type}/category/${item.id}`">{{ item.name }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <div v-if="$route.params.type && (!$route.params.taxonomy || $route.params.id_string && $route.params.taxonomy)">
        <h1 class="text-3xl font-semibold">{{ $store.state.config.meta.title }}</h1>
        <p class="text-gray-500">{{ $store.state.config.meta.desc }}</p>
      </div>
      <div v-if="response2.results.length" class="space-y-2">
        <div v-if="$route.path === '/'" class="uppercase font-bold text-xs">
          <nuxt-link to="/group">Top group by online</nuxt-link>
        </div>
        <div class="grid md:grid-cols-3 gap-3 text-sm">
          <nuxt-link
            v-for="item in response2.results" :key="item.id"
            :to="`/group/${item.id_string}`"
            class="flex gap-2 p-2 border"
          >
            <div class="h-16 w-16 flex items-center justify-center bg-gray-200">
              <img
                v-if="item.photo"
                :src="item.photo"
                :alt="item.name">
              <icon v-else name="thumb"/>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-gray-900 line-1">{{ item.name }}</div>
              <div class="text-gray-500 text-xs">@{{ item.id_string }}</div>
              <div class="flex gap-3 text-xs mt-1">
                <div class="flex gap-1">
                  <span>{{ item.members?.toLocaleString() }}</span>
                  <span>members</span>
                </div>
                <div class="flex gap-1 items-center">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>{{ item.online?.toLocaleString() }}</span>
                  <span>online</span>
                </div>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div v-if="response3.results.length" class="space-y-2">
        <div v-if="$route.path === '/'" class="uppercase font-bold text-xs">
          <nuxt-link to="/sticker">New sticker</nuxt-link>
        </div>
        <div class="grid md:grid-cols-2 gap-3 text-sm">
          <div
            v-for="item in response3.results" :key="item.id"
            class="border"
          >
            <div class="p-2 flex justify-between border-b">
              <div class="flex gap-2 items-center font-semibold">
                <nuxt-link :to="`/sticker/${item.id_string}`">{{ item.name }}</nuxt-link>
                <span v-if="item.is_animated" class="text-xs p-0.5 px-2 bg-green-500 rounded-lg text-white">Animated</span>
              </div>
              <div class="flex gap-2 items-center">
                <a
                  :href="`https://t.me/addstickers/${item.id_string}`"
                  target="_blank" rel="nofollow"
                  class="flex gap-1 text-xs uppercase font-semibold items-center"
                >
                  <icon name="plus"/>
                  <span>Add</span>
                </a>
              </div>
            </div>
            <div class="p-2 grid grid-cols-6 gap-2">
              <sticker-item
                v-for="s in item.sticker_items.slice(0, 12)"
                :key="s.tg_id"
                :is_animated="item.is_animated"
                :value="s"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="response.results.length" class="space-y-2">
        <div v-if="$route.path === '/'" class="uppercase font-bold text-xs">
          <nuxt-link to="/channel">Top channel by subscribers</nuxt-link>
        </div>
        <table class="w-full table-fixed divide-y border text-right">
          <thead class="bg-gray-50 text-xs uppercase font-semibold text-gray-900">
          <tr>
            <th scope="col" class="p-3 text-left">Name</th>
            <th scope="col" class="p-3 hidden md:table-cell">View Rate</th>
            <th scope="col" class="p-3">Subscribers</th>
            <th scope="col" class="p-3 hidden md:table-cell">Age</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white text-sm">
          <tr v-for="(item, i) in response.results" :key="i">
            <td class="py-2 px-3 text-left">
              <nuxt-link
                class="flex items-center gap-2"
                :to="`/${item.is_group ? 'group' : 'channel'}/${item.id_string}`"
              >
                <div class="flex-none h-8 w-8 flex items-center justify-center bg-gray-200">
                  <img
                    v-if="item.photo"
                    class="h-8 w-8"
                    :src="item.photo"
                    :alt="item.name">
                  <icon v-else name="thumb"/>
                </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-900 truncate w-64">{{ item.name }}</div>
                  <div class="text-gray-500 text-xs">@{{ item.id_string }}</div>
                </div>
              </nuxt-link>
            </td>
            <td class="py-2 px-3 hidden md:table-cell">
              {{ parsePercent(item.views / item.members) }}
            </td>
            <td class="py-2 px-3">
              <div class="font-semibold">{{ item?.members.toLocaleString() }}</div>
              <div class="text-xs text-green-500">
                <span>{{ item?.statistics?.members_1h?.toLocaleString() }}</span>
              </div>
            </td>
            <td class="py-2 px-3 hidden md:table-cell">
              {{ timeSince(item.created) }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div v-if="$route.params.type && paginator.num_pages" class="flex justify-center gap-3 text-sm fill-gray-300">
        <nuxt-link
          class="button border duration-200 border-transparent rounded-xl"
          :class="{'hover:border-green-700 fill-gray-700': paginator.links.previous}"
          :to="toURL(paginator.links.previous ? currentPage - 1 : currentPage)"
        >
          <icon name="chevron-left"/>
        </nuxt-link>
        <div
          class="px-6 py-2 inline-flex gap-4 font-semibold cursor-pointer items-center border rounded-xl text-gray-500"
        >
          <div
            v-for="page in pages" :key="page"
            class="hover:text-green-700">
            <nuxt-link v-if="page !== '...'" :to="toURL(page)">{{ page }}</nuxt-link>
            <span v-else>...</span>
          </div>
        </div>
        <nuxt-link
          class="button border duration-200 border-transparent rounded-xl"
          :class="{'hover:border-green-700 fill-gray-700': paginator.links.next}"
          :to="toURL(paginator.links.next ? currentPage + 1 : currentPage)"
        >
          <icon name="chevron-right"/>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import {stringify} from "qs"
import StickerItem from "../StickerItem";

const nations = require("@/assets/nations.json")
export default {
  name: "ResultView",
  components: {StickerItem},
  computed: {
    currentPage() {
      return Number.parseInt(this.$route.query.page || "1")
    },
    response() {
      return this.$store.state.config.response
    },
    response2() {
      return this.$store.state.config.response2
    },
    response3() {
      return this.$store.state.config.response3
    },
    type() {
      return this.$route.params.type || 'channel'
    },
    paginator() {
      if (this.type === 'channel') {
        return this.response
      } else if (this.type === 'group') {
        return this.response2
      }
      return this.response3
    },
    pages() {
      const out = []
      if (this.paginator.num_pages === 1) {
        return [1]
      } else if (this.paginator.num_pages <= 6) {
        for (let i = 1; i < this.paginator.num_pages; i++) {
          out.push(i)
        }
      } else {
        out.push(1)
        const leftPages = this.currentPage - 1
        if (leftPages > 3) {
          out.push('...')
        }
        for (
          let i = leftPages > 3 ? leftPages - this.currentPage + 3 : leftPages - 1;
          i >= 0;
          i--
        ) {
          if (this.currentPage - i === this.paginator.num_pages) {
            break
          }
          out.push(this.currentPage - i)
        }
        const rightPages = this.paginator.num_pages - this.currentPage
        for (let i = 1; i < (rightPages > 3 ? 3 : rightPages); i++) {
          out.push(this.currentPage + i)
        }
        if (rightPages > 3) {
          out.push('...')
        }
        out.push(this.paginator.num_pages)
      }
      return out
    }
  },
  data() {
    return {
      name: null,
      nations,
      categories: [
        {name: "Cryptocurrencies", id: "cryptocurrencies"},
        {name: "Games", id: "games"},
        {name: "Marketing", id: "marketing"},
        {name: "Programing", id: "programing"},
        {name: "Animals", id: "animals"},
        {name: "18+", id: "18plus"},
        // {name: "Betting", id: "betting"}
      ]
    }
  },
  methods: {
    toURL(page) {
      const q = stringify({
        ...this.$route.query,
        page: page
      })
      return this.$route.path + "?" + q
    }
  }
}
</script>

<style scoped>

</style>
