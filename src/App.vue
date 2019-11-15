<template>
  <v-app>
    <div id="app">
      <v-toolbar
        app
        class="my-toolbar"
        v-if="get_logged_status"
        :fixed="toolbar.fixed"
        :clipped-left="toolbar.clippedLeft"
      >
        <v-toolbar-side-icon :disabled="!get_logged_status" @click.stop="toggleDrawer"></v-toolbar-side-icon>
        <v-toolbar-title>{{ get_title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-chip color="indigo" text-color="white">
            <v-avatar>
              <v-icon>account_circle</v-icon>
            </v-avatar>
            {{ get_user_name }}
          </v-chip>
          <v-btn flat :disabled="!get_logged_status" v-on:click="logout()">Log Out</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-navigation-drawer
        app
        v-if="get_logged_status"
        :clipped="drawer.clipped"
        :fixed="drawer.fixed"
        :permanent="drawer.permanent"
        :mini-variant="drawer.mini"
        v-model="drawer.open"
      >
        <v-divider></v-divider>`
        <v-list dense class="pt-0">
          <v-list-group prepend-icon value="true">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Communications & Messaging</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-tile
              v-for="item in communication_items"
              :key="item.title"
              v-on:click="item.action"
            >
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-group prepend-icon value="true">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Student Management</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-tile
              v-for="item in student_management_items"
              :key="item.title"
              v-on:click="item.action"
            >
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-group prepend-icon value="true">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Exam & Results</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-tile v-for="item in exam_items" :key="item.title" v-on:click="item.action">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-group prepend-icon value="true">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Fees Management</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-tile v-for="item in fee_items" :key="item.title" v-on:click="item.action">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-group prepend-icon value="true">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>Reports</v-list-tile-title>
              </v-list-tile>
            </template>
            <v-list-tile v-for="item in report_items" :key="item.title" v-on:click="item.action">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>
      <template>
        <div class="text-xs-center">
          <v-progress-circular v-if="waiting" :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
        </div>
      </template>
      <div v-if="get_logged_status === false">
        <hello></hello>
      </div>

      <v-footer app :fixed="footer.fixed" :clipped-left="footer.clippedLeft">
        <span class="caption mx-3">&copy; 2019, EmergeTech Mobile Products & Services Pvt Ltd</span>
      </v-footer>
      <router-view />
    </div>
  </v-app>
</template>

<script>
import axios from "axios";
import HelloWorld from "@/components/Common/HelloWorld";
export default {
  name: "App",
  components: {
    hello: HelloWorld
  },
  data() {
    return {
      waiting: false,
      drawer: {
        open: true,
        clipped: false,
        fixed: false,
        permanent: false,
        mini: false
      },
      toolbar: {
        fixed: true,
        clippedLeft: false
      },
      footer: {
        fixed: true,
        clippedLeft: true
      },
      communication_items: [
        {
          title: "Send Bulk Message",
          action: this.bulk_message
        },
        {
          title: "Download Monthly Communication Report",
          action: this.monthly_communication
        },
        {
          title: "Download Parent Communication Report",
          action: this.parent_communication
        }
      ],
      student_management_items: [
        {
          title: "Add Student",
          action: this.add_student
        },
        {
          title: "Update Student",
          action: this.update_student
        }
      ],
      exam_items: [
        {
          title: "Result Analysis Sheets",
          action: this.class_search
        },
        {
          title: "Download Mark Sheets",
          action: this.mark_sheet
        },
        {
          title: "Download Performance Sheets",
          action: this.performance_analysis
        }
      ],
      fee_items: [
        {
          title: "Take Fee",
          action: this.student_search
        },
        {
          title: "Cancel Fee",
          action: this.correction
        },
        {
          title: "Defaulter Report",
          action: this.defaulter_report
        }
      ],
      report_items: [
        {
          title: "Monthly Attendance of Class"
        }
      ],
      right: null
    };
  },
  methods: {
    toggleDrawer() {
      if (this.drawer.permanent) {
        this.drawer.permanent = !this.drawer.permanent;
        this.drawer.clipped = true;
        this.toolbar.clippedLeft = true;
      } else {
        this.drawer.open = !this.drawer.open;
      }
    },
    logout() {
      this.drawer.open = false;
      this.$store.dispatch("set_logged_status", false);
      this.$store.dispatch("set_user", "unknown");
      this.$store.dispatch("set_user_type", "unknown");
      this.$store.dispatch("set_school_name", "ClassUp");
      this.$store.dispatch("set_id", 0);
      this.$router.replace("/");
    },
    bulk_message() {
      this.$store.dispatch("set_coming_status", "bulk_sms");
      this.$router.replace("/bulk_sms");
    },
    class_search() {
      this.$store.dispatch("set_coming_status", "class_search");
      this.$router.replace("/class_search");
    },
    mark_sheet() {
      this.$store.dispatch("set_coming_status", "mark_sheet");
      this.$router.replace("/mark_sheet");
    },
    performance_analysis() {
      this.$store.dispatch("set_coming_status", "performance_analysis");
      this.$router.replace("/performance_analysis");
    },
    student_search() {
      this.$store.dispatch("set_coming_status", "fee_payment");
      this.$router.replace("/student_search");
    },
    add_student() {
      this.$store.dispatch("set_coming_status", "add_student");
      this.$router.replace("/add_student");
    },
    update_student() {
      this.$store.dispatch("set_coming_status", "update_student");
      this.$router.replace("/student_search");
    },
    defaulter_report() {
      let self = this;
      alert("Report will be downloaded. This can take some time");
      self.waiting = true;
      let ip = this.$store.getters.get_server_ip;
      let school_id = this.$store.getters.get_school_id;
      let url = ip.concat("/fee_processing/defaulter_list/", school_id, "/");
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
          var file_name = "fee_defaulter_report.xlsx";
          link.setAttribute("download", file_name); //or any other extension
          document.body.appendChild(link);
          link.click();
          self.waiting = false;
          confirm("Fee Defaulter Report downloaded");
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {
          // always executed
        });
    },
    correction() {
      this.$store.dispatch("set_coming_status", "correction");
      this.$router.replace("/student_search");
    }
  },

  computed: {
    get_title() {
      return this.$store.getters.get_school_name;
    },
    get_user_name() {
      return this.$store.getters.get_user_name;
    },
    get_logged_status() {
      return this.$store.getters.get_logged_status;
    }
  }
};
</script>

<style lang="stylus" scoped>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.v-progress-circular {
  margin: 1rem;
}
</style>
