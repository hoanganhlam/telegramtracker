<template>
  <div class="modal" v-if="modal">
    <div class="modal-wrap">
      <div class="mask" @click="closeModal"></div>
      <div class="body">
        <div>
          <div class="close" @click="closeModal">
            <icon name="close" class="medium sm"></icon>
            <span>close</span>
          </div>
        </div>
        <div class="relative bg-white rounded-bl rounded-br rounded-tr">
          <div class="text-black p-4">
            <connect-wallet/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConnectWallet from "@/components/Modal/ConnectWallet";

export default {
  name: "Adapter",
  components: {ConnectWallet},
  computed: {
    modal() {
      return this.$store.state.config.modal
    }
  },
  methods: {
    closeModal() {
      this.$store.commit('config/SET_MODAL', null)
    }
  }
}
</script>

<style>
.modal {
  @apply fixed top-0 left-0 right-0 bottom-0 z-30;
}

.modal .mask {
  @apply fixed top-0 left-0 right-0 bottom-0 bg-green-800 opacity-40;
}

.modal .modal-wrap {
  @apply fixed top-0 left-0 right-0 bottom-0 z-10 flex flex-col items-center justify-center;
}

.modal .body {
  width: calc(100% - 32px);
  @apply md:w-1/2 lg:w-1/3 mx-auto relative z-20 flex flex-col rounded-bl rounded-br;
  max-width: 450px;
  height: 85%;
}

.modal .close {
  @apply cursor-pointer px-4 py-1 bg-white inline-flex text-xs inline-flex space-x-2 items-center font-bold uppercase rounded-tl rounded-tr h-full border-b text-black;
}
</style>
