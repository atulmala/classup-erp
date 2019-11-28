<template>
  <v-app>
    <v-content>
      <v-form>
        <v-container fluid class="pa-md-4 mx-lg-auto">
          <h1>{{ heading }}</h1>
          <h3>Select Class, Section, and Subject</h3>
          <v-layout xs4 row wrap justify-center>
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
          </v-layout>
          <h3>Select Month & Year</h3>
          <v-layout xs4 row wrap justify-center>
            <v-col cols="12" md="4">
              <v-date-picker
                v-model="date"
                type="month"
                color="green lighten-1" 
                header-color="primary"
                :show-current="false"
                @change="dismiss()"
                no-title
                scrollable
                actions
              ></v-date-picker>
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
              <v-alert :value="showDismissibleAlert" :color="alert_color" :type="alert_type">{{ alert_message }}</v-alert>
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
      ip: "",
      school_id: "",
      coming_from: "",
      heading: "Download Monthly Attendance for a Class/Grade",
      show_search_criteria: true,
      loader: null,
      loading: false,
      the_class: "",
      class_list: [],
      section: "",
      section_list: [],
      subject: "Main",
      subject_list: [],
      date: "",

      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      alert_color: "",
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

    self.coming_from = this.$store.getters.get_coming_from;

    self.school_id = this.$store.getters.get_school_id;
    self.ip = this.$store.getters.get_server_ip;
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
    download() {
      let self = this;
      var can_search = true;
      if (this.section == "") {
        this.alert_message = "Please specify Section";
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
      if (this.subject == "") {
        this.alert_message = "Please specify Subject";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_search = false;
      }
      if (this.date == "") {
        this.alert_message = "Please specify Month";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_search = false;
      }

      if (can_search) {
        console.log("selected month = " + this.month);
        this.waiting = true;
        this.loading = true;
        let ip = this.$store.getters.get_server_ip;
        let school_id = this.$store.getters.get_school_id;

        let url = self.ip.concat("/operations/att_register_class/");
        console.log("url=", url);

        let options = {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          },
          responseType: "arraybuffer"
        };
        axios
          .post(
            url,
            {
              school_id: self.school_id,
              the_class: self.the_class,
              section: self.section,
              subject: self.subject,
              date: self.date
            },
            options
          )
          .then(function(response) {
            self.waiting = false;
            self.loading = false;
            console.log(response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            var file_name =
              "Attendance_Register" + self.the_class + "-" + self.section;
            file_name += "_" + self.subject + "_" + self.date + ".xlsx";

            link.setAttribute("download", file_name); //or any other extension
            document.body.appendChild(link);
            link.click();
            confirm("Attendance Sheet Downloaded");
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