<template>
    <v-content>
      <v-form>
        <v-container fluid>
          <div class="text-center">
            <v-overlay :value="overlay"></v-overlay>
          </div>
          <h2>Add Student</h2>
          <v-layout xs4 row wrap justify-center>
            <v-col cols="12" md="2">
              <v-text-field label="Reg/Adm/Sch No" v-model="reg_no" v-on:focus="dismiss()"></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field label="First Name" v-model="first_name" v-on:focus="dismiss()"></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field label="Surname/Last Name" v-model="last_name" v-on:focus="dismiss()"></v-text-field>
            </v-col>

            <v-col cols="12" md="1">
              <v-select
                :items="class_list"
                label="Class"
                v-model="the_class"
                v-on:focus="dismiss()"
              ></v-select>
            </v-col>
            <v-col cols="12" md="1">
              <v-select
                :items="section_list"
                label="Section"
                v-model="section"
                v-on:focus="dismiss()"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                :return-value.sync="date1"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="date_of_admission"
                    label="Date of Admission"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date_of_admission" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu1 = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.menu1.save(date1)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-layout>
          <v-layout xs6 row wrap justify-center>
            <v-col cols="12" md="3">
              <v-radio-group v-model="gender" @click="dismiss()" row>
                <v-radio label="Male" value="male"></v-radio>
                <v-radio label="Female" value="female"></v-radio>
                <v-radio label="Other" value="other"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" md="2">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="dob"
                    label="Date of Birth"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dob" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field label="Adhar No" v-model="adhar" v-on:focus="dismiss()"></v-text-field>
            </v-col>

            <v-col cols="12" md="2">
              <v-text-field label="Blood Group" v-model="blood_group" v-on:focus="dismiss()"></v-text-field>
            </v-col>
            <v-col cols="12" md="1">
              <v-text-field label="House" v-model="house" v-on:focus="dismiss()"></v-text-field>
            </v-col>
          </v-layout>
          <v-layout xs4 row wrap justify-center>
            <v-col cols="12" md="2">
              <v-text-field label="Father Name" v-model="father_name" v-on:focus="dismiss()"></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field label="Email" v-model="email" v-on:focus="dismiss()"></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field label="Father Mob" v-model="father_mobile" v-on:focus="dismiss()"></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field label="Mother Name" v-model="mother_name" v-on:focus="dismiss()"></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field label="Mother Mob" v-model="mother_mobile" v-on:focus="dismiss()"></v-text-field>
            </v-col>
          </v-layout>
          <v-layout xs6 row wrap justify-center>
            <v-col cols="12" md="2">
              <v-text-field
                label="Father Occupation"
                v-model="father_occupation"
                v-on:focus="dismiss()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                label="Mother Occupation"
                v-model="mother_occupation"
                v-on:focus="dismiss()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3" justify-space-between>
              <v-radio-group v-model="transport" @click="dismiss()" row>
                <v-radio label="Bus User" value="bus_user"></v-radio>
                <v-radio label="Walker" value="walker"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" md="1">
              <v-text-field label="Bus Route" v-model="bus_rout" v-on:focus="dismiss()"></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field label="Bus Stop" v-model="bus_stop" v-on:focus="dismiss()"></v-text-field>
            </v-col>
          </v-layout>
          <v-layout xs4 row wrap justify-center>
            <v-col cols="12" md="10">
              <v-text-field label="Address" v-model="address" v-on:focus="dismiss()"></v-text-field>
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
                Add Student
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
            <v-btn color="green darken-1" flat="flat" @click="add_student()">OK</v-btn>
            <v-btn color="green darken-1" flat="flat" @click="confirm = false; overlay = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-content>
</template>

