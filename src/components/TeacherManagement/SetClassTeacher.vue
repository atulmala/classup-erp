<template>
  <v-content>
    <v-form>
      <v-container fluid>
        <div class="text-center">
          <v-overlay :value="overlay"></v-overlay>
        </div>
        <h2>Set Class Teacher</h2>
        <v-layout xs4 row wrap justify-center>
          <v-col cols="12" md="10">
            <v-card max-width="900">
              <v-card-title>Select Class & Section</v-card-title>
              <v-divider></v-divider>
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
                <v-col cols="12" md="3">
                  <v-text-field
                    disabled
                    label="Selected Teacher"
                    v-model="selected_teacher"
                    v-on:focus="dismiss()"
                  ></v-text-field>
                </v-col>
              </v-layout>
              <v-divider></v-divider>
              <v-card-title>Select Teacher</v-card-title>
              <v-divider></v-divider>
              <v-card-text style="height: 100px;">
                <v-chip-group multiple :center-active="true" active-class="primary--text;">
                  <v-chip
                    v-for="teacher in teacher_list"
                    :key="teacher.id"
                    :color="colors[Math.floor(Math.random() * 37)]"
                    @click="show_details(teacher.id)"
                  >{{ teacher.first_name }} {{ teacher.last_name }}</v-chip>
                </v-chip-group>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  :loading="loading"
                  :disabled="!selected"
                  color="green"
                  @click="loader = 'loading'"
                  v-on:click="validate_entries()"
                >
                  Set Class Teacher
                  <span slot="loader" class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                </v-btn>
                <v-btn
                  :loading="loading"
                  color="orange"
                  @click="loader = 'loading'"
                  v-on:click="download_class_teacher_list()"
                >
                  Download Class Teacher List
                  <span slot="loader" class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-layout>
        <v-layout xs4 row wrap justify-space-around>
          <div class="text-xs-center"></div>
        </v-layout>
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
    </v-form>
    <v-dialog v-model="confirm" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">{{ caption }}</v-card-title>
        <v-card-text>{{ alert_message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="set_class_teacher()">OK</v-btn>
          <v-btn color="green darken-1" flat="flat" @click="confirm = false; overlay = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import axios from "axios";
export default {
  name: "SetClassTeacher",
  data() {
    return {
      teacher_id: "",
      first_name: "",
      last_name: "",
      mobile: "",
      login_id: "",
      teacher_list: [],
      the_class: "",
      class_list: [],
      section: "",
      section_list: [],
      changed_index: "",
      selected: false,
      selected_teacher: "",
      waiting: false, 
      loading: false,
      showDismissibleAlert: false,
      alert_type: "error",
      alert_color: "",
      alert_message: "",
      confirm: false,
      caption: "",
      allow_edit: false,
      max25chars: v => v.length <= 30 || "Input too long!",
      overlay: false
    };
  },
  computed: {},
  mounted: function() {
    let self = this;
    let school_id = this.$store.getters.get_school_id;
    self.colors = this.$store.getters.get_colors;
    let ip = this.$store.getters.get_server_ip;
    let url = ip.concat("/teachers/teacher_list/", school_id, "/");

    axios
      .get(url)
      .then(function(response) {
        // handle success
        for (var i = 0; i < response.data.length; i++) {
          let a_teacher = {};
          a_teacher["id"] = response.data[i]["id"];
          a_teacher["first_name"] = response.data[i]["first_name"];
          a_teacher["last_name"] = response.data[i]["last_name"];
          a_teacher["mobile"] = response.data[i]["mobile"];
          a_teacher["login_id"] = response.data[i]["email"];
          self.teacher_list.push(a_teacher);
        }
        console.log("teacher list = ", self.teacher_list);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });

    let url1 = ip.concat("/academics/class_list/", school_id, "/");
    axios
      .get(url1)
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

    let url2 = ip.concat("/academics/section_list/", school_id, "/");
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
    show_details(id) {
      console.log("inside show_detasils", id);
      for (var i = 0; i < this.teacher_list.length; i++) {
        if (this.teacher_list[i]["id"] == id) {
          this.changed_index = i;
          this.selected = true;
          this.id = id;
          this.selected_teacher =
            this.teacher_list[i]["first_name"] +
            " " +
            this.teacher_list[i]["last_name"];
          this.last_name = this.teacher_list[i]["last_name"];
          this.mobile = this.teacher_list[i]["mobile"];
          this.login_id = this.teacher_list[i]["login_id"];
          break;
        }
      }
    },
    validate_entries() {
      if (this.the_class == "") {
        this.alert_message = "Please elect a Class";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }
      if (this.section == "") {
        this.alert_message = "Please select a Section";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        return;
      }

      this.caption = "Confirm Class Teacher Selection";
      this.alert_message =
        "Are you sure you want to set " +
        this.selected_teacher +
        " as the class Teacher for " +
        this.the_class +
        "-" +
        this.section +
        "?";
      this.confirm = true;
      this.overlay = true;
    },

    close() {
      console.log("Dialog closed");
    },

    download_class_teacher_list() {
        let self = this;
      this.waiting = true;
      this.loading = true;
      let ip = this.$store.getters.get_server_ip;
      let school_id = this.$store.getters.get_school_id;

      let url = ip.concat("/teachers/download_class_teacher_list/");

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
            school_id: school_id
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
          var file_name = "class_teacher_list.xlsx";

          link.setAttribute("download", file_name); //or any other extension
          document.body.appendChild(link);
          link.click();
          confirm("Class Teacher list Downloaded");
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {
          // always executed
        });
    },

    set_class_teacher() {
      let self = this;
      this.waiting = true;
      this.loading = true;
      this.confirm = false;
      let school_id = this.$store.getters.get_school_id;
      let ip = this.$store.getters.get_server_ip;
      let sender = this.$store.getters.get_logged_user;
      let url = ip.concat("/teachers/set_class_teacher/");
      let full_name = axios
        .post(url, {
          school_id: school_id,
          user: sender,
          teacher_id: self.id,
          teacher_login: self.login_id,
          the_class: self.the_class,
          section: self.section,
          is_class_teacher: "false"
        })
        .then(function(response) {
          console.log(response);
          self.overlay = false;
          self.waiting = false;
          self.loading = false;
          if (response.data["status"] == "success") {
            self.showDismissibleAlert = true;
            self.alert_message = response.data["message"];
            self.alert_color = "green";
            confirm("Teacher successfully updated");
            self.teacher_list[self.changed_index]["first_name"] =
              self.first_name;
            self.teacher_list[self.changed_index]["last_name"] = self.last_name;
            self.teacher_list[self.changed_index]["mobile"] = self.mobile;
            self.first_name = "";
            self.last_name = "";
            self.mobile = "";
            self.login_id = "";
            return;
          } else {
            self.alert_color = "red";
            self.alert_message = response.data["message"];
            self.showDismissibleAlert = true;
            confirm(response.data["message"]);
            return;
          }
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
    }
  }
};
</script>