<template>
  <v-app class="mt-n12 pt-n12">
    <div id="app">
      <v-app-bar
        app
        class="my-toolbar"
        color="light-green"
        v-if="get_logged_status"
        :fixed="toolbar.fixed"
        :clipped-left="toolbar.clippedLeft"
      >
        <v-app-bar-nav-icon :disabled="!get_logged_status" @click.stop="toggleDrawer"></v-app-bar-nav-icon>
        <v-toolbar-title>{{ get_title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-chip color="indigo" large class="ma-1" text-color="white">
            <v-avatar>
              <v-icon>account_circle</v-icon>
            </v-avatar>
            {{ get_user_name }}
          </v-chip>
          <v-btn text :disabled="!get_logged_status" v-on:click="logout()">Log Out</v-btn>
        </v-toolbar-items>
      </v-app-bar>
      <v-navigation-drawer
        app
        v-if="get_logged_status"
        :width="325"
        :clipped="drawer.clipped"
        :fixed="drawer.fixed"
        :permanent="drawer.permanent"
        :mini-variant="drawer.mini"
        v-model="drawer.open"
      >
        <v-list class="text-left" nav rounded>
          <v-list-item color="purple">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
          <v-divider dark class="mx-4"></v-divider>
          <v-list-group v-show="get_user_type === 'school_admin'" prepend-icon value="true" color="#283593">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>mdi-message</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Communications</v-list-item-title>
            </template>
            <v-list-item
              v-for="item in communication_items"
              :key="item.title"
              v-on:click="item.action"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-divider class="mx-4"></v-divider>
          <v-list-group v-show="get_user_type == 'school_admin'" prepend-icon value="true" color="#9575CD">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>mdi-timetable</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Time Table & Arrangement </v-list-item-title>
            </template>
            <v-list-item
              v-for="item in time_table_items"
              :key="item.title"
              v-on:click="item.action"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-divider class="mx-4"></v-divider>
          <v-list-group v-show="get_user_type == 'school_admin'" prepend-icon value="true" color="#795548">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>mdi-teach</v-icon>
              </v-list-item-icon>
              <v-list-item>
                <v-list-item-title>Teacher Management</v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item
              v-for="item in teacher_management_items"
              :key="item.title"
              v-on:click="item.action"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-divider class="mx-4"></v-divider>
          <v-list-group v-show="get_user_type == 'school_admin'" prepend-icon value="true" color="#1A237E">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>mdi-school</v-icon>
              </v-list-item-icon>
              <v-list-item>
                <v-list-item-title>Student Management</v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item
              v-for="item in student_management_items"
              :key="item.title"
              v-on:click="item.action"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-divider class="mx-4"></v-divider>
          <v-list-group v-show="get_user_type == 'school_admin'" prepend-icon value="true" color="purple">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>mdi-ab-testing</v-icon>
              </v-list-item-icon>
              <v-list-item>
                <v-list-item-title>Exam & Results</v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item v-for="item in exam_items" :key="item.title" v-on:click="item.action">
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-divider class="mx-4"></v-divider>
          <v-list-group v-show="get_user_type == 'school_admin'" prepend-icon value="true" color="teal">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>mdi-currency-inr</v-icon>
              </v-list-item-icon>
              <v-list-item>
                <v-list-item-title>Fees Management</v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item v-for="item in fee_items" :key="item.title" v-on:click="item.action">
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-divider class="mx-4"></v-divider>
          <v-list-group v-if="get_user_type == 'non_admin'" prepend-icon value="true" color="blue">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>mdi-teach</v-icon>
              </v-list-item-icon>
              <v-list-item>
                <v-list-item-title>Teacher's Corner</v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item v-for="item in teacher_menu" :key="item.title" v-on:click="item.action">
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
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
import { mapGetters } from "vuex";
import HelloWorld from "@/components/Common/HelloWorld";
export default {
  name: "App",
  components: {
    hello: HelloWorld
  },
  data() {
    return {
      user_type: "",
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
          icon: "mdi-bullhorn",
          title: "Send Bulk Message",
          action: this.bulk_message
        },
        {
          icon: "mdi-cloud-download",
          title: "Download Monthly Communication Report",
          action: this.monthly_communication
        },
        {
          icon: "mdi-cloud-download-outline",
          title: "Download Parent Communication Report",
          action: this.parent_communication
        }
      ],
      time_table_items: [
        {
          icon: "mdi-table-edit",
          title: "Setup Time Table",
          action: this.setup_time_table
        },
        {
          icon: "mdi-alpha-p-circle",
          title: "Teacher Attendance",
          action: this.teacher_attendance
        },
      ],
      teacher_management_items: [
        {
          icon: "mdi-account-plus-outline",
          title: "Add Teacher",
          action: this.add_teacher
        },
        {
          icon: "mdi-account-edit-outline",
          title: "Update Teacher",
          action: this.update_teacher
        },
        {
          icon: "mdi-google-classroom",
          title: "Set Class Teacher",
          action: this.set_class_teacher
        },
        {
          icon: "mdi-account-remove-outline",
          title: "Delete Teacher",
          action: this.delete_teacher
        }
      ],
      student_management_items: [
        {
          icon: "mdi-account-plus",
          title: "Add Student",
          action: this.add_student
        },
        {
          icon: "mdi-account-edit",
          title: "Update Student",
          action: this.update_student
        },
        {
          icon: "mdi-account-remove",
          title: "Delete Student",
          action: this.delete_student
        },
        {
          icon: "mdi-file-download",
          title: "Download Student List",
          action: this.download_student_list
        }
      ],
      exam_items: [
        {
          icon: "mdi-calendar-alert",
          title: "Unscheduled Test Report",
          action: this.unscheduled_test_report
        },
        {
          icon: "mdi-chart-histogram",
          title: "Result Analysis Sheets",
          action: this.class_search
        },
        {
          icon: "mdi-arrow-up-down-bold",
          title: "Student Promote/Detain",
          action: this.exam_results
        },
        {
          icon: "mdi-alpha-m-box",
          title: "Mark Sheets",
          action: this.mark_sheet
        },
        {
          icon: "mdi-chart-line",
          title: "Performance Sheets",
          action: this.performance_analysis
        }
      ],
      fee_items: [
        {
          icon: "mdi-transfer-right",
          title: "Take Fee",
          action: this.student_search
        },
        {
          icon: "mdi-cancel",
          title: "Cancel Fee",
          action: this.correction
        },
        {
          icon: "mdi-file-remove",
          title: "Defaulter Report",
          action: this.defaulter_report
        }
      ],
      teacher_menu: [
        {
          icon: "mdi-alpha-p-circle-outline",
          title: "Conduct Attendance",
          action: this.student_attendance
        },
        {
          icon: "mdi-download",
          title: "Download Monthly Attendance",
          action: this.class_monthly_attendance
        },
        {
          icon: "mdi-message-alert-outline",
          title: "Communicate with Parents",
          action: this.communicate_with_parents
        },
        {
          icon: "mdi-message-text-clock",
          title: "Message History",
          action: this.teacher_message_history
        },
        {
          icon: "mdi-timetable",
          title: "Schedule Test",
          action: this.schedule_test
        },
        {
          icon: "mdi-marker",
          title: "Test Marks Entry",
          action: this.test_marks_entry
        }
      ],
      right: null
    };
  },
 
  mounted: function() {
    let self = this;

    self.user_type = this.$store.getters.get_user_type;
    console.log("user_type = " + self.user_type);
  },
  beforeUpdate: function () {
    self.user_type = this.$store.getters.get_user_type;
    console.log("user_type = " + self.user_type);
  },
  updated: function() {
    self.user_type = this.$store.getters.get_user_type;
    console.log("user_type = " + self.user_type);
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
    unscheduled_test_report() {
      this.$store.dispatch("set_coming_status", "unscheduled_test_report");
      this.$router.replace("/unscheduled_test_report");
    },
    teacher_attendance()  {
      this.$store.dispatch("set_coming_status", "teacher_attendance");
      this.$router.replace("/teacher_attendance");
    },
    setup_time_table()  {
      this.$store.dispatch("set_coming_status", "setup_time_table");
      this.$router.replace("/setup_time_table");
    },
    delete_teacher() {
      this.$store.dispatch("set_coming_status", "delete_teacher");
      this.$router.replace("/delete_teacher");
      
    },
    set_class_teacher() {
      this.$store.dispatch("set_coming_status", "set_class_teacher");
      this.$router.replace("/set_class_teacher");
    },
    update_teacher() {
      this.$store.dispatch("set_coming_status", "update_teacher");
      this.$router.replace("/update_teacher");
    },
    add_teacher() {
      this.$store.dispatch("set_coming_status", "add_teacher");
      this.$router.replace("/add_teacher");
    },
    teacher_message_history() {
      this.$store.dispatch("set_coming_status", "teacher_message_history");
      this.$router.replace("/teacher_message_history");
    },
    parent_communication() {
      this.$store.dispatch("set_coming_status", "parent_communication");
      this.$router.replace("/parent_communication");
    },
    monthly_communication() {
      this.$store.dispatch("set_coming_status", "monthly_communication");
      this.$router.replace("/monthly_communication");
    },
    schedule_test() {
      this.$store.dispatch("set_coming_status", "schedule_test");
      this.$router.replace("/schedule_test");
    },
    student_attendance() {
      this.$store.dispatch("set_coming_status", "class_attendance");
      this.$router.replace("/student_attendance");
    },
    communicate_with_parents() {
      this.$store.dispatch("set_coming_status", "send_message_to_parents");
      this.$router.replace("/send_message_to_parents");
    },
    test_marks_entry() {
      this.$store.dispatch("set_coming_status", "show_test_list");
      this.$router.replace("/show_test_list");
    },
    class_monthly_attendance() {
      this.$store.dispatch("set_coming_status", "class_monthly_attendance");
      this.$router.replace("/class_monthly_attendance");
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
    exam_results() {
      this.$store.dispatch("set_coming_status", "exam_results");
      this.$router.replace("/exam_results");
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
    delete_student()  {
      this.$store.dispatch("set_coming_status", "delete_student");
      this.$router.replace("/student_search")
    },
    download_student_list() {
      this.$store.dispatch("set_coming_status", "download_student_list");
      this.$router.replace("/download_student_list");
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
    ...mapGetters("user_type", ["school_admin", "non_admin"]),
    get_title() {
      return this.$store.getters.get_school_name;
    },
    get_user_name() {
      return this.$store.getters.get_user_name;
    },
    get_logged_status() {
      return this.$store.getters.get_logged_status;
    },
    get_user_type() {
      return this.$store.getters.get_user_type;
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
