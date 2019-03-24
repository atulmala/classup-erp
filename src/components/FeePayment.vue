<template>
  <v-app>
    <v-content class="ma-0 pa-0 ta-0">
      <h2>Fee Details</h2>
      <v-layout row wrap>
        <v-flex d-flex xs6 order-xs5 offset-sm3>
          <v-layout column>
            <v-flex d-flex xs8>
              <h5>Student:</h5>
              <h3>{{ student_name }}</h3>
              <h5>Reg/Adm/Sch No</h5>
              <h3>{{ student_erp_id }}</h3>
              <h5>Parent</h5>
              <h3>{{ parent}}</h3>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-flex d-flex xs6 order-xs7 offset-sm3>
        <v-data-table
          :headers="headers"
          :items="heads"
          class="elevation-1"
          hide-actions="true"
          loading="true"
        >
          <template slot="items" slot-scope="props">
            <tr @click="showAlert(props.item)">
              <td class="text-xs-left">{{ props.item.head }}</td>
              <td class="text-xs-left">{{ props.item.amount }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>

      <v-flex d-flex xs6 order-xs7 offset-sm3>
        <v-form>
          <v-container fluid>
            <v-layout row wrap>
              <v-flex xs2 sm6 md3>
                <v-text-field label="Due this term" v-model="due_this_term" disabled="true"></v-text-field>
              </v-flex>
              <v-flex d-flex xs2 sm6 md3>
                <v-text-field label="Previous Due" v-model="previous_due" disabled="true"></v-text-field>
              </v-flex>
              <v-flex xs3 sm6 md3>
                <v-text-field label="Delay" v-model="delay" disabled="true"></v-text-field>
              </v-flex>
              <v-flex xs3 sm6 md3>
                <v-text-field label="Fine" v-model="late_fee" v-on:focus="dismiss()"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs3 sm6 md3>
                <v-text-field label="Discount" v-model="discount" v-on:focus="dismiss()"></v-text-field>
              </v-flex>
              <v-flex xs3 sm6 md3>
                <v-text-field label="Net Payable" v-model="net_payable" disabled="true"></v-text-field>
              </v-flex>
              <v-flex xs3 sm6 md3>
                <v-text-field label="Actual Paid" v-model="actual_paid" v-on:focus="dismiss()"></v-text-field>
              </v-flex>
              <v-flex xs3 sm6 md3>
                <v-text-field label="Remaining Balance" v-model="balance" disabled="true"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-radio-group v-model="payment_mode" @click="dismiss()" row>
                <v-radio label="Cash" value="cash"></v-radio>
                <v-radio label="Cheque" value="cheque"></v-radio>
                <v-radio label="Card" value="card"></v-radio>
              </v-radio-group>

              <v-flex xs3 sm6 md3>
                <v-text-field label="Cheque No" v-model="cheque_no" v-on:focus="dismiss()"></v-text-field>
              </v-flex>
              <v-flex xs3 sm6 md3>
                <v-text-field label="Bank" v-model="bank" v-on:focus="dismiss()"></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-btn color="success" @click="validate_fee">Accept Fee</v-btn>
            </v-layout>
            <v-alert :value="showDismissibleAlert" :type="alert_type">{{ alert_message }}</v-alert>
          </v-container>
        </v-form>
      </v-flex>

      <v-dialog v-model="confirm" persistent max-width="360">
        <v-card>
          <v-card-title class="headline">{{ caption }}</v-card-title>
          <v-card-text>{{ alert_message }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click="process_fee()">OK</v-btn>
            <v-btn color="green darken-1" flat="flat" @click="confirm = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "FeePayment",
  data() {
    return {
      school_id: "",
      student_id: "",
      student_erp_id: "",
      student_name: "",
      parent: "",
      alert_message: "",
      heads: [],
      headers: [
        {
          text: "Head",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "Amount", value: "reg_no" }
      ],
      due_this_term: 0.0,
      previous_due: 0.0,
      delay: "No Delay",
      late_fee: 0.0,
      discount: 0.0,
      actual_paid: 0.0,
      payment_mode: "",
      cheque_no: "N/A",
      bank: "N/A",
      showDismissibleAlert: false,
      alert_type: "error",
      confirm: false,
      caption: ""
    };
  },
  computed: {
    net_payable: function() {
      let self = this;
      return (
        this.due_this_term +
        eval(self.late_fee) +
        eval(this.previous_due) -
        this.discount
      );
    },
    balance: function() {
      return this.net_payable - this.actual_paid;
    }
  },
  mounted: function() {
    let self = this;
    let school_id = this.$store.getters.get_school_id;
    let student_id = this.$store.getters.get_student_id;
    this.student_name = this.$store.getters.get_student_name;
    this.parent = this.$store.getters.get_parent;
    let ip = this.$store.getters.get_server_ip;
    let url = ip.concat("/erp/fee_payment/", school_id, "/", student_id, "/");
    axios
      .get(url)
      .then(function(response) {
        // handle success
        //self.class_list = response.data;
        self.student_erp_id = response.data["reg_no"];
        var i;
        for (i = 0; i < response.data["heads"].length; i++) {
          var head = {};
          head["head"] = response.data["heads"][i]["head"];
          head["amount"] = response.data["heads"][i]["amount"];
          self.heads.push(head);
        }
        self.due_this_term = response.data["Due this term"];
        self.previous_due = response.data["Previous Outstanding"];
        self.delay =
          response.data["Days Delay"] +
          " Days/" +
          response.data["Weeks Delay"] +
          " Weeks";
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  },
  methods: {
    validate_fee() {
      if (this.actual_paid == 0.0) {
        this.alert_message = "Please enter actual fees paid";
        this.showDismissibleAlert = true;
        return;
      }
      if (this.payment_mode == "") {
        this.alert_message = "Please select a Payment mode";
        this.showDismissibleAlert = true;
        return;
      }
      if (this.payment_mode == "cheque") {
        console.log("payment mode cheque");
        if (this.cheque_no == "N/A" || this.cheque_no == "") {
          this.cheque_no = "";
          this.alert_message = "Please enter cheque number";
          this.showDismissibleAlert = true;
          return;
        }
        if (this.bank == "N/A" || this.bank == "") {
          this.bank = "";
          this.alert_message = "Please enter Bank Name";
          this.showDismissibleAlert = true;
          return;
        }
      }
      // short fee case
      if (this.actual_paid < this.net_payable) {
        console.log("short fee case");
        let difference = this.balance;
        this.caption = "Short Fees Alert";
        this.alert_message =
          "Fees paid is less than Net payable by " + difference;
        this.alert_message +=
          ". This will be added to the Balance. Do you want to proceed?";
        this.confirm = true;
      }
      // excess fee case
      if (this.actual_paid > this.net_payable) {
        console.log("excess fee case");
        let difference = this.actual_paid - this.net_payable;
        this.caption = "Excess Fees Alert";
        this.alert_message =
          "Fees paid is more than Net payable by " + difference;
        this.alert_message +=
          ". This will be adjusted in future payments. Do you want to proceed?";
        this.confirm = true;
      }
      // no issues, accept fee
      if (this.actual_paid == this.net_payable) {
        this.process_fee();
      }
    },
    process_fee() {
      let self = this;
      console.log("inside process fees");
      this.confirm = false;
      let ip = this.$store.getters.get_server_ip;
      let school_id = this.$store.getters.get_school_id;
      let url = ip.concat("/erp/process_fee/", school_id, "/");

      axios
        .post(url, {
          reg_no: this.student_erp_id,
          amount: this.actual_paid,
          fine: this.late_fee,
          discount: this.discount,
          balance: this.balance,
          previous_due: this.previous_due,
          mode: this.payment_mode,
          cheque_no: this.cheque_no,
          bank: this.bank
        })
        .then(function(response) {
          console.log(response);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          var file_name = self.student_name + " (" + self.student_erp_id + ")"
          file_name += "_fee_receipt.pdf"
          link.setAttribute("download", file_name); //or any other extension
          document.body.appendChild(link);
          link.click();
          // if (response.data["status"] == "success") {
          //   self.alert_message = response.data["message"];
          //   self.showDismissibleAlert = true;
          //   self.alert_type = "success"
          // } else {
          //   self.alert_message = response.data["message"];
          //   self.showDismissibleAlert = true;
          //   self.alert_type = "error"
          // }
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {
          // always executed
        });
    },
    dismiss() {
      this.showDismissibleAlert = false;
    }
  }
};
</script>