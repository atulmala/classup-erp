<template>
  <v-app class="mt-n12 pt-n12">
    <v-content>
      <v-container fluid class="pa-md-4 mx-lg-auto"></v-container>
      <v-layout xs4 row wrap justify-center>
        <v-col cols="12" md="10" v-for="item in lecture_list">
          <v-card class="mx-auto">
            <v-card-title class="title">
              {{ item.date }}
              <v-divider class="mx-4" vertical></v-divider>
              <div class="title">
                Class: {{ item.the_class }}
                <v-divider class="mx-4" vertical></v-divider>
                Subject: {{ item.subject }}
                <v-divider class="mx-4" vertical></v-divider>
                Teacher: {{ item.teacher }}
              </div>
            </v-card-title>

            <v-card-text>
              <p class="title">{{ item.subject }} - {{ item.topic }}</p>

              <div class="text--primary">
                Video Link:
                <br />
                <a v-on:click="show_video(item)">{{ item.youtube_link }}</a>
              </div>
              <p />
              <div v-if="item.pdf_present" class="text--primary">
                Study Notes/Assighment Link (To open, right click and select "Open in new Tab"):
                <br />
                <a :href="item.pdf_link" @click.prevent="download(item.pdf_link)">{{ item.pdf_link }}</a>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-layout>

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
      ip: "",
      school_id: "",
      coming_from: "",
      student_id: "",
      loader: null,
      loading: false,
      lecture_list: [],
      dialog: "false",
      delivery_status: "",
      snackbar: false,

      colors: [],
      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      alert_color: "",
      waiting: false
    };
  },
  mounted: function() {
    let self = this;
    self.waiting = true;
    self.colors = this.$store.getters.get_colors;
    self.dialog = false;
    this.ip = this.$store.getters.get_server_ip;
    this.coming_from = this.$store.getters.get_coming_from;
    this.school_id = this.$store.getters.get_school_id;
    this.student_id = this.$store.getters.get_student_id;
    let url = self.ip.concat(
      "/lectures/get_student_lectures/",
      this.student_id,
      "/"
    );
    axios
      .get(url)
      .then(function(response) {
        // handle success
        for (var i = 0; i < response.data.length; i++) {
          let lecture = {};
          lecture["id"] = response.data[i]["id"];
          let long_date = response.data[i]["creation_date"];
          let yyyymmdd = long_date.slice(0, 10);

          lecture["date"] = yyyymmdd;

          lecture["the_class"] = response.data[i]["the_class"];

          lecture["teacher"] = response.data[i]["teacher"];
          lecture["topic"] = response.data[i]["topic"];
          lecture["subject"] = response.data[i]["subject"];
          
          lecture["pdf_link"] = response.data[i]["pdf_link"];
          if (lecture["pdf_link"] == null)  {
            lecture["pdf_present"] = false;
          }
          else{
            lecture["pdf_present"] = true;
          }
          lecture
          ["youtube_link"] = response.data[i]["youtube_link"];

          self.lecture_list.push(lecture);
        }
        console.log(self.lecture_list);
        self.waiting = false;
      })
      .catch(function(error) {
        // handle error
        console.log(error);
        self.waiting = false;
      });
  },

  methods: {
    show_delivery_status(recepient) {
      this.delivery_status = recepient.student + "    " + recepient.outcome;
      this.snackbar = true;
    },
    show_video(item) {
      this.$store.dispatch("set_video_url", item.youtube_link);
      this.$store.dispatch("set_lecture_title", item.topic);
      this.$router.replace("/youtube_player");
    },
    dismiss() {
      this.showDismissibleAlert = false;
    },
    download(url) {
      let headers = {"Access-Control-Allow-Origin": "*"}
      axios.get(url, { responseType: "blob" }, headers)
        .then(response => {
          // const blob = new Blob([response.data], { type: "application/pdf" });
          // const link = document.createElement("a");
          // link.href = URL.createObjectURL(blob);
          // link.download = label;
          // link.click();
          // URL.revokeObjectURL(link.href);


          const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            var file_name = "lecture.pdf";
            
            link.setAttribute("download", file_name); //or any other extension
            document.body.appendChild(link);
            link.click();
        })
        .catch(console.error);
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