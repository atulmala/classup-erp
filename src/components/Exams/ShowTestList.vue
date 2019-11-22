<template>
  <v-app>
    <v-content>
      <h3>Test List (Click on Subject to start entering marks)</h3>
      <v-flex d-flex xs9 order-xs5 offset-sm1>
        <v-data-table dark dense :headers="headers" :items="tests" class="elevation-1">
          <template slot="items" slot-scope="props">
            <tr @click="showAlert(props.item)">
              <td class="text-xs-left">{{ props.item.date_conducted }}</td>
              <td class="text-xs-left">{{ props.item.subject }}</td>
              <td class="text-xs-left">{{ props.item.the_class }}</td>
              <td class="text-xs-left">{{ props.item.exam }}</td>
              <td class="text-xs-left">{{ props.item.test_type }}</td>
              <td class="text-xs-left">
                <v-chip color="teal">{{ props.item.max_marks }}</v-chip>
              </td>
              <td class="text-xs-left">
                <v-chip :color="status_color(props.item.is_completed)" class="ma-2" label>{{ props.item.is_completed }}</v-chip>
              </td>
              <td class="text-xs-left">
                <tr>
                  <v-icon small color="blue" class="mr-2" @click="editItem(item)">edit</v-icon>
                  <v-icon small color="red" @click="deleteItem(item)">delete</v-icon>
                </tr>
              </td>
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
  name: "ShowTestList",
  data() {
    return {
      loader: null,
      loading: false,
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
        { text: "Status", value: "completed" },
        { text: "Actions", value: "action", sortable: false }
      ]
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
        }
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  },

  methods: {
    status_color(status)  {
      if (status == "Pending")
        return "amber"
      if (status == "Completed")
        return "green"
    },
    dismiss() {
      this.showDismissibleAlert = false;
    },
    showAlert(a) {
      if (event.target.classList.contains("btn__content")) return;
      let coming_from = this.$store.getters.get_coming_from;
      if (coming_from == "fee_payment") {
        let response = confirm(
          "Are you sure you want to process the fees for " +
            a.name +
            " (" +
            a.reg_no +
            ")?"
        );
        if (response) {
          this.$store.dispatch("set_student_id", a.reg_no);
          this.$store.dispatch("set_student_name", a.name);
          this.$store.dispatch("set_parent", a.parent);
          this.$router.replace("/fee_payment");
        }
      }

      if (coming_from == "correction") {
        let response = confirm(
          "Are you sure you want to do correction for " +
            a.name +
            " (" +
            a.reg_no +
            ")?"
        );
        if (response) {
          this.$store.dispatch("set_student_id", a.reg_no);
          this.$store.dispatch("set_student_name", a.name);
          var the_class = a.current_class;
          console.log(the_class);
          let section = a.current_section;
          console.log(section);
          this.$store.dispatch("set_student_class", a.the_class);
          this.$store.dispatch("set_parent", a.parent);
          this.$router.replace("/correction");
        }
      }

      if (coming_from == "update_student") {
        let response = confirm(
          "Are you sure you want to do update for " +
            a.name +
            " (" +
            a.reg_no +
            ")?"
        );
        if (response) {
          this.$store.dispatch("set_student_id", a.reg_no);
          this.$store.dispatch("set_student_name", a.name);
          this.$store.dispatch("set_student_class", a.the_class);
          this.$store.dispatch("set_parent", a.parent);
          this.$router.replace("/update_student");
        }
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