<template>
  <v-app>
    <v-content class="ma-0">
      <v-form>
        <v-container class="ma-0 pa-0">
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
          <h2>Select Class, Section, Subject, and Date</h2>
          <v-layout justify-center>
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
                label="Section"
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
                    label="Date"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                    @click="dismiss()"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title color="green lighten-1" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
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
                v-on:click="get_students()"
              >
                Take Attendance
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
            </div>
          </v-layout>
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
export default {
  name: "StudentAttendance",
  data() {
    return {
      loader: null,
      loading: false,
      reg_no: "",

      the_class: "",
      class_list: [],
      section: "",
      section_list: [],
      subject: "Main",
      subject_list: [],
      date: new Date().toISOString().substr(0, 10),

      menu: "",

      students: [],
      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      alert_color: "",
      headers: [
        { text: "S No", value: "s_no" },
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

    function get_class_list() {
      return axios.get(ip.concat("/academics/class_list/", school_id, "/"));
    }
    function get_section_list() {
      return axios.get(ip.concat("/academics/section_list/", school_id, "/"));
    }
    function get_subject_list() {
      return axios.get(ip.concat("/academics/subject_list/", school_id, "/"));
    }
    axios.all([get_class_list(), get_section_list(), get_subject_list()]).then(
      axios.spread(function(classes, sections, subjects) {
        self.class_list = classes.data;
        self.section_list = sections.data;
        self.subject_list = subjects.data;

        for (var i = 0; i < classes.data.length; i++) {
          self.class_list[i] = classes.data[i]["standard"];
        }
        for (var i = 0; i < sections.data.length; i++) {
          self.section_list[i] = sections.data[i]["section"];
        }
        for (var i = 0; i < subjects.data.length; i++) {
          self.subject_list[i] = subjects.data[i]["subject_name"];
        }
      })
    );
  },

  methods: {
    get_students() {
      let self = this;
      var can_search = true;
      if (this.reg_no == "" && this.first_name == "") {
        this.alert_message = "Search criteria provided is NOT Enough.";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_search = false;
      }
      if (this.the_class == "") {
        this.alert_message = "Please specify Class";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_search = false;
      }
      if (this.section == "") {
        this.alert_message = "Please specify Section";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_search = false;
      }
      if (can_search) {
        console.log("date = ", this.date);
        let splitDate = this.date.split("-");

        let year = splitDate[0];
        let month = splitDate[1];
        let day = splitDate[2];
        let ip = this.$store.getters.get_server_ip;
        let school_id = this.$store.getters.get_school_id;
        let url2 = ip.concat(
          "/student/list",
          school_id,
          "/",
          this.the_class,
          "/",
          this.section,
          "/"
        );
        axios
          .get(url2, {})
          .then(function(response) {
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
          })
          .catch(function(error) {
            console.log(error);
          })
          .then(function() {
            // always executed
          });
          
        let url = ip.concat(
          "/attendance/retrieve/",
          school_id,
          "/",
          this.the_class,
          "/",
          this.section,
          "/",
          this.subject_list,
          "/",
          day,
          "/",
          month,
          "/",
          year,
          "/"
        );
        axios
          .get(url, {})
          .then(function(response) {
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