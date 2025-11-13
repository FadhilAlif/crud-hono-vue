import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { ConfirmationService, ToastService } from "primevue";

const app = createApp(App);

app.use(VueQueryPlugin);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(ToastService);
app.use(ConfirmationService);
app.mount("#app");
