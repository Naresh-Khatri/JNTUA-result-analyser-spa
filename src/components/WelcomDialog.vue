<template>
  <q-dialog v-model="confirm" ref="dialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">New Features! 👩‍🔧</div>
      </q-card-section>
      <q-card-section class="row items-center">

        Most anticipated feature is here!
        <li style="font-size:1.2em">
          View regular + supply result COMBINED!!
        </li>
        <li style="font-size:1.2em">
          Join the telegram group and ask for help!
        </li>
        <br />
        If you want this app to get better then head over to the feedback
        section on top 🙋‍♀️
      </q-card-section>

      <q-card-actions align="right" class="q-ma-sm">
        <q-btn flat color="primary" v-close-popup @click="openInvLink">
          <img style="height:40px" src="../assets/telegram-logo.png" />
          <div class="q-ml-sm">join</div>
        </q-btn>
        <q-btn flat label="OK" color="primary" @click="confirm = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      confirm: true
    };
  },
  methods: {
    openInvLink() {
      window.open("https://t.me/joinchat/t-5F6U3drIxmZmQ9");
    },
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      this.$refs.dialog.show();
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit("hide");
    },

    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit("ok");
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide();
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide();
    }
  }
};
</script>
