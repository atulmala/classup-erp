<template>
  <v-app>
    <v-content>
      <v-form v-if="show_search_criteria">
        <v-container fluid>
          <v-layout row wrap>
            <v-flex xs12 sm6 md3>
              <v-text-field label="Reg/Adm/Sch Number" v-model="reg_no" v-on:focus="dismiss()"></v-text-field>
            </v-flex>

            <v-flex xs12 sm6 md3>
              <v-text-field label="First Name" v-model="first_name" v-on:focus="dismiss()"></v-text-field>
            </v-flex>

            <v-flex xs12 sm6 md3>
              <v-text-field label="Surname/Last Name" v-model="last_name" v-on:focus="dismiss()"></v-text-field>
            </v-flex>

            <v-flex xs12 sm6 md3>
              <v-select
                :items="class_list"
                label="Class/Standard"
                v-model="the_class"
                v-on:focus="dismiss()"
              ></v-select>
            </v-flex>
            <div class="text-xs-center">
              <v-btn
                :loading="loading"
                :disabled="loading"
                color="info"
                @click="loader = 'loading'"
                v-on:click="search()"
              >
                Search
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
            </div>
            <v-alert :value="showDismissibleAlert" :type="alert_type">{{ alert_message }}</v-alert>
          </v-layout>
        </v-container>
      </v-form>
      <v-data-table
        v-if="show_student_list"
        :headers="headers"
        :items="students"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.reg_no }}</td>
          <td class="text-xs-right">{{ props.item.the_clss }}</td>
          <td class="text-xs-right">{{ props.item.parent }}</td>
        </template>
      </v-data-table>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "StudentSearch",
  data() {
    return {
      show_search_criteria: true,
      show_student_list: false,
      loader: null,
      loading: false,
      reg_no: "",
      first_name: "",
      last_name: "",
      the_class: "",
      class_list: [
        {
          'name': 'the_chako',
          'reg_no': '420',
          'parent': 'super chako',
          'the_class': 'IV-C'
        }
      ],
      students: [],
      alert_type: "",
      alert_message: "",
      showDismissibleAlert: false,
      headers: [
        {
          text: "Student Name",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "Reg/Adm/Sch Number", value: "reg_no" },
        { text: "Class", value: "the_class" },
        { text: "Parent", value: "parent" }
      ]
    };
  },
  mounted: function() {
    let self = this;
    let school_id = this.$store.getters.get_school_id;
    let ip = this.$store.getters.get_server_ip;
    let url = ip.concat("/academics/class_list/", school_id, "/");
    axios
      .get(url)
      .then(function(response) {
        // handle success
        self.class_list = response.data;
        for (var i = 0; i < response.data.length; i++) {
          self.class_list[i] = response.data[i]["standard"];
        }
        console.log(self.class_list);
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
            //console.log(response);
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
                console.log(student)
                self.students.push(student);
              }
              console.log(self.students)
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
content_copy
