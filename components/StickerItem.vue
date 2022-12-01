<template>
  <div
    v-if="value"
    class="pt-full relative group"
  >
    <div class="absolute inset-0 flex items-center justify-center bg-gray-200">
      <client-only v-if="is_animated">
        <lottie-player
          ref="player"
          loop
          :src="value.path"
          speed="1"
          @mouseenter="onMouseOver(true)"
          @mouseleave="onMouseOver(false)"
        />
      </client-only>
      <video
        ref="player"
        v-else-if="is_video" class="w-full h-full object-contain"
        @mouseenter="onMouseOver(true)"
        @mouseleave="onMouseOver(false)"
      >
        <source :src="value.path">
      </video>
      <img v-else :src="value.path" :alt="value.tg_id" class="w-full h-full object-contain">
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
    value: {}
  },
  methods: {
    pin() {
      const url = `https://www.pinterest.com/pin/create/button/?url=${window.location.href}&description=${this.title}&media=${this.value.path}`
      const newWindow=window.open(url, "Pin It",'height=728,width=728,toolbar=0,menubar=0,location=0');
      if (window.focus) {newWindow.focus()}
      return false;
    },
    onMouseOver(isEnter) {
      if (isEnter) {
        this.$refs.player.play()
      } else {
        this.$refs.player.pause()
      }
    }
  }
}
</script>

<style scoped>

</style>
