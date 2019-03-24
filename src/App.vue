<template>
  <v-app>
    <div id="app">
      <v-toolbar app v-if="get_logged_status" :fixed="toolbar.fixed" :clipped-left="toolbar.clippedLeft">
        <v-toolbar-side-icon 
        :disabled="!get_logged_status" @click.stop="toggleDrawer">
        </v-toolbar-side-icon>
        <v-toolbar-title>{{ get_title }} </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
    <v-chip color="indigo" text-color="white" >
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
        <v-divider></v-divider>
        <v-list dense class="pt-0">
          <v-list-tile v-for="item in items" :key="item.title" v-on:click="item.action">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <hello></hello>

      <v-footer app :fixed="footer.fixed" :clipped-left="footer.clippedLeft">
        <span class="caption mx-3">&copy; 2019, EmergeTech Mobile Products & Services Pvt Ltd</span>
      </v-footer>
      <router-view/>
    </div>
  </v-app>
</template>

<script>
import HelloWorld from '@/components/HelloWorld'
export default {
  name: "App",
  components: {
        hello: HelloWorld
  },
  data() {
    return {
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
      items: [
        { title: "Fees Management", icon: "dashboard", action: this.student_search },
        { title: "About", icon: "question_answer" }
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
      } 
      else {
        this.drawer.open = !this.drawer.open;
      }
    },
    logout()  {
      this.drawer.open = false
      this.$store.dispatch("set_logged_status", false);
      this.$store.dispatch("set_user", "unknown");
      this.$store.dispatch("set_user_type", "unknown");
      this.$store.dispatch("set_school_name", "ClassUp");
      this.$store.dispatch("set_id", 0);
    },
    student_search()  {
      this.$router.replace('/student_search')
    }
  },

  computed: {
    get_title() {
      return this.$store.getters.get_school_name;
    },
    get_user_name() {
      return this.$store.getters.get_user_name
    },
    get_logged_status() {
      return this.$store.getters.get_logged_status;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
