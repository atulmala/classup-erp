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
        <v-simple-table fixed-header height="450px" dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">S No</th>
                <th class="text-left">Student</th>
                <th class="text-left">{{ main_marks }}</th>
                <th class="text-left">Practical</th>
                <th class="text-left">PA (UT Average)</th>
                <th class="text-left">Portfolio</th>
                <th class="text-left">Subject Enrichment</th>
                <th class="text-left">Multi Asses</th>
                <th class="text-left">Absent?</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in marks_list" :key="item.id">
                <td width="5%">{{ item.s_no }}</td>
                <td width="15%" class="text-left">{{ item.student }}</td>
                <td width="10%">
                  <v-text-field
                    class="pa-0 ma-0"
                    v-model="item.marks_obtained"
                    :value="item.marks_obtained"
                    :disabled="item.disabled"
                  ></v-text-field>
                </td>
                <td width="10%">
                  <v-text-field
                    class="pa-0 ma-0"
                    v-model="item.prac_marks"
                    :value="item.prac_marks"
                    :disabled="disable_prac"
                  ></v-text-field>
                </td>
                <td width="10%">
                  <v-text-field
                    class="pa-0 ma-0"
                    v-model="item.periodic_test_marks"
                    :value="item.periodic_test_marks"
                    :disabled="disable_pa"
                  ></v-text-field>
                </td>
                <td width="10%">
                  <v-text-field
                    class="pa-0 ma-0"
                    v-model="item.notebook_marks"
                    :value="item.notebook_marks"
                    :disabled="disable_notebook"
                  ></v-text-field>
                </td>
                <td width="10%">
                  <v-text-field
                    class="pa-0 ma-0"
                    v-model="item.sub_enrich_marks"
                    :value="item.sub_enrich_marks"
                    :disabled="disable_sub_enrich"
                  ></v-text-field>
                </td>
                <td width="10%">
                  <v-text-field
                    class="pa-0 ma-0"
                    v-model="item.multi_asses_marks"
                    :value="item.multi_asses_marks"
                    :disabled="disable_multi"
                  ></v-text-field>
                </td>
                <td>
                  <v-checkbox
                    class="pa-0"
                    label="Absent"
                    :value="item.absent"
                    v-model="item.absent"
                    @change="mark_absence(item)"
                  ></v-checkbox>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-layout>
      <v-layout row wrap justify-center>
        <v-col cols="12" md="4">
          <v-btn
            :loading="loading"
            :disabled="loading"
            color="green"
            @click="loader = 'loading'"
            v-on:click="save_marks()"
          >
            Save
            <span slot="loader" class="custom-loader">
              <v-icon light>cached</v-icon>
            </span>
          </v-btn>
          <v-btn
            :loading="loading"
            :disabled="loading"
            color="green"
            @click="loader = 'loading'"
            v-on:click="save_marks()"
          >
            Submit
            <span slot="loader" class="custom-loader">
              <v-icon light>cached</v-icon>
            </span>
          </v-btn>
        </v-col>
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
      main_marks: "Marks",
      disable_prac: false,
      disable_pa: false,
      disable_notebook: false,
      disable_multi: false,
      disable_sub_enrich: false,

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
            marks["absent"] = false;
            marks["id"] = response.data[i]["id"];
            marks["student"] = response.data[i]["student"];

            marks["marks_obtained"] = response.data[i]["marks_obtained"];
            if (response.data[i]["marks_obtained"] == "-5000.00")
              marks["marks_obtained"] = "";
            if (response.data[i]["marks_obtained"] == "-1000.00") {
              marks["marks_obtained"] = "ABS";
              marks["absent"] = true;
            }

            marks["grade"] = response.data[i]["grade"];

            marks["periodic_test_marks"] =
              response.data[i]["periodic_test_marks"];
            if (response.data[i]["periodic_test_marks"] == -5000) {
              marks["periodic_test_marks"] = "";
            }
            if (response.data[i]["periodic_test_marks"] == "N/A") {
              self.disable_pa = true;
            }

            marks["multi_asses_marks"] = response.data[i]["multi_asses_marks"];
            if (response.data[i]["multi_asses_marks"] == -5000) {
              marks["multi_asses_marks"] = "";
            }
            if (response.data[i]["multi_asses_marks"] == "N/A") {
              self.disable_multi = true;
            }

            marks["notebook_marks"] = response.data[i]["notebook_marks"];
            if (response.data[i]["notebook_marks"] == -5000) {
              marks["notebook_marks"] = "";
            }
            if (response.data[i]["notebook_marks"] == "N/A") {
              self.disable_notebook = true;
            }

            marks["sub_enrich_marks"] = response.data[i]["sub_enrich_marks"];
            if (response.data[i]["sub_enrich_marks"] == -5000) {
              marks["sub_enrich_marks"] = "";
            }
            if (response.data[i]["sub_enrich_marks"] == "N/A") {
              self.disable_sub_enrich = true;
            }

            marks["prac_marks"] = response.data[i]["prac_marks"];
            if (response.data[i]["prac_marks"] == null) {
              marks["prac_marks"] = "N/A";
              self.disable_prac = true;
            } 
            if (response.data[i]["prac_marks"] == -5000) {
              marks["prac_marks"] = "";
              marks["periodic_test_marks"] = "N/A";
              marks["notebook_marks"] = "N/A";
              marks["sub_enrich_marks"] = "N/A";
              marks["multi_asses_marks"] = "N/A";
              self.disable_pa = true;
              self.disable_multi = true;
              self.disable_notebook = true;
              self.disable_sub_enrich = true;

            } 

            self.marks_list.push(marks);
          }

          self.loading = false;
        }
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  },
  methods: {
    mark_absence: function(item)  {
      if (item.absent)
        this.marks_list[item.s_no - 1]["marks_obtained"] = "ABS"
      else
        this.marks_list[item.s_no - 1]["marks_obtained"] = ""
    },
    save_marks: function()  {
      let params = {};
      for (var i = 0; i < this.marks_list.length; i++)  {
        let params1 = {}
        params1["marks"] = this.marks_list[i]["marks_obtained"]
        params1["pa"] = this.marks_list[i]["periodic_test_marks"]
        params1["notebook"] = this.marks_list[i]["notebook_marks"]
        params1["multi_assess"] = this.marks_list[i]["multi_asses_marks"]
        params1["prac_marks"] = this.marks_list[i]["prac_marks"]

        
        params[this.marks_list[i].id] = params1
      }
      console.log(params)
    }
  }
};
</script>