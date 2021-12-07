<template>
  <div>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated hinge"
    >
      <div v-if="!disabled" class="q-mx-lg">
        <div class="container">
          <q-icon name="info" />
          <p
            class="text-bold"
            style="font-weight:700; margin:0; display:inline;"
          >
            {{ title }}
          </p>
          <span class="float-right"
            ><q-btn icon="close" round @click="disable" size="sm" flat />
          </span>
          <div>
            <p>{{ desc }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: ["title", "desc"],
  data() {
    return {
      disabled: false
    };
  },
  mounted() {
    // this.$q.tipsDisabled = false;
  },
  methods: {
    disable() {
      this.disabled = true;
    }
  }
};
</script>

<style scoped>
.container {
  display: block;
  border-radius: 4px;
  margin: 16px 0;
  padding: 16px 24px;
  font-size: 1em;
  border-width: 0 5px;
  border-style: solid;
  background-color: rgba(193, 244, 205, 0.562);
  border-color: #21ba45;
  /* background-color: rgba(255, 77, 1, 0.116);
  border-color: #ff4d01; */
  letter-spacing: 0.5px;
}
p {
  margin: 0 0 16px;
}
</style>
