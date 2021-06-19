<template>
  <q-layout view="hHh lpR fFf">
    <q-header class=" bg-white text-black " style="height:100px">
      <div class="bg-primary text-white">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="left = !left" />
          <q-space />
          <!-- <q-btn flat round icon="search" class="q-mr-xs" @click="toggleTheme()" /> -->
          <q-btn flat round disabled dense icon="search" class="q-mr-xs" />
          <q-btn flat round disabled dense icon="group_add" />
        </q-toolbar>
        <q-toolbar inset>
          <q-toolbar-title
            ><strong>JNTUA</strong> Results analyser</q-toolbar-title
          >
        </q-toolbar>
      </div>
    </q-header>

    <q-drawer v-model="left" side="left" overlay bordered>
      <!-- drawer content -->
      <div class="q-pa-md">
        <q-list class="rounded-borders text-primary">
          <q-item
            clickable
            v-ripple
            :active="link === 'single-result'"
            @click="link = 'single-result'"
            active-class="bg-primary"
            to="/single-result"
          >
            <q-item-section avatar>
              <q-icon name="person_outline" />
            </q-item-section>

            <q-item-section>Single result</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="link === 'multi-result'"
            @click="link = 'multi-result'"
            active-class="bg-primary"
            to="/multi-result"
          >
            <q-item-section avatar>
              <q-icon name="person_add_alt" />
            </q-item-section>

            <q-item-section>Multi result</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="link === 'sem-result'"
            @click="link = 'sem-result'"
            active-class="bg-primary"
            to="/sem-result"
          >
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>

            <q-item-section>Sem Result</q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item
            clickable
            v-ripple
            :active="link === 'feedback'"
            @click="link = 'feedback'"
            active-class="bg-primary"
            to="/feedback"
          >
            <q-item-section avatar>
              <q-icon name="feedback" />
            </q-item-section>

            <q-item-section>Feedback</q-item-section>
          </q-item>

          <q-item
            clickable
            disabled
            v-ripple
            :active="link === 'help'"
            @click="link = 'help'"
            active-class="bg-primary"
          >
            <q-item-section avatar>
              <q-icon name="help" />
            </q-item-section>

            <q-item-section>Help</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container class="bg-grey-4" style="min-height:1000px">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      left: false,
      link: "single-result"
    };
  },
  methods:{
    toggleTheme(){
      this.$q.dark.toggle()
      console.log(this.$q.dark.isActive)
    }
  }
};
</script>
<style>
/* @import "tailwindcss/base"; */
/* @import "tailwindcss/components"; */
/* @import "tailwindcss/utilities"; */
.bg-primary {
  color: white;
  background: #f2c037;
}
</style>
