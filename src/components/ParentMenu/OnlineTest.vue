<template>
  <v-app class="mt-n12 pt-n12">
    <v-content>
      <div v-if="submitted">
        <h3>Your Answers have been Submitted</h3>
      </div>
      <v-form v-if="show_questions">
        <v-layout xs4 row wrap justify-center>
          <v-col cols="12" md="10" v-for="item in question_list">
            <v-card class="mx-auto">
              <v-list-item four-line>
                <v-list-item-content>
                  <div class="title-1 font-weight-bold">{{item.q_no}}</div>
                  <v-divider></v-divider>
                  <p />
                  <p />
                  <p />
                  <p />
                  <div class="title-1 text-left font-weight-medium">{{ item.question }}</div>
                  <p />
                  <p />
                  <p />
                  <p />
                  <p />
                  <p />
                  <p />
                  <p />
                  <v-chip
                    :color="item.option_a_color"
                    @click="mark_answer(item.id, 'A')"
                  >A. {{ item.option_a }}</v-chip>
                  <p />
                  <p />
                  <p />
                  <p />
                  <v-chip
                    :color="item.option_b_color"
                    @click="mark_answer(item.id, 'B')"
                  >B. {{ item.option_b }}</v-chip>
                  <p />
                  <p />
                  <p />
                  <p />
                  <v-chip
                    :color="item.option_c_color"
                    @click="mark_answer(item.id, 'C')"
                  >C. {{ item.option_c }}</v-chip>
                  <p />
                  <p />
                  <p />
                  <p />
                  <v-chip
                    :color="item.option_d_color"
                    @click="mark_answer(item.id, 'D')"
                  >D. {{ item.option_d }}</v-chip>
                  <p />
                  <p />
                  <p />
                  <p />
                  <div class="title-1 font-weight-bold text-left ml-3">
                    Your Answer:
                    <v-icon>{{ item.icon }}</v-icon>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-layout>
        <v-btn color="green darken-1" @click="submit = true">Submit Answers</v-btn>
      </v-form>
      <v-form v-if="!test_selected">
        <v-container fluid class="pa-md-4 mx-lg-auto">
          <v-layout xs4 row wrap justify-center>
            <v-col cols="8" md="8">
              <v-card max-width="400">
                <v-card-title>Select Online Test</v-card-title>
                <v-divider></v-divider>
                <v-card-text style="height: 100px;">
                  <v-chip-group multiple :center-active="true" active-class="primary--text;">
                    <v-chip
                      v-for="test in test_list"
                      :key="test.id"
                      :color="colors[Math.floor(Math.random() * 37)]"
                      @click="get_questions(test.id)"
                    >Class: {{ test.the_class }} Subject: {{ test.subject }}</v-chip>
                  </v-chip-group>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions></v-card-actions>
              </v-card>
            </v-col>
          </v-layout>
        </v-container>
      </v-form>
      <v-form v-if="show_instructions">
        <v-container fluid class="pa-md-4 mx-lg-auto">
          <v-layout xs4 row wrap justify-center>
            <v-col cols="8" md="8">
              <v-card class="mx-auto" max-width="800">
                <v-card-title>Please Read the below Instructions Carefully</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="subtitle-1 text-left">
                  <div>1. This test consist of 20 Multiple Choice Questions</div>
                  <div>2. Time: 30 Minutes</div>
                  <div>3. There are 4 options and only one option is correct</div>
                  <div>4. There will only be a single Attempt to do this test</div>
                  <div>5. You can attempt the test anytime today but once you start your Attempt will be counted</div>
                  <div
                    class="font-italic font-weight-bold red--text"
                  >6. Very Important: Do NOT Press the Browser Back/Forward button during the Test</div>
                  <div
                    class="font-italic font-weight-bold"
                  >7. Do NOT Press the Logout or any of the links in side Menu during the Test</div>
                  <div>7. Please Ensure your Internet is stable during the test</div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-chip-group>
                    <v-chip
                      color="#43A047"
                      @click="confirm = true; show_instructions = false; caption='Please Confirm'"
                    >Start Test</v-chip>
                    <br />
                    <v-chip color="#E65100" @click="show_instructions = false">No, Not Now</v-chip>
                  </v-chip-group>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-layout>
        </v-container>
      </v-form>
      <v-dialog v-model="confirm" persistent max-width="500">
        <v-card>
          <v-card-title class="headline">{{ caption }}</v-card-title>
          <v-card-text>Are you sure to start this Test? Once started your Attempt will be counted.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" @click="start_test()">Yes</v-btn>
            <v-btn color="#E65100" @click="confirm = false; overlay = false">No</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="submit" persistent max-width="500">
        <v-card>
          <v-card-title class="headline">Please Confirm Submission</v-card-title>
          <v-card-text>Are you sure that You want to Submit this Test?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" @click="finish_test()">Yes</v-btn>
            <v-btn color="#E65100" @click="submit = false; overlay = false">No</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      student_id: "",
      coming_from: "",
      test_selected: false,
      test_list: [],
      test_id: "",
      question_list: [],
      answer_list: [],
      show_instructions: false,
      caption: "",
      confirm: false,
      show_questions: false,
      submit: false,
      submitted: false,

      normal_color: "#E0E0E0",
      marked_color: "#D4E157",
      minutes: 29,
      seconds: 60,
      loader: null,
      loading: false,

      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      alert_color: "",
      colors: [],
      waiting: false
    };
  },
  mounted: function() {
    console.log("inside mounted");
    let self = this;

    self.coming_from = this.$store.getters.get_coming_from;
    self.colors = this.$store.getters.get_colors;

    self.school_id = this.$store.getters.get_school_id;
    self.student_id = this.$store.getters.get_student_id;
    self.ip = this.$store.getters.get_server_ip;
    let parent_id = this.$store.getters.get_logged_user;
    let url = self.ip.concat("/online_test/get_online_test/", self.student_id);
    console.log("url=", url);

    axios
      .get(url)
      .then(function(response) {
        self.waiting = false;
        self.loading = false;
        console.log(response);
        for (var i = 0; i < response.data.length; i++) {
          var test = {};
          test["id"] = response.data[i]["id"];
          test["the_class"] = response.data[i]["the_class"];
          test["subject"] = response.data[i]["subject"];
          test["date"] = response.data[i]["date"];
          test["duration"] = response.data[i]["duration"];
          self.test_list.push(test);
        }
        console.log(self.test_list);
      })
      .catch(function(error) {
        console.log(error);
      })
      .then(function() {
        // always executed
      });
  },
  updated: function() {
    console.log("inside updated");
  },

  methods: {
    get_questions(id) {
      let self = this;
      self.waiting = true;
      self.loading = true;
      self.test_id = id;

      let url1 = self.ip.concat(
        "/online_test/whether_attempted/",
        self.student_id,
        "/",
        id,
        "/"
      );
      axios
        .get(url1)
        .then(function(response) {
          let attempted_before = response.data["attempted"];
          if (attempted_before == true || attempted_before == "true") {
            alert("You have already Attempted this Test", attempted_before);
            self.waiting = false;
            self.loading = false;
            return;
          } else {
            let url = self.ip.concat(
              "/online_test/get_online_questions/",
              self.test_id
            );

            axios
              .get(url)
              .then(function(response) {
                self.waiting = false;
                self.loading = false;
                console.log(response);
                for (var i = 0; i < response.data.length; i++) {
                  var question = {};
                  question["id"] = response.data[i]["id"];
                  question["q_no"] = "Question: " + parseInt(i + 1);
                  question["question"] = response.data[i]["question"];
                  question["option_a"] = response.data[i]["option_a"];
                  question["option_a_color"] = self.normal_color;
                  question["option_b"] = response.data[i]["option_b"];
                  question["option_b_color"] = self.normal_color;
                  question["option_c"] = response.data[i]["option_c"];
                  question["option_c_color"] = self.normal_color;
                  question["option_d"] = response.data[i]["option_d"];
                  question["option_d_color"] = self.normal_color;
                  question["icon"] = " ";
                  self.question_list.push(question);

                  var answer = {};
                  answer["question_id"] = response.data[i]["id"];
                  answer["student_id"] = self.student_id;
                  answer["option_marked"] = " ";
                  self.answer_list.push(answer);
                }
              })
              .catch(function(error) {
                console.log(error);
              })
              .then(function() {
                self.test_selected = true;
                self.show_instructions = true;
              });
          }
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {});
    },

    start_test() {
      console.log("inside start_test()");
      let self = this;
      let url = self.ip.concat(
        "/online_test/mark_attempted/",
        self.student_id,
        "/",
        self.test_id,
        "/"
      );
      axios
        .post(url, {
          submitted_via: "web"
        })
        .then(function(response) {});

      this.confirm = false;
      this.show_questions = true;
      this.$store.dispatch("set_test_in_progress", true);
      this.$store.dispatch("set_min_remaining", this.minutes);
      this.$store.dispatch("set_sec_remaining", this.seconds);
      var duration = this.minutes * 60 * 1000;

      var x = setInterval(function() {
        duration -= 1000;

        self.minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        self.seconds = Math.floor((duration % (1000 * 60)) / 1000);
        if (self.seconds == 0) {
          self.$store.dispatch("set_min_remaining", self.minutes);
        }

        self.$store.dispatch("set_sec_remaining", self.seconds);

        if (duration < 0) {
          clearInterval(x);
          confirm("Time Over the test will now be submitted");
          self.finish_test();
        }
      }, 1000);
    },

    finish_test() {
      this.$store.dispatch("set_test_in_progress", false);
      this.show_questions = false;
      this.submit = false;
      this.submitted = true;
    },

    mark_answer(id, option) {
      console.log(this.question_list);
      console.log("marking question with id:", id, " with Option: ", option);

      for (var i = 0; i < this.question_list.length; i++) {
        if (this.question_list[i]["id"] == id) {
          this.answer_list[i]["option_marked"] = option;
          switch (option) {
            case "A":
              this.question_list[i]["option_a_color"] = this.marked_color;
              this.question_list[i]["option_b_color"] = this.normal_color;
              this.question_list[i]["option_c_color"] = this.normal_color;
              this.question_list[i]["option_d_color"] = this.normal_color;
              this.question_list[i]["icon"] = "mdi-alpha-a-box";
              break;
            case "B":
              this.question_list[i]["option_b_color"] = this.marked_color;
              this.question_list[i]["option_c_color"] = this.normal_color;
              this.question_list[i]["option_d_color"] = this.normal_color;
              this.question_list[i]["option_a_color"] = this.normal_color;
              this.question_list[i]["icon"] = "mdi-alpha-b-box";
              break;
            case "C":
              this.question_list[i]["option_c_color"] = this.marked_color;
              this.question_list[i]["option_d_color"] = this.normal_color;
              this.question_list[i]["option_a_color"] = this.normal_color;
              this.question_list[i]["option_b_color"] = this.normal_color;
              this.question_list[i]["icon"] = "mdi-alpha-c-box";
              break;
            case "D":
              this.question_list[i]["option_d_color"] = this.marked_color;
              this.question_list[i]["option_a_color"] = this.normal_color;
              this.question_list[i]["option_b_color"] = this.normal_color;
              this.question_list[i]["option_c_color"] = this.normal_color;
              this.question_list[i]["icon"] = "mdi-alpha-d-box";
              break;
          }

          let self = this;
          let ip = this.$store.getters.get_server_ip;
          let school_id = this.$store.getters.get_school_id;
          let url = ip.concat("/online_test/mark_answer/");
          axios
            .post(url, {
              student_id: self.student_id,
              question_id: id,
              answer_marked: option
            })
            .then(function(response) {
              console.log(response);
            })
            .catch(function(error) {
              console.log(error);
            })
            .then(function() {
              // always executed
            });
        }
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
  },
  computed: {}
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