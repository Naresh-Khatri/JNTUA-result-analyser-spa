<template>
  <div class="q-mx-lg">
    <div class="container">
      <q-icon name="info"/>
      <p class="text-bold" style="font-weight:700; margin:0; display:inline;">
        {{ title }}
      </p>
      <p>{{ desc }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "desc"]
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
  letter-spacing: 0.5px;
}
p {
  margin: 0 0 16px;
}
</style>
