<template>
  <v-app class="mt-n12 pt-n12">
    <v-content>
      <v-container fluid class="pa-md-4 mx-lg-auto"></v-container>
      <v-layout xs4 row wrap justify-center>
        <v-col cols="12" md="10">
          <div id="#app">
            <section>
              <h2>{{ lecture_title }}</h2>
              <youtube :video-id=video_id @ready="ready" @playing="playing"></youtube>
            </section>
          </div>
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
import { getIdFromURL, getTimeFromURL } from "vue-youtube-embed";
export default {
  data() {
    return {
      ip: "",
      school_id: "",
      lecture_title: "",
      coming_from: "",
      video_url: "",
      video_id: "",
      loader: null,
      loading: false,
      

      colors: [],
      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      alert_color: "",
      waiting: false
    };
  },
  mounted: function() {
    this.lecture_title = this.$store.getters.get_lecture_title;
    this.video_url = this.$store.getters.get_video_url;
    console.log("video_url = ", this.video_url);
    this.video_id = getIdFromURL(this.video_url);
    console.log("video_id = ", this.video_id);
    let startTime = getTimeFromURL(url);
  },

  methods: {
    ready(event) {
      this.player = event.target;
    },
    playing(event) {
      // The player is playing a video.
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