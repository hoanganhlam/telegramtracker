<template>
  <div>
    <room-view v-if="viewName === 'detail'"/>
    <result-view v-else/>
  </div>
</template>

<script>
import ResultView from "@/components/views/ResultView";
import RoomView from "@/components/views/RoomView";

export default {
  name: "IDStringPage",
  components: {RoomView, ResultView},
  computed: {
    viewName() {
      const {id_string, type, taxonomy} = this.$route.params
      if (!id_string && taxonomy && ["group", "channel", "sticker"].includes(type)) {
        return 'detail'
      }
      return 'list'
    },
  },
  async fetch() {
    this.$store.commit('config/SET_RESPONSE', null)
    this.$store.commit('config/SET_RESPONSE2', null)
    this.$store.commit('config/SET_RESPONSE3', null)
    this.$store.commit('config/SET_ROOM', null)
    if (this.viewName === 'detail') {
      if (["group", "channel"].includes(this.$route.params.type)) {
        const now = new Date()
        const next = new Date()
        next.setDate(next.getDate() - 7)
        const q = {
          params: {
            "room__id_string": this.$route.params.taxonomy,
            "page_size": -1,
            "date_after": next.toISOString(),
            "date_before": now.toISOString()
          }
        }
        const res = await Promise.all([
          this.$axios.$get(`/main/rooms/${this.$route.params.taxonomy}/`),
          this.$axios.$get(`/main/snapshots/`, q),
          this.$axios.$get(`/main/posts/`, q)
        ])
        this.$store.commit('config/SET_ROOM', res[0])
        this.$store.commit('config/SET_RESPONSE_SNAPSHOT', res[1].reverse())
        this.$store.commit('config/SET_RESPONSE_POST', res[2])
      } else {
        this.$store.commit(
          'config/SET_ROOM',
          await this.$axios.$get(`/main/stickers/${this.$route.params.taxonomy}/`)
        )
      }
    } else {
      const inters = []
      inters.push(Promise.resolve(null));
      inters.push(Promise.resolve(null));
      inters.push(Promise.resolve(null));
      const q = {
        page: this.$route.query.page,
        properties__taxonomy: this.$route.params.taxonomy,
        properties__id_string: this.$route.params.id_string,
        page_size: !this.$route.params.type ? 6 : 21,
        search: this.$store.state.config.search
      }
      if (!this.$route.params.type || this.$route.params.type === 'channel') {
        inters[0] = this.$axios.$get('/main/rooms/', {
          params: {
            ...q,
            is_group: false
          },
          headers: {
            'X-Cache': 'client'
          }
        })
      }
      if (!this.$route.params.type || this.$route.params.type === 'group') {
        inters[1] = this.$axios.$get('/main/rooms/', {
          params: {
            ...q,
            is_group: true
          },
          headers: {
            'X-Cache': 'client'
          }
        })
      }
      if (!this.$route.params.type || this.$route.params.type === 'sticker') {
        inters[2] = this.$axios.$get('/main/stickers/', {
          params: {
            ...q,
            page_size: !this.$route.params.type ? 3 : 9,
          },
          headers: {
            'X-Cache': 'client'
          }
        })
      }
      const rs = await Promise.all(inters)
      this.$store.commit('config/SET_RESPONSE', rs[0])
      this.$store.commit('config/SET_RESPONSE2', rs[1])
      this.$store.commit('config/SET_RESPONSE3', rs[2])
    }
    const room = this.$store.state.config.room
    const r1 = this.$store.state.config.response
    const r2 = this.$store.state.config.response2
    const r3 = this.$store.state.config.response3
    let title = 'Telegram Tracker'
    let desc = 'Easiest way to track any telegram channel and group'
    if (room) {
      title = `${room.name} ${this.$route.params.type}`
      desc = room.desc
    } else if (r1.instance) {
      title = `${r1.instance.name} Telegram ${this.$route.params.type}s`
      desc = r1.instance.desc
    } else if (r2.instance) {
      title = `${r2.instance.name} Telegram ${this.$route.params.type}s`
      desc = r2.instance.desc
    } else if (r3.instance) {
      title = `${r3.instance.name} Telegram ${this.$route.params.type}s`
      desc = r3.instance.desc
    } else if (this.$route.params.type === 'group') {
      title = "Best Telegram Groups"
    } else if (this.$route.params.type === 'channel') {
      title = "Best Telegram Channels"
    } else if (this.$route.params.type === 'sticker') {
      title = "Best Telegram Stickers"
    }
    this.$store.commit('config/SET_META', {
      title,
      desc
    })
  },
  watch: {
    "$route.query"() {
      this.$fetch()
    },
    "$store.state.config.search"() {
      this.$fetch()
    }
  }
}
</script>

<style scoped>

</style>
