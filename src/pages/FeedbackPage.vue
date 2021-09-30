<template>
  <q-page class="card">
    <div class="q-pa-md">
      <div v-if="sent" class="centerr">
        <div
          value="df  "
          style="height: 100%;border-radius: 20px; padding: 20px"
          :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
        >
          <h3 style="text-align: center; margin: 10px;">Thank you!</h3>
          <div class="flex flex-center q-mb-lg">
            <q-img
              src="../assets/thank-you.gif"
              alt=""
              style="width: 80%; border-radius:20px"
            />
          </div>
          <div class="flex flex-center">
            <q-btn to="/" color="primary" label="Home" size="large" />
          </div>
        </div>
      </div>
      <div v-else>
        <q-stepper
          vertical
          color="primary"
          style="border-radius:20px"
          v-model="ok"
        >
          <h3 style="text-align: center; margin: 10px;">Send Us a Message!</h3>
          <q-input
            filled
            :color="$q.dark.isActive ? 'white' : 'primary'"
            class="q-mx-lg q-my-sm q-mt-xl"
            v-model="name"
            label="Name"
            type="text"
          />
          <q-input
            class="q-mx-lg"
            filled
            :color="$q.dark.isActive ? 'white' : 'primary'"
            v-model="email"
            label="Email (Optional)"
            type="email"
            :rules="[
              val =>
                (val &&
                  val.length > 10 &&
                  val.includes('@') &&
                  val.includes('.')) ||
                'Invalid Email'
            ]"
          />
          <div>
            <q-input
              class="q-ma-lg"
              v-model="message"
              filled
              type="textarea"
              :color="$q.dark.isActive ? 'white' : 'primary'"
              label="Message"
            />
          </div>
          <q-btn
            color="primary"
            label="Submit"
            style="margin-left:40%;"
            :disable="message.length < minCharInMsg"
            @click="onSubmit"
          />
        </q-stepper>
      </div>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      email: "",
      message: "",
      sent: false,
      ok: "",
      minCharInMsg: 4
    };
  },
  methods: {
    onSubmit() {
      if (this.message.length < this.minCharInMsg) return
        var payload = {
          name: this.name,
          email: this.email,
          text: this.message
        };
      axios
        .post("https://jntua.plasmatch.in/feedback", payload)
        .then(response => {
          if (response.status === 200) {
            this.$q.notify({
              type: "positive",
              message: "Message Sent!",
              position: "top",
              duration: 50
            });
            console.log(response);
            this.sent = !this.sent;
          }
        })
        .catch(error => {
          if (error.response) {
            console.log("bad requset");
            this.$q.notify({
              type: "negative",
              message: "Enter A Valid Email or Try Again Later :(",
              position: "top",
              duration: 50
            });
          }
        });
    }
  }
};
</script>
<style>
.card {
  max-width: 800px;
  margin-top:50px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 5px;
}
.centerr {
  margin-left: auto;
  margin-right: auto;
}
</style>
