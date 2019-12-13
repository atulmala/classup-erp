<template>
  <v-app>
    <v-content>
      <v-form class="mt-0">
        <v-container fluid class="pa-md-4 mx-lg-auto">
          <v-layout row wrap justify-center>
            <v-col cols="12" md="6">
              <v-alert
                :value="showDismissibleAlert"
                color="red"
                :type="alert_type"
              >{{ alert_message }}</v-alert>
            </v-col>
          </v-layout>
          <v-layout row wrap>
            <v-col cols="12" md="6">
              <v-data-table
                dense
                dark
                loading
                loading-text="Fetching students... Please wait"
                v-model="recepients"
                :headers="headers"
                :items="student_list"
                item-key="id"
                show-select
                @item-selected="student_selected"
                class="elevation-1"
              >
                <template v-slot:top>
                  <v-toolbar flat color="#BF360C">
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
                    <v-col cols="12" md="2">
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
                    <v-checkbox
                      class="mt-7"
                      v-model="whole_class"
                      :value="whole_class"
                      label="Whole Class"
                      :disabled="!(the_class != '' && section != '')"
                      @change="select_all_students"
                    ></v-checkbox>
                    <v-spacer></v-spacer>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-dialog max-width="500px">
                      <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark @click="validate" @v-on="on">Send</v-btn>
                      </template>
                    </v-dialog>
                  </v-toolbar>
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="12" md="6">
              <v-layout row wrap justify-center>
                <v-textarea
                  v-model="message"
                  label="Message"
                  filled
                  v-on:focus="dismiss()"
                  :rules="rules"
                  :auto-grow="true"
                  :no-resize="false"
                  :solo="true"
                  counter="400"
                ></v-textarea>
              </v-layout>
              <v-layout row wrap justify-center>
                <v-file-input
                  show-size
                  label="Optional - Attach file (Image jpeg or png, PDF)"
                  ref="file_input"
                  outlined
                  color="deep-purple accent-4"
                  v-model="selectedFile"
                  :name="uploadFieldName"
                  @change="onFileChanged"
                  accept="image/*, .pdf"
                />
              </v-layout>
              <v-layout v-if="recepients.length > 0" row wrap r>
                <v-card class="mx-auto">
                  <v-card-text>
                    <div class="font-weight-black">Selected Students ({{ recepients.length }})</div>
                    <v-chip-group multiple column active-class="primary--text;">
                      <v-chip
                        v-for="student in recepients"
                        :key="student.name"
                        :color="colors[Math.floor(Math.random() * 37)]"
                      >{{ student.name }}</v-chip>
                    </v-chip-group>
                  </v-card-text>
                </v-card>
              </v-layout>
            </v-col>
          </v-layout>
        </v-container>
      </v-form>
      <template>
        <v-layout row wrap justify-center></v-layout>
      </template>
      <template>
        <div class="text-xs-center">
          <v-progress-circular v-if="waiting" :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
        </div>
      </template>
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
      whole_class: "",
      loader: null,
      loading: false,
      the_class: "",
      class_list: [],
      section: "",
      section_list: [],
      student: "",
      student_list: [],
      recepients: [],
      message: "",
      rules: [v => v.length <= 400 || "Max 400 characters"],
      image_included: false,
      uploadFieldName: "",
      selectedFile: null,
      ip: "",
      school_id: "",
      headers: [
        {
          text: "S No",
          align: "left",
          sortable: false,
          value: "s_no"
        },
        { text: "Student", value: "name" }
      ],
      selected: [],

      alert_type: "",
      alert_message: "",
      alert_color: "",
      showDismissibleAlert: false,
      waiting: false,
      colors: [
        "#F44336",
        "#BBDEFB",
        "#9C27B0",
        "#03A9F4",
        "#00BCD4",
        "#CDDC39",
        "#CDDC39",
        "#BF360C",
        "#81C784",
        "#FFCC80",
        "#FF6D00",
        "#FFECB3",
        "#1B5E20",
        "#827717",
        "#3D5AFE",
        "#9575CD",
        "#880E4F",
        "#EF5350",
        "#F44336",
        "#BBDEFB",
        "#9C27B0",
        "#03A9F4",
        "#00BCD4",
        "#CDDC39",
        "#CDDC39",
        "#BF360C",
        "#81C784",
        "#FFCC80",
        "#FF6D00",
        "#FFECB3",
        "#1B5E20",
        "#827717",
        "#3D5AFE",
        "#9575CD",
        "#880E4F",
        "#EF5350",
        "#F44336",
        "#BBDEFB",
        "#9C27B0",
        "#03A9F4",
        "#00BCD4",
        "#CDDC39",
        "#CDDC39",
        "#BF360C",
        "#81C784",
        "#FFCC80",
        "#FF6D00",
        "#FFECB3",
        "#1B5E20",
        "#827717",
        "#3D5AFE",
        "#9575CD",
        "#880E4F",
        "#EF5350"
      ]
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
    get_student_list() {
      let self = this;
      self.student_list = [];
      self.recepients = [];
      self.whole_class = false;
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
            for (var i = 0; i < response.data.length; i++) {
              let student = {};
              student["id"] = response.data[i]["id"];
              student["s_no"] = i + 1;
              student["name"] =
                response.data[i]["fist_name"] +
                " " +
                response.data[i]["last_name"];
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
    student_selected() {
      this.showDismissibleAlert = false;
    },
    select_all_students() {
      if (this.whole_class) {
        this.recepients = this.student_list;
      } else {
        this.recepients = [];
      }
      console.log("selected_classes", this.recepients);
    },
    onFileChanged(event) {
      this.image_included = true;
    },
    validate() {
      this.good_to_send = true;
      if (this.message == "") {
        this.showDismissibleAlert = true;
        this.alert_message = "Message is empty!";
        this.alert_color = "red";
        this.good_to_send = false;
      }
      if (this.message.length > 400) {
        this.showDismissibleAlert = true;
        this.alert_message =
          "Message is too long. Please restrict to 400 characters max";
        this.alert_color = "red";
        this.good_to_send = false;
      }
      if (this.recepients.length == 0) {
        this.showDismissibleAlert = true;
        this.alert_message = "No recepient selected";
        this.good_to_send = false;
      }
      if (this.good_to_send) {
        this.caption = "Please Confirm sending Bulk Messages";
        this.alert_message =
          "Are you sure you want to send this message to selected Recepients? ";
        this.confirm = true;
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