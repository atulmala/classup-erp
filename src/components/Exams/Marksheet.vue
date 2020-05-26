<template>
  <v-app class="mt-n12 pt-n12">
    <v-content>
      <v-form v-if="show_search_criteria">
        <v-container fluid class="pa-md-4 mx-lg-auto">
          <h1>{{ heading }}</h1>
          <h3>Select Class & Section</h3>
          <v-layout xs4 row wrap justify-center>
            <v-col cols="12" md="2">
              <v-select
                :items="class_list"
                label="Class/Standard"
                v-model="the_class"
                v-on:focus="dismiss()"
                v-on:change="get_student_list()"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                :items="section_list"
                label="Section"
                v-model="section"
                v-on:focus="dismiss()"
                v-on:change="get_student_list()"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                :items="student_list"
                label="Student"
                v-model="student"
                v-on:focus="dismiss()"
                :disabled="whole_class"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                v-model="whole_class"
                :label="`Whole Class: ${whole_class.toString()}`"
                @change="dismiss(); student=''"
              ></v-checkbox>
            </v-col>
          </v-layout>
          <v-layout xs4 row wrap justify-space-around>
            <div class="text-xs-center">
              <v-btn
                :loading="loading"
                :disabled="loading"
                color="green"
                @click="loader = 'loading'"
                v-on:click="download()"
              >
                Download Sheet
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
                color="red"
                :type="alert_type"
              >{{ alert_message }}</v-alert>
            </v-col>
          </v-layout>
        </v-container>
      </v-form>
      <template>
        <div class="text-xs-center">
          <v-progress-circular v-if="waiting" :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
        </div>
      </template>
      <v-flex d-flex xs8 order-xs5 offset-sm2></v-flex>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      coming_from: "",
      heading: "",
      whole_class: true,
      show_search_criteria: true,
      loader: null,
      loading: false,
      the_class: "",
      class_list: [],
      section: "",
      section_list: [],
      student: "",
      student_list: [],
      ip: "",
      school_id: "",

      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      waiting: false,

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

    this.coming_from = this.$store.getters.get_coming_from;
    if (this.coming_from == "performance_analysis")
      this.heading = "Download Performance Analysis Sheet(s)";
    if (this.coming_from == "mark_sheet")
      this.heading = "Download Mark Sheet(s)";

    this.school_id = this.$store.getters.get_school_id;
    self.ip = this.$store.getters.get_server_ip;
    let url = self.ip.concat("/academics/class_list/", this.school_id, "/");
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
    let url2 = self.ip.concat("/academics/section_list/", this.school_id, "/");
    axios
      .get(url2)
      .then(function(response) {
        // handle success
        self.section_list = response.data;
        for (var i = 0; i < response.data.length; i++) {
          self.section_list[i] = response.data[i]["section"];
        }
        console.log(self.class_list);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  },

  methods: {
    get_student_list() {
      let self = this;
      if (this.the_class != "" && this.section != "") {
        let url = self.ip.concat(
          "/student/list/",
          this.school_id,
          "/",
          this.the_class,
          "/",
          this.section,
          "/"
        );
        axios
          .get(url)
          .then(function(response) {
            // handle success
            self.student_list = response.data;
            for (var i = 0; i < response.data.length; i++) {
              self.student_list[i] =
                response.data[i]["fist_name"] +
                " " +
                response.data[i]["last_name"] +
                " (" +
                response.data[i]["student_erp_id"] +
                ")";
            }
            console.log(self.student_list);
          })
          .catch(function(error) {
            // handle error
            console.log(error);
          });
      }
    },
    download() {
      let self = this;
      var can_search = true;
      if (this.section == "") {
        this.alert_message = "Please specify Section";
        this.showDismissibleAlert = true;
        can_search = false;
      }
      if (this.the_class == "") {
        this.alert_message = "Please specify Class";
        this.showDismissibleAlert = true;
        can_search = false;
      }
      if (!this.whole_class && this.student == "") {
        this.alert_message = "Please Select a Student";
        this.showDismissibleAlert = true;
        can_search = false;
      }
      if (can_search) {
        this.waiting = true;
        this.loading = true;
        let ip = this.$store.getters.get_server_ip;
        let school_id = this.$store.getters.get_school_id;
        let school_name = this.$store.getters.get_school_name;
        let the_class = self.the_class;
        let section = self.section;
        var student = self.student;
        if (student == "") student = "na";
        let whole_class = this.whole_class;

        var url = "";
        if (this.coming_from == "performance_analysis")
          url = ip.concat("/analytics/performance_sheet/");
        if (this.coming_from == "mark_sheet")
          url = ip.concat(
            "/exam/marksheet/",
            school_id,
            "/",
            the_class,
            "/",
            section
          );
        console.log("url=", url);

        axios
          .get(url, {
            params: {
              school_id: school_id,
              the_class: the_class,
              section: section,
              student: student,
              selected_student: student,
              whole_class: whole_class
            }
          })
          .then(function(response) {
            self.waiting = false;
            self.loading = false;
            console.log(response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            var file_name = "";
            if (whole_class)
              file_name =
                self.the_class + "-" + self.section + "_Mark_Sheet" + ".pdf";
            if (student != "") file_name = student + "_Mark_Sheet" + ".pdf";
            link.setAttribute("download", file_name); //or any other extension
            document.body.appendChild(link);
            link.click();
            confirm("Analysis sheet downloaded");
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