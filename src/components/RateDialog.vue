<template>
  <q-dialog v-model="confirm" ref="dialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Rate this app 😁</div>
      </q-card-section>
      <q-rating
        v-model="rating"
        max="5"
        size="3.5em"
        color="yellow"
        icon="star_border"
        icon-selected="star"
        icon-half="star_half"
        no-dimming
      />
      <q-card-section class="row items-center">
        or leave a feedback! 🙋‍♀️
      </q-card-section>
      <q-card-actions align="right" class="q-ma-sm">
        <q-btn flat color="primary" v-close-popup label="Feedback" />
        <q-btn
          flat
          :label="'OK' + waitTime"
          @click="confirm = false"
          :disabled="closeWaitTime > 0"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      confirm: true,
      rating: 2.5,
      closeWaitTime: 5
    };
  },
  mounted() {
    setInterval(() => {
      if (this.closeWaitTime > 0) this.closeWaitTime -= 1;
    }, 1000);
  },
  computed: {
    waitTime() {
      return  this.closeWaitTime>0? '(' + this.closeWaitTime + ')' :'';
    }
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
