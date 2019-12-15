<template>
  <v-app>
    <v-content>
      <v-container fluid class="pa-md-4 mx-lg-auto"></v-container>
      <v-layout xs4 row wrap justify-center>
        <v-col cols="12" md="10">
          <v-card class="mx-auto" >
            <v-card-text>
              <div>Word of the Day</div>
              <p class="display-1 text--primary">be•nev•o•lent</p>
              <p>adjective</p>
              <div class="text--primary">
                well meaning and kindly.
                <br />"a benevolent smile"
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="deep-purple accent-4">Learn More</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-layout>
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

      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      alert_color: "",
      waiting: false
    };
  },
  mounted: function() {
    let self = this;
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
          message["date"] = response.data[i]["date"];
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