<script>
import axios from "axios";
export default {
  name: "FeePayment",
  data() {
    return {
      date: null,
      date1: null,
      menu: false,
      menu1: false,
      modal: false,
      reg_no: "",
      first_name: "",
      last_name: "",
      the_class: "",
      section: "",
      date_of_admission: "",
      gender: "",
      parent: "",
      alert_message: "",
      dob: "",
      father_name: "",
      email: "",
      father_mobile: "",
      mother_name: "",
      mother_mobile: "",
      address: "",
      adhar: "",
      blood_group: "",
      house: "",
      father_occupation: "",
      mother_occupation: "",
      transport: "",
      bus_rout: "",
      bus_stop: "",

      class_list: [],
      section_list: [],

      loading: false,
      showDismissibleAlert: false,
      alert_type: "error",
      alert_color: "",
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
    let ip = this.$store.getters.get_server_ip;

    let url1 = ip.concat("/academics/class_list/", school_id, "/");
    axios
      .get(url1)
      .then(function(response) {
        // handle success
        self.class_list = response.data;
        for (var i = 0; i < response.data.length; i++) {
          self.class_list[i] = response.data[i]["standard"];
        }
        console.log(self.class_list);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });

    let url2 = ip.concat("/academics/section_list/", school_id, "/");
    axios
      .get(url2)
      .then(function(response) {
        // handle success
        self.section_list = response.data;
        for (var i = 0; i < response.data.length; i++) {
          self.section_list[i] = response.data[i]["section"];
        }
        console.log(self.section_list);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  },
  methods: {
    add_student() {},
    save_dob() {
      console.log("saving dob...");
    },
    validate_entries() {
      if (this.reg_no == "") {
        this.alert_message =
          "Please enter Registration/Admission/Scholar Number";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }
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
      if (this.the_class == "") {
        this.alert_message = "Please Select Class in which student is admitted";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }
      if (this.section == "") {
        this.alert_message =
          "Please Select Section in which student is admitted";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }
      if (this.date_of_admission == "") {
        this.alert_message = "Please enter the date of Admission";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }
      if (this.gender == "") {
        this.alert_message = "Please Select Gender)";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }
      if (this.dob == "") {
        this.alert_message = "Please enter Student's Date of Birth (DOB)";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }
      if (this.father_name == "") {
        this.alert_message = "Please enter Father's name";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }
      if (this.father_mobile == "") {
        this.alert_message = "Please enter Father's mobile number (10 digits)";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }
      if (this.mother_name == "") {
        this.alert_message = "Please enter Mother's name";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }
      if (this.transport == "") {
        this.alert_message = "Please mention whether Bus user or Walker";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }
      if (this.address == "") {
        this.alert_message = "Please enter Address";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }

      this.caption = "Confirm Student Addition";
      this.alert_message = "Are you sure you want to Add this Student ";
      this.confirm = true;
      this.overlay = true;
    },

    close() {
      console.log("Dialog closed");
    },

    add_student() {
      let self = this;
      console.log("inside add student");
      this.confirm = false;
      let school_id = this.$store.getters.get_school_id;
      console.log(school_id);
      let ip = this.$store.getters.get_server_ip;
      let sender = this.$store.getters.get_logged_user;
      let url = ip.concat("/student/add_student_web/");

      axios
        .post(url, {
          school_id: school_id,
          sender: sender,
          reg_no: this.reg_no,
          first_name: this.first_name,
          last_name: this.last_name,
          the_class: this.the_class,
          section: this.section,
          date_of_admission: this.date_of_admission,
          gender: this.gender,
          dob: this.dob,
          adhar: this.adhar,
          house: this.house,
          blood_group: this.blood_group,
          father_name: this.father_name,
          father_mobile: this.father_mobile,
          email: this.email,
          mother_name: this.mother_name,
          mother_mobile: this.mother_mobile,
          father_occupation: this.father_occupation,
          mother_occupation: this.mother_occupation,
          transport: this.transport,
          bus_rout: this.bus_rout,
          bus_stop: this.bus_stop,
          address: this.address
        })
        .then(function(response) {
          console.log(response);
          self.overlay = false;
          if (response.data["status"] != "success") {
            self.showDismissibleAlert = true;
            self.alert_message = response.data["message"];
            return;
          }

          confirm("student successfully added");
          self.$router.replace("/student_search");
        })
        .catch(function(error) {
          self.waiting = false;
            self.loading = false;
            var error_message = "An error occured.";
            error_message = error_message.concat(" Error summary: ", error, ". Please contact ClassUp Support");
            confirm(error_message);
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