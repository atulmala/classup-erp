<template>
  <v-app>
    <v-content>
      <v-container fluid class="pa-md-4 mx-lg-auto"></v-container>
      <v-layout xs4 row wrap justify-center>
        <v-col cols="12" md="10" v-for="item in message_list">
          <v-card class="mx-auto">
            <v-card-title>{{ item.date }}</v-card-title>
            <v-card-text>
              <v-list-item-content>
                <div
                  class="overline mb-4"
                >{{ item.the_class }} - {{ item.section }} {{ item.sent_to }}</div>
              </v-list-item-content>
              {{ item.message }}
            </v-card-text>
            <v-card-actions>
              <v-btn text color="deep-purple accent-4" @click="show_recepients(item.id)">Recepients</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-layout>
      <div class="text-center">
        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>Recepients List</v-card-title>
            <v-card-text>
              <v-chip-group multiple column active-class="primary--text">
                <v-chip
                  v-for="recepient in recepient_list"
                  :color="colors[Math.floor(Math.random() * 37)]"
                  :key="recepient.student"
                  @click="show_delivery_status(recepient)"
                >{{ recepient.student }}</v-chip>
              </v-chip-group>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-snackbar absolute top multi-line v-model="snackbar">
                {{ delivery_status }}
                <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
              </v-snackbar>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <template>
        <div class="text-xs-center">
          <v-progress-circular v-if="waiting" :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
        </div>
      </template>
    </v-content>
  </v-app>
</template>
    
      
<script>
import axios from "axios";
export default {
  data() {
    return {
      ip: "",
      school_id: "",
      coming_from: "",
      teacher: "",
      loader: null,
      loading: false,
      message_list: [],
      recepient_list: [],
      dialog: "false",
      delivery_status: "",
      snackbar: false,

      colors: [],
      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      alert_color: "",
      waiting: false
    };
  },
  mounted: function() {
    let self = this;
    self.colors = this.$store.getters.get_colors;
    self.dialog = false;
    this.ip = this.$store.getters.get_server_ip;
    this.coming_from = this.$store.getters.get_coming_from;
    this.school_id = this.$store.getters.get_school_id;
    this.teacher = this.$store.getters.get_logged_user;
    let url = self.ip.concat("/teachers/message_list/", this.teacher, "/");
    axios
      .get(url)
      .then(function(response) {
        // handle success
        for (var i = 0; i < response.data.length; i++) {
          let message = {};
          message["id"] = response.data[i]["id"];
          let long_date = response.data[i]["date"];
          let yyyymmdd = long_date.slice(0, 10);

          message["date"] = yyyymmdd;
          message["message"] = response.data[i]["message"];
          message["sent_to"] = response.data[i]["sent_to"];

          message["the_class"] = response.data[i]["the_class"];
          if (message["the_class"] != "null") {
          }
          message["section"] = response.data[i]["section"];
          message["activity_group"] = response.data[i]["activity_group"];
          message["teacher"] = response.data[i]["teacher"];
          self.message_list.push(message);
        }
        console.log(self.message_list);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  },

  methods: {
    show_delivery_status(recepient) {
      this.delivery_status = recepient.student + "    " + recepient.outcome;
      this.snackbar = true;
    },
    show_recepients(message_id) {
      this.waiting = true;
      let self = this;
      let url = self.ip.concat("/teachers/receivers_list/", message_id, "/");

      axios
        .get(url)
        .then(function(response) {
          // handle success
          self.recepient_list = [];
          for (var i = 0; i < response.data.length; i++) {
            let recepeint = {};
            recepeint["student"] = response.data[i]["student"];
            recepeint["outcome"] = response.data[i]["outcome"];
            self.recepient_list.push(recepeint);
            self.dialog = true;
          }
          console.log(self.recepient_list);
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
    },
    dismiss() {
      this.showDismissibleAlert = false;
    }
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>