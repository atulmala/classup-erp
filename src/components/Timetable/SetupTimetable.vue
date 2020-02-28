<template>
  <v-app class="mt-n12 pt-n12">
    <v-content>
      <v-form class="mt-0 ma-0 pa-0">
        <v-container fluid class="pa-md-4 mx-lg-auto">
          <h1 class="mt-n50 mx-auto">{{ heading }}</h1>
          <v-row align="center">
            <v-col cols="12" md="12">
              <v-card max-width="900" class="mx-auto">
                <v-card-title>Please make selections</v-card-title>
                <v-layout xs4 row wrap justify-center>
                  <v-col cols="12" md="2">
                    <v-select :items="days" label="Day" v-model="day" v-on:focus="dismiss()"></v-select>
                  </v-col>
                  <v-col cols="12" md="2">
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
                      label="Sec"
                      v-model="section"
                      v-on:focus="dismiss()"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-select
                      :items="period_list"
                      label="Period"
                      v-model="period"
                      v-on:focus="dismiss()"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-text-field label="Subject" disabled v-model="subject" v-on:focus="dismiss()"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-text-field label="Teacher" disabled v-model="teacher" v-on:focus="dismiss()"></v-text-field>
                  </v-col>
                </v-layout>

                <v-card-actions>
                  <v-btn
                    :loading="loading"
                    color="green"
                    @click="loader = 'loading'"
                    v-on:click="validate_entries()"
                  >
                    Set
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                  </v-btn>
                </v-card-actions>
                <v-divider></v-divider>
                <v-card-title>Select Subject</v-card-title>

                <v-card-text>
                  <v-chip-group multiple :center-active="true" active-class="primary--text;">
                    <v-chip
                      v-for="subject in subject_list"
                      :key="subject.id"
                      :color="colors[Math.floor(Math.random() * 37)]"
                      @click="dismiss();set_subject(subject)"
                    >{{subject}}</v-chip>
                  </v-chip-group>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-title>Select Teacher</v-card-title>

                <v-card-text>
                  <v-chip-group multiple :center-active="true" active-class="primary--text;">
                    <v-chip
                      v-for="teacher in teacher_list"
                      :key="teacher.id"
                      :color="colors[Math.floor(Math.random() * 37)]"
                      @click="dismiss();set_teacher(teacher)"
                    >{{ teacher}}</v-chip>
                  </v-chip-group>
                </v-card-text>
                <v-divider></v-divider>
              </v-card>
            </v-col>
          </v-row>

          <v-layout xs4 row wrap justify-space-around>
            <v-col cols="12" md="6">
              <v-alert
                :value="showDismissibleAlert"
                color="red"
                :type="alert_type"
              >{{ alert_message }}</v-alert>
            </v-col>
          </v-layout>
          <v-layout xs4 row wrap justify-space-around class="mx-auto">
          <v-snackbar v-model="snackbar" :timeout="timeout" top color="#880E4F">
            {{ response_message }}
            <v-btn color="blue" :text="response_message" @click="snackbar = false">Close</v-btn>
          </v-snackbar>
          </v-layout>
        </v-container>
      </v-form>
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
      heading: "Setup Time Table",
      show_search_criteria: true,
      loader: null,
      loading: false,
      days: [
        "Monday",
        "Tuesday",
        "Wednesdayt",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      day: "",
      the_class: "",
      class_list: [],
      section: "",
      section_list: [],
      subject: "",
      subject_list: [],
      period: "",
      period_list: [],
      subject: "",
      subject_list: [],
      teacher_id: "",
      teacher: "",
      teacher_list: [],
      teacher_id_list: [],
      caption: "",
      snackbar: false,
      timeout: 2000,
      response_message: "",
      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      colors: [],
      alert_color: "",
      waiting: false,
      confirm: "",

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

    self.coming_from = this.$store.getters.get_coming_from;

    self.school_id = this.$store.getters.get_school_id;
    self.ip = this.$store.getters.get_server_ip;
    self.colors = this.$store.getters.get_colors;

    function get_class_list() {
      return axios.get(
        self.ip.concat("/academics/class_list/", self.school_id, "/")
      );
    }
    function get_section_list() {
      return axios.get(
        self.ip.concat("/academics/section_list/", self.school_id, "/")
      );
    }
    function get_subject_list() {
      return axios.get(
        self.ip.concat("/academics/subject_list/", self.school_id, "/")
      );
    }
    function get_periods() {
      return axios.get(
        self.ip.concat("/time_table/get_periods/", self.school_id, "/")
      );
    }
    function get_teacher_list() {
      return axios.get(
        self.ip.concat("/teachers/teacher_list/", self.school_id, "/")
      );
    }
    axios
      .all([
        get_class_list(),
        get_section_list(),
        get_subject_list(),
        get_periods(),
        get_teacher_list()
      ])
      .then(
        axios.spread(function(classes, sections, subjects, periods, teachers) {
          self.class_list = classes.data;
          self.section_list = sections.data;
          self.subject_list = subjects.data;
          self.period_list = periods.data;

          for (var i = 0; i < classes.data.length; i++) {
            self.class_list[i] = classes.data[i]["standard"];
          }
          for (var i = 0; i < sections.data.length; i++) {
            self.section_list[i] = sections.data[i]["section"];
          }
          for (var i = 0; i < subjects.data.length; i++) {
            self.subject_list[i] = subjects.data[i]["subject_name"];
          }
          for (var i = 0; i < periods.data.length; i++) {
            self.period_list[i] = periods.data[i]["symbol"];
          }

          for (var i = 0; i < teachers.data.length; i++) {
            self.teacher_id_list[i] = teachers.data[i]["id"];
          }
          let length = teachers.data.length;
          self.teacher_list = teachers.data;
          for (var i = 0; i < teachers.data.length; i++) {
            self.teacher_list[i] =
              teachers.data[i]["first_name"] +
              " " +
              teachers.data[i]["last_name"];
          }
        })
      );
  },

  methods: {
    set_subject(subject) {
      this.subject = subject;
    },
    set_teacher(teacher) {
      this.teacher = teacher;
    },
    dismiss() {
      this.showDismissibleAlert = false;
    },
    validate_entries() {
      var can_schedule = true;

      if (this.day == "") {
        this.alert_message = "Please select a Day";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_schedule = false;
      }

      if (this.the_class == "") {
        this.alert_message = "Please select a Class";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_schedule = false;
      }
      if (this.section == "") {
        this.alert_message = "Please select a Section";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_schedule = false;
      }
      if (this.period == "") {
        this.alert_message = "Please select a Period";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_schedule = false;
      }
      if (this.subject == "") {
        this.alert_message = "Please select a Subject";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_schedule = false;
      }
      if (this.teacher == "") {
        this.alert_message = "Please select a Teacher";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_schedule = false;
      }

      if (can_schedule) {
        for (var i = 0; i < this.teacher_list.length; i++) {
          if (this.teacher_list[i] == this.teacher) {
            this.teacher_id = this.teacher_id_list[i];
            console.log("selected teacher: ", this.teacher);
            console.log("selected teacher id: ", this.teacher_id);
            break;
          }
        }

        let self = this;
        this.confirm = false;
        this.waiting = true;
        this.loading = true;
        let ip = this.$store.getters.get_server_ip;
        let school_id = this.$store.getters.get_school_id;
        let teacher = this.$store.getters.get_logged_user;

        if (self.grade_based) {
          self.max_marks = self.passing_marks = 0;
        }

        let url = ip.concat("/time_table/set_period/");
        console.log("url=", url);

        axios
          .post(url, {
            school_id: school_id,
            day: self.day,
            the_class: self.the_class,
            section: self.section,
            period: self.period,
            subject: self.subject,
            teacher_id: self.teacher_id
          })
          .then(function(response) {
            self.waiting = false;
            self.loading = false;
            console.log(response);
            self.response_message = response.data["message"];
            console.log(self.response_message);
            self.snackbar = true;
          })
          .catch(function(error) {
            console.log(error);
          })
          .then(function() {
            // always executed
          });
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