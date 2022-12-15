<template>
  <div
    v-if="value"
    class="pt-full relative group"
    @mouseenter="onMouseOver(true)"
    @mouseleave="onMouseOver(false)"
  >
    <div class="absolute inset-0 flex items-center justify-center bg-gray-200">
      <video
        v-if="is_video"
        v-lazy-load ref="player" class="w-full h-full object-contain"
      >
        <source :data-src="path">
      </video>
      <img
        v-else-if="!is_animated" :data-src="path" :alt="title + ' #' + value.tg_id"
        v-lazy-load
        class="w-full h-full object-contain"
      >
      <div v-else-if="is_animated" ref="player">
        <img
          v-if="!loaded"
          v-lazy-load
          :data-src="thumbPath" :alt="title + ' #' + value.tg_id"
          class="w-full h-full object-contain"
        >
      </div>
    </div>
    <div
      v-if="!is_animated && !is_video"
      class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 duration-300 cursor-pointer"
      @click="pin"
    >
      <icon name="pinterest" class="fill-red-600 lg"/>
    </div>
  </div>
</template>

<script>
import lottie from 'lottie-web';

export default {
  name: "StickerItem",
  props: {
    title: {},
    is_animated: {
      default: false,
      type: Boolean
    },
    is_video: {
      default: false,
      type: Boolean
    },
    value: {},
  },
  data() {
    return {
      anime: null,
      loading: false,
      loaded: false
    }
  },
  computed: {
    path() {
      return `${this.$config.API_DOMAIN}${this.value.path}`
    },
    thumbPath() {
      let path = this.value.path
      if (this.is_animated) {
        path = path.replace("/files/media/", "/files/media/thumb/").replace(".json", ".png")
      }
      return `${this.$config.API_DOMAIN}${path}`
    }
  },
  methods: {
    pin() {
      const url = `https://www.pinterest.com/pin/create/button/?url=${window.location.href}&description=${this.title}&media=${this.$config.API_DOMAIN}${this.value.path}`
      const newWindow = window.open(url, "Pin It", 'height=728,width=728,toolbar=0,menubar=0,location=0');
      if (window.focus) {
        newWindow.focus()
      }
      return false;
    },
    async onMouseOver(isEnter) {
      if (this.loading) return;
      if (this.is_animated && !this.anime) {
        await this.init()
      }
      if (this.is_video) {
        if (isEnter) {
          this.$refs.player?.play()
        } else {
          this.$refs.player?.pause()
        }
      } else if (this.anime) {
        if (isEnter) {
          this.anime.play()
        } else {
          this.anime.pause()
        }
      }
    },
    async init() {
      if (!this.$refs.player) return;
      this.loading = true
      const res = await this.$axios.$get(this.path)
      this.anime = await lottie.loadAnimation({
        container: this.$refs.player,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData: JSON.parse(JSON.stringify(res)),
        rendererSettings: {}
      })
      this.loaded = true
      this.loading = false
    }
  },
}
</script>

<style scoped>

</style>
