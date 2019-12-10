<template>
  <v-app>
    <v-content class="ma-0">
      <v-form v-if="!show_student_list">
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
                v-on:click="get_attendance_list()"
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
      <div class="text-xs-center">
        <v-col cols="10" md="8">
          <v-data-table
            dark
            loading
            loading-text="Fetching student list for this class... Please wait"
            v-if="show_student_list"
            :headers="headers"
            :items="students"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat color="teal">
                <v-toolbar-title>{{ the_class }} - {{ section }}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-toolbar-title>{{ subject }}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-toolbar-title>{{ ddmmyyyy }}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-toolbar-title>Total: {{ total }}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-toolbar-title>Present: {{ present }}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-toolbar-title>Absent: {{ absent }}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="purple" dark class="mb-0" v-on="on">Submit</v-btn>
                  </template>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">
              <v-icon x-large class="mr-2 material-icons" :color="item.presence_color" @click="mark_absence(item)">{{ item.toggle }}</v-icon>
            </template>

            <template v-slot:item.presence="{ item }">
              <v-chip :color="status_color(item.presence)" @click="mark_absence(item)">{{ item.presence }}</v-chip>
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
      get_student_list: function() {
        console.log("inside get_student_list()");
        let self = this;
        let school_id = this.$store.getters.get_school_id;
        let ip = this.$store.getters.get_server_ip;
        return axios.get(
          ip.concat(
            "/student/list/",
            school_id,
            "/",
            this.the_class,
            "/",
            this.section,
            "/"
          )
        );
      },
      get_absentees_list: function() {
        console.log("inside get_absentee_list()");
        let school_id = this.$store.getters.get_school_id;
        let ip = this.$store.getters.get_server_ip;
        console.log("date = ", this.date);
        let splitDate = this.date.split("-");

        let year = splitDate[0];
        let month = splitDate[1];
        let day = splitDate[2];
        this.ddmmyyyy = day + "-" + month + "-" + year;
        return axios.get(
          ip.concat(
            "/attendance/retrieve/",
            school_id,
            "/",
            this.the_class,
            "/",
            this.section,
            "/",
            this.subject,
            "/",
            day,
            "/",
            month,
            "/",
            year,
            "/"
          )
        );
      },
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
      ddmmyyyy: "",
      menu: "",

      students: [],
      absentee_list: [],
      total: "",
      present: "",
      absent: "",
      dialog: "",
      show_student_list: false,
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
        { text: "Present/Absent", value: "presence" },
        { text: 'Mark', value: 'action', sortable: false },
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
    get_attendance_list() {
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
        console.log("retrieving student list and absentees list for the class");
        axios.all([this.get_student_list(), this.get_absentees_list()]).then(
          axios.spread(function(students, absentees) {
            self.absent = absentees.data.length;
            for (var i = 0; i < absentees.data.length; i++) {
              self.absentee_list.push(absentees.data[i]["student"]);
            }

            self.total = students.data.length;
            self.present = self.total - self.absent;
            for (var i = 0; i < students.data.length; i++) {
              let student = {};
              student["s_no"] = i + 1;
              student["id"] = students.data[i]["id"];
              if (self.absentee_list.indexOf(student["id"]) > 0) {
                student["presence"] = "absent";
                student["toggle"] = "toggle_off"
                student["presence_color"] = "orange darken-2"
              } else {
                student["presence"] = "present";
                student["toggle"] = "toggle_on"
                student["presence_color"] = "green darken-2"
              }
              student["name"] =
                students.data[i]["fist_name"] +
                " " +
                students.data[i]["last_name"];
              self.students.push(student);
            }
            self.show_student_list = true;
          })
        );
      }
    },

    status_color(status) {
      if (status == "absent") return "red";
      if (status == "present") return "green";
    },
    mark_absence(item) {
      console.log("inside marks_absence(item)");
      let position = this.absentee_list.indexOf(item.id);
      console.log("position = ", position)
      if (position > -1) {
        // this student was in the absentee list. will have to be marked as present
        this.absentee_list.splice(position, 1);
        console.log(this.absentee_list);
        item.presence = "present"
        this.present += 1;
        this.absent -= 1;
        console.log("present = ", self.present)
        item.toggle = "toggle_on"
        item.presence_color = "green darken-2"
      }
      else  {
        this.absentee_list.push(item.id)
        console.log(this.absentee_list);
        item.presence = "absent"
        this.present -= 1;
        this.absent += 1;
        item.toggle = "toggle_off"
        item.presence_color = "orange darken-2"
      }
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