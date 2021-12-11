<template>
  <div>
    <q-card class="sgpa-container q-px-lg rounded" flat>
      <div class="q-px-sm">
        <q-knob
          readonly
          v-model="sgpaNumber"
          show-value
          size="90px"
          :thickness="0.22"
          :max="10"
          color="green"
          track-color="grey-3"
          class=" q-ma-md"
        ></q-knob>
        <div class=" text-center" style="font-size:1.3rem">
          {{ year }}-{{ sem }}
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  props: ["sgpa", "year", "sem"],
  data() {
    return {
      sgpaNumber:this.sgpa
    };
  }
};
</script>

<style scoped></style>
