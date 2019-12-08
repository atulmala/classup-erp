<template>
  <v-app>
    <v-container fluid>
      <v-content>
        <h2 v-if="show_payment_history">Fee Payment History</h2>
        <v-layout justify-center v-if="show_payment_history">
          <v-col cols="8" md="2">
            <h5>Student:</h5>
            <h3>{{ student_name }}</h3>
          </v-col>
          <v-col cols="8" md="2">
            <h5>Class:</h5>
            <h3>{{ the_class }}</h3>
          </v-col>
          <v-col cols="8" md="2">
            <h5>Reg/Adm/Sch No</h5>
            <h3>{{ reg_no }}</h3>
          </v-col>
          <v-col cols="8" md="2">
            <h5>Parent</h5>
            <h3>{{ parent}}</h3>
          </v-col>
        </v-layout>
        <v-layout justify-center>
          <v-col cols="10" md="8">
            <v-data-table
              v-if="show_payment_history"
              :headers="headers"
              :items="payment_history"
              class="elevation-1"
            >
              <template v-slot:body="{ items }">
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.name"
                  @click="showAlert(item)"
                  :class="{'selectedRow': item === selectedItem}"
                >
                  <td class="text-xs-left">{{ item.date }}</td>
                  <td class="text-xs-left">{{ item.receipt_number }}</td>
                  <td class="text-xs-left">{{ item.amount_paid }}</td>
                </tr>
              </tbody>
              </template>
            </v-data-table>
          </v-col>
        </v-layout>
      </v-content>
    </v-container>
    <v-layout justify-center>
      <v-form v-if="show_payment_details">
        <h3>Please Correct</h3>
          <v-layout row wrap>
             <v-col cols="8" md="2">
              <v-text-field label="Penalty" v-model="penalty"></v-text-field>
            </v-col>
             <v-col cols="8" md="2">
              <v-text-field label="Other/One Time" v-model="one_time"></v-text-field>
            </v-col>
             <v-col cols="8" md="2">
              <v-text-field label="Discount" v-model="discount" v-on:focus="dismiss()"></v-text-field>
            </v-col>
             <v-col cols="8" md="2">
              <v-text-field label="Amount Paid" v-model="amount_paid" v-on:focus="dismiss()"></v-text-field>
            </v-col>
          </v-layout>
          <v-layout row wrap>
            <v-col cols="8" md="3">
            <v-btn color="green"  @click="correction">Update Payment</v-btn>
            </v-col>
            <v-col cols="8" md="3">
            <v-btn color="orange"  @click="validate_fee">Cancel</v-btn>
            </v-col>
          </v-layout>
          <v-alert :value="showDismissibleAlert" :type="alert_type">{{ alert_message }}</v-alert>
      </v-form>
    </v-layout>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "Correction",
  data() {
    return {
      school_id: "",
      student_id: "",
      reg_no: "",
      the_class: "",
      student_name: "",
      parent: "",
      alert_message: "",
      show_payment_history: true,
      show_payment_details: false,

      receipt_corrected: "",
      penalty: "",
      one_time: "",
      discount: "",
      amount_paid: "",

      payment_history: [],
      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      headers: [
        {
          text: "Date",
          align: "left",
          sortable: false,
          value: "date"
        },
        { text: "Receipt Number", value: "receipt_number" },
        { text: "Amount Paid", value: "amount_paid" }
      ]
    };
  },
  mounted: function() {
    let self = this;
    let school_id = this.$store.getters.get_school_id;
    let student_id = this.$store.getters.get_student_id;
    this.student_name = this.$store.getters.get_student_name;
    this.parent = this.$store.getters.get_parent;

    self.reg_no = this.$store.getters.get_student_id;
    this.the_class = this.$store.getters.get_student_class;
    let ip = this.$store.getters.get_server_ip;
    let url = ip.concat("/fee_processing/get_fee_history/");
    axios
      .get(url, {
        params: {
          school_id: school_id,
          reg_no: self.reg_no,
          download: "false"
        }
      })
      .then(function(response) {
        if (response.data.length == 0) {
          self.alert_message =
            "No payment associated with this student could be found.";
          self.showDismissibleAlert = true;
          self.alert_type = "error";
        } else {
          console.log(response);
          self.show_payment_history = true;
          self.show_payment_details = false;
          for (var i = 0; i < response.data.length; i++) {
            var a_payment = {};
            a_payment["date"] = response.data[i]["date"];
            a_payment["receipt_number"] = response.data[i]["receipt_number"];
            a_payment["amount_paid"] = response.data[i]["amount"];
            a_payment["fine"] = response.data[i]["fine"];
            a_payment["one_time"] = response.data[i]["one_time"];
            a_payment["discount"] = response.data[i]["discount"];
            self.payment_history.push(a_payment);
          }
          console.log(self.payment_history);
        }
        // handle success
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  },

  methods: {
    search() {
      let self = this;
      var can_search = true;
      if (this.reg_no == "" && this.first_name == "") {
        this.alert_message = "Search criteria provided is NOT Enough.";
        this.showDismissibleAlert = true;
        can_search = false;
      }
      if (this.first_name != "" && this.reg_no == "" && this.the_class == "") {
        this.alert_message = "Please specify Class";
        this.showDismissibleAlert = true;
        can_search = false;
      }
      if (can_search) {
        let ip = this.$store.getters.get_server_ip;
        let school_id = this.$store.getters.get_school_id;
        let url = ip.concat(
          "/student/list/",
          school_id,
          "/",
          "in_params",
          "/",
          "in_params"
        );
        axios
          .get(url, {
            params: {
              reg_no: this.reg_no,
              first_name: this.first_name,
              last_name: this.last_name,
              the_class: this.the_class
            }
          })
          .then(function(response) {
            if (response.data.length == 0) {
              self.alert_message =
                "Student not found. Please change the search criteria and try again";
              self.showDismissibleAlert = true;
              self.alert_type = "error";
            } else {
              self.show_search_criteria = false;
              for (var i = 0; i < response.data.length; i++) {
                var student = {};
                student["reg_no"] = response.data[i]["student_erp_id"];
                student["name"] =
                  response.data[i]["fist_name"] +
                  " " +
                  response.data[i]["last_name"];
                student["the_class"] =
                  response.data[i]["current_class"] +
                  "-" +
                  response.data[i]["current_section"];
                student["parent"] = response.data[i]["parent"];
                student["adm_fee"] = response.data[i]["adm_fee"];
                console.log(student);
                self.students.push(student);
              }
              console.log(self.students);
              self.show_student_list = true;
            }
          })
          .catch(function(error) {
            console.log(error);
          })
          .then(function() {
            // always executed
          });
      }
      console.log(this.reg_no);
    },
    dismiss() {
      this.showDismissibleAlert = false;
    },
    showAlert(a) {
      console.log("inside showAlert")
      if (event.target.classList.contains("btn__content")) return;

      let response = confirm(
        "Are you sure you want to do correction for " +
          a.receipt_number +
          " (date: " +
          a.date +
          ", amount: " +
          a.amount_paid +
          ")?"
      );
      if (response) {
        this.show_payment_history = false;
        this.show_payment_details = true;
        this.receipt_corrected = a.receipt_number;
        this.penalty = a.fine;
        this.one_time = a.one_time;
        this.discount = a.discount;
        this.amount_paid = a.amount_paid;
      }
    },
    correction() {
      let self = this;
      let response = confirm("Are you sure you want to apply this correction?");
      if (response) {
        let ip = this.$store.getters.get_server_ip;
        let school_id = this.$store.getters.get_school_id;
        let url = ip.concat("/fee_processing/correct_fee/", school_id, "/");

        axios
          .post(url, {
            receipt_corrected: this.receipt_corrected,
            penalty: this.penalty,
            due_this_term: this.due_this_term,
            one_time: this.one_time,
            fine: this.late_fee,
            one_time: this.one_time,
            discount: this.discount,
            amount_paid: this.amount_paid
          })
          .then(function(response) {
            console.log(response);

            confirm("Fees successfully corrected");
            self.$router.replace("/student_search");
          })
          .catch(function(error) {
            console.log(error);
          })
          .then(function() {
            // always executed
          });
      }
    }
  }
};
</script>