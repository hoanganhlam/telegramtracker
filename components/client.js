import Vue from "vue";
import VueTippy, {TippyComponent} from "vue-tippy";

Vue.use(VueTippy);
Vue.component("tippy", TippyComponent);

window.checkVisible = (el) => {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const elemTop = rect.top;
  const elemBottom = rect.bottom;
  return (elemTop >= 0) && (elemBottom <= window.innerHeight);
}
