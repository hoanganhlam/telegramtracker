<template>
  <div class="space-y-3">
    <div
      class="border flex px-4 py-2 rounded cursor-pointer hover:shadow items-center gap-3"
      @click="$aptos.connect('Martian')">
      <img class="w-5 h-5" src="/wallets/Martian.png" alt="">
      <span>Martian</span>
    </div>
    <div
      class="border flex px-4 py-2 rounded cursor-pointer hover:shadow items-center gap-3"
      @click="$aptos.connect('Potem')">
      <img class="w-5 h-5" src="/wallets/Potem.png" alt="">
      <span>Potem</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConnectWallet",
  mounted() {

  }
}
</script>

<style scoped>

</style>
