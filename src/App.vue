<template>
  <v-app>
    <div id="app">
      <v-toolbar app :fixed="toolbar.fixed" :clipped-left="toolbar.clippedLeft">
        <v-toolbar-side-icon :disabled="!get_logged_status"></v-toolbar-side-icon>
        <v-toolbar-title>{{ get_title }}</v-toolbar-title>
        <v-toolbar-items class="hidden-sm-and-down"></v-toolbar-items>
      </v-toolbar>
      <v-navigation-drawer app v-if="get_logged_status"
        :clipped="drawer.clipped"
        :fixed="drawer.fixed"
        :permanent="drawer.permanent"
        :mini-variant="drawer.mini"
        v-model="drawer.open">
        <v-divider></v-divider>
        <v-list dense class="pt-0">
          <v-list-tile v-for="item in items" :key="item.title">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      
      <v-footer app :fixed="footer.fixed" :clipped-left="footer.clippedLeft">
        <span class="caption mx-3">&copy; 2019, EmergeTech Mobile Products & Services Pvt Ltd</span>
      </v-footer>
      <router-view/>
    </div>
  </v-app>
</template>

<script>
export default {
  name: "App",
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
        { title: "Home", icon: "dashboard" },
        { title: "About", icon: "question_answer" }
      ],
      right: null
    };
  },

  computed: {
    get_title() {
      return this.$store.getters.get_school_name;
    },
    get_logged_status() {
      return this.$store.getters.get_logged_status
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
