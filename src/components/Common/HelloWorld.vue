<template >
  <!-- descriprion -->
  <v-app id="hello">
    <div class="hello">
      <v-content>
        <v-container>
          <v-form v-if="show_it">
            <v-layout align-center justify-center>
              <v-flex xs12 sm8 md4>
                <img
                  src="https://classup2.s3.us-east-2.amazonaws.com/static/prod/images/ClassUp_mobile_logo.png"
                />
                <h1>{{ msg }}</h1>
                <h2>Please Login</h2>
                <v-card class="elevation-12">
                  <v-card-text>
                    <v-form>
                      <v-text-field
                        prepend-icon="person"
                        v-model="input.user"
                        v-on:focus="dismiss()"
                        label="Login"
                        type="text"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="lock"
                        v-model="input.password"
                        v-on:focus="dismiss()"
                        label="Password"
                        id="password"
                        type="password"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-on:click="login()">Login</v-btn>
                  </v-card-actions>
                </v-card>
                <v-alert :value="showDismissibleAlert" :type="alert_type">{{ alert_message }}</v-alert>
              </v-flex>
            </v-layout>
          </v-form>
          <v-form v-if="parent_user">
            <v-layout align-center justify-center>
              <v-flex xs12 sm8 md4>
                <h2>Please Choose Ward</h2>
                <v-card class="elevation-12">
                  <v-card-text>
                    <v-form>
                      <v-text-field
                        prepend-icon="person"
                        v-model="input.user"
                        v-on:focus="dismiss()"
                        label="Login"
                        type="text"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="lock"
                        v-model="input.password"
                        v-on:focus="dismiss()"
                        label="Password"
                        id="password"
                        type="password"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-on:click="login()">Login</v-btn>
                  </v-card-actions>
                </v-card>
                <v-alert :value="showDismissibleAlert" :type="alert_type">{{ alert_message }}</v-alert>
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to ClassUp",
      input: {
        user: "",
        password: ""
      },
      show_it: true,
      parent_user: false,
      alert_color: "red",
      alert_type: "",
      alert_message: "",
      response: "",
      showDismissibleAlert: false
    };
  },
  methods: {
    dismiss() {
      this.showDismissibleAlert = false;
    },

    login() {
      if (this.input.user != "" && this.input.password != "") {
        console.log("username and password have been specified");
        let ip = this.$store.getters.get_server_ip;
        console.log(ip);
        let url = ip.concat("/auth/login/");
        axios({
          method: "POST",
          url: url,
          data: this.input
        }).then(
          result => {
            this.response = result.data;
            console.log(this.response);

            if (result.data["outcome"] == "success") {
              this.show_it = false;
              this.alert_type = "success";
              this.showDismissibleAlert = true;
              this.alert_message = result.data["message"];
              this.$store.dispatch("set_logged_status", true);
              this.$store.dispatch("set_user", this.input.user);
              this.$store.dispatch("set_user_name", result.data["user_name"]);

              let user_type = result.data["user_type"];
              console.log("user_type = ", user_type);
              this.$store.dispatch("set_user_type", user_type);
              this.$store.dispatch(
                "set_school_name",
                result.data["school_name"]
              );
              this.$store.dispatch("set_id", result.data["school_id"]);
              if (user_type == "parent") {
                this.parent_user = true;
                this.$store.dispatch("set_ward_selected", false);
              }
              else  {
                this.parent_user = false;
                this.$router.push("/dashboard");
              }
              
            } else {
              this.showDismissibleAlert = true;
              this.alert_message = result.data["message"];
              this.alert_type = "error";
              this.$store.dispatch("set_logged_status", false);
              this.$store.dispatch("set_user", "unknown");
              this.$store.dispatch("set_user_name", "");
              this.$store.dispatch("set_user_type", "unknown");
              this.$store.dispatch("set_school_name", "ClassUp");
              this.$store.dispatch("set_id", 0);
            }
          },
          error => {
            this.alert_type = "error";
            this.alert_message = "an error occured in contacting the server";
            console.log(this.alert_message);
            console.error(error.response);
            this.$emit("authenticated", false);
          }
        );
      } else {
        this.alert_type = "error";
        this.alert_message = "A username and password must be present";
        console.log(this.alert_message);
        this.showDismissibleAlert = true;
        this.dismissCountDown = this.dismissSecs;
      }
    },
    get_logged_status() {
      return this.$store.getters.get_logged_status;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
