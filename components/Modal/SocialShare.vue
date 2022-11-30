<template>
  <div v-if="modalData" class="md:max-w-md mx-auto space-y-3 rounded-xl">
    <div class="text-xl font-semibold">Share with your friends</div>
    <div class="flex items-center gap-3">
      <ShareNetwork
        v-for="item in socials"
        :key="item.name"
        :network="item.name"
        :url="modalData.url"
        :title="modalData.title"
        :hashtags="modalData.hashtag"
      >
        <div
          class="rounded-xl flex items-center p-3 justify-center"
          :style="{ backgroundColor: item.color }"
        >
          <icon class="fill-white" :name="item.icon" />
        </div>
      </ShareNetwork>
    </div>
    <div class="space-y-2 text-xs">
      <div class="uppercase text-gray-500 font-semibold">Copy link</div>
      <div class="flex px-3 py-1 rounded border items-center">
        <input
          v-if="modalData"
          class="flex-1 bg-transparent text-sm"
          disabled
          :value="modalData.url"
        />
        <div class="p-2 rounded cursor-pointer" @click="copy(modalData.url)">
          {{ isCopy ? 'Copied' : 'Copy' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SocialShare",
  data() {
    return {
      socials: [
        {
          name: 'twitter',
          icon: 'twitter',
          color: '#1DA1F2',
        },
        {
          name: 'facebook',
          icon: 'facebook',
          color: '#1877F2',
        },
        {
          name: 'whatsapp',
          icon: 'whatsapp',
          color: '#25D366',
        },
        {
          name: 'telegram',
          icon: 'telegram',
          color: '#0088CC',
        },
      ],
      isCopy: false
    }
  },
  computed: {
    modalData() {
      return this.$store.state.config.modal?.data
    }
  },
  methods: {
    copy(text) {
      if (!navigator.clipboard) return
      navigator.clipboard.writeText(text)
      this.isCopy = true
    }
  }
}
</script>
