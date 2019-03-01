<template>
  <v-app>
    <v-content>
      <v-form>
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
              <v-select :items="class_list" label="Class/Standard" v-model="the_class" v-on:focus="dismiss()"></v-select>
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
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "StudentSearch",
  data() {
    return {
      loader: null,
      loading: false,
      reg_no: "",
      first_name: "",
      last_name: "",
      the_class: "",
      class_list: [],
      alert_message: "",
      showDismissibleAlert: false
    };
  },
  mounted: function () {
    let self = this
    let school_id = this.$store.getters.get_school_id
    let ip = this.$store.getters.get_server_ip
    let url = ip.concat("/academics/class_list/", school_id, "/")
    axios
          .get(url)
          .then(function(response) {
            // handle success
            self.showDismissibleAlert = true
            self.alert_message = "class list retrievd"
            self.class_list = response.data
            for(var i = 0; i < response.data.length; i++)  {
              self.class_list[i] = response.data[i]["standard"]
            }
            console.log(self.class_list);
          })
          .catch(function(error) {
            // handle error
            console.log(error);
          });
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 3000);

      this.loader = null;
    }
  },
  methods: {
    search() {
      var can_search = true
      if(this.reg_no == "" && this.first_name == "" ){
        this.alert_message = "Search criteria provided is NOT Enough."
        this.showDismissibleAlert = true
        can_search = false
      }
      if(this.first_name != "" && this.reg_no == "" && this.the_class == "")  {
        this.alert_message = "Please specify Class"
        this.showDismissibleAlert = true
        can_search = false
      }
      if (can_search) {
        
      }
      
      console.log(this.reg_no)
    },
    dismiss() {
      this.showDismissibleAlert = false;
    },
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
