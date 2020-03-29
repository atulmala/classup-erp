<template>
  <v-app class="mt-n12 pt-n12">
    <v-content>
      <v-form>
        <v-container fluid class="pa-md-4 mx-lg-auto">
          <h1>{{ heading }}</h1>
          <v-layout xs4 row wrap justify-center>
            <v-col cols="12" md="2">
              <v-select
                :items="class_list"
                label="Class"
                v-model="the_class"
                v-on:focus="dismiss()"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                :items="section_list"
                label="Section"
                v-model="section"
                :disabled="all_sections"
                v-on:focus="dismiss()"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                v-model="all_sections"
                :label="`All Sections`"
                @change="section=''; dismiss(); "
              ></v-checkbox>
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
            <v-col cols="12" md="4">
              <v-text-field label="Lesson/Topic" v-model="lesson_topic" v-on:focus="dismiss()"></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field label="You Tube Link" v-model="youtube_link" v-on:focus="dismiss()"></v-text-field>
            </v-col>
          </v-layout>
          <v-layout xs4 row wrap justify-center>
            <v-col cols="12" md="6">
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
                Share Lecture
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

      <v-dialog v-model="confirm" persistent max-width="440">
        <v-card>
          <v-card-title class="headline">{{ caption }}</v-card-title>
          <v-card-text>{{ alert_message }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="share_lecture()">OK</v-btn>
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
      heading: "Share Lecture",
      loader: null,
      loading: false,
      the_class: "",
      class_list: [],
      section: "",
      section_list: [],
      all_sections: false,
      subject: "",
      subject_list: [],
      lesson_topic: "",
      youtube_link: "",
      file_included: false,
      uploadFieldName: "",
      selectedFile: null,

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
    validate() {
      var can_share = true;

      if (this.subject == "") {
        this.alert_message = "Please select a Subject";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_share = false;
      }
      if (this.section == "" && this.all_sections == false) {
        this.alert_message = "Please select a Section";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_share = false;
      }
      if (this.the_class == "") {
        this.alert_message = "Please select a Class";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_share = false;
      }
      if (this.youtube_link == "") {
        this.alert_message = "Please copy paste You Tube Video Link";
        this.alert_color = "red";
        this.showDismissibleAlert = true;
        can_share = false;
      }
      if (this.lesson_topic == "") {
        this.alert_message = "Please Enter Lesson/Topic for this Lecture";
        this.showDismissibleAlert = true;
        this.alert_color = "red";
        can_share = false;
      }

      if (can_share) {
        this.confirm = true;
        this.caption = "Confirm Lecture Sharing";
        this.alert_message = "Are you sure you want to share this Lecture?";
      }
    },
    onFileChanged(event) {
      this.file_included = true;
    },
    dismiss() {
      this.showDismissibleAlert = false;
    },
    showAlert(a) {
      if (event.target.classList.contains("btn__content")) return;
      let coming_from = this.$store.getters.get_coming_from;
      console.log(coming_from);
    },
    async share_lecture() {
      let self = this;
      this.confirm = false;
      this.waiting = true;
      this.loading = true;
      let ip = this.$store.getters.get_server_ip;
      let school_id = this.$store.getters.get_school_id;
      let teacher = this.$store.getters.get_logged_user;

      let url = ip.concat("/lectures/share_lecture/");
      console.log("url=", url);

      let formData = new FormData();

      formData.set("teacher", teacher);
      formData.set("school_id", this.school_id);
      formData.set("the_class", this.the_class);
      formData.set("section", this.section);
      formData.set("subject", this.subject);
      formData.set("all_sections", this.all_sections);
      formData.set("youtube_link", this.youtube_link);
      formData.set("lesson_topic", this.lesson_topic);
      formData.set("file_included", this.file_included);
      if (this.file_included == true) {
        formData.append("file", this.selectedFile);
        formData.set("file_name", this.selectedFile.name);
      }

      confirm("Messages Sent. \nWill be delivered in about an hour's time.\n");
      self.waiting = false;
      self.loading = false;
      self.message = "";
      self.the_class = "";
      self.section = "";
      self.subject = "";
      self.youtube_link = "";
      self.lesson_topic = "";
      self.$refs.file_input.value = null;

      try {
        let res = axios.post(url, formData);
        console.log(res);
      } catch (error) {
        console.error(error);
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