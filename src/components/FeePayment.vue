<template>
  <v-app>
    <v-content class="ma-0 pa-0 ta-0">
      <h2>Fee Details</h2>
      <v-layout row wrap>
        <v-flex d-flex xs6 order-xs5 offset-sm3>
          <v-layout column>
            <v-flex d-flex xs6>
              <h5>Student:</h5>
              <h3>{{ student_name }}</h3>
              <h5>Class:</h5>
              <h3>{{ the_class }}</h3>
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
            <tr @click="click(props.item)">
              <td class="text-xs-left">{{ props.item.head }}</td>
              <td class="text-xs-left">
                <v-edit-dialog 
                  :return-value.sync="props.item.amount" 
                  @save="update_fee(props.item)"
                  large 
                  lazy 
                  persistent
                >
                  <div>{{ props.item.amount }}</div>
                  <template v-slot:input>
                    <div class="mt-3 title">Update Amount</div>
                  </template>
                  <template v-slot:input>
                    <v-text-field
                      v-model="props.item.amount"
                      :disabled="props.item.head !== 'Transportation Fee'"
                      label="Edit"
                      single-line
                      counter
                      autofocus
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </td>
              <td class="text-xs-left">
                <v-edit-dialog
                  :return-value.sync="props.item.discount_perc"
                  @save="apply_discount(props.item)"
                  large
                  lazy
                  persistent
                >
                  <div>{{ props.item.discount_perc }}</div>
                  <template v-slot:input>
                    <div class="mt-3 title">Enter Dicount %</div>
                  </template>
                  <template v-slot:input>
                    <v-text-field
                      v-model="props.item.discount_perc"
                      label="Edit"
                      single-line
                      counter
                      autofocus
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </td>
              <td class="text-xs-left">{{ props.item.discount_amt }}</td>
              <td class="text-xs-left">{{ props.item.net_payable }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>

      <v-flex d-flex xs7 order-xs10 offset-sm3>
        <v-form>
          <v-container fluid>
            <v-layout row wrap>
              <v-flex d-flex xs2 sm6 md2>
                <v-text-field label="Due this Month/Qtr" v-model="due_this_term" disabled="true"></v-text-field>
              </v-flex>
              <v-flex d-flex xs2 sm6 md2>
                <v-text-field label="Previous Due" v-model="previous_due" disabled="true"></v-text-field>
              </v-flex>
              <v-flex d-flex xs2 sm6 md2>
                <v-text-field
                  label="Paid Till Date"
                  v-model="paid_till_date"
                  disabled="true"
                  v-on:focus="dismiss()"
                ></v-text-field>
              </v-flex>
              <v-flex d-flex xs2 sm6 md2>
                <v-text-field label="Delay" v-model="delay" disabled="true"></v-text-field>
              </v-flex>
              <v-flex d-flex xs2 sm6 md2>
                <v-text-field label="Penalty" v-model="late_fee" v-on:focus="dismiss()"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs2 sm6 md2>
                <v-text-field
                  label="Other/One time Charges"
                  v-model="one_time"
                  v-on:focus="dismiss()"
                ></v-text-field>
              </v-flex>
              <v-flex xs2 sm6 md2>
                <v-text-field label="Waivers" v-model="waiver" v-on:focus="dismiss()"></v-text-field>
              </v-flex>
              <v-flex xs2 sm6 md2>
                <v-text-field label="Net Payable" v-model="net_payable" disabled="true"></v-text-field>
              </v-flex>
              <v-flex xs2 sm6 md2>
                <v-text-field label="Actual Paid" v-model="actual_paid" v-on:focus="dismiss()"></v-text-field>
              </v-flex>
              <v-flex xs3 sm6 md2>
                <v-text-field label="Remaining Balance" v-model="balance" disabled="true"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs4 sm4 md6>
                <v-radio-group v-model="payment_mode" @click="dismiss()" row>
                  <v-radio label="Cash" value="cash"></v-radio>
                  <v-radio label="Cheque" value="cheque"></v-radio>
                  <v-radio label="Card" value="card"></v-radio>
                  <v-radio label="Net Banking" value="netbanking"></v-radio>
                </v-radio-group>
              </v-flex>

              <v-flex xs3 sm3 md2>
                <v-text-field label="Cheque No" v-model="cheque_no" v-on:focus="dismiss()"></v-text-field>
              </v-flex>
              <v-flex xs3 sm3 md2>
                <v-text-field label="Bank" v-model="bank" v-on:focus="dismiss()"></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-btn color="success" @click="fee_history">Download Payment History</v-btn>
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
      the_class: "",
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
        { text: "Amount", value: "reg_no" },
        { text: "Discount (%)", value: 0.0 },
        { text: "Dicsount (Amount)", value: 0.0 },
        { text: "Net payable", value: 0.0 }
      ],
      due_till_now: 0.0,
      transport_fee: 0.0,
      paid_till_date: 0.0,
      dues: 0.0,
      delay: "No Delay",
      late_fee: 0.0,
      one_time: 0.0,
      discount_given: 0.0,
      waiver: 0.0,
      actual_paid: 0.0,
      payment_mode: "",
      cheque_no: "N/A",
      bank: "N/A",
      showDismissibleAlert: false,
      alert_type: "error",
      confirm: false,
      caption: "",
      allow_edit: false,
      max25chars: v => v.length <= 30 || "Input too long!"
    };
  },
  computed: {
    previous_due: function() {
      let self = this;
      return this.dues + eval(this.due_till_now);
    },
    due_this_term: function() {
      let self = this;
      var amt = 0.0;
      console.log(self.heads);
      for (var i = 0; i < self.heads.length; i++) {
        console.log("head value = ", self.heads[i]["head"]);
        if (self.heads[i]["amount"] != "N/A") {
          amt += eval(self.heads[i]["net_payable"]);
        }
      }
      console.log("amount as computed = ", amt);
      return amt;
    },
    net_payable: function() {
      let self = this;
      return (
        this.due_this_term +
        eval(self.late_fee) +
        eval(self.one_time) +
        eval(this.previous_due) -
        this.waiver -
        this.paid_till_date
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
    let url = ip.concat("/fee_processing/fee_details/");
    axios
      .get(url, {
        params: {
          school_id: school_id,
          student_id: student_id
        }
      })
      .then(function(response) {
        // handle success
        //self.class_list = response.data;
        self.student_erp_id = response.data["reg_no"];
        self.the_class = response.data["current_class"];
        var i;
        for (i = 0; i < response.data["heads"].length; i++) {
          var head = {};
          if (response.data["heads"][i]["amount"] != "N/A") {
            head["head"] = response.data["heads"][i]["head"];
            head["amount"] = response.data["heads"][i]["amount"];
            head["discount_perc"] = 0.0;
            head["discount_amt"] = 0.0;
            head["net_payable"] = response.data["heads"][i]["amount"];
            self.heads.push(head);
            if (head["head"] == "Transportation Fee") {
              self.transport_fee = head["amount"];
              console.log("transportation fee = ", self.transport_fee);
            }
          }
        }
        self.due_till_now = response.data["Due till now"];
        console.log(self.due_till_now);
        self.dues = response.data["Previous Outstanding"];
        self.paid_till_date = response.data["Paid till date"];
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
    click() {},
    apply_discount(item) {
      console.log("inside apply_discount");
      console.log("discount to be given = ", item.discount_perc);
      const index = this.heads.indexOf(item);
      var original_amt = this.heads[index]["amount"];
      console.log("original amount = ", original_amt);
      let discount = (original_amt * item.discount_perc) / 100.0;
      this.heads[index]["discount_amt"] = discount;
      console.log("discount = ", discount);
      let discounted_amt = original_amt - discount;
      console.log("discounted amount = ", discounted_amt);
      this.heads[index]["net_payable"] = discounted_amt;
      this.discount_given += discount
    },
    update_fee(item)  {
      console.log("inside update_fee");
      const index = this.heads.indexOf(item);
      this.heads[index]["net_payable"] = item.amount

    },
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
        this.caption = "Confirm fee submission";
        this.alert_message = "Are you sure you want to accept this fee? ";
        this.confirm = true;
        //this.process_fee();
      }
    },

    close() {
      console.log("Dialog closed");
    },
    fee_history() {
      let self = this;
      let ip = this.$store.getters.get_server_ip;
      let school_id = this.$store.getters.get_school_id;
      let reg_no = this.student_erp_id
      let url = ip.concat("/fee_processing/fee_history_download/?school_id=", school_id, "&reg_no=", reg_no );
      axios
        .get(url, {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          },
          responseType: "arraybuffer"
        })
        .then(function(response) {
          console.log(response);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          var file_name = self.$store.getters.get_student_name + "_fee_history.xlsx";
          link.setAttribute("download", file_name); //or any other extension
          document.body.appendChild(link);
          link.click();
          self.waiting = false;
          confirm("Fee Payment History Downloaded");
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {
          // always executed
        });
    },
    process_fee() {
      let self = this;
      console.log("inside process fees");
      this.confirm = false;
      let ip = this.$store.getters.get_server_ip;
      let school_id = this.$store.getters.get_school_id;
      let url = ip.concat("/fee_processing/process_fee/", school_id, "/");

      axios
        .post(url, {
          reg_no: this.student_erp_id,
          heads: this.heads,
          due_this_term: this.due_this_term,
          previous_due: this.previous_due,
          fine: this.late_fee,
          one_time: this.one_time,
          discount: this.discount_given,
          waiver: this.waiver,
          net_payable: this.net_payable,
          actual_paid: this.actual_paid,
          balance: this.balance,
          mode: this.payment_mode,
          cheque_no: this.cheque_no,
          bank: this.bank
        })
        .then(function(response) {
          console.log(response);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          var file_name = self.student_name + " (" + self.student_erp_id + ")";
          file_name += "_fee_receipt.pdf";
          link.setAttribute("download", file_name); //or any other extension
          document.body.appendChild(link);
          link.click();
          confirm("Fees successfully deposited");
          self.$router.replace("/student_search");
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