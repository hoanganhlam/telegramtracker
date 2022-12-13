<template>
  <div :class="{dark: dark}">
    <div class="px-4 dark:bg-black dark:text-white min-h-screen dark:fill-gray-500 bg-stone-100">
      <p-header :dark="dark"/>
      <div class="content-wrapper">
        <div class="main-wrapper">
          <div class="flex-1">
            <nuxt/>
          </div>
          <div class="max-w-4xl mx-auto text-xs text-gray-500 flex gap-4">
            <div class="py-1">Copyright © 2021 telegramtracker.com</div>
            <div class="py-1 flex space-x-3 fill-gray-500">
              <a href="https://twitter.com/telegramtracker" target="_blank">
                <icon name="twitter"/>
              </a>
              <a  href="https://pinterest.com/telegramtracker" target="_blank">
                <icon name="pinterest" class="fill-red-500"/>
              </a>
            </div>
            <div v-if="false" class="flex-1 flex justify-end fill-gray-500">
              <div
                  class="py-1 cursor-pointer"
                  :class="{'fill-green-500': dark}"
                  @click="dark = !dark">
                <icon name="sun"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <adapter/>
    </div>
  </div>
</template>

<script>

import Adapter from "../components/Modal/Adapter";
import PHeader from "../components/Header";

export default {
  name: "LayoutDefault",
  components: {PHeader, Adapter},
  head() {
    const meta = this.$store.state.config.meta
    return {
      title: meta.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: meta.desc
        },
        {
          property: 'og:title',
          hid: 'og:title',
          name: 'og:title',
          content: meta.title,
        },
        {
          property: 'og:description',
          hid: 'og:description',
          name: 'og:description',
          content: meta.desc,
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        }
      ],
    }
  },
  data() {
    return {
      dark: false
    }
  },
  methods: {
    switch() {
      if (this.dark) {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
    }
  },
  watch: {
    dark() {
      this.switch()
    }
  },
  mounted() {
    this.switch()
  }
}
</script>

<style>
.main-wrapper {
  @apply flex flex-col;

  min-height: calc(100vh - 98px);
}
</style>
