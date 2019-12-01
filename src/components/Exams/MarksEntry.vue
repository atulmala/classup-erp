<template>
  <v-content>
    <template>
      <h2>Marks Entry</h2>
      <v-layout rxs4 row wrap>
        <v-col cols="8" md="4">
          <h5>Class:</h5>
          <h4>{{ the_class }}</h4>
        </v-col>
        <v-col cols="12" md="4">
          <h5>Subject:</h5>
          <h4>{{ subject }}</h4>
        </v-col>
        <v-col cols="12" md="4">
          <h5>Exam</h5>
          <h4>{{ exam }}</h4>
        </v-col>
      </v-layout>
      <v-layout row wrap justify-space-around>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">S No</th>
                <th class="text-left">Student</th>
                <th class="text-left">Main Marks</th>
                <th class="text-left">Practical</th>
                <th class="text-left">PA (UT Average)</th>
                <th class="text-left">Portfolio</th>
                <th class="text-left">Notebook Submission</th>
                <th class="text-left">Multi Asses</th>
                <th class="text-left">Absent?</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in marks_list" :key="item.id">
                <td>{{ item.s_no }}</td>
                <td class="text-left">{{ item.student }}</td>
                <td>
                  <v-text-field v-model="item.marks_obtained" :value=item.marks_obtained></v-text-field>
                  
                </td>
                <td>{{ item.prac_marks }}</td>
                <td>{{ item.periodic_test_marks }}</td>
                <td>{{ item.multi_asses_marks }}</td>
                <td>{{ item.notebook_marks }}</td>
                <td>{{ item.sub_enrich_marks }}</td>
                <td>
                  <v-checkbox label="Absent" value="absent"></v-checkbox>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
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
      <template>
        <div class="text-xs-center">
          <v-progress-circular v-if="waiting" :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
        </div>
      </template>
      <v-col cols="12" md="3"></v-col>
    </template>
  </v-content>
</template>

<script>
import axios from "axios";
export default {
  name: "MarksEntry",
  data() {
    return {
      ip: "",
      the_class: "",
      section: "",
      subject: "",
      exam: "",
      test_id: "",
      marks_list: [],

      showDismissibleAlert: false,
      confirm: false,
      alert_message: "",
      alert_type: "",
      alert_color: ""
    };
  },
  mounted: function() {
    let self = this;
    let store = this.$store.getters;
    self.the_class = store.get_class;
    self.subject = store.get_subject;
    self.exam = store.get_exam;
    self.test_id = store.get_test;

    self.ip = store.get_server_ip;
    let url = self.ip.concat("/exam/get_test_marks_list");
    axios
      .get(url, {
        params: {
          test_id: self.test_id
        }
      })
      .then(function(response) {
        if (response.data.length == 0) {
          self.alert_message = "This test has no results";
          self.showDismissibleAlert = true;
          self.alert_type = "error";
          self.alert_color = "red";
        } else {
          for (var i = 0; i < response.data.length; i++) {
            var marks = {};
            marks["s_no"] = i + 1;
            marks["student"] = response.data[i]["student"];

            if (response.data[i]["marks_obtained"] == "-5000.00")
              marks["marks_obtained"] = "";
            else marks["marks_obtained"] = response.data[i]["marks_obtained"];

            marks["grade"] = response.data[i]["grade"];
            if (response.data[i]["periodic_test_marks"] == -5000)
              marks["periodic_test_marks"] = "N/A";
            else
              marks["periodic_test_marks"] =
                response.data[i]["periodic_test_marks"];

            if (response.data[i]["multi_assess_marks"] == -5000)
              marks["multi_asses_marks"] = "N/A";
            else
              marks["multi_asses_marks"] =
                response.data[i]["multi_asses_marks"];

            if (response.data[i]["notebook_marks"] == 5000.0)
              marks["notebook_marks"] = "N/A";
            else marks["notebook_marks"] = response.data[i]["notebook_marks"];

            if (response.data[i]["sub_enrich_marks"] === -5000)
              marks["sub_enrich_marks"] = "N/A";
            else
              marks["sub_enrich_marks"] = response.data[i]["sub_enrich_marks"];

            if ((response.data[i]["prac_marks"] = null))
              marks["prac_marks"] = "N/A";
            else marks["prac_marks"] = response.data[i]["prac_marks"];
            self.marks_list.push(marks);
          }

          console.log(self.marks_list);
          self.loading = false;
        }
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  }
};
</script>