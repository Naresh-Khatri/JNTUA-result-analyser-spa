<template>
  <q-layout view="hHh lpR fFf">
    <q-header :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
      <div class="bg-primary text-white">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="left = !left" />
          <q-space />

          <transition name="fade" mode="out-in">
            <q-btn
              flat
              v-if="!$q.dark.isActive"
              round
              key="1"
              icon="dark_mode"
              class="q-mr-xs"
              size="lg"
              @click="toggleTheme()"
            />
            <q-btn
              flat
              round
              key="2"
              v-else
              icon="light_mode"
              class="q-mr-xs"
              size="lg"
              @click="toggleTheme()"
            />
          </transition>
          <!-- <q-btn flat round disabled dense icon="search" class="q-mr-xs" />
          <q-btn flat round disabled dense icon="group_add" /> -->
        </q-toolbar>
        <q-toolbar inset style="padding:0px">
          <q-toolbar-title class="text-center"
            ><strong>JNTUA</strong> Results analyser</q-toolbar-title
          >
        </q-toolbar>
      </div>
    </q-header>

    <q-drawer v-model="left" side="left" overlay bordered>
      <!-- drawer content -->
      <div class="q-pa-md">
        <q-list
          class="rounded-borders text-primary"
          :style="$q.screen.lt.md ? 'margin-top:200px' : ''"
        >
          <!-- <q-item
            clickable
            v-ripple
            :active="link === 'personal-perf'"
            @click="link = 'personal-perf'"
            active-class="bg-primary"
            to="/personal-perf"
          >
            <q-item-section avatar>
              <q-icon name="person_outline" />
            </q-item-section>

            <q-item-section>Personal Performance</q-item-section>
          </q-item> -->
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

            <q-item-section>Single</q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            :active="link === 'compare-result'"
            @click="link = 'compare-result'"
            active-class="bg-primary"
            to="/compare-result"
          >
            <q-item-section avatar>
              <q-icon name="person_add_alt" />
            </q-item-section>

            <q-item-section>Compare</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="link === 'batch-result'"
            @click="link = 'batch-result'"
            active-class="bg-primary"
            to="/batch-result"
          >
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>

            <q-item-section>Batch</q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item
            clickable
            v-ripple
            :active="link === 'stats'"
            @click="link = 'stats'"
            active-class="bg-primary"
            to="/stats"
          >
            <q-item-section avatar>
              <q-icon name="leaderboard" />
            </q-item-section>

            <q-item-section>Stats</q-item-section>
          </q-item>
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

    <q-page-container
      :class="$q.dark.isActive ? 'dark' : 'bg-grey-4'"
      style="transition: background-color .3s"
    >
      <div class="snowflake" v-for="i in 50" :key="i"></div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import WelcomDialog from "src/components/WelcomDialog.vue";
import RateDialog from "src/components/RateDialog.vue";
export default {
  data() {
    return {
      left: false,
      link: "single-result"
    };
  },
  mounted() {
    this.$q.loadingBar.setDefaults({
      color: "white",
      size: "15px"
    });
    this.$q.addressbarColor.set("#ff4d01");
    this.$q.dark.toggle();
    // this.$q.dialog({
    //   persistent: true,
    //   component: RateDialog
    // });
    if (!window.location.href.includes("8080"))
      //patch logs
      this.$q.dialog({
        //   title: "New Features! 👩‍🔧",
        //   html: true,
        //   message: `<li style='font-size:1.2em'>
        // 🆕 Added 🏆statstics for every college</li>
        // <li style='font-size:1.2em'>
        // Now you can share any result with your friends😎🤟</li>
        //   <br>
        //   If you want this app to get better then head over to
        //   the feedback section on top 🙋‍♀️
        //   `
        component: WelcomDialog
      });
    localStorage.setItem("logDisplayed", true);
  },
  methods: {
    toggleTheme() {
      this.$q.dark.toggle();
    },
    show() {
      this.$refs.dialog.show();
    }
  }
};
</script>
<style lang="scss" scoped>
.snowflake {
  --size: 1vw;
  width: var(--size);
  height: var(--size);
  background: white;
  border-radius: 50%;
  position: absolute;
  top: -5vh;
}

@keyframes snowfall {
  0% {
    transform: translate3d(var(--left-ini), 0, 0);
  }
  100% {
    transform: translate3d(var(--left-end), 110vh, 0);
  }
}

@for $i from 1 through 50 {
  .snowflake:nth-child(#{$i}) {
    --size: #{random(5) * 0.2}vw;
    --left-ini: #{random(20) - 10}vw;
    --left-end: #{random(20) - 10}vw;
    left: #{random(100)}vw;
    animation: snowfall #{5 + random(10)}s linear infinite;
    animation-delay: -#{random(10)}s;
  }
}
/* added small blur every 6 snowflakes*/
.snowflake:nth-child(6n) {
  filter: blur(1px);
}
.snowflake:nth-child(5n) {
  filter: blur(4px);
}
</style>
<style>
.rounded {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  /* background-color: rgba(17, 25, 40, 0.75); */
  opacity: 0.9;
}

.body--light {
  background: #e0e0e0;
  transition: 0.3s;
}
.bg-primary {
  color: white;
  background: #f2c037;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
.fade-enter {
  opacity: 0;
  transform: rotate(-90deg);
}
.fade-leave-to {
  opacity: 0;
  transform: rotate(90deg);
}
.q-drawer__backdrop,
.q-dialog__backdrop {
  backdrop-filter: blur(3px);
}
</style>
