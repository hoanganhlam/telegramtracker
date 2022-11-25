import {NuxtCookies} from 'cookie-universal-nuxt'
import {AccountKeys, NetworkInfo, WalletAdapter} from "~/helpers/aptos/WalletAdapters/BaseAdapter";

interface AuthStore {
  account: AccountKeys
  network: NetworkInfo
  wallet: string
}

interface APTWallet {
  adapter: WalletAdapter
  connect: (network: string) => void
  setAuth: (auth: AuthStore) => void
}

declare module 'vue/types/vue' {
  interface Vue {
    ck: NuxtCookies
    aptos: APTWallet
  }
}
