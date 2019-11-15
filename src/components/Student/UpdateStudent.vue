<template>
  <v-app>
    <v-content>
      <v-form>
        <v-container fluid>
          <div class="text-center">
            <v-overlay :value="overlay">
            </v-overlay>
          </div>
          <h2>Update Student</h2>
          <v-layout xs4 row wrap justify-center>
            <v-flex xs6 sm6 md2>
              <v-text-field
                disabled="true"
                label="Reg/Adm/Sch No"
                v-model="reg_no"
                v-on:focus="dismiss()"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm6 md2>
              <v-text-field label="First Name" v-model="first_name" v-on:focus="dismiss()"></v-text-field>
            </v-flex>

            <v-flex xs6 sm6 md2>
              <v-text-field label="Surname/Last Name" v-model="last_name" v-on:focus="dismiss()"></v-text-field>
            </v-flex>

            <v-flex xs6 sm6 md2>
              <v-select
                :items="class_list"
                label="Class/Standard"
                v-model="the_class"
                v-on:focus="dismiss()"
              ></v-select>
            </v-flex>
            <v-flex xs6 sm6 md2>
              <v-select
                :items="section_list"
                label="Section"
                v-model="section"
                v-on:focus="dismiss()"
              ></v-select>
            </v-flex>
          </v-layout>
          <v-layout xs6 row wrap justify-center>
            <v-flex xs6 sm6 md3 justify-space-between>
              <v-radio-group v-model="gender" @click="dismiss()" row>
                <v-radio label="Male" value="male"></v-radio>
                <v-radio label="Female" value="female"></v-radio>
                <v-radio label="Other" value="other"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs6 sm6 md2 justify-end>
              <v-menu
                lazy
                :close-on-content-click="false"
                v-model="dob_menu"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="Date of Birth(DOB)"
                  v-model="dob"
                  prepend-icon="event"
                  readonly
                  @click="dismiss()"
                ></v-text-field>
                <v-date-picker v-model="dob" title="Date of Birth(DOB)" no-title scrollable actions>
                  <template scope="{ save_dob, cancel_dob }"></template>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs6 sm6 md2>
              <v-text-field label="Adhar No" v-model="adhar" v-on:focus="dismiss()"></v-text-field>
            </v-flex>

            <v-flex xs6 sm6 md2>
              <v-text-field label="Blood Group" v-model="blood_group" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
            <v-flex xs6 sm6 md1>
              <v-text-field label="House" v-model="house" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout xs4 row wrap justify-center>
            <v-flex xs3 sm3 md2>
              <v-text-field label="Father Name" v-model="father_name" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
            <v-flex xs3 sm3 md2>
              <v-text-field label="Email" v-model="email" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
            <v-flex xs3 sm3 md2>
              <v-text-field label="Father Mob" v-model="father_mobile" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
            <v-flex xs3 sm3 md2>
              <v-text-field label="Mother Name" v-model="mother_name" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
            <v-flex xs3 sm3 md2>
              <v-text-field label="Mother Mob" v-model="mother_mobile" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout xs6 row wrap justify-center>
            <v-flex xs6 sm6 md2>
              <v-text-field
                label="Father Occupation"
                v-model="father_occupation"
                v-on:focus="dismiss()"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm6 md2>
              <v-text-field
                label="Mother Occupation"
                v-model="mother_occupation"
                v-on:focus="dismiss()"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm6 md2 justify-space-between>
              <v-radio-group v-model="transport" @click="dismiss()" row>
                <v-radio label="Bus User" value="bus_user"></v-radio>
                <v-radio label="Walker" value="walker"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs6 sm6 md2>
              <v-text-field label="Bus Route" v-model="bus_rout" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
            <v-flex xs6 sm6 md2>
              <v-text-field label="Bus Stop" v-model="bus_stop" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout xs4 row wrap justify-center>
            <v-flex xs6 sm6 md10>
              <v-text-field label="Address" v-model="address" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout xs4 row wrap justify-space-around>
            <div class="text-xs-center">
              <v-btn
                :loading="loading"
                :disabled="loading"
                color="info"
                @click="loader = 'loading'"
                v-on:click="validate_entries()"
              >
                Update Student
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
            </div>
          </v-layout>
          <v-layout xs8 row wrap justify-space-around>
            <v-flex xs6 sm6 md6>
              <v-alert :value="showDismissibleAlert" :type="alert_type">{{ alert_message }}</v-alert>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
      <v-dialog v-model="confirm" persistent max-width="360">
        <v-card>
          <v-card-title class="headline">{{ caption }}</v-card-title>
          <v-card-text>{{ alert_message }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click="update_student()">OK</v-btn>
            <v-btn color="green darken-1" flat="flat" @click="confirm = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "FeePayment",
  data() {
    return {
      date: null,
      menu: false,
      modal: false,
      reg_no: "",
      first_name: "",
      last_name: "",
      the_class: "",
      section: "",
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

      showDismissibleAlert: false,
      alert_type: "error",
      confirm: false,
      caption: "",
      allow_edit: false,
      max25chars: v => v.length <= 30 || "Input too long!",
      ovelay: false
    };
  },
  computed: {},
  mounted: function() {
    let self = this;
    let school_id = this.$store.getters.get_school_id;
    let ip = this.$store.getters.get_server_ip;
    let student_id = this.$store.getters.get_student_id;

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

    let url3 = ip.concat(
      "/student/single_student_details/",
      school_id,
      "?student_id=",
      student_id
    );
    axios
      .get(url3)
      .then(function(response) {
        console.log(response.data);
        self.reg_no = response.data[0].student_erp_id;
        self.first_name = response.data[0].fist_name;
        self.last_name = response.data[0].last_name;
        self.the_class = response.data[0].current_class;
        self.section = response.data[0].current_section;
        self.gender = response.data[0].gender;
        self.parent = response.data[0].parent;
        if (response.data[0].dob != "Not Available")
          self.dob = response.data[0].dob;
        self.father_name = response.data[0].parent;
        self.email = response.data[0].email;
        self.father_mobile = response.data[0].parent_mob;
        self.father_name = response.data[0].parent;
        self.mother_name = response.data[0].mother;
        self.mother_mobile = response.data[0].mother_mob;
        self.address = response.data[0].address;
        self.adhar = response.data[0].adhar;
        self.blood_group = response.data[0].blood_group;
        self.house = response.data[0].house;
        self.father_occupation = response.data[0].father_occ;
        self.mother_occupation = response.data[0].mother_occ;
        self.transport = response.data[0].bus_user;
        self.bus_rout = response.data[0].bus_rout;
        self.bus_stop = response.data[0].bus_stop;
      })
      .catch(function(error) {});
  },
  methods: {
    validate_entries() {
      console.log("gender =", this.gender);
      if (this.reg_no == "") {
        this.alert_message =
          "Please enter Registration/Admission/Scholar Number";
        this.showDismissibleAlert = true;
        return;
      }
      if (this.first_name == "") {
        this.alert_message = "Please enter First Name";
        this.showDismissibleAlert = true;
        return;
      }
      if (this.last_name == "") {
        this.alert_message = "Please enter Last Name";
        this.showDismissibleAlert = true;
        return;
      }
      if (this.gender == " " || this.gender == "Not Available") {
        this.alert_message = "Please Select Gender)";
        this.showDismissibleAlert = true;
        return;
      }

      if (this.dob == "") {
        this.alert_message = "Please enter Student's Date of Birth (DOB)";
        this.showDismissibleAlert = true;
        return;
      }
      if (this.father_name == "") {
        this.alert_message = "Please enter Father's name";
        this.showDismissibleAlert = true;
        return;
      }
      if (this.father_mobile == "") {
        this.alert_message = "Please enter Father's mobile number (10 digits)";
        this.showDismissibleAlert = true;
        return;
      }
      if (this.father_mobile.length != 10) {
        this.alert_message =
          "Father's mobile number should be exactly 10 digits";
        this.showDismissibleAlert = true;
        return;
      }
      if (this.mother_mobile.length != 10) {
        this.alert_message =
          "Mother's mobile number should be exactly 10 digits";
        this.mother_mobile.this.showDismissibleAlert = true;
        return;
      }
      if (this.mother_name == "") {
        this.alert_message = "Please enter Mother's name";
        this.showDismissibleAlert = true;
        return;
      }
      if (this.transport == "") {
        this.alert_message = "Please mention whether Bus user or Walker";
        this.showDismissibleAlert = true;
        return;
      }
      if (this.address == "") {
        this.alert_message = "Please enter Address";
        this.showDismissibleAlert = true;
        return;
      }

      this.caption = "Confirm Student Update";
      this.alert_message = "Are you sure you want to Update this Student ";
      this.confirm = true;
      this.ovelay = true;
    },

    close() {
      console.log("Dialog closed");
    },

    update_student() {
      let self = this;
      
      console.log("inside update student");
      this.confirm = false;
      let school_id = this.$store.getters.get_school_id;
      console.log(school_id);
      let ip = this.$store.getters.get_server_ip;
      let sender = this.$store.getters.get_logged_user;
      let url = ip.concat("/student/update_student_web/");

      axios
        .post(url, {
          school_id: school_id,
          sender: sender,
          reg_no: this.reg_no,
          first_name: this.first_name,
          last_name: this.last_name,
          the_class: this.the_class,
          section: this.section,
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
          self.ovelay = false;
          console.log(response);
          if (response.data["status"] != "success") {
            self.showDismissibleAlert = true;
            self.alert_message = response.data["message"];
            return;
          }

          confirm("student successfully updated");
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