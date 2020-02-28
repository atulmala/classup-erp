<template>
  <v-app class="mt-n12 pt-n12">
    <v-content class="ma-0">
      <template>
        <div class="text-xs-center">
          <v-progress-circular v-if="waiting" :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
        </div>
      </template>
      <div class="text-xs-center">
        <v-col cols="10" md="10" class="mx-auto">
          <v-data-table dark loading :headers="headers" :items="teacher_list" class="elevation-1">
            <template v-slot:top>
              <v-toolbar flat color="#651FFF">
                <v-chip class="mt-0" color="#8D6E63" label>
                  <div class="text-uppercase">Teacher Attendance</div>
                </v-chip>
                <v-divider class="mx-4" inset vertical></v-divider>

                <v-col cols="12" sm="6" md="3">
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
                        class="mt-7"
                        v-model="date"
                        label="Date"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                        @click="dismiss()"
                        v-on:change="date_changed()"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" no-title color="green lighten-1" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false" class="mt-auto">Cancel</v-btn>
                      <v-btn text color="primary" @click="date_changed();$refs.menu.save(date)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-toolbar>
            </template>
            <template v-slot:item.presence="{ item }">
              <v-chip
                :color="status_color(item.presence)"
                @click="mark_absence(item)"
              >{{ item.presence }}</v-chip>
            </template>
            <template v-slot:footer>
              <div>
                <v-toolbar dense flat color="#FBC02D">
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-toolbar-title>Total: {{ total }}</v-toolbar-title>
                  <v-divider class="mx-4" color="#BDBDBD" inset vertical></v-divider>
                  <v-toolbar-title>Present: {{ present }}</v-toolbar-title>
                  <v-divider class="mx-4" color="#BDBDBD" inset vertical></v-divider>
                  <v-toolbar-title>Absent: {{ absent }}</v-toolbar-title>
                  <v-divider class="mx-4" color="#BDBDBD" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="#1A237E"
                        dark
                        class="mb-0"
                        v-on="on"
                        @click="process_attendance"
                      >Submit</v-btn>
                    </template>
                  </v-dialog>
                </v-toolbar>
              </div>
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
  name: "TeacherAttendance",
  data() {
    return {
      date_changed: function() {
        let self = this;
        let splitDate = this.date.split("-");
        let year = splitDate[0];
        self.yyyy = year;
        let month = splitDate[1];
        self.mm = month;
        let day = splitDate[2];
        self.dd = day;
        self.ddmmyyyy = day + "-" + month + "-" + year;
        let ip = this.$store.getters.get_server_ip;
        let school_id = this.$store.getters.get_school_id;
        let url = ip.concat(
          "/teachers/retrieve_attendance/",
          school_id,
          "/",
          day,
          "/",
          month,
          "/",
          year,
          "/"
        );
        axios
          .get(url)
          .then(function(response) {
            self.absent = response.data.length;
            self.absentee_list = [];
            for (var i = 0; i < response.data.length; i++) {
              self.absentee_list.push(response.data[i]["teacher"]);
            }
            console.log("absentee_list = ", self.absentee_list);
            self.total = self.teacher_list.length;
            self.present = self.total - self.absent;
            for (var j = 0; j < self.teacher_list.length; j++) {
              self.teacher_list[j]["presence"] = "present";
              self.teacher_list[j]["toggle"] = "toggle_on";
              self.teacher_list[j]["presence_color"] = "green darken-2";
              for (var i = 0; i < self.absentee_list.length; i++) {
                if (
                  self.teacher_list[j]["id"] == self.absentee_list[i]
                ) {
                  self.teacher_list[j]["presence"] = "absent";
                  self.teacher_list[j]["toggle"] = "toggle_off";
                  self.teacher_list[j]["presence_color"] = "#EF5350";
                } 
              }
            }
            self.waiting = false;
          })
          .catch(function(error) {
            // handle error
            console.log(error);
          });
      },
      loader: null,
      loading: false,
      loading_text: "Fetching Teacher list... Please wait",
      teacher_id: "",

      teacher_list: [],
      date: new Date().toISOString().substr(0, 10),
      dd: "",
      mm: "",
      yyyy: "",
      ddmmyyyy: "",
      menu: "",

      absentee_list: [],
      correction_list: [],
      total: "",
      present: "",
      absent: "",
      dialog: "",
      waiting: false,
      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      alert_color: "",
      headers: [
        { text: "S No", value: "s_no" },
        {
          text: "Teacher Name",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "Present/Absent", value: "presence" }
      ]
    };
  },

  mounted: function() {
    let self = this;
    let school_id = this.$store.getters.get_school_id;
    let ip = this.$store.getters.get_server_ip;
    let url = ip.concat("/teachers/teacher_list/", school_id, "/");

    function get_teacher_list() {
      return axios.get(url);
    }

    function get_absentees_list() {
      let splitDate = self.date.split("-");

      let year = splitDate[0];
      self.yyyy = year;
      let month = splitDate[1];
      self.mm = month;
      let day = splitDate[2];
      self.dd = day;
      self.ddmmyyyy = day + "-" + month + "-" + year;
      return axios.get(
        ip.concat(
          "/teachers/retrieve_attendance/",
          school_id,
          "/",
          day,
          "/",
          month,
          "/",
          year,
          "/"
        )
      );
    }

    axios.all([get_teacher_list(), get_absentees_list()]).then(
      axios.spread(function(teachers, absentees) {
        self.absent = absentees.data.length;
        for (var i = 0; i < absentees.data.length; i++) {
          self.absentee_list.push(absentees.data[i]["teacher"]);
        }
        self.total = teachers.data.length;
        self.present = self.total - self.absent;
        for (var i = 0; i < teachers.data.length; i++) {
          let teacher = {};
          teacher["s_no"] = i + 1;
          teacher["id"] = teachers.data[i]["id"];
          if (self.absentee_list.indexOf(teacher["id"]) > -1) {
            teacher["presence"] = "absent";
            teacher["toggle"] = "toggle_off";
            teacher["presence_color"] = "#EF5350";
          } else {
            teacher["presence"] = "present";
            teacher["toggle"] = "toggle_on";
            teacher["presence_color"] = "green darken-2";
          }
          teacher["name"] =
            teachers.data[i]["first_name"] +
            " " +
            teachers.data[i]["last_name"];
          self.teacher_list.push(teacher);
        }
        self.waiting = false;
      })
    );
  },

  methods: {
    status_color(status) {
      if (status == "absent") return "#EF5350";
      if (status == "present") return "#4CAF50";
    },
    mark_absence(item) {
      let position = this.absentee_list.indexOf(item.id);
      if (position > -1) {
        // this student was in the absentee list. will have to be marked as present
        this.absentee_list.splice(position, 1);
        this.correction_list.push(item.id);
        item.presence = "present";
        this.present += 1;
        this.absent -= 1;
        item.toggle = "toggle_on";
        item.presence_color = "green darken-2";
      } else {
        this.absentee_list.push(item.id);
        let idx = this.correction_list.indexOf(item.id);
        if (idx > -1) {
          this.correction_list.splice(idx, 1);
        }
        item.presence = "absent";
        this.present -= 1;
        this.absent += 1;
        item.toggle = "toggle_off";
        item.presence_color = "orange darken-2";
        console.log("absentees_list = ", this.absentee_list);
        console.log("correction_list = ", this.correction_list);
      }
    },
    dismiss() {
      this.showDismissibleAlert = false;
    },
    process_attendance() {
      let self = this;
      let response = confirm(
        "Are you sure you want to Submit this Attendance?"
      );
      if (response) {
        this.waiting = true;
        let school_id = self.$store.getters.get_school_id;
        let ip = self.$store.getters.get_server_ip;
        let splitDate = this.date.split("-");

        let year = splitDate[0];
        let month = splitDate[1];
        let day = splitDate[2];
        let url = ip.concat(
          "/teachers/process_attendance/",
          school_id,
          "/",
          day,
          "/",
          month,
          "/",
          year,
          "/"
        );
        console.log("url=", url);

        var corrections = {};
        for (var i in self.correction_list) {
          let correction = self.correction_list[i];
          corrections[correction] = correction;
        }

        var absentees = {};
        for (var i in self.absentee_list) {
          let an_absentee = self.absentee_list[i];
          absentees[an_absentee] = an_absentee;
        }

        axios
          .post(url, {
            corrections,
            absentees
          })
          .then(function(response) {
            self.waiting = false;
            self.loading = false;
            console.log(response);

            confirm(response.data["outcome"]);
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