<template>
  <v-app class="mt-n12 pt-n12">
    <v-content>
      <template>
        <div class="text-xs-center">
          <v-progress-circular v-if="waiting" :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
        </div>
      </template>
      <v-form>
        <v-container fluid class="pa-md-4 mx-lg-auto">
          <h1>Download Unscheduled Test Report</h1>
          <h3>Select an Exam</h3>
          <v-layout xs4 row wrap justify-center>
            <v-col cols="12" md="2">
              <v-select :items="exam_list" label="Exam" v-model="exam" v-on:focus="dismiss()"></v-select>
            </v-col>
          </v-layout>
          <v-layout xs4 row wrap justify-space-around>
            <div class="text-xs-center">
              <v-btn
                :loading="loading"
                :disabled="loading"
                color="green"
                @click="loader = 'loading'"
                v-on:click="search()"
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
      <v-flex d-flex xs8 order-xs5 offset-sm2>
        <v-data-table
          v-if="show_student_list"
          :headers="headers"
          :items="students"
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <tr @click="showAlert(props.item)">
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.reg_no }}</td>
              <td class="text-xs-left">{{ props.item.the_class }}</td>
              <td class="text-xs-left">{{ props.item.parent }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      loader: null,
      loading: false,
      waitng: false,
      exam: "",
      exam_list: [],

      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false
    };
  },
  mounted: function() {
    let self = this;
    let school_id = this.$store.getters.get_school_id;
    let ip = this.$store.getters.get_server_ip;
    let url = ip.concat("/academics/get_exam_list_school/", school_id, "/");
    axios
      .get(url)
      .then(function(response) {
        // handle success
        self.exam_list = response.data;
        for (var i = 0; i < response.data.length; i++) {
          self.exam_list[i] = response.data[i]["title"];
        }
        console.log(self.exam_list);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  },

  methods: {
    search() {
      let self = this;
      var can_search = true;
      if (this.exam == "") {
        this.alert_message = "Please select an Exam";
        this.showDismissibleAlert = true;
        can_search = false;
      }
      if (can_search) {
        self.waitng = true;
        self.loading = true;
        let ip = this.$store.getters.get_server_ip;
        let school_id = this.$store.getters.get_school_id;
        let school_name = this.$store.getters.get_school_name;
        let url = ip.concat("/exam/unscheuled_test_list/");
        axios
          .get(url, {
            headers: {
              "Content-Type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            },
            responseType: "arraybuffer",
            params: {
              school_id: school_id,
              exam_title: this.exam
            }
          })
          .then(function(response) {
            console.log(response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            let file_name = "Unscheduled_test_" + self.exam + ".xlsx";
            link.setAttribute("download", file_name); //or any other extension
            document.body.appendChild(link);
            link.click();
            confirm("Result sheet downloaded");
            self.waitng = false;
            self.loading = false;
          })
          .catch(function(error) {
            self.waiting = false;
            self.loading = false;
            var error_message = "An error occured.";
            error_message = error_message.concat(
              " Error summary: ",
              error,
              ". Please contact ClassUp Support"
            );
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