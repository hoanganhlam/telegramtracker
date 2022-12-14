<template>
  <div class="max-w-4xl mx-auto py-8">
    <div class="flex space-x-2 mb-4 text-xs uppercase font-bold">
      <div class="border py-0.5 p-2 cursor-pointer" @click="model = 'room'">Room</div>
      <div class="border py-0.5 p-2 cursor-pointer" @click="model = 'sticker'">Sticker</div>
    </div>
    <table class="w-full table-fixed divide-y border">
      <thead class="bg-gray-50 text-xs uppercase font-semibold text-gray-900 text-left">
      <tr>
        <th scope="col" class="p-3">Name</th>
        <th scope="col" class="p-3">Images</th>
        <th scope="col" class="p-3">Labels</th>
        <th scope="col" class="p-3 w-20"></th>
      </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white text-sm">
      <tr v-for="(item, i) in response.results" :key="i">
        <td class="py-2 px-3">
          <div class="flex items-center gap-2">
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
          </div>
        </td>
        <td class="py-2 px-3">
          <div v-if="item.sticker_items" class="p-2 grid grid-cols-6 gap-2">
            <sticker-item
              v-for="s in item.sticker_items.slice(0, 6)"
              :key="s.tg_id"
              :is_animated="item.is_animated"
              :is_video="item.is_video"
              :value="s"
            />
          </div>
        </td>
        <td class="py-2 px-3">
          <input
            v-model="item.properties" class="border outline-none p-1.5 px-4 w-full"
            type="text" placeholder="properties"
          >
        </td>
        <td class="py-2 px-3 text-xs uppercase font-bold">
          <div class="border py-1 p-2 cursor-pointer" @click="save(item)">
            <span>Save</span>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import StickerItem from "../../components/StickerItem";
export default {
  name: "index",
  components: {StickerItem},
  head() {
    return {
      title: "Labeling"
    }
  },
  data() {
    return {
      model: 'room',
      response: {
        results: [],
        count: 0
      }
    }
  },
  async fetch() {
    this.response = await this.$axios.$get(`/main/${this.model}s/`, {
      params: this.$route.query,
      headers: {
        'x-cache': new Date().getTime()
      }
    }).then(res => {
      return {
        ...res,
        results: res.results.map(x => {
          return {
            ...x,
            properties: x.properties?.map(y => y.name).join(",")
          }
        })
      }
    })
  },
  watch: {
    model() {
      this.$fetch()
    }
  },
  methods: {
    save(item) {
      this.$axios.$post('/main/make_label/', {
        pwd: this.$route.query.pwd,
        model: this.model,
        id: item.id,
        properties: item.properties.split(","),
        taxonomy: this.$route.query.taxonomy
      })
    }
  }
}
</script>

<style scoped>

</style>
