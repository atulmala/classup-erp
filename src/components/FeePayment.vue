<template>
  <v-app>
    <v-content>
      <h3>Fee Details</h3>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  mounted: function() {
    let self = this;
    let school_id = this.$store.getters.get_school_id;
    let student_id = this.$store.getters.get_student_id;
    let ip = this.$store.getters.get_server_ip;
    let url = ip.concat("/erp/fee_payment/", school_id, "/", student_id, "/");
    axios
      .get(url)
      .then(function(response) {
        // handle success
        self.class_list = response.data;
        console.log(response.data["heads"]);

        console.log(self.class_list);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
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
  }
};
</script>