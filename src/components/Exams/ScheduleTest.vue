<template>
  <v-app>
    <v-content>
      <v-form>
        <v-container fluid class="pa-md-4 mx-lg-auto">
          <h1>{{ heading }}</h1>
          <v-layout xs4 row wrap justify-center>
            <v-col cols="12" md="2">
              <v-select
                :items="exam_list"
                label="Exam"
                v-model="exam"
                @change="exam_selected"
                v-on:focus="dismiss()"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                :items="class_list"
                label="Class"
                v-model="the_class"
                @change="exam_selected"
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
          </v-layout>
          <v-layout xs4 row wrap justify-center>
            <v-col cols="12" md="2">
              <v-checkbox
                v-model="grade_based"
                value="grade_based"
                :label="`Grade Based?`"
                @change="set_grade_based()"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                label="Max Marks"
                v-model="max_marks"
                :disabled="exam_type == 'term' || grade_based"
                v-on:focus="dismiss()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                label="Pass Marks"
                v-model="passing_marks"
                :disabled="exam_type == 'term' || grade_based"
                v-on:focus="dismiss()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field label="Syllabus (optional)" v-model="syllabus" v-on:focus="dismiss()"></v-text-field>
            </v-col>
          </v-layout>
          <h3>Select Date</h3>
          <v-layout xs4 row wrap justify-center>
            <v-col cols="12" md="3">
              <v-date-picker
                v-model="test_date"
                show-current
                color="green lighten-1"
                :min="start_date"
                :max="end_date"
                @change="dismiss()"
              ></v-date-picker>
            </v-col>
          </v-layout>
          <v-layout></v-layout>
          <v-layout xs4 row wrap justify-space-around>
            <div class="text-xs-center">
              <v-btn
                :loading="loading"
                :disabled="loading"
                color="green"
                @click="loader = 'loading'"
                v-on:click="validate()"
              >
                Schedule Test
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
            </div>
          </v-layout>
          <v-layout xs4 row wrap justify-space-around>
            <v-col cols="12" md="6">
              <v-alert
                :value="showDismissibleAlert"
                :color="alert_color"
                :type="alert_type"
              >{{ alert_message }}</v-alert>
            </v-col>
          </v-layout>
        </v-container>
      </v-form>
      <v-dialog v-model="confirm_date" persistent max-width="440">
        <v-card>
          <v-card-title class="headline">{{ caption }}</v-card-title>
          <v-card-text>{{ alert_message }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="confirm_date = false; confirm = true; 
            caption='Confirm Test Scheduling'; alert_message = 'Are you sure you want to schedule this Test?'"
            >Yes, Date is Correct</v-btn>
            <v-btn color="amber darken-1" text @click="confirm_date = false">Change Date</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="confirm" persistent max-width="440">
        <v-card>
          <v-card-title class="headline">{{ caption }}</v-card-title>
          <v-card-text>{{ alert_message }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="schecule_test()">OK</v-btn>
            <v-btn color="green darken-1" text @click="confirm = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <template>
        <div class="text-xs-center">
          <v-progress-circular v-if="waiting" :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
        </div>
      </template>
      <v-col cols="12" md="3"></v-col>
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
      coming_from: "",
      teacher: "",
      heading: "Schedule a Test",
      show_search_criteria: true,
      loader: null,
      loading: false,
      the_class: "",
      exam: "",
      exam_list: [],
      exam_id_list: [],
      exam_id: "",
      start_dates: [],
      start_date: "",
      end_dates: [],
      end_date: "",
      test_date: "",
      confirm_date: false,
      exam_type: "",
      exam_types: [],
      class_list: [],
      section: "",
      section_list: [],
      subject: "",
      subject_list: [],
      grade_based: false,
      max_marks: "",
      passing_marks: "",
      syllabus: "",
      date: "",
      caption: "",
      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
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
    self.teacher = this.$store.getters.get_logged_user;

    function get_exam_list() {
      return axios.get(
        self.ip.concat("/academics/get_exam_list_teacher/", self.teacher, "/")
      );
    }
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

    axios
      .all([
        get_exam_list(),
        get_class_list(),
        get_section_list(),
        get_subject_list()
      ])
      .then(
        axios.spread(function(exams, classes, sections, subjects) {
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

          for (var i = 0; i < exams.data.length; i++) {
            self.exam_id_list[i] = exams.data[i]["id"];
            self.start_dates[i] = exams.data[i]["start_date"];
            self.end_dates[i] = exams.data[i]["end_date"];
            self.exam_types[i] = exams.data[i]["exam_type"];
          }
          let length = exams.data.length;
          self.exam_list = exams.data;
          for (var i = 0; i < length; i++) {
            self.exam_list[i] = exams.data[i]["title"];
          }
        })
      );
  },

  methods: {
    set_grade_based: function(event) {
      console.log(event);
      if (this.grade_based) {
        this.max_marks = this.passing_marks = "N/A";
      } else {
        if (this.exam_type != "term") this.max_marks = this.passing_marks = "";
        else {
          this.max_marks = 80;
          this.passing_marks = 25;
        }
      }
    },
    exam_selected() {
      let i = this.exam_list.indexOf(this.exam);
      this.exam_id = this.exam_id_list[i];
      this.start_date = this.start_dates[i];
      this.test_date = this.start_date;
      this.end_date = this.end_dates[i];

      this.exam_type = this.exam_types[i];
      if (this.exam_type == "term") {
        let higher_classes = ["XI", "XII"];
        if (higher_classes.indexOf(this.the_class) > -1) {
          this.max_marks = 100;
          this.passing_marks = 40;
        } else {
          this.max_marks = 80;
          this.passing_marks = 30;
        }
      } else {
        this.max_marks = "";
        this.passing_marks = "";
      }
    },
    validate() {
      var can_schedule = true;

      if (this.test_date == "") {
        this.alert_message = "Please select a date for this Test";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_schedule = false;
      }
      if (this.max_marks == "") {
        this.alert_message = "Please enter Maximum Marks for this Test";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_schedule = false;
      }
      if (this.passing_marks == "") {
        this.alert_message = "Please enter Passing Marks for this Test";
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
      if (this.section == "") {
        this.alert_message = "Please select a Section";
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
      if (this.exam == "") {
        this.alert_message = "Please select an Exam";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_schedule = false;
      }
      if (can_schedule) {
        if (this.test_date === this.start_date) {
          this.confirm_date = true;
          let splitDate = this.test_date.split("-");

          let year = splitDate[0];
          let month = splitDate[1];
          let day = splitDate[2];

          let ddmmyyyy = day + "/" + month + "/" + year;
          this.caption =
            "The date of test is same as the start date of this exam. Are you sure?";
          this.alert_message =
            "Test date and Exam start date are same (" +
            ddmmyyyy +
            "). Is this a coincidence?";
        } else {
          this.confirm = true;
          this.caption = "Confirm Test Scheduling";
          this.alert_message = "Are you sure you want to schedule this Test?";
        }
      }
    },
    schecule_test() {
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

      let url = ip.concat("/exam/schedule_test/");
      console.log("url=", url);

      axios
        .post(url, {
          school_id: school_id,
          teacher: teacher,
          exam_id: self.exam_id,
          the_class: self.the_class,
          section: self.section,
          subject: self.subject,
          date: self.test_date,
          grade_based: self.grade_based,
          max_marks: self.max_marks,
          passing_marks: self.passing_marks,
          syllabus: self.syllabus
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