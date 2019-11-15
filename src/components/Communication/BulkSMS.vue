<template>
  <v-app>
    <v-content>
      <v-form enctype="multipart/form-data">
        <v-container fluid>
          <h2>Send Bulk SMS (Broadcast)</h2>
          <p />
          <p />
          <v-layout row wrap justify-center>
            <v-flex xs6 sm6 md10>
              <h3>Compose Message</h3>
              <p />
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
            </v-flex>
          </v-layout>
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
          <v-layout row wrap>
            <v-container>
              <v-flex xs12 md12>
                <h3>Select Recepients</h3>
                <div class="mr-4 ml-4 whiteback userGroupHeight">
                  <v-layout row wrap>
                    <v-checkbox
                      light
                      label="All Classes"
                      v-on:change="select_all_classes"
                      @change="dismiss()"
                    ></v-checkbox>
                  </v-layout>
                </div>
              </v-flex>
              <v-flex xs12 md12>
                <div class="mr-4 ml-4 whiteback userGroupHeight">
                  <v-layout row wrap>
                    <v-flex v-for="a_class in class_list" :key="a_class">
                      <v-checkbox
                        v-model="selected_classes"
                        :label="a_class"
                        :value="a_class"
                        :disabled="!all_classes"
                        v-on:focus="dismiss()"
                        @change="add_recepient; dismiss()"
                      ></v-checkbox>
                    </v-flex>
                  </v-layout>
                </div>
              </v-flex>
              <v-flex xs12 md12>
                <div class="mr-4 ml-4 whiteback userGroupHeight">
                  <v-layout row wrap>
                    <v-flex v-for="a_staff in staff" :key="a_staff" xs2>
                      <v-checkbox
                        light
                        v-model="selected_staff"
                        :label="a_staff"
                        :value="a_staff"
                        @change="dismiss()"
                      ></v-checkbox>
                    </v-flex>
                  </v-layout>
                </div>
              </v-flex>
            </v-container>
          </v-layout>
          <h3>Optional - Attach file (Allowed file types - Image jpeg or png, PDF)</h3>
          <v-flex xs6 md7>
            <v-layout xs4 row wrap justify-space-around>
              <div class="mr-5 ml0 whiteback userGroupHeight">
                <v-layout row-wrap>
                  <input
                    type="file"
                    ref="file_input"
                    :name="uploadFieldName"
                    :disabled="isSaving"
                    @change="onFileChanged"
                    accept="image/*, .pdf"
                    class="input-file"
                  />
                </v-layout>
              </div>
            </v-layout>
          </v-flex>
          <p />
          <v-layout xs4 row wrap justify-space-around>
            <div class="text-xs-center">
              <v-btn color="info" @click="validate()">
                Send Message
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
              <v-btn color="info" @click="cancel()">
                Cancel
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
            </div>
          </v-layout>
          <v-alert :value="showDismissibleAlert" :type="alert_type">{{ alert_message }}</v-alert>
        </v-container>
      </v-form>

      <v-dialog v-model="confirm" persistent max-width="360">
        <v-card>
          <v-card-title class="headline">{{ caption }}</v-card-title>
          <v-card-text>{{ alert_message }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click="send_message()">OK</v-btn>
            <v-btn color="green darken-1" flat="flat" @click="confirm = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      rules: [v => v.length <= 400 || "Max 400 characters"],
      class_list: [],
      all_classes: true,
      selected_classes: [],
      selected_staff: [],
      final_recepients: [],
      staff: ["Teachers", "Staff"],
      recepients: [],
      message: "",
      good_to_send: true,
      alert_message: "",
      showDismissibleAlert: false,
      alert_type: "error",
      confirm: false,
      caption: "",
      loader: "",
      loading: "",
      isSaving: false,
      image_included: false,
      uploadFieldName: "",
      selectedFile: null,
      image: null,
      waiting: false
    };
  },
  mounted: function() {
    let self = this;
    let school_id = this.$store.getters.get_school_id;
    let ip = this.$store.getters.get_server_ip;
    let url = ip.concat("/academics/class_list/", school_id, "/");
    axios
      .get(url)
      .then(function(response) {
        // handle success
        self.class_list = response.data;
        for (var i = 0; i < response.data.length; i++) {
          self.class_list[i] = response.data[i]["standard"];
        }
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  },
  methods: {
    add_recepient(e) {
      //   console.log(this.recepients);
    },
    onFileChanged(event) {
      const file = event.target.files[0];
      this.selectedFile = file;
      this.image_included = true;
    },
    validate() {
      this.final_recepients = this.selected_classes.concat(this.selected_staff);
      console.log(this.final_recepients);
      this.good_to_send = true;
      if (this.message == "") {
        this.showDismissibleAlert = true;
        this.alert_message = "Message is empty!";
        this.good_to_send = false;
      }
      if (this.message.length > 400) {
        this.showDismissibleAlert = true;
        this.alert_message =
          "Message is too long. Please restrict to 400 characters max";
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
      this.final_recepients = this.selected_classes.concat(this.selected_staff);

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
      self.selected_staff = [];
      self.$refs.file_input.value = null;
      
      try {
        let res = await axios.post(url, formData);
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    },
    select_all_classes(e) {
      if (e) {
        this.all_classes = false;
        this.selected_classes = this.class_list.slice();
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
      this.selected_staff = null;
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
