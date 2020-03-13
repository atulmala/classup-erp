<template>
  <v-content>
    <v-col cols="12" md="10" offset-sm4>
      <template>
        <v-data-table
          dark
          loading
          loading-text="Fetching tests... Please wait"
          :headers="headers"
          :items="tests"
          item-key="id"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="blue">
              <v-toolbar-title>Test List</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="primary"
                    dark
                    class="ma-2"
                    @click="get_test_details"
                    @v-on="on"
                  >Schedule Test</v-btn>
                </template>
                <v-card>
                  <template>
                    <div class="text-xs-center">
                      <v-progress-circular
                        v-if="waiting"
                        :size="70"
                        :width="7"
                        color="purple"
                        indeterminate
                      ></v-progress-circular>
                    </div>
                  </template>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-select
                            :items="test_details.exam_list"
                            label="Exam"
                            v-model="test_details.exam"
                            @change="exam_selected"
                            v-on:focus="dismiss()"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-select
                            :items="test_details.allowed_classes"
                            label="Class"
                            v-model="test_details.the_class"
                            @change="exam_selected"
                            v-on:focus="dismiss()"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <v-select
                            :items="test_details.section_list"
                            label="Section"
                            v-model="test_details.section"
                            v-on:focus="dismiss()"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-select
                            :items="test_details.subject_list"
                            label="Subject"
                            v-model="test_details.subject"
                            v-on:focus="dismiss()"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-menu
                            ref="menu"
                            v-model="test_details.menu"
                            :close-on-content-click="false"
                            :return-value.sync="test_details.test_date"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="test_details.test_date"
                                label="Date of Test"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                                @click="dismiss()"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="test_details.test_date"
                              no-title
                              color="green lighten-1"
                              :min="test_details.start_date"
                              :max="test_details.end_date"
                              scrollable
                            >
                              <v-spacer></v-spacer>
                              <v-btn text color="primary" @click="test_details.menu = false">Cancel</v-btn>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.menu.save(test_details.test_date)"
                              >OK</v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-checkbox
                            v-model="test_details.grade_based"
                            :label="`Grade Based?`"
                            value="grade_based"
                            @change="set_grade_based()"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-text-field
                            label="Max Marks"
                            v-model="test_details.max_marks"
                            :disabled="test_details.exam_type == 'term' || test_details.grade_based == 'grade_based'"
                            v-on:focus="dismiss()"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                          <v-text-field
                            label="Pass Marks"
                            v-model="test_details.passing_marks"
                            :disabled="test_details.exam_type == 'term' || test_details.grade_based == 'grade_based'"
                            v-on:focus="dismiss()"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="12">
                          <v-text-field
                            label="Syllabus (optional)"
                            v-model="test_details.syllabus"
                            v-on:focus="dismiss()"
                          ></v-text-field>
                        </v-col>
                      </v-row>
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
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="orange" @click="close">Cancel</v-btn>
                    <v-btn color="green" @click="validate">Schedule</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="test_details.confirm_date" persistent max-width="440">
                <v-card>
                  <v-card-title class="headline">{{ caption }}</v-card-title>
                  <v-card-text>{{ alert_message }}</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="green darken-1"
                      text
                      @click="test_details.confirm_date = false; confirm = true; 
                        caption='Confirm Test Scheduling'; 
                        alert_message = 'Are you sure you want to schedule this Test?'"
                    >Yes, Date is Correct</v-btn>
                    <v-btn
                      color="amber darken-1"
                      text
                      @click="test_details.confirm_date = false"
                    >Change Date</v-btn>
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
                    <v-btn
                      color="green darken-1"
                      text
                      @click="confirm = false; alert_color = ''"
                    >Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.max_marks="{ item }">
            <v-chip small color="teal" dark>{{ item.max_marks }}</v-chip>
          </template>
          <template v-slot:item.is_completed="{ item }">
            <v-chip outlined :color="status_color(item.is_completed)">{{ item.is_completed }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon small class="mr-2" @click="edit_item(item)">edit</v-icon>
            <v-icon small @click="deleteItem(item)">delete</v-icon>
          </template>
          <template v-slot:expanded-item="{ item }">
            <v-card flat>
              <v-card-subtitle
                class="headline mb-0"
              >Exam {{ item.exam }} Marks Entry - Subject: {{ item.subject }} Class: {{ item.the_class }}</v-card-subtitle>
              <v-card-text></v-card-text>
              <v-card-actions>
                <v-btn text>Save</v-btn>
                <v-btn text>Submit</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-data-table>
      </template>
    </v-col>
  </v-content>
</template>
      
<script>
import axios from "axios";
export default {
  name: "ShowTestList",
  data() {
    return {
      ip: "",
      school_id: "",
      teacher: "",
      loader: null,
      loading: true,
      tests: [],
      headers: [
        {
          text: "Date",
          align: "left",
          sortable: false,
          value: "date_conducted"
        },
        { text: "Subject", value: "subject" },
        { text: "Class", value: "the_class" },
        { text: "Exam", value: "exam" },
        { text: "Type", value: "test_type" },
        { text: "Max Marks", value: "max_marks" },
        { text: "Status", value: "is_completed" },
        { text: "Actions", value: "action", sortable: false }
      ],

      formTitle: "Schedule a new Test",
      dialog: false,
      test_details: {
        the_class: "",
        exam: "",
        exam_list: [],
        exam_id_list: [],
        exam_id: "",
        start_dates: [],
        start_date: "",
        end_dates: [],
        end_date: "",
        start_classes: [],
        start_class: "",
        end_classes: [],
        end_class: "",
        menu: false,
        test_date: "",
        confirm_date: false,
        exam_type: "",
        exam_types: [],
        class_list: [],
        allowed_classes: [],
        section: "",
        section_list: [],
        subject: "",
        subject_list: [],
        grade_based: false,
        max_marks: "",
        passing_marks: "",
        syllabus: "",
        date: ""
      },
      confirm: false,
      alert_type: "",
      alert_message: "",
      alert_color: "",
      showDismissibleAlert: false,
      caption: "",
      waiting: false
    };
  },
  mounted: function() {
    let self = this;
    self.school_id = this.$store.getters.get_school_id;
    self.teacher = this.$store.getters.get_logged_user;
    self.ip = this.$store.getters.get_server_ip;
    let url = self.ip.concat("/exam/get_tests");
    axios
      .get(url, {
        params: {
          school_id: self.school_id,
          for_whom: "teacher",
          teacher: self.teacher
        }
      })
      .then(function(response) {
        if (response.data.length == 0) {
          self.alert_message = "You have not scheduled any Test";
          self.showDismissibleAlert = true;
          self.alert_type = "error";
        } else {
          for (var i = 0; i < response.data.length; i++) {
            var test = {};
            test["id"] = response.data[i]["id"];
            test["date_conducted"] = response.data[i]["date_conducted"];
            test["the_class"] =
              response.data[i]["the_class"] +
              " - " +
              response.data[i]["section"];
            test["section"] = response.data[i]["section"];
            test["subject"] = response.data[i]["subject"];
            test["exam"] = response.data[i]["exam"];
            test["test_type"] = response.data[i]["test_type"];
            test["grade_based"] = response.data[i]["grade_based"];

            let grade_based = response.data[i]["grade_based"];
            if (grade_based == true) {
              test["max_marks"] = "Grade Based";
              test["grade_based"] = "Yes";
            } else {
              test["max_marks"] = response.data[i]["max_marks"];
              test["grade_based"] = "No";
            }

            let is_completed = response.data[i]["is_completed"];
            if (is_completed == true) {
              test["is_completed"] = "Completed";
            } else {
              test["is_completed"] = "Pending";
            }
            self.tests.push(test);
          }
          console.log(self.tests);
          self.loading = false;
        }
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  },
  methods: {
    get_test_details() {
      let self = this;
      self.waiting = true;
      console.log("inside get_clsses");
      this.dialog = true;

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
            self.test_details.class_list = classes.data;
            self.test_details.section_list = sections.data;
            self.test_details.subject_list = subjects.data;

            for (var i = 0; i < classes.data.length; i++) {
              self.test_details.class_list[i] = classes.data[i]["standard"];
            }
            for (var i = 0; i < sections.data.length; i++) {
              self.test_details.section_list[i] = sections.data[i]["section"];
            }
            for (var i = 0; i < subjects.data.length; i++) {
              self.test_details.subject_list[i] =
                subjects.data[i]["subject_name"];
            }

            for (var i = 0; i < exams.data.length; i++) {
              self.test_details.exam_id_list[i] = exams.data[i]["id"];
              self.test_details.start_dates[i] = exams.data[i]["start_date"];
              self.test_details.end_dates[i] = exams.data[i]["end_date"];
              self.test_details.start_classes[i] = exams.data[i]["start_class"];
              self.test_details.end_classes[i] = exams.data[i]["end_class"];
              self.test_details.exam_types[i] = exams.data[i]["exam_type"];
            }
            console.log(self.test_details.start_classes);
            console.log(self.test_details.end_classes);
            let length = exams.data.length;
            self.test_details.exam_list = exams.data;
            for (var i = 0; i < length; i++) {
              self.test_details.exam_list[i] = exams.data[i]["title"];
            }
          })
        );
      self.waiting = false;
    },
    set_grade_based: function(event) {
      console.log(this.test_details.grade_based);
      if (this.test_details.grade_based) {
        this.test_details.max_marks = this.test_details.passing_marks = "N/A";
      } else {
        if (this.test_details.exam_type != "term")
          this.test_details.max_marks = this.test_details.passing_marks = "";
        else {
          this.test_details.max_marks = 80;
          this.test_details.passing_marks = 25;
        }
      }
    },
    exam_selected() {
      let i = this.test_details.exam_list.indexOf(this.test_details.exam);
      this.test_details.exam_id = this.test_details.exam_id_list[i];
      this.test_details.start_date = this.test_details.start_dates[i];
      this.test_details.test_date = this.test_details.start_date;
      this.test_details.end_date = this.test_details.end_dates[i];

      this.test_details.start_class = this.test_details.start_classes[i];
      let start_class_index = this.test_details.class_list.indexOf(
        this.test_details.start_class
      );
      this.test_details.end_class = this.test_details.end_classes[i];
      let end_class_index = this.test_details.class_list.indexOf(
        this.test_details.end_class
      );
      this.test_details.allowed_classes = this.test_details.class_list.slice(
        0,
        end_class_index + 1
      );

      this.test_details.allowed_classes.splice(0, start_class_index);
      this.test_details.exam_type = this.test_details.exam_types[i];

      if (this.test_details.exam_type == "term") {
        let higher_classes = ["XI", "XII"];
        if (higher_classes.indexOf(this.test_details.the_class) > -1) {
          this.test_details.max_marks = 100;
          this.test_details.passing_marks = 40;
        } else {
          this.test_details.max_marks = 80;
          this.test_details.passing_marks = 30;
        }
      } else {
        this.test_details.max_marks = "";
        this.test_details.passing_marks = "";
      }
    },
    validate() {
      var can_schedule = true;

      if (this.test_details.test_date == "") {
        this.alert_message = "Please select a date for this Test";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_schedule = false;
      }
      if (this.test_details.max_marks == "") {
        this.alert_message = "Please enter Maximum Marks for this Test";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_schedule = false;
      }
      if (this.test_details.passing_marks == "") {
        this.alert_message = "Please enter Passing Marks for this Test";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_schedule = false;
      }
      if (this.test_details.subject == "") {
        this.alert_message = "Please select a Subject";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_schedule = false;
      }
      if (this.test_details.section == "") {
        this.alert_message = "Please select a Section";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_schedule = false;
      }
      if (this.test_details.the_class == "") {
        this.alert_message = "Please select a Class";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_schedule = false;
      }
      if (this.test_details.exam == "") {
        this.alert_message = "Please select an Exam";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_schedule = false;
      }
      if (can_schedule) {
        if (this.test_details.test_date === this.test_details.start_date) {
          this.test_details.confirm_date = true;
          let splitDate = this.test_details.test_date.split("-");

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
          exam_id: self.test_details.exam_id,
          the_class: self.test_details.the_class,
          section: self.test_details.section,
          subject: self.test_details.subject,
          date: self.test_details.test_date,
          grade_based: self.test_details.grade_based,
          max_marks: self.test_details.max_marks,
          passing_marks: self.test_details.passing_marks,
          syllabus: self.test_details.syllabus
        })
        .then(function(response) {
          self.waiting = false;
          self.loading = false;
          self.dialog = false;
          console.log(response);

          confirm(response.data["outcome"]);
          if (response.data["outcome"] == "Test successfully created") {
            console.log("trying to insert this test into the data table");
            let test = {};
            test["id"] = response.data["id"];
            test["date_conducted"] = self.test_details.test_date;
            test["the_class"] =
              self.test_details.the_class + " - " + self.test_details.section;
            test["section"] = self.test_details.section;
            test["subject"] = self.test_details.subject;
            test["exam"] = self.test_details.exam;
            test["test_type"] = response.data["type"];

            let grade_based = self.test_details.grade_based;
            if (grade_based == "grade_based") {
              test["max_marks"] = "Grade Based";
              test["grade_based"] = "Yes";
            } else {
              test["max_marks"] = self.test_details.max_marks + ".00";
              test["grade_based"] = "No";
            }

            test["is_completed"] = "Pending";
            console.log("test = ", test);
            self.tests.splice(0, 0, test);
            self.tests.push(test);
          }

          // neutralize the test_details structure so that Schedule Test dialog doesn't show pre-populated
          self.test_details.exam = "";
          self.test_details.the_class = "";
          self.test_details.section = "";
          self.test_details.test_date = "";
          self.test_details.subject = "";
          self.test_details.max_marks = "";
          self.test_details.passing_marks = "";
          self.test_details.grade_based = "";
          self.test_details.syllabus = "";
        })
        .catch(function(error) {
          self.waiting = false;
          self.loading = false;
          var error_message = "An error occured.";
          error_message = error_message.concat(
            " Error summary: ",
            error,
            ". Please contact ClassUp Support"
          );
          confirm(error_message);
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
    },
    status_color(status) {
      if (status == "Pending") return "amber";
      if (status == "Completed") return "green";
    },
    dismiss() {
      this.showDismissibleAlert = false;
    },
    showAlert(a) {
      console.log(a);
      let response = confirm(
        "Are you sure you want to Enter/Update marks for this test ",
        a.id,
        " ",
        a.subject,
        "a.date_coducted"
      );
      if (response) {
        this.$store.dispatch("set_student_id", a.id);
      }
    },
    close() {
      this.test_details.exam = "";
      this.test_details.the_class = "";
      this.test_details.section = "";
      this.test_details.test_date = "";
      this.test_details.subject = "";
      this.test_details.max_marks = "";
      this.test_details.passing_marks = "";
      this.test_details.grade_based = "";
      this.test_details.syllabus = "";
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    edit_item(item) {
      console.log("inside edited item", item);
      this.$store.dispatch("set_class", item.the_class);
      this.$store.dispatch("set_section", item.section);
      this.$store.dispatch("set_subject", item.subject);
      this.$store.dispatch("set_exam", item.exam);
      this.$store.dispatch("set_test", item.id);
      this.$store.dispatch("set_grade_based", item.grade_based);
      this.$store.dispatch("set_test_type", item.test_type);
      this.$store.dispatch("set_max_marks", item.max_marks);
      this.$router.replace("/marks_entry");
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