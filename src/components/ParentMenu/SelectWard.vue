<template>
  <v-app class="mt-n12 pt-n12">
    <v-content>
      <v-form v-if="!ward_chosen">
        <v-container fluid class="pa-md-4 mx-lg-auto">
          <v-layout xs4 row wrap justify-center>
            <v-col cols="6" md="6">
              <v-card max-width="400">
                <v-card-title>Select Ward</v-card-title>
                <v-divider></v-divider>
                <v-card-text style="height: 100px;">
                  <v-chip-group multiple :center-active="true" active-class="primary--text;">
                    <v-chip
                      v-for="ward in ward_list"
                      :key="ward.id"
                      :color="colors[Math.floor(Math.random() * 37)]"
                      @click="set_ward(ward.id)"
                    >{{ ward.name }}</v-chip>
                  </v-chip-group>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions></v-card-actions>
              </v-card>
            </v-col>
          </v-layout>
          
        </v-container>
      </v-form>
      <template>
        <div class="text-xs-center">
          <v-progress-circular v-if="waiting" :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
        </div>
      </template>
      <v-flex d-flex xs8 order-xs5 offset-sm2></v-flex>
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
      ward_list: [],
      // ward_chosen: false,
      selected_ward: "",
      loader: null,
      loading: false,

      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      alert_color: "",
      colors: [],
      waiting: false
    };
  },
  mounted: function() {
    console.log("inside mounted");
    let self = this;

    self.coming_from = this.$store.getters.get_coming_from;
    self.colors = this.$store.getters.get_colors;

    self.school_id = this.$store.getters.get_school_id;
    self.ip = this.$store.getters.get_server_ip;
    let parent_id = this.$store.getters.get_logged_user;
    let url = self.ip.concat("/student/student_list_for_parents/", parent_id);
    console.log("url=", url);

    axios
      .get(url)
      .then(function(response) {
        self.waiting = false;
        self.loading = false;
        self.ward_chosen = true;
        console.log(response);
        for (var i = 0; i < response.data.length; i++) {
          var ward = {};
          ward["id"] = response.data[i]["id"];
          ward["reg_no"] = response.data[i]["student_erp_id"];
          ward["name"] =
            response.data[i]["fist_name"] + " " + response.data[i]["last_name"];
          ward["the_class"] =
            response.data[i]["current_class"] +
            "-" +
            response.data[i]["current_section"];
          ward["parent"] = response.data[i]["parent"];
          console.log(ward);
          self.ward_list.push(ward);
        }
        console.log(self.ward_list);
      })
      .catch(function(error) {
        console.log(error);
      })
      .then(function() {
        // always executed
      });
  },
  updated: function() {
    console.log("inside updated");
  },

  methods: {
    get_wards() {
      let self = this;
      let school_id = this.$store.getters.get_school_id;
    },
    set_ward(id) {
      // this.ward_chosen = true;
      this.$store.dispatch("set_student_id", id);
      this.$store.dispatch("set_ward_selected", true);
      console.log("student_id = ", id);
      for (var i = 0; i < this.ward_list.length; i++) {
        if (this.ward_list[i]["id"] == id) {
          this.changed_index = i;
          this.ward_chosen = true;
          this.id = id;
          this.ward_name = this.ward_list[i]["name"];
          this.selected_ward = this.ward_list[i]["name"];
          console.log("selected_ward = ", this.selected_ward)
          this.$store.dispatch("set_student_name", this.ward_list[i]["name"]);
          break;
        }
      }
      
    },
    dismiss() {
      this.showDismissibleAlert = false;
    },
    showAlert(a) {
      if (event.target.classList.contains("btn__content")) return;
      let coming_from = this.$store.getters.get_coming_from;
      console.log(coming_from);
    }
  },
  computed: {
   
    ward_chosen() {
      return this.$store.getters.get_ward_selected;
    },
   
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