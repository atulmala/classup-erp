<template>
  <v-content>
    <v-form>
      <v-container fluid>
        <div class="text-center">
          <v-overlay :value="overlay"></v-overlay>
        </div>
        <h2>Add Teacher</h2>
        <v-layout xs4 row wrap justify-center>
          <v-col cols="12" md="2">
            <v-text-field label="First Name" v-model="first_name" v-on:focus="dismiss()"></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="Last Name" v-model="last_name" v-on:focus="dismiss()"></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="Mobile" v-model="mobile" v-on:focus="dismiss()"></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="Login Id" v-model="login_id" v-on:focus="dismiss()"></v-text-field>
          </v-col>
        </v-layout>

        <v-layout xs4 row wrap justify-space-around>
          <div class="text-xs-center">
            <v-btn
              :loading="loading"
              :disabled="loading"
              color="green"
              @click="loader = 'loading'"
              v-on:click="validate_entries()"
            >
              Add Teacher
              <span slot="loader" class="custom-loader">
                <v-icon light>cached</v-icon>
              </span>
            </v-btn>
          </div>
        </v-layout>
        <v-layout xs4 row wrap justify-space-around>
          <v-col cols="12" md="10">
            <v-alert
              :value="showDismissibleAlert"
              :color="alert_color"
              :type="alert_type"
            >{{ alert_message }}</v-alert>
          </v-col>
        </v-layout>
      </v-container>
    </v-form>
    <v-dialog v-model="confirm" persistent max-width="360">
      <v-card>
        <v-card-title class="headline">{{ caption }}</v-card-title>
        <v-card-text>{{ alert_message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="add_teacher()">OK</v-btn>
          <v-btn color="green darken-1" flat="flat" @click="confirm = false; overlay = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import axios from "axios";
export default {
  name: "AddTeacher",
  data() {
    return {
      first_name: "",
      last_name: "",
      mobile: "",
      login_id: "",

      loading: false,
      showDismissibleAlert: false,
      alert_type: "error",
      alert_color: "",
      alert_message: "",
      confirm: false,
      caption: "",
      allow_edit: false,
      max25chars: v => v.length <= 30 || "Input too long!",
      overlay: false
    };
  },
  computed: {},
  mounted: function() {
    
  },
  methods: {
    validate_entries() {
      if (this.first_name == "") {
        this.alert_message =
          "Please enter First Name";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }
      if (this.last_name == "") {
        this.alert_message =
          "Please enter Last Name";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }
      if (this.mobile == "") {
        this.alert_message = "Please enter a valid 10 digit Mobile Number";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }
      if (this.login_id == "") {
        this.alert_message = "Please enter login id";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }
      
      this.caption = "Confirm Teacher Addition";
      this.alert_message = "Are you sure you want to Add this Teacher? ";
      this.confirm = true;
      this.overlay = true;
    },

    close() {
      console.log("Dialog closed");
    },

    add_teacher() {
      let self = this;
      console.log("inside add teacher");
      this.confirm = false;
      let school_id = this.$store.getters.get_school_id;
      console.log(school_id);
      let ip = this.$store.getters.get_server_ip;
      let sender = this.$store.getters.get_logged_user;
      let url = ip.concat("/teachers/add_teacher/");

      axios
        .post(url, {
          school_id: school_id,
          user: sender,
          full_name: self.first_name + " " + self.last_name,
          mobile: self.mobile,
          email: self.login_id
          
        })
        .then(function(response) {
          console.log(response);
          self.overlay = false;
          if (response.data["status"] == "success") {
            self.showDismissibleAlert = true;
            self.alert_message = response.data["message"];
            self.alert_color = "green";
            confirm("Teacher successfully added");
            self.teacher_name = "";
            self.mobile = "";
            self.login_id = "";
            return;
          }
          else{
              self.alert_color = "red";
              self.alert_message = response.data["message"];
              self.showDismissibleAlert = true;
              confirm(response.data["message"]);
              return;
          }
          
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {
          // always executed
        });
    },
    dismiss() {
      this.showDismissibleAlert = false;
    }
  }
};
</script>