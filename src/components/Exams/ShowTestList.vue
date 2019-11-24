<template>
  <v-app>
    <v-content>
      <v-flex d-flex xs8 order-xs offset-sm2>
        <template>
          <v-data-table
            dark
            loading-text="Fetching tests... Please wait"
            :headers="headers"
            :items="tests"
            item-key="id"
            :items-per-page="10"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat color="blue">
                <v-toolbar-title>Test List</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>Click on a subject to enter marks
                <v-spacer></v-spacer>
                <v-btn color="orange" class="mb-0">Schedule Test</v-btn>
              </v-toolbar>
            </template>
            <template v-slot:item.max_marks="{ item }">
              <v-chip small color="teal" dark>{{ item.max_marks }}</v-chip>
            </template>
            <template v-slot:item.is_completed="{ item }">
              <v-chip outlined="" :color="status_color(item.is_completed)" >{{ item.is_completed }}</v-chip>
            </template>
            <template v-slot:item.action="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
              <v-icon small @click="deleteItem(item)">delete</v-icon>
            </template>
            <template v-slot:expanded-item="{ item }">
              <v-card flat>
                <v-card-subtitle
                  class="headline mb-0"
                >Exam {{ item.exam }} Marks Entry - Subject: {{ item.subject }} Class: {{ item.the_class }}</v-card-subtitle>
                <v-card-text></v-card-text>
                <v-card-actions>
                  <v-btn text>Save</v-btn>
                  <v-btn text>Submit</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-data-table>
        </template>
      </v-flex>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "ShowTestList",
  data() {
    return {
      loader: null,
      loading: true,
      tests: [],
      test_id: "",
      date_conducted: "",
      the_class: "",
      section: "",
      subject: "",
      exam: "",
      max_marks: "",
      grade_based: "",
      test_type: "",
      is_completed: "",

      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      headers: [
        {
          text: "Date",
          align: "left",
          sortable: false,
          value: "date_conducted"
        },
        { text: "Subject", value: "subject" },
        { text: "Class", value: "the_class" },
        { text: "Exam", value: "exam" },
        { text: "Type", value: "test_type" },
        { text: "Max Marks", value: "max_marks" },
        { text: "Status", value: "is_completed" },
        { text: "Actions", value: "action", sortable: false }
      ],

      formTitle: "Schedule a new Test",
      dialog: true
    };
  },
  mounted: function() {
    let self = this;
    let school_id = this.$store.getters.get_school_id;
    let teacher = this.$store.getters.get_logged_user;
    let ip = this.$store.getters.get_server_ip;
    let url = ip.concat("/exam/get_tests");
    axios
      .get(url, {
        params: {
          school_id: school_id,
          for_whom: "teacher",
          teacher: teacher
        }
      })
      .then(function(response) {
        if (response.data.length == 0) {
          self.alert_message = "You have not scheduled any Test";
          self.showDismissibleAlert = true;
          self.alert_type = "error";
        } else {
          for (var i = 0; i < response.data.length; i++) {
            var test = {};
            test["id"] = response.data[i]["id"];
            test["date_conducted"] = response.data[i]["date_conducted"];
            test["the_class"] =
              response.data[i]["the_class"] +
              " - " +
              response.data[i]["section"];
            test["section"] = response.data[i]["section"];
            test["subject"] = response.data[i]["subject"];
            test["exam"] = response.data[i]["exam"];
            test["test_type"] = response.data[i]["test_type"];

            let grade_based = response.data[i]["grade_based"];
            if (grade_based == true) {
              test["max_marks"] = "Grade Based";
              test["grade_based"] = "Yes";
            } else {
              test["max_marks"] = response.data[i]["max_marks"];
              test["grade_based"] = "No";
            }

            let is_completed = response.data[i]["is_completed"];
            if (is_completed == true) {
              test["is_completed"] = "Completed";
            } else {
              test["is_completed"] = "Pending";
            }
            self.tests.push(test);
          }
          console.log(self.tests);
          self.loading = false;
        }
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  },

  methods: {
    status_color(status) {
      if (status == "Pending") return "amber";
      if (status == "Completed") return "green";
    },
    dismiss() {
      this.showDismissibleAlert = false;
    },
    showAlert(a) {
      console.log(a);
      let response = confirm(
        "Are you sure you want to Enter/Update marks for this test ",
        a.id,
        " ",
        a.subject,
        "a.date_coducted"
      );
      if (response) {
        this.$store.dispatch("set_student_id", a.id);
      }
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