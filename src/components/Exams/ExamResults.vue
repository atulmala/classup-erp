<template>
  <v-app class="mt-n12 pt-n12">
    <v-content class="ma-0">
      <template>
        <div class="text-xs-center">
          <v-progress-circular v-if="waiting" :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
        </div>
      </template>
      <div class="text-xs-center">
        <v-col cols="12" md="12">
          <v-row justify="center">
            <v-dialog v-model="display_marks" scrollable max-width="700px">
              <v-card>
                <v-card-title>
                  {{ operated_student }}
                  <v-divider class="mx-4" vertical></v-divider>
                  {{ active_term }}
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text style="height: 250px;">
                  <div class="font-weight-black"></div>
                  <v-chip-group
                    v-if="active_term=='Term I'"
                    multiple
                    column
                    active-class="primary--text;"
                  >
                    <v-chip
                      outlined
                      v-for="(subject, index) in term_marks1"
                      :color="color1[index]"
                      :key="subject"
                    >{{ subject }}</v-chip>
                  </v-chip-group>
                  <v-chip-group
                    v-if="active_term=='Term II'"
                    multiple
                    column
                    active-class="primary--text;"
                  >
                    <v-chip
                      outlined
                      v-for="(subject, index) in term_marks2"
                      :color="color2[index]"
                      :key="subject"
                    >{{ subject }}</v-chip>
                  </v-chip-group>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn color="blue darken-1" text @click="display_marks = false">Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="promote_dialog" persistent max-width="520px">
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <v-card-title>
                  <v-card-title>
                    <span class="headline">{{ operated_student }}</span>
                  </v-card-title>
                </v-card-title>
                <v-card-subtitle>
                  <hr />
                  <h5>You are changing status to Promoted. Please Confirm</h5>
                </v-card-subtitle>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="cancel_promote()">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="set_promote_reason()">Confirm</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="detain_dialog" persistent max-width="520px">
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <v-card-title>
                  <v-card-title>
                    <span class="headline">{{ operated_student }}</span>
                  </v-card-title>
                </v-card-title>
                <v-card-subtitle>
                  <hr />
                  <h5>You are changing status to Not Promoted. Please mention reason</h5>
                </v-card-subtitle>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          label="Reason*"
                          v-model="detain_reason"
                          required
                        >{{ detain_reason }}</v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="cancel_detain()">Cancel</v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="detain_dialog = false; set_detain_reason()"
                  >Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
          <v-data-table
            dark
            dense
            loading
            :loading-text="((the_class == '') || (section == '')) ? class_not_selected : loading_text"
            :headers="headers"
            :items="student_list"
            :items-per-page="7"
          >
            <template v-slot:top>
              <v-toolbar flat color="#827717">
                <v-chip class="mt-4" color="#827717" label>
                  <div class="text-uppercase">Student Promotion Operations</div>
                </v-chip>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-col cols="12" md="1">
                  <v-select
                    class="mt-7"
                    :items="class_list"
                    label="Class"
                    v-model="the_class"
                    v-on:focus="dismiss()"
                    v-on:change="get_student_list()"
                  ></v-select>
                </v-col>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-col cols="12" md="1">
                  <v-select
                    class="mt-7"
                    :items="section_list"
                    label="Sec"
                    v-model="section"
                    v-on:focus="dismiss()"
                    v-on:change="get_student_list()"
                  ></v-select>
                </v-col>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-chip class="mt-4" color="#827717" label>
                  <div class="text-uppercase">Class Teacher: {{ class_teacher }}</div>
                </v-chip>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="#9575CD"
                      dark
                      class="mb-0"
                      :disabled="!download"
                      @click="save_results"
                    >Save</v-btn>
                  </template>
                </v-dialog>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="#7986CB"
                      dark
                      class="mb-0"
                      :disabled="!download"
                      @click="download_excel"
                    >Download</v-btn>
                  </template>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">
              <v-icon
                large
                color="#FFB74D"
                @click="active_term='Term I'; get_marks(item)"
              >mdi-numeric-1-box</v-icon>
              <v-icon
                large
                color="#EEFF41"
                @click="active_term='Term II'; get_marks(item)"
              >mdi-numeric-2-box</v-icon>
            </template>
            <template v-slot:item.promotion_status="{ item }">
              <v-radio-group class="mb-n2" dense row v-model="item.promotion_status">
                <v-radio label="promoted" value="promoted" color="green" @change="promote(item)"></v-radio>
                <v-radio
                  label="not promoted"
                  value="not promoted"
                  color="red"
                  @change="detain(item)"
                ></v-radio>
              </v-radio-group>
            </template>
          </v-data-table>
        </v-col>
      </div>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "ExamResults",
  data() {
    return {
      ip: "",
      school_id: "",

      loader: null,
      loading: false,
      loading_text: "Fetching student list for this class... Please wait",
      class_not_selected: "Please select a Class & Section",
      reg_no: "",

      the_class: "",
      class_list: [],
      section: "",
      section_list: [],
      class_teacher: "",

      student_list: [],
      download: false,
      promote_dialog: false,
      detain_dialog: false,
      display_marks: false,

      dialog: "",
      current_status: "",
      operated_student: "",
      operated_student_id: "",
      detain_reason: "",
      term_marks1: [],
      term_marks2: [],
      color1: [],
      color2: [],
      active_term: "",
      waiting: false,
      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      alert_color: "",
      headers: [
        { text: "S No", value: "s_no" },
        {
          text: "Student Name",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "Term Marks Details", value: "action", sortable: false },
        { text: "Promotion Status", value: "promotion_status" },
        { text: "Not Promoted Reason", value: "detain_reason" }
      ]
    };
  },

  mounted: function() {
    let self = this;
    self.waiting = true;
    self.school_id = this.$store.getters.get_school_id;
    self.ip = this.$store.getters.get_server_ip;
    let url = self.ip.concat("/academics/class_list/", self.school_id, "/");

    function get_class_list() {
      return axios.get(
        self.ip.concat("/academics/class_list/", self.school_id, "/")
      );
    }
    function get_section_list() {
      return axios.get(
        self.ip.concat("/academics/section_list/", self.school_id, "/")
      );
    }

    axios.all([get_class_list(), get_section_list()]).then(
      axios.spread(function(classes, sections) {
        self.class_list = classes.data;
        self.section_list = sections.data;

        for (var i = 0; i < classes.data.length; i++) {
          self.class_list[i] = classes.data[i]["standard"];
        }
        for (var i = 0; i < sections.data.length; i++) {
          self.section_list[i] = sections.data[i]["section"];
        }
        self.waiting = false;
      })
    );
  },

  methods: {
    get_student_list() {
      let self = this;
      self.student_list = [];
      if (this.the_class != "" && this.section != "") {
        let url1 = self.ip.concat(
          "/teachers/get_class_teacher/?school_id=",
          self.school_id,
          "&the_class=",
          this.the_class,
          "&section=",
          this.section
        );
        axios
          .get(url1)
          .then(function(response) {
            // handle success
            console.log(response)
            self.class_teacher = response.data['class_teacher'];
          })
          .catch(function(error) {
            // handle error
            console.log(error);
          });

        let url = self.ip.concat(
          "/exam/get_promotion_list/?school_id=",
          self.school_id,
          "&the_class=",
          this.the_class,
          "&section=",
          this.section
        );
        axios
          .get(url)
          .then(function(response) {
            // handle success
            for (var i = 0; i < response.data.length; i++) {
              let student = {};
              student["id"] = response.data[i]["id"];
              student["s_no"] = i + 1;
              student["name"] = response.data[i]["student"];
              if (response.data[i]["status"] == true) {
                student["promotion_status"] = "promoted";
              } else {
                student["promotion_status"] = "not promoted";
              }

              student["detain_reason"] = response.data[i]["detain_reason"];

              self.student_list.push(student);
            }
            self.download = true;
          })
          .catch(function(error) {
            // handle error
            console.log(error);
          });
      }
    },
    promote(item) {
      this.promote_dialog = true;
      this.operated_student = item.name;
      this.operated_student_id = item.id;
    },
    set_promote_reason() {
      this.promote_dialog = false;
      for (var i = 0; i < this.student_list.length; i++) {
        if (this.student_list[i]["id"] == this.operated_student_id) {
          this.student_list[i]["detain_reason"] = "N/A";
          this.student_list[i]["promotion_status"] = "promoted";
          this.detain_reason = "";
        }
      }
    },
    cancel_promote() {
      this.promote_dialog = false;
      for (var i = 0; i < this.student_list.length; i++) {
        if (this.student_list[i]["id"] == this.operated_student_id) {
          this.student_list[i]["promotion_status"] = "not promoted";
        }
      }
    },
    detain(item) {
      this.detain_dialog = true;
      this.operated_student = item.name;
      this.operated_student_id = item.id;
      this.current_status = item.promotion_status;
      if (item.detain_reason == "N/A") {
        this.detain_reason = "";
      } else {
        this.detain_reason = item.detain_reason;
      }
    },
    set_detain_reason() {
      if (this.detain_reason == "") {
        alert("Detain reason not provided. Please provide Detain Reason");
        this.detain_dialog = true;
      } else {
        this.detain_dialog = false;
        for (var i = 0; i < this.student_list.length; i++) {
          if (this.student_list[i]["id"] == this.operated_student_id) {
            this.student_list[i]["detain_reason"] = this.detain_reason;
            this.student_list[i]["promotion_status"] = "not promoted";
            this.detain_reason = "";
          }
        }
      }
    },
    cancel_detain() {
      this.detain_dialog = false;
      this.detain_reason = "N/A";
      for (var i = 0; i < this.student_list.length; i++) {
        if (this.student_list[i]["id"] == this.operated_student_id) {
          this.student_list[i]["detain_reason"] = this.detain_reason;
          this.student_list[i]["promotion_status"] = "promoted";
          this.detain_reason = "N/A";
        }
      }
    },
    save_results() {
      let self = this;
      let promotion_list = {};
      for (var i = 0; i < this.student_list.length; i++) {
        let promotee = {};
        promotee["promotion_status"] = this.student_list[i]["promotion_status"];
        promotee["detain_reason"] = this.student_list[i]["detain_reason"];
        promotion_list[this.student_list[i]["id"]] = promotee;
      }
      let url = this.ip.concat("/exam/process_promotion/");
      this.waiting = true;
      axios
        .post(url, promotion_list)
        .then(function(response) {
          console.log(response.data);
          // handle success
          self.waiting = false;
          alert("Data Saved");
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
    },
    download_excel() {
      let self = this;
      self.waiting = true;
      let url = self.ip.concat("/exam/get_promotion_excel/");
      let options = {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        },
        responseType: "arraybuffer"
      };
      axios
        .post(
          url,
          {
            school_id: self.school_id,
            the_class: self.the_class,
            section: self.section
          },

          options
        )
        .then(function(response) {
          self.waiting = false;
          console.log(response);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          var file_name =
            "Promotion_List_" + self.the_class + "_" + self.section + ".xlsx";

          link.setAttribute("download", file_name); //or any other extension
          document.body.appendChild(link);
          link.click();
          confirm("Promotion List Downloaded");
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {
          // always executed
        });
    },
    get_marks(item) {
      this.operated_student = item.name;
      let self = this;
      self.waiting = true;
      let url = this.ip.concat("/exam/get_student_marks/?result_id=", item.id);
      axios
        .get(url)
        .then(function(response) {
          console.log(response.data);

          // handle success
          self.term_marks1 = [];
          self.term_marks2 = [];
          self.color1 = [];
          self.color2 = [];
          for (var i = 0; i < response.data.length; i++) {
            var marks_string1 = "";
            var marks_string2 = "";

            let subject = response.data[i]["subject"];

            let marks = response.data[i]["marks"];

            if (self.the_class == "XI" || self.the_class == "XII") {
              let prac = response.data[i]["prac_marks"];
              let total = response.data[i]["total_marks"];
              let exam = response.data[i]["exam"];
              if (exam.includes("Term-I ")) {
                marks_string1 = marks_string1.concat(
                  subject,
                  " |  Therory: ",
                  marks,
                  " |  Prac: ",
                  prac,
                  " |  Total: ",
                  total
                );
                if (marks >= 60) {
                  self.color1.push("#00E676");
                }
                if (marks < 60 && marks >= 40) {
                  self.color1.push("#1E88E5");
                }
                if (marks < 40) {
                  self.color1.push("#FF5722");
                }
              }
              if (exam.includes("Term-II ")) {
                marks_string2 = marks_string2.concat(
                  response.data[i]["subject"],
                  " |  Theory: ",
                  marks,
                  " |  Prac: ",
                  prac,
                  " |  Total: ",
                  total
                );
                if (marks >= 60) {
                  self.color2.push("#00E676");
                }
                if (marks < 60 && marks >= 40) {
                  self.color2.push("#1E88E5");
                }
                if (marks < 40) {
                  self.color2.push("#FF5722");
                }
              }
            } else {
              let pa = response.data[i]["periodic_test_marks"];
              let multi_asses = response.data[i]["multi_asses_marks"];
              let portfolio = response.data[i]["portfolio_marks"];
              let sub_enrich = response.data[i]["sub_enrich_marks"];

              let total = response.data[i]["total_marks"];

              let exam = response.data[i]["exam"];
              if (exam.includes("Term-I (")) {
                marks_string1 = marks_string1.concat(
                  response.data[i]["subject"],
                  " |  Marks: ",
                  marks,
                  " |  PA: ",
                  pa,
                  " |  Mult Asse: ",
                  multi_asses,
                  " |  Port: ",
                  portfolio,
                  " |  Sub En: ",
                  sub_enrich,
                  " |  Total: ",
                  total
                );
                if (marks >= 60) {
                  self.color1.push("#00E676");
                }
                if (marks < 60 && marks >= 40) {
                  self.color1.push("#1E88E5");
                }
                if (marks < 40) {
                  self.color1.push("#FF5722");
                }
              }
              if (exam.includes("Term-II (")) {
                marks_string2 = marks_string2.concat(
                  response.data[i]["subject"],
                  " |  Marks: ",
                  marks,
                  " |  PA: ",
                  pa,
                  " |  Mult Asse: ",
                  multi_asses,
                  " |  Port: ",
                  portfolio,
                  " |  Sub En: ",
                  sub_enrich,
                  " |  Total: ",
                  total
                );
                if (marks >= 60) {
                  self.color2.push("#00E676");
                }
                if (marks < 60 && marks >= 40) {
                  self.color2.push("#1E88E5");
                }
                if (marks < 40) {
                  self.color2.push("#FF5722");
                }
              }
            }
            if (self.active_term == "Term I") {
              if (marks_string1 != "") {
                self.term_marks1.push(marks_string1);
              }
            } else {
              if (marks_string2 != "") {
                self.term_marks2.push(marks_string2);
              }
            }
          }
          self.waiting = false;

          self.display_marks = true;
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
    }
  },
  dismiss() {
    this.showDismissibleAlert = false;
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