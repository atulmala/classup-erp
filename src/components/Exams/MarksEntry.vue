<template>
  <v-content style="margin: 0px 0px 0px;">
    <template>
      <v-layout xs4 row wrap justify-space-around>
        <v-col cols="12" md="12">
          <v-toolbar  color="#FEDBD0" elevation="5">
            <v-toolbar-title>Marks Entry</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-toolbar-title>Exam: {{ exam }}</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-toolbar-title>Class: {{ the_class }}</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-toolbar-title>Subject: {{ subject }}</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-toolbar-title>Max Marks: {{ max_marks }}</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-chip
            :loading="loading"
            :disabled="loading"
            text-color="white"
            color="#442C2E"
            @click="loader = 'loading'"
            v-on:click="save_marks()"
          >
              Save
            <span slot="loader" class="custom-loader">
              <v-icon light>cached</v-icon>
            </span>
          </v-chip>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-chip
            :loading="loading"
            :disabled="loading"
            color="#4E0D3A"
            text-color="white"
            @click="loader = 'loading'"
            v-on:click="submit_marks()"
          >
            Submit
            <span slot="loader" class="custom-loader">
              <v-icon light>cached</v-icon>
            </span>
          </v-chip>
            <v-spacer></v-spacer>
          </v-toolbar>
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
      <v-layout row wrap justify-space-around>
        <v-simple-table fixed-header height="450px" dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">S No</th>
                <th class="text-left">Student</th>
                <th class="text-left">{{ main_marks }}</th>
                <th v-if="higher_class" class="text-left">Practical</th>
                <th v-if="!higher_class" class="text-left">PA (UT Average)</th>
                <th v-if="!higher_class" class="text-left">Portfolio</th>
                <th v-if="!higher_class" class="text-left">Subject Enrichment</th>
                <th v-if="!higher_class" class="text-left">Multi Asses</th>
                <th class="text-left">Absent?</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in marks_list" :key="item.id">
                <td width="5%">{{ item.s_no }}</td>
                <td width="20%" class="text-left">{{ item.student }}</td>
                <td width="10%">
                  <v-text-field
                    class="pa-0 ma-0"
                    v-model="item.marks_obtained"
                    :value="item.marks_obtained"
                    :disabled="item.disabled"
                    v-on:focus="dismiss()"
                  ></v-text-field>
                </td>
                <td v-if="higher_class" width="10%">
                  <v-text-field
                    class="pa-0 ma-0"
                    v-model="item.prac_marks"
                    :value="item.prac_marks"
                    :disabled="disable_prac"
                    v-on:focus="dismiss()"
                  ></v-text-field>
                </td>
                <td v-if="!higher_class" width="10%">
                  <v-text-field
                    class="pa-0 ma-0"
                    v-model="item.periodic_test_marks"
                    :value="item.periodic_test_marks"
                    :disabled="disable_pa"
                    v-on:focus="dismiss()"
                  ></v-text-field>
                </td>
                <td v-if="!higher_class" width="10%">
                  <v-text-field
                    class="pa-0 ma-0"
                    v-model="item.notebook_marks"
                    :value="item.notebook_marks"
                    :disabled="disable_notebook"
                    v-on:focus="dismiss()"
                  ></v-text-field>
                </td>
                <td v-if="!higher_class" width="10%">
                  <v-text-field
                    class="pa-0 ma-0"
                    v-model="item.sub_enrich_marks"
                    :value="item.sub_enrich_marks"
                    :disabled="disable_sub_enrich"
                    v-on:focus="dismiss()"
                  ></v-text-field>
                </td>
                <td v-if="!higher_class" width="10%">
                  <v-text-field
                    class="pa-0 ma-0"
                    v-model="item.multi_asses_marks"
                    :value="item.multi_asses_marks"
                    :disabled="disable_multi"
                    v-on:focus="dismiss()"
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
      grade_based: false,
      test_type: "",
      max_marks: "",
      marks_list: [],
      main_marks: "Marks",
      disable_prac: false,
      disable_pa: false,
      disable_notebook: false,
      disable_multi: false,
      disable_sub_enrich: false,
      higher_class: false,

      loading: "",
      waiting: "",
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
    
    self.grade_based = store.get_grade_based;
    
    self.test_type = store.get_test_type;
    self.max_marks = store.get_max_marks;
    console.log("test_type = ", self.test_type);
    console.log("grade_based = ", self.grade_based);

    let only_class = self.the_class.slice(0, -4);
    if (only_class == "XI" || only_class == "XII") self.higher_class = true;
    console.log("higher_class = ", only_class);

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
    dismiss() {
      this.showDismissibleAlert = false;
    },
    mark_absence: function(item) {
      this.showDismissibleAlert = false;
      if (item.absent) this.marks_list[item.s_no - 1]["marks_obtained"] = "ABS";
      else this.marks_list[item.s_no - 1]["marks_obtained"] = "";
    },
    compare_with_max(item) {
      if (item.marks_obtained > this.max_marks) {
        this.showDismissibleAlert = true;
        this.alert_message =
          "Marks entered for " +
          item.student +
          " are higher than Marks " +
          this.max_marks;
        this.alert_color = "amber";
      }
    },
    submit_marks: function() {
      for (var i = 0; i < this.marks_list.length; i++) {
        if (this.marks_list[i]["marks_obtained"] == "") {
          console.log(this.marks_list[i]);
          this.showDismissibleAlert = true;
          this.alert_message =
            "Please enter marks or mark as Absent for " +
            this.marks_list[i]["student"];
          this.alert_color = "red";
          return;
        }
      }

      if (this.test_type == "term") {
        for (var i = 0; i < this.marks_list.length; i++) {
          if (this.marks_list[i]["periodic_test_marks"] == "") {
            this.showDismissibleAlert = true;
            this.alert_message =
              "Please enter PA (UT Average) marks for " +
              this.marks_list[i]["student"];
            this.alert_color = "red";
            return;
          }
          if (this.marks_list[i]["notebook_marks"] == "") {
            this.showDismissibleAlert = true;
            this.alert_message =
              "Please enter Portfolio marks for " +
              this.marks_list[i]["student"];
            this.alert_color = "red";
            return;
          }
          if (this.marks_list[i]["sub_enrich_marks"] == "") {
            this.showDismissibleAlert = true;
            this.alert_message =
              "Please enter Sub Enrichment marks for " +
              this.marks_list[i]["student"];
            this.alert_color = "red";
            return;
          }
          if (this.marks_list[i]["multi_asses_marks"] == "") {
            this.showDismissibleAlert = true;
            this.alert_message =
              "Please enter Multiple Assessment marks for " +
              this.marks_list[i]["student"];
            this.alert_color = "red";
            return;
          }

          // all marks entered properly, can submit now
          if (this.grade_based == "No") {
            params1["marks"] = this.marks_list[i]["marks_obtained"];
            if (this.marks_list[i]["marks_obtained"] == "")
              params1["marks"] = "-5000.00";
            if (this.marks_list[i]["marks_obtained"] == "ABS")
              params1["marks"] = "-1000.0";

            if (this.marks_list[i]["periodic_test_marks"] == "")
              params1["pa"] = "-5000.0";
            else params1["pa"] = this.marks_list[i]["periodic_test_marks"];

            if (this.marks_list[i]["notebook_marks"] == "")
              params1["notebook"] = "-5000.0";
            else params1["notebook"] = this.marks_list[i]["notebook_marks"];

            if (this.marks_list[i]["multi_asses_marks"] == "")
              params1["multi_assess"] = "-5000.0";
            else
              params1["multi_assess"] = this.marks_list[i]["multi_asses_marks"];

            if (this.marks_list[i]["sub_enrich_marks"] == "")
              params1["subject_enrich"] = "-5000.0";
            else
              params1["subject_enrich"] = this.marks_list[i][
                "sub_enrich_marks"
              ];

            if (this.marks_list[i]["prac_marks"] == "")
              params1["prac_marks"] = "-5000.0";
            else params1["prac_marks"] = this.marks_list[i]["prac_marks"];

            params[this.marks_list[i]["id"]] = params1;
          } else {
            params[this.marks_list[i]["id"]] = this.marks_list[i][
              "marks_obtained"
            ];
          }
        }

        let ip = this.$store.getters.get_server_ip;
        let url = ip.concat("/academics/submit_marks/");

        axios
          .post(url, {
            params
          })
          .then(function(response) {})
          .catch(function(error) {
            console.log(error);
          })
          .then(function() {
            // always executed
          });

        console.log(params);
      }
    },
    save_marks: function() {
      let params = {};
      for (var i = 0; i < this.marks_list.length; i++) {
        let params1 = {};
        console.log("grade_based = ", this.grade_based);
        if (this.grade_based == "No") {
          params1["marks"] = this.marks_list[i]["marks_obtained"];
          if (this.marks_list[i]["marks_obtained"] == "")
            params1["marks"] = "-5000.00";
          if (this.marks_list[i]["marks_obtained"] == "ABS")
            params1["marks"] = "-1000.0";

          if (this.marks_list[i]["periodic_test_marks"] == "")
            params1["pa"] = "-5000.0";
          else params1["pa"] = this.marks_list[i]["periodic_test_marks"];

          if (this.marks_list[i]["notebook_marks"] == "")
            params1["notebook"] = "-5000.0";
          else params1["notebook"] = this.marks_list[i]["notebook_marks"];

          if (this.marks_list[i]["multi_asses_marks"] == "")
            params1["multi_assess"] = "-5000.0";
          else
            params1["multi_assess"] = this.marks_list[i]["multi_asses_marks"];

          if (this.marks_list[i]["sub_enrich_marks"] == "")
            params1["subject_enrich"] = "-5000.0";
          else
            params1["subject_enrich"] = this.marks_list[i]["sub_enrich_marks"];

          if (this.marks_list[i]["prac_marks"] == "")
            params1["prac_marks"] = "-5000.0";
          else params1["prac_marks"] = this.marks_list[i]["prac_marks"];

          params[this.marks_list[i]["id"]] = params1;
        } else {
          params[this.marks_list[i]["id"]] = this.marks_list[i][
            "marks_obtained"
          ];
        }
      }

      let ip = this.$store.getters.get_server_ip;
      let url = ip.concat("/academics/save_marks/");

      axios
        .post(url, {
          params
        })
        .then(function(response) {})
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {
          // always executed
        });

      console.log(params);
    }
  }
};
</script>