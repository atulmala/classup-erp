<template>
  <v-app class="mt-n12 pt-n12">
    <v-content>
      <v-form class="mt-0">
        <v-container fluid class="pa-md-4 mt-0 mx-lg-auto">
          <v-layout row wrap justify-center>
            <v-col cols="12" md="6">
              <v-snackbar
                v-model="showDismissibleAlert"
                :color="alert_color"
                :left="x === 'left'"
                multi-line
                :right="x === 'right'"
                bottom
                :vertical="mode === 'vertical'"
              >
                {{ alert_message }}
                <v-btn dark text @click="snackbar = false">Close</v-btn>
              </v-snackbar>
            </v-col>
          </v-layout>
          <v-layout row wrap>
            <v-col cols="12" md="5">
              <v-data-table
                dense
                dark
                loading
                loading-text="Fetching classes... Please wait"
                v-model="selected_classes"
                :headers="headers"
                :items="class_list"
                item-key="standard"
                show-select
                @item-selected="class_selected"
                class="elevation-1"
              >
                <template v-slot:top>
                  <v-toolbar flat color="#FF8A65">
                    <v-checkbox
                      class="mt-7"
                      v-model="whole_school"
                      :value="whole_school"
                      label="Whole School"
                      @change="select_all"
                    ></v-checkbox>
                    <v-spacer></v-spacer>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-dialog max-width="500px">
                      <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark @click="validate" @v-on="on">Send Message</v-btn>
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
              <v-layout v-if="selected_classes.length > 0" row wrap r>
                <v-card class="mx-auto">
                  <v-card-text>
                    <div class="font-weight-black">Selected Recepients ({{ selected_classes.length }})</div>
                    <v-chip-group multiple column active-class="primary--text;">
                      <v-chip
                        v-for="recepient in selected_classes"
                        :key="recepient.standard"
                        :color="colors[Math.floor(Math.random() * 37)]"
                      >{{ recepient.standard }}</v-chip>
                    </v-chip-group>
                  </v-card-text>
                </v-card>
              </v-layout>
            </v-col>
          </v-layout>
        </v-container>
      </v-form>
      <v-dialog v-model="confirm" persistent max-width="430">
        <v-card>
          <v-card-title class="headline">{{ caption }}</v-card-title>
          <v-card-text>{{ alert_message }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="send_message()">OK</v-btn>
            <v-btn color="green darken-1" text @click="confirm = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      rules: [v => v.length <= 400 || "Max 400 characters"],
      headers: [
        {
          text: "Class",
          align: "left",
          sortable: false,
          value: "standard"
        }
      ],
      class_list: [],
      all_classes: true,
      selected_classes: [],
      final_recepients: [],
      staff: ["Teachers", "Staff"],
      recepients: [],
      whole_school: "",
      message: "",
      good_to_send: true,
      alert_message: "",
      showDismissibleAlert: false,
      alert_type: "error",
      alert_color: "",
      confirm: false,
      caption: "",
      loader: "",
      loading: "",
      isSaving: false,
      image_included: false,
      uploadFieldName: "",
      selectedFile: null,
      colors: [],
      image: null,
      waiting: false,
      confirm: "",
      caption: "",
      alert_type: "",
      alert_message: "",
      alert_color: "",
      showDismissibleAlert: false,
    };
  },
  mounted: function() {
    let self = this;
    let school_id = this.$store.getters.get_school_id;
    self.colors = this.$store.getters.get_colors;
    let ip = this.$store.getters.get_server_ip;
    let url = ip.concat("/academics/class_list/", school_id, "/");
    axios
      .get(url)
      .then(function(response) {
        // handle success
        for (var i = 0; i < response.data.length; i++) {
          let a_class = {};
          a_class["standard"] = response.data[i]["standard"];
          self.class_list.push(a_class);
        }
        // also add teachers & staff to this list
        let a_class = {};
        a_class["standard"] = "Teachers";
        self.class_list.push(a_class);
        a_class = {};
        a_class["standard"] = "Staff";
        self.class_list.push(a_class);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  },
  methods: {
    class_selected() {
      this.showDismissibleAlert = false;
    },
    onFileChanged(event) {
      this.image_included = true;
    },
    validate() {
      this.final_recepients = this.selected_classes;
      console.log(this.final_recepients);
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
      if (this.final_recepients.length == 0) {
        this.showDismissibleAlert = true;
        this.alert_message = "No recepient selected (Class, Teacher, or Staff)";
        this.good_to_send = false;
      }
      if (this.good_to_send) {
        this.caption = "Please Confirm sending Bulk Messages";
        this.alert_message =
          "Are you sure you want to send this message to selected Recepients? ";
        this.confirm = true;
      }
    },
    async send_message() {
      let self = this;
      self.waiting = true;
      this.confirm = false;
      for (var i = 0; i < self.selected_classes.length; i++) {
        self.final_recepients[i] = self.selected_classes[i]["standard"];
      }

      console.log(this.final_recepients);

      let ip = this.$store.getters.get_server_ip;
      let school_id = this.$store.getters.get_school_id;
      let user = this.$store.getters.get_user_name;
      let url = ip.concat("/operations/send_bulk_sms/");

      var formData = new FormData();

      formData.set("from_device", false);
      formData.set("user", user);
      formData.set("school_id", school_id);
      formData.set("message_text", this.message);
      formData.set("whole_school", "undetermined");
      formData.set("classes_array", this.final_recepients);
      formData.set("image_included", this.image_included);

      if (this.image_included == true) {
        formData.append("file", this.selectedFile);
        formData.set("image_name", this.selectedFile.name);
      }

      confirm("Messages Sent. \nWill be delivered in about an hour's time.\n");
      self.waiting = false;
      self.message = "";
      self.selected_classes = [];
    
      self.$refs.file_input.value = null;

      try {
        let res = await axios.post(url, formData);
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    },
    select_all() {
      if (this.whole_school) {
        this.all_classes = false;
        this.selected_classes = this.class_list;
        console.log("selected_classes", this.selected_classes);
      } else {
        this.all_classes = true;
        this.selected_classes = [];
        console.log("selected_classes", this.selected_classes);
      }
    },
    dismiss() {
      this.showDismissibleAlert = false;
    },
    cancel() {
      this.message = "";
      this.selected_classes = null;
      this.recepients = null;
      this.image_included = false;
      this.$refs.file_input.value = null;
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
