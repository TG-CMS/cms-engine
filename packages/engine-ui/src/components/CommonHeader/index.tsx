import { computed,defineComponent } from "vue";
import logoSrc from "@/assets/vue.svg";
import styles from "./style.module.less";
import { useRoute,useRouter } from "vue-router";
const Logo= defineComponent({
  setup() {
    const router = useRouter();
    return () => (
      <div class={styles.headerLogo} onClick={() => router.push("/")}>
        <img src={logoSrc} alt="" />
      </div>
    );
  },
});

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    const name = computed(() => route.name);
    return () => (
      <header class={styles.header}>
        <div class={styles.headerWrap}>
          <div class={styles.headerLeft}>
            <Logo />
            <ul class={styles.headerMenu}>
              <li
                class={[styles.headerMenuItem, name.value === "tpl" ? styles.active : null]}
                onClick={() => router.push("/")}
              >
                <span class="anticon anticon-code">
                  <svg
                    focusable="false"
                    data-icon="code"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M921.6 102.4v358.4h-256V102.4h256M358.4 102.4v153.6H102.4V102.4h256m0 460.8v358.4H102.4v-358.4h256m563.2 204.8v153.6h-256v-153.6h256m0-768h-256c-56.32 0-102.4 46.08-102.4 102.4v358.4c0 56.32 46.08 102.4 102.4 102.4h256c56.32 0 102.4-46.08 102.4-102.4V102.4c0-56.32-46.08-102.4-102.4-102.4zM358.4 0H102.4C46.08 0 0 46.08 0 102.4v153.6c0 56.32 46.08 102.4 102.4 102.4h256c56.32 0 102.4-46.08 102.4-102.4V102.4c0-56.32-46.08-102.4-102.4-102.4z m0 460.8H102.4c-56.32 0-102.4 46.08-102.4 102.4v358.4c0 56.32 46.08 102.4 102.4 102.4h256c56.32 0 102.4-46.08 102.4-102.4v-358.4c0-56.32-46.08-102.4-102.4-102.4z m563.2 204.8h-256c-56.32 0-102.4 46.08-102.4 102.4v153.6c0 56.32 46.08 102.4 102.4 102.4h256c56.32 0 102.4-46.08 102.4-102.4v-153.6c0-56.32-46.08-102.4-102.4-102.4z"></path>
                  </svg>
                </span>
                <div class={styles.headerMenuText}>模板中心</div>
              </li>

              <li
                class={[styles.headerMenuItem, name.value === "cp" ? styles.active : null]}
                onClick={() => router.push("/components")}
              >
                <span class="anticon anticon-code">
                  <svg
                    focusable="false"
                    data-icon="code"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="4130"
                  >
                    <path
                      d="M119.808 463.872l345.088 0L464.896 133.12c0-66.56-54.272-119.808-119.808-119.808l-225.28 0C54.272 13.312 0 67.584 0 133.12l0 209.92C0 409.6 54.272 463.872 119.808 463.872zM71.68 133.12c0-26.624 21.504-48.128 48.128-48.128l225.28 0c26.624 0 48.128 21.504 48.128 48.128l0 258.048L119.808 391.168c-26.624 0-48.128-21.504-48.128-48.128L71.68 133.12z"
                      p-id="4131"
                    ></path>
                    <path
                      d="M1024 344.064 1024 133.12c0-66.56-53.248-119.808-119.808-119.808L681.984 13.312c-66.56 0-119.808 54.272-119.808 119.808l0 330.752 343.04 0C970.752 463.872 1024 409.6 1024 344.064zM952.32 344.064c0 26.624-21.504 48.128-48.128 48.128l-264.192 0-6.144 0L633.856 133.12c0-26.624 21.504-48.128 48.128-48.128l222.208 0c26.624 0 48.128 21.504 48.128 48.128L952.32 344.064z"
                      p-id="4132"
                    ></path>
                    <path
                      d="M681.984 1010.688l227.328 0c66.56 0 114.688-54.272 114.688-119.808L1024 679.936c0-66.56-53.248-119.808-119.808-119.808L561.152 560.128 561.152 890.88C561.152 956.416 615.424 1010.688 681.984 1010.688zM633.856 631.808l270.336 0c26.624 0 48.128 21.504 48.128 48.128L952.32 890.88c0 26.624-21.504 48.128-48.128 48.128L681.984 939.008c-26.624 0-48.128-21.504-48.128-48.128L633.856 631.808z"
                      p-id="4133"
                    ></path>
                    <path
                      d="M119.808 1010.688l225.28 0c66.56 0 119.808-54.272 119.808-119.808L464.896 560.128 119.808 560.128C54.272 560.128 0 614.4 0 679.936L0 890.88C0 956.416 54.272 1010.688 119.808 1010.688zM71.68 679.936c0-26.624 21.504-48.128 48.128-48.128l273.408 0L393.216 890.88c0 26.624-21.504 48.128-48.128 48.128l-225.28 0C93.184 939.008 71.68 916.48 71.68 890.88L71.68 679.936z"
                      p-id="4134"
                    ></path>
                  </svg>
                </span>
                <div class={styles.headerMenuText}>组件中心</div>
              </li>
              <li
                class={[styles.headerMenuItem, name.value === "tpledit" ? styles.active : null]}
                onClick={() => router.push("/tpledit")}
              >
                <span class="anticon anticon-code">
                  <svg
                    focusable="false"
                    data-icon="code"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2471"
                  >
                    <path
                      d="M315.904 338.688V908.48c0 19.328 15.168 34.496 34.432 34.496a34.112 34.112 0 0 0 34.496-34.496V338.688a34.112 34.112 0 0 0-34.496-34.432 34.112 34.112 0 0 0-34.432 34.432zM822.144 64H201.856A138.24 138.24 0 0 0 64 201.856v620.288A138.24 138.24 0 0 0 201.856 960h620.288A138.24 138.24 0 0 0 960 822.144V201.856A138.24 138.24 0 0 0 822.144 64zM896 826.24c0 38.4-31.36 69.76-69.76 69.76H197.76c-38.4 0-69.76-31.36-69.76-69.76V197.76c0-38.4 31.36-69.76 69.76-69.76h628.48c38.4 0 69.76 31.36 69.76 69.76v628.48z m14.72-555.52H113.28a34.112 34.112 0 0 0-34.56 34.56c0 19.2 15.232 34.432 34.56 34.432h797.44a34.112 34.112 0 0 0 34.56-34.496 34.112 34.112 0 0 0-34.56-34.432z"
                      p-id="2472"
                    ></path>
                  </svg>
                </span>
                <div class={styles.headerMenuText}>模板开发</div>
              </li>
            </ul>
          </div>
          <div class={styles.headerRight}></div>
        </div>
      </header>
    );
  },
});
