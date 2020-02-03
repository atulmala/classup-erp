<template>
  <v-content>
    <v-form>
      <v-container fluid>
        <div class="text-center">
          <v-overlay :value="overlay"></v-overlay>
        </div>
        <h2>Update Teacher</h2>
        <v-layout v-if="selected" xs4 row wrap justify-center>
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
            <v-text-field label="Login Id" disabled v-model="login_id" v-on:focus="dismiss()"></v-text-field>
          </v-col>
        </v-layout>
        <v-layout xs4 row wrap justify-center>
          <v-col cols="12" md="10">
            <v-card max-width="900">
              <v-card-title>Select Teacher</v-card-title>
              <v-divider></v-divider>
              <v-card-text style="height: 100px;">
                <v-chip-group multiple :center-active="true" active-class="primary--text;">
                  <v-chip
                    v-for="teacher in teacher_list"
                    :key="teacher.id"
                    :color="colors[Math.floor(Math.random() * 37)]"
                    @click="show_details(teacher.id)"
                  >{{ teacher.first_name }} {{ teacher.last_name }}</v-chip>
                </v-chip-group>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  :loading="loading"
                  :disabled="!selected"
                  color="green"
                  @click="loader = 'loading'"
                  v-on:click="validate_entries()"
                >
                  Update Teacher
                  <span slot="loader" class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-layout>

        <v-layout xs4 row wrap justify-space-around>
          <div class="text-xs-center"></div>
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
          <v-btn color="green darken-1" flat="flat" @click="update_teacher()">OK</v-btn>
          <v-btn color="green darken-1" flat="flat" @click="confirm = false; overlay = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import axios from "axios";
export default {
  name: "UpdateTeacher",
  data() {
    return {
      teacher_id: "",
      first_name: "",
      last_name: "",
      mobile: "",
      login_id: "",
      teacher_list: [],
      changed_index: "",
      selected: false,
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
    let self = this;
    let school_id = this.$store.getters.get_school_id;
    self.colors = this.$store.getters.get_colors;
    let ip = this.$store.getters.get_server_ip;
    let url = ip.concat("/teachers/teacher_list/", school_id, "/");

    axios
      .get(url)
      .then(function(response) {
        // handle success
        for (var i = 0; i < response.data.length; i++) {
          let a_teacher = {};
          a_teacher["id"] = response.data[i]["id"];
          a_teacher["first_name"] = response.data[i]["first_name"];
          a_teacher["last_name"] = response.data[i]["last_name"];
          a_teacher["mobile"] = response.data[i]["mobile"];
          a_teacher["login_id"] = response.data[i]["email"];
          self.teacher_list.push(a_teacher);
        }
        console.log("teacher list = ", self.teacher_list);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  },
  methods: {
    show_details(id) {
      console.log("inside show_detasils", id);
      for (var i = 0; i < this.teacher_list.length; i++) {
        if (this.teacher_list[i]["id"] == id) {
            this.changed_index = i;
          this.selected = true;
          this.id = id;
          this.first_name = this.teacher_list[i]["first_name"];
          this.last_name = this.teacher_list[i]["last_name"];
          this.mobile = this.teacher_list[i]["mobile"];
          this.login_id = this.teacher_list[i]["login_id"];
          break;
        }
      }
    },
    validate_entries() {
      if (this.first_name == "") {
        this.alert_message = "Please enter First Name";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }
      if (this.last_name == "") {
        this.alert_message = "Please enter Last Name";
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

      this.caption = "Confirm Teacher Update";
      this.alert_message = "Are you sure you want to Update this Teacher? ";
      this.confirm = true;
      this.overlay = true;
    },

    close() {
      console.log("Dialog closed");
    },

    update_teacher() {
      let self = this;
      console.log("inside add teacher");
      this.confirm = false;
      let school_id = this.$store.getters.get_school_id;
      console.log(school_id);
      let ip = this.$store.getters.get_server_ip;
      let sender = this.$store.getters.get_logged_user;
      let url = ip.concat("/teachers/update_teacher/");
      let full_name = 

      axios
        .post(url, {
          school_id: school_id,
          user: sender,
          teacher_id: self.id,
          teacher_name: self.first_name + " " + self.last_name,
          teacher_mobile: self.mobile,
          teacher_login: self.login_id, 
          is_class_teacher: "false"
        })
        .then(function(response) {
          console.log(response);
          self.overlay = false;
          if (response.data["status"] == "success") {
            self.showDismissibleAlert = true;
            self.alert_message = response.data["message"];
            self.alert_color = "green";
            confirm("Teacher successfully updated");
            self.teacher_list[self.changed_index]["first_name"] = self.first_name;
            self.teacher_list[self.changed_index]["last_name"] = self.last_name;
            self.teacher_list[self.changed_index]["mobile"] = self.mobile;
            self.first_name = "";
            self.last_name = "";
            self.mobile = "";
            self.login_id = "";
            return;
          } else {
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