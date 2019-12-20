<template>
  <v-app>
    <v-content class="ma-0">
      <template>
        <div class="text-xs-center">
          <v-progress-circular v-if="waiting" :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
        </div>
      </template>
      <div class="text-xs-center">
        <v-col cols="10" md="10">
          <v-data-table
            dark
            loading
            :loading-text="((the_class == '') || (section == '')) ? class_not_selected : loading_text"
            :headers="headers"
            :items="student_list"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat color="#827717">
                <v-chip class="mt-4" color="#827717" label>
                  <div class="text-uppercase">Student Promotion (Passs/Fail) Operations</div>
                </v-chip>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-col cols="12" md="2">
                  <v-select
                    class="mt-7"
                    :items="class_list"
                    label="Class"
                    v-model="the_class"
                    v-on:focus="dismiss()"
                    v-on:change="get_student_list()"
                  ></v-select>
                </v-col>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-col cols="12" md="1">
                  <v-select
                    class="mt-7"
                    :items="section_list"
                    label="Sec"
                    v-model="section"
                    v-on:focus="dismiss()"
                    v-on:change="get_student_list()"
                  ></v-select>
                </v-col>
                <v-divider class="mx-4" inset vertical></v-divider>
              </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">
              <v-icon
                class="mr-2 material-icons"
                :color="item.presence_color"
                @click="mark_absence(item)"
              >{{ item.toggle }}</v-icon>
            </template>
            <template v-slot:item.presence="{ item }">
              <v-chip
                :color="status_color(item.presence)"
                @click="mark_absence(item)"
              >{{ item.presence }}</v-chip>
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
  name: "ExamResults",
  data() {
    return {
      loader: null,
      loading: false,
      loading_text: "Fetching student list for this class... Please wait",
      class_not_selected: "Please select a Class & Section",
      reg_no: "",

      the_class: "",
      class_list: [],
      section: "",
      section_list: [],
      

      student_list: [],
      
      dialog: "",
      waiting: false,
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
        { text: "Status", value: "Promoted" }
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
    
    axios.all([get_class_list(), get_section_list()]).then(
      axios.spread(function(classes, sections, subjects) {
        self.class_list = classes.data;
        self.section_list = sections.data;

        for (var i = 0; i < classes.data.length; i++) {
          self.class_list[i] = classes.data[i]["standard"];
        }
        for (var i = 0; i < sections.data.length; i++) {
          self.section_list[i] = sections.data[i]["section"];
        }
      })
    );
  },

  methods: {
    get_student_list() {
      let self = this;
      let ip = this.$store.getters.get_server_ip;
      let school_id = this.$store.getters.get_school_id;
      self.student_list = [];
      if (this.the_class != "" && this.section != "") {
        let url = ip.concat(
          "/exam/get_promotion_list/?school_id=",
          school_id,
          "&the_class=",
          this.the_class,
          "&section=",
          this.section,
        );
        axios
          .get(url)
          .then(function(response) {
            // handle success
            for (var i = 0; i < response.data.length; i++) {
              let student = {};
              student["id"] = response.data[i]["id"];
              student["s_no"] = i + 1;
              student["name"] = response.data[i]["student"]
              student["promotion_status"] = response.data[i]["status"]
              student["detain_reason"] = response.data[i]["detain_reason"]
                
              self.student_list.push(student);
            }
            console.log(self.student_list);
          })
          .catch(function(error) {
            // handle error
            console.log(error);
          });
      }
    
    },

    status_color(status) {
      if (status == "absent") return "#EF5350";
      if (status == "present") return "#4CAF50";
    },
    dismiss() {
      this.showDismissibleAlert = false;
    },
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