<template>
  <div class="container">
    <q-card
      class="card rounded bg-gray"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
      :style=" active?'border: 5px solid #ff4d01;':''"
      flat
    >
      <q-knob
        class=" q-ma-md"
        :style="knobStyle"
        readonly
        v-model="sgpaNumber"
        show-value
        size="90px"
        :thickness="0.22"
        :max="10"
        color="green"
        track-color="grey-3"
      ></q-knob>
      <div class="text-center" style="font-size:1.3rem">
        {{ year }}-{{ sem }}
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  props: ["sgpa", "year", "sem", "active"],
  data() {
    return {
      sgpaNumber: this.sgpa
    };
  },
  computed: {
    knobStyle() {
      return `filter: drop-shadow(0 0 0.5rem ${
        this.sgpaNumber > 0 ? "green" : "red"
      });`;
    }
  }
};
</script>

<style scoped>
.active {
  background: #3f3f3f;
}
.inactive {
  background: #1d1d1d88;
}
.card{
  transition: border 0.2s ease-out;
}
</style>
