<template>
  <v-app class="mt-n12 pt-n12">
    <v-content>
      <v-form>
        <v-container fluid class="pa-md-4 mx-lg-auto">
          <h1>{{ heading }}</h1>
          
          
          <v-layout xs4 row wrap justify-space-around>
            <div class="text-xs-center">
              <v-btn
              class="mt-12"
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
      heading: "Download Detain/Not Promoted Students List",
      show_search_criteria: true,
      loader: null,
      loading: false,
      date: "",

      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      alert_color: "",
      waiting: false
    };
  },
  mounted: function() {
    let self = this;

    self.coming_from = this.$store.getters.get_coming_from;

    self.school_id = this.$store.getters.get_school_id;
    self.ip = this.$store.getters.get_server_ip;
  },

  methods: {
    download() {
      let self = this;
      var can_search = true;
      

      if (can_search) {
        this.waiting = true;
        this.loading = true;
        let ip = this.$store.getters.get_server_ip;
        let school_id = this.$store.getters.get_school_id;

        let url = self.ip.concat("/exam/detain_list/?school_id=",
          self.school_id);
        console.log("url=", url);

        let options = {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          },
          responseType: "arraybuffer"
        };
        axios
          .get(
            url,
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
              "Detain_List.xlsx";

            link.setAttribute("download", file_name); //or any other extension
            document.body.appendChild(link);
            link.click();
            confirm("Detain/Compartment List Downloaded");
          })
          .catch(function(error) {
            console.log(error);
            self.waiting = false;
            self.loading = false;
            confirm(error)
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