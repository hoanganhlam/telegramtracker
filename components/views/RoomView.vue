<template>
  <div v-if="value" class="max-w-4xl mx-auto py-4 space-y-4 md:py-6 md:space-y-6">
    <div class="flex gap-6 items-center">
      <div class="h-16 w-16 flex items-center justify-center bg-gray-200">
        <img
          v-if="value.media"
          :src="`${$config.API_DOMAIN}${value.media.sizes.thumb_128}`"
          class="rounded"
          alt=""
        >
        <icon v-else name="thumb"/>
      </div>
      <div class="flex-1">
        <h1 class="font-semibold text-xl md:text-3xl line-1">{{ value.name }}</h1>
        <div class="mt-1 text-gray-500">Age: <span class="font-semibold">{{ timeSince(value.created) }}</span>
        </div>
      </div>
    </div>
    <div class="md:flex gap-6">
      <div class="md:w-3/4 space-y-4">
        <div class="border p-3 flex-1 space-y-4">
          <div v-if="value.statistics" class="flex flex-wrap gap-4 md:gap-10 text-gray-500 leading-none text-sm font-semibold">
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
        <div class="flex items-center gap-4 text-gray-500">
          <div v-for="(item, i) in value.properties" :key="i" class="flex rounded overflow-hidden">
            <nuxt-link
              class="p-2 py-1 bg-gray-100"
              :to="`/${$route.params.type}/${item.taxonomy}/${item.id_string}`"
            >#{{ item.name }}
            </nuxt-link>
          </div>
        </div>
        <div v-if="value.participants.length" class="space-y-2">
          <div class="uppercase font-semibold text-xs text-gray-500">Administrators</div>
          <div class="grid md:grid-cols-3 gap-3 text-sm leading-none">
            <a
              v-for="item in value.participants" :key="item.id"
              :href="`https://t.me/${item.account.tg_username}`"
              target="_blank"
              rel="nofollow"
              class="flex gap-3 p-3 border"
            >
              <div class="h-8 w-8 flex items-center justify-center bg-gray-200">
                <icon name="thumb"/>
              </div>
              <div class="flex-1">
                <div class="font-semibold text-gray-900 line-1">{{ item.account.tg_name }}</div>
                <div class="text-gray-500 text-xs">@{{ item.account.tg_username }}</div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div class="md:w-1/4 space-y-4">
        <div class="flex flex-col gap-4">
          <a
            :href="`https://t.me/${value.id_string}`"
            target="_blank"
            rel="nofollow"
            class="button bg-green-600 justify-center text-white fill-white"
          >
            <span>Join</span>
            <icon name="join" class="fill-white"/>
          </a>
          <div class="button bg-gray-100 justify-center">
            <icon class="lg" name="star"/>
            <span>Share</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "~/components/Chart";

const colors = {
  members: '#344D67',
  views: '#6ECCAF',
  messages: '#ADE792',
  online: '#F3ECB0'
}

export default {
  name: "RoomView",
  components: {Chart},
  data() {
    return {
      selectedMetrics: ['members'],
      range: '5m',
      colors
    }
  },
  computed: {
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
              yAxisID: metric === 'members' ? 'y' : 'y1',
              borderColor: colors[metric]
            }
          }
          datasets[index].data.push(item[metric])
        })
      })
      return {
        labels, datasets
      }
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
    }
  }
}
</script>

<style scoped>

</style>
