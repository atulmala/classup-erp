<template>
  <v-app>
    <v-content>
      <v-form v-if="show_search_criteria">
        <v-container>
          <h2>Student Search</h2>
          <v-layout xs4 row wrap justify-center>
            <v-col cols="12" md="3">
              <v-text-field label="Reg/Adm/Sch Number" v-model="reg_no" v-on:focus="dismiss()"></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field label="First Name" v-model="first_name" v-on:focus="dismiss()"></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field label="Surname/Last Name" v-model="last_name" v-on:focus="dismiss()"></v-text-field>
            </v-col>

            <v-col cols="12" md="2">
              <v-select
                :items="class_list"
                label="Class/Standard"
                v-model="the_class"
                v-on:focus="dismiss()"
              ></v-select>
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
      show_search_criteria: true,
      show_student_list: false,
      loader: null,
      loading: false,
      reg_no: "",
      first_name: "",
      last_name: "",
      the_class: "",
      class_list: [],

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
                student["id"] = response.data[i]["id"];
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
            ")"
        );
        if (response) {
          this.$store.dispatch("set_student_id", a.reg_no);
          this.$store.dispatch("set_student_name", a.name);
          this.$store.dispatch("set_student_class", a.the_class);
          this.$store.dispatch("set_parent", a.parent);
          this.$router.replace("/update_student");
        }
      }

      if (coming_from == "delete_student") {
        let response = confirm(
          "Are you sure you want to Delete Student: " +
            a.name +
            " (" +
            a.reg_no +
            ")?" +
            " Parent: " +
            a.parent +
            "?"
        );
        if (response) {
          let self = this;
          this.confirm = false;
          let school_id = this.$store.getters.get_school_id;
          let ip = this.$store.getters.get_server_ip;
          let url = ip.concat("/setup/delete_student/");
          axios
            .post(url, {
              student_id: a.id
            })
            .then(function(response) {
              console.log(response);
              self.overlay = false;
              if (response.data["status"] == "success") {
                confirm("Student successfully deleted");
                self.first_name = "";
                self.the_class = "";
                self.replace = "";
                self.last_name = "";
                self.students = [];
                self.show_search_criteria = true;
                self.show_student_list = false;
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