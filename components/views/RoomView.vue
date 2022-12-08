<template>
  <div v-if="value" class="max-w-4xl mx-auto py-4 space-y-4 md:py-6 md:space-y-6">
    <div class="flex gap-4 items-center">
      <div class="h-16 w-16 flex items-center justify-center bg-gray-200">
        <img
          v-if="value.photo"
          :src="value.photo"
          :alt="value.name"
          class="rounded"
        >
        <icon v-else name="thumb"/>
      </div>
      <div class="flex-1 space-y-1">
        <h1 class="font-semibold text-xl md:text-3xl line-1">{{ value.name }}</h1>
        <div v-if="isChat" class="flex gap-1 text-xs uppercase font-semibold">
          <div class="text-gray-500">Age</div>
          <icon class="sm" name="drag"/>
          <div>{{ timeSince(value.created) }}</div>
        </div>
        <div v-else class="flex gap-3 items-center text-xs uppercase font-semibold">
          <div class="flex gap-1">
            <div class="text-gray-500">Total</div>
            <icon class="sm" name="drag"/>
            <div>{{ value.sticker_items.length }}</div>
          </div>
          <span v-if="value.is_animated" class="p-0.5 px-2 bg-green-500 rounded-lg text-white">Animated</span>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row gap-6">
      <div class="md:w-3/4 space-y-4">
        <template v-if="isChat">
          <div class="border p-3 flex-1 space-y-4">
            <div v-if="value.statistics"
                 class="flex flex-wrap gap-4 md:gap-10 text-gray-500 leading-none text-sm font-semibold">
              <div class="space-y-1" v-for="item in metrics" :key="item.id">
                <div class="flex items-center gap-2">
                  <input
                    v-model="selectedMetrics"
                    :id="item.id" :name="item.id" type="checkbox"
                    :value="item.id"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500">
                  <label
                    :for="item.id"
                    :style="{color: colors[item.id]}"
                  >{{ item.name }}</label>
                </div>
                <div class="flex items-end gap-2">
                  <div class="md:text-xl font-bold">{{ (value[item.id] || 0).toLocaleString() }}</div>
                  <div
                    class="text-xs flex items-center"
                    :class="{
                    'text-green-500 fill-green-500': value.statistics[`${item.id}_${range}`] >= 0,
                    'text-red-500 fill-red-500': value.statistics[`${item.id}_${range}`] < 0
                  }"
                  >
                    <icon
                      class="sm"
                      :name="value.statistics[`${item.id}_${range}`] >= 0 ? 'plus' : 'minus'"
                    />
                    <span>{{ Math.abs(value.statistics[`${item.id}_${range}`]) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <client-only>
              <chart :data="charts"/>
            </client-only>
          </div>
          <table v-if="resPost.length" class="w-full table-fixed divide-y border text-right">
            <thead class="bg-gray-50 font-semibold text-gray-900">
            <tr>
              <th scope="col" class="p-3 py-1.5 text-left">Post</th>
              <th scope="col" class="p-3 py-1.5">View</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white text-sm">
            <tr v-for="(item, i) in resPost" :key="i">
              <td class="whitespace-nowrap py-2 px-3 text-left">
                <div class="flex items-center gap-2 font-semibold">
                  <div class="">{{ value.name }} #{{ item.post_id }}</div>
                </div>
              </td>
              <td class="whitespace-nowrap py-2 px-3">{{ item.views.toLocaleString() }}</td>
            </tr>
            </tbody>
          </table>
          <div v-if="value.participants.length" class="space-y-2">
            <div class="uppercase font-semibold text-xs text-gray-500">Administrators</div>
            <div class="grid md:grid-cols-2 gap-3 text-sm leading-none">
              <a
                v-for="item in value.participants" :key="item.id"
                :href="`https://t.me/${item.account.tg_username}`"
                target="_blank"
                rel="nofollow"
                class="flex gap-2"
              >
                <div class="h-8 w-8 flex items-center justify-center bg-gray-200">
                  <img
                    v-if="item.account.photo"
                    :src="item.account.photo"
                    :alt="item.account.tg_username">
                  <icon v-else name="thumb"/>
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-gray-900 line-1">{{ item.account.tg_name }}</div>
                  <div class="text-gray-500 text-xs">@{{ item.account.tg_username }}</div>
                </div>
              </a>
            </div>
          </div>
        </template>
        <div v-else class="grid grid-cols-4 gap-3">
          <sticker-item
            v-for="s in value.sticker_items"
            :key="s.tg_id"
            :is_animated="value.is_animated"
            :is_video="value.is_video"
            :value="s"
          />
        </div>
        <div class="flex items-center gap-4 text-gray-500">
          <div v-for="(item, i) in value.properties" :key="i" class="flex rounded overflow-hidden">
            <nuxt-link
              class="p-2 py-1 bg-gray-100"
              :to="`/${$route.params.type}/${item.taxonomy}/${item.id_string}`"
            >#{{ item.name }}
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="md:w-1/4 space-y-4">
        <div class="flex md:flex-col gap-4">
          <a
            :href="exLink"
            target="_blank"
            rel="nofollow"
            class="button bg-green-600 justify-center md:justify-between text-white fill-white"
          >
            <span>{{ $route.params.type === 'sticker' ? 'Add Sticker' : 'Join' }}</span>
            <icon name="join" class="fill-white"/>
          </a>
          <a
            v-if="$route.params.type === 'sticker'" download
            :href="`${$config.API_DOMAIN}/files/media/${value.tg_id}.zip`"
            target="_blank"
            class="button bg-gray-100 justify-center md:justify-between"
          >
            <span class="hidden md:block">Download</span>
            <icon name="download"/>
          </a>
          <div class="button bg-gray-100 justify-center md:justify-between" @click="share">
            <span class="hidden md:block">Share</span>
            <icon name="share"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "~/components/Chart";
import StickerItem from "../StickerItem";

const colors = {
  members: '#344D67',
  views: '#6ECCAF',
  messages: '#ADE792',
  online: '#F3ECB0'
}

export default {
  name: "RoomView",
  components: {StickerItem, Chart},
  data() {
    return {
      selectedMetrics: ['members'],
      range: '5m',
      colors
    }
  },
  computed: {
    isChat() {
      return this.$route.params.type !== 'sticker'
    },
    value() {
      return this.$store.state.config.room
    },
    resSnap() {
      return this.$store.state.config.resSnap
    },
    resPost() {
      return this.$store.state.config.resPost
    },
    metrics() {
      return [
        {id: "members", name: "Members"},
        ...this.$route.params.type === 'group' ? [{id: "online", name: "Online"}] : [],
        {id: "messages", name: "Messages"},
        {id: "views", name: "Views"},
      ]
    },
    charts() {
      const labels = []
      const datasets = []
      this.resSnap.forEach(item => {
        labels.push(this.makeLabel(item.date))
        this.selectedMetrics.forEach((metric, index) => {
          if (!datasets[index]) {
            datasets[index] = {
              data: [],
              borderWidth: 2,
              tension: 0.2,
              yAxisID: ['members', 'online'].includes(metric) ? 'y' : 'y1',
              borderColor: colors[metric]
            }
          }
          datasets[index].data.push(item[metric])
        })
      })
      return {
        labels, datasets
      }
    },
    exLink() {
      if (this.$route.params.type === 'sticker') {
        return `https://t.me/addstickers/${this.value.id_string}`
      }
      return `https://t.me/${this.value.id_string}`
    }
  },
  methods: {
    makeLabel(dateStr) {
      const date = new Date(dateStr)
      switch (this.range) {
        case "1y":
          return date.getFullYear()
        case "1M":
          return date.getMonth + 1
        case "1d":
          return date.getDate()
        case "1h":
          return date.getHours()
        default:
          return `${date.getHours()}:${date.getMinutes()}`
      }
    },
    share() {
      this.$store.commit('config/SET_MODAL', {
        type: 'social-share',
        data: {
          ...this.$store.state.config.meta,
          url: window.location.href,
          hashtag: ''
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
