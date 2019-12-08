<template>
  <v-app>
    <v-content class="ma-0">
      <v-form>
        <v-container class="ma-0 pa-0">
          <h2>Select Class, Section, Subject, and Date</h2>
          <v-layout>
            <v-col cols="12" md="2">
              <v-select
                :items="class_list"
                label="Class/Standard"
                v-model="the_class"
                v-on:focus="dismiss()"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                :items="section_list"
                label="Class/Standard"
                v-model="section"
                v-on:focus="dismiss()"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                :items="subject_list"
                label="Subject"
                v-model="subject"
                v-on:focus="dismiss()"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="2">
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
                    v-model="date"
                    label="Date of Test"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                    @click="dismiss()"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="datee"
                  no-title
                  color="green lighten-1"
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <!-- <v-btn text color="primary" @click="test_details.menu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(test_details.test_date)">OK</v-btn> -->
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-layout>
          <v-layout xs4 row wrap justify-space-around>
            <div class="text-xs-center">
              <v-btn
                :loading="loading"
                :disabled="loading"
                color="green"
                @click="loader = 'loading'"
                v-on:click="search()"
              >
                Search
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
            </div>
          </v-layout>
          <div class="text-xs-center">
            <v-layout xs4 row wrap justify-center>
              <v-col cols="12" md="6">
                <v-alert
                  :value="showDismissibleAlert"
                  :color="alert_color"
                  :type="alert_type"
                >{{ alert_message }}</v-alert>
              </v-col>
            </v-layout>
          </div>
        </v-container>
      </v-form>
      <div class="text-xs-center" offset-sm4>
        <v-col cols="10" md="2"></v-col>
        <v-col cols="10" md="8">
          <v-data-table
            v-if="show_student_list"
            :headers="headers"
            :items="students"
            class="elevation-1"
          >
            <template v-slot:body="{ items }">
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.name"
                  @click="showAlert(item)"
                  :class="{'selectedRow': item === selectedItem}"
                >
                  <td align="left">{{ item.name }}</td>
                  <td align="left">{{ item.reg_no }}</td>
                  <td align="left">{{ item.the_class }}</td>
                  <td align="left">{{ item.parent }}</td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-col>
      </div>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
import FeePayment from "@/components/Fee/FeePayment";
export default {
  name: "StudentSearch",
  data() {
    return {
      
      loader: null,
      loading: false,
      reg_no: "",
      
      the_class: "",
      class_list: [],
      section: "",
      section_list: [],
      subject: "",
      subject_list: [],
      date: "",
      menu: "",

      students: [],
      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      alert_color: "",
      headers: [
        {
          text: "Student Name",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "Reg/Adm/Sch Number", value: "reg_no" },
        { text: "Class", value: "the_class" },
        { text: "Parent", value: "parent" }
      ]
    };
  },
  mounted: function() {
    let self = this;
    let school_id = this.$store.getters.get_school_id;
    let ip = this.$store.getters.get_server_ip;
    let url = ip.concat("/academics/class_list/", school_id, "/");
    axios
      .get(url)
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
  },

  methods: {
    search() {
      let self = this;
      var can_search = true;
      if (this.reg_no == "" && this.first_name == "") {
        this.alert_message = "Search criteria provided is NOT Enough.";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_search = false;
      }
      if (this.first_name != "" && this.reg_no == "" && this.the_class == "") {
        this.alert_message = "Please specify Class";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_search = false;
      }
      if (can_search) {
        let ip = this.$store.getters.get_server_ip;
        let school_id = this.$store.getters.get_school_id;
        let url = ip.concat(
          "/student/list/",
          school_id,
          "/",
          "in_params",
          "/",
          "in_params"
        );
        axios
          .get(url, {
            params: {
              reg_no: this.reg_no,
              first_name: this.first_name,
              last_name: this.last_name,
              the_class: this.the_class
            }
          })
          .then(function(response) {
            if (response.data.length == 0) {
              self.alert_message =
                "Student not found. Please change the search criteria and try again";
              self.showDismissibleAlert = true;
              this.alert_color = "red";
              self.alert_type = "error";
            } else {
              self.show_search_criteria = false;
              for (var i = 0; i < response.data.length; i++) {
                var student = {};
                student["reg_no"] = response.data[i]["student_erp_id"];
                student["name"] =
                  response.data[i]["fist_name"] +
                  " " +
                  response.data[i]["last_name"];
                student["the_class"] =
                  response.data[i]["current_class"] +
                  "-" +
                  response.data[i]["current_section"];
                student["parent"] = response.data[i]["parent"];
                student["adm_fee"] = response.data[i]["adm_fee"];
                console.log(student);
                self.students.push(student);
              }
              console.log(self.students);
              self.show_student_list = true;
            }
          })
          .catch(function(error) {
            console.log(error);
          })
          .then(function() {
            // always executed
          });
      }
      console.log(this.reg_no);
    },
    dismiss() {
      this.showDismissibleAlert = false;
    },
    showAlert(a) {
      console.log("inside showAlert");
      let coming_from = this.$store.getters.get_coming_from;
      console.log(coming_from);
      if (coming_from == "fee_payment") {
        let response = confirm(
          "Are you sure you want to process the fees for " +
            a.name +
            " (" +
            a.reg_no +
            ")?"
        );
        if (response) {
          this.$store.dispatch("set_student_id", a.reg_no);
          this.$store.dispatch("set_student_name", a.name);
          this.$store.dispatch("set_parent", a.parent);
          this.$router.replace("/fee_payment");
        }
      }

      if (coming_from == "correction") {
        let response = confirm(
          "Are you sure you want to do correction for " +
            a.name +
            " (" +
            a.reg_no +
            ")?"
        );
        if (response) {
          this.$store.dispatch("set_student_id", a.reg_no);
          this.$store.dispatch("set_student_name", a.name);
          var the_class = a.current_class;
          console.log(the_class);
          let section = a.current_section;
          console.log(section);
          this.$store.dispatch("set_student_class", a.the_class);
          this.$store.dispatch("set_parent", a.parent);
          this.$router.replace("/correction");
        }
      }

      if (coming_from == "update_student") {
        let response = confirm(
          "Are you sure you want to do update for " +
            a.name +
            " (" +
            a.reg_no +
            ")?"
        );
        if (response) {
          this.$store.dispatch("set_student_id", a.reg_no);
          this.$store.dispatch("set_student_name", a.name);
          this.$store.dispatch("set_student_class", a.the_class);
          this.$store.dispatch("set_parent", a.parent);
          this.$router.replace("/update_student");
        }
      }
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