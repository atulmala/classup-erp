<template>
  <v-app class="mt-n12 pt-n12">
    <v-content class="ma-0">
      <template>
        <div class="text-xs-center">
          <v-progress-circular v-if="waiting" :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
        </div>
      </template>
      <div class="text-xs-center">
        <v-col cols="10" md="10" class="mx-auto">
          <v-data-table
            dark
            dense
            loading
            fixed-header
            hide-default-footer
            :loading-text="exam_chosen ? prompt : loading_text"
            :headers="headers"
            :items="mark_list"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat color="#F4511E">
                <v-col cols="12" md="3">
                  <v-select
                    class="mt-7 text-md-start"
                    :items="exam_list"
                    label="Exam"
                    v-model="exam"
                    v-on:focus="dismiss()"
                    v-on:change="get_marks()"
                  ></v-select>
                </v-col>
                <v-divider class="mx-4" inset vertical></v-divider>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-col>
      </div>
      <section v-if="data_ready" class="container">
        <v-col cols="10" md="10" class="mx-auto">
          <column-chart
            :data="chart_data"
            :colors="colors"
            :xtitle="xtitle"
            :ytitle="ytitle"
            :dataset="dataset_options"
          ></column-chart>
        </v-col>
      </section>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "TestResults",
  data() {
    return {
      chart_data: [],
      loader: null,
      loading: false,
      prompt: "Fetching Marks...Please wait",
      loading_text: "Please select an Exam",
      exam_chosen: false,
      exam_list: [],
      exam_id_list: [],
      exam: "",
      exam_id: "",
      mark_list: [],
      colors: ["#311B92", "#1B5E20", "#F4511E"],
      dataset_options: {
        borderWidth: 2,
        
      },
      xtitle: "Subjects",
      ytitle: "Marks",

      headers: [
        {
          text: "Subject",
          value: "subject"
        },
        {
          text: "Max Marks",
          align: "left",
          sortable: false,
          value: "max_marks"
        },
        {
          text: "Your Marks",
          value: "marks"
        },
        {
          text: "Highest",
          value: "highest"
        },
        {
          text: "Average",
          value: "average"
        }
      ],

      data_ready: false,
      waiting: false,
      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      alert_color: ""
    };
  },

  mounted: function() {
    let self = this;
    let school_id = this.$store.getters.get_school_id;
    let ip = this.$store.getters.get_server_ip;
    let student_id = this.$store.getters.get_student_id;
    let url = ip.concat("/academics/get_exam_list/", student_id, "/");

    axios
      .get(url)
      .then(function(response) {
        // handle success
        for (var i = 0; i < response.data.length; i++) {
          self.exam_id_list.push(response.data[i]["id"]);
          self.exam_list.push(response.data[i]["title"]);
        }
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  },

  methods: {
    get_marks() {
      let i = this.exam_list.indexOf(this.exam);
      let exam_id = this.exam_id_list[i];
      let ip = this.$store.getters.get_server_ip;
      let student_id = this.$store.getters.get_student_id;
      let url = ip.concat(
        "/parents/get_exam_result/",
        student_id,
        "/",
        exam_id,
        "/"
      );

      let self = this;
      self.data_ready = false;

      axios
        .get(url)
        .then(function(response) {
          self.mark_list = [];
          self.chart_data = [];
          let your_marks = {};
          let highest_marks = {};
          let average_marks = {};

          for (var i = 0; i < response.data.length; i++) {
            let result = {};
            let subject = response.data[i]["subject"];
            let max_marks = response.data[i]["max_marks"];
            let marks = response.data[i]["marks"];
            let highest = response.data[i]["highest"];
            let average = response.data[i]["average"];

            result["subject"] = subject;
            result["marks"] = marks;
            result["max_marks"] = max_marks;
            result["highest"] = highest;
            result["average"] = average;
            self.mark_list.push(result);

            your_marks[subject] = marks;
            highest_marks[subject] = highest;
            average_marks[subject] = average;
          }
          let dic_your_marks = {};
          dic_your_marks["name"] = "Your Marks";
          dic_your_marks["data"] = your_marks;
          self.chart_data.push(dic_your_marks);

          let dic_highest_marks = {};
          dic_highest_marks["name"] = "Highest Marks";
          dic_highest_marks["data"] = highest_marks;
          self.chart_data.push(dic_highest_marks);

          let dic_average_marks = {};
          dic_average_marks["name"] = "Average Marks";
          dic_average_marks["data"] = average_marks;
          self.chart_data.push(dic_average_marks);

          self.data_ready = true;
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {});
    },
    dismiss() {
      this.showDismissibleAlert = false;
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