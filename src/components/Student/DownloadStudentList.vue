<template>
  <v-app>
    <v-content>
      <v-form class="mt-0">
        <v-container fluid class="pa-md-4 mx-lg-auto">
          <h1>{{ heading }}</h1>
          <h3>Select Class & Section</h3>
          <v-layout xs4 row wrap justify-center>
            <v-col cols="12" md="2">
              <v-checkbox
                v-model="whole_school"
                :label="`Whole School`"
                @change="dismiss(); the_class=''; section=''; all_sections=false"
              ></v-checkbox>
            </v-col >
            <v-col cols="12" md="2">
              <v-select
                :items="class_list"
                label="Class/Standard"
                v-model="the_class"
                v-on:focus="dismiss()"
                :disabled="whole_school"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                :items="section_list"
                label="Section"
                v-model="section"
                v-on:focus="dismiss()"
                :disabled="whole_school || all_sections"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                v-model="all_sections"
                :label="`All Sections`"
                @change="dismiss(); section=''"
                :disabled="whole_school"
                
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
      heading: "Download Student List",
      whole_school: false,
      all_sections: false,
      loader: null,
      loading: false,
      the_class: "",
      class_list: [],
      section: "",
      section_list: [],
      ip: "",
      school_id: "",

      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      waiting: false,
      loading: false
    };
  },
  mounted: function() {
    let self = this;

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
    download() {
      let self = this;
      var can_search = true;
      console.log(this.whole_school, this.the_class, this.section, this.all_sections);
      if (this.whole_school == false && this.the_class == "") {
        this.alert_message = "Please Select either Whole School or a Class & Section";
        this.showDismissibleAlert = true;
        can_search = false;
      }
     
      if (this.the_class != "" && this.section == "" && !this.all_sections) {
        this.alert_message = "Please specify Section";
        this.showDismissibleAlert = true;
        can_search = false;
      }
      if (this.the_class == "" && this.section !="") {
        this.alert_message = "Please specify Class";
        this.showDismissibleAlert = true;
        can_search = false;
      }
      if (can_search) {
        this.waiting = true;
        this.loading = true;
        let ip = this.$store.getters.get_server_ip;
        let school_id = this.$store.getters.get_school_id;
        let school_name = this.$store.getters.get_school_name;
        let whole_school = this.whole_school
        let the_class = this.the_class;
        let section = this.section;
        let all_sections = self.all_sections

        var url = ip.concat("/student/download_student_list/");
        let options = {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          },
          responseType: "arraybuffer"
        };
        
        axios
          .post(url, 
            {
              school_id: school_id,
              whole_school: whole_school,
              the_class: the_class,
              section: section,
              all_sections: all_sections
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
            var file_name = "";
            if (whole_school) {
              file_name = "Student_List.xlsx";
            }
            else  {
              if (all_sections) {
                file_name = the_class + "_Student_list.xlsx";
              }
              else{
                file_name = the_class + "_" + section + "_Student_list.xlsx"
              }
            }
            
            link.setAttribute("download", file_name); //or any other extension
            document.body.appendChild(link);
            link.click();
            confirm("Student List Downloaded");
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