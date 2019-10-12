<template>
  <v-app>
    <v-content>
      <v-form>
        <v-container fluid>
          <h2>Update Student</h2>
          <v-layout xs4 row wrap justify-center>
            <v-flex xs6 sm6 md2>
              <v-text-field label="Reg/Adm/Sch No" v-model="reg_no" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
            <v-flex xs6 sm6 md2>
              <v-text-field label="First Name" v-model="first_name" v-on:focus="dismiss()"></v-text-field>
            </v-flex>

            <v-flex xs6 sm6 md2>
              <v-text-field label="Surname/Last Name" v-model="last_name" v-on:focus="dismiss()"></v-text-field>
            </v-flex>

            <v-flex xs6 sm6 md2>
              <v-select
                :items="class_list"
                label="Class/Standard"
                v-model="the_class"
                v-on:focus="dismiss()"
              ></v-select>
            </v-flex>
            <v-flex xs6 sm6 md2>
              <v-select
                :items="section_list"
                label="Section"
                v-model="section"
                v-on:focus="dismiss()"
              ></v-select>
            </v-flex>
          </v-layout>
          <v-layout xs6 row wrap justify-center>
            <v-flex xs6 sm6 md3 justify-space-between>
              <v-radio-group v-model="gender" @click="dismiss()" row>
                <v-radio label="Male" value="male"></v-radio>
                <v-radio label="Female" value="female"></v-radio>
                <v-radio label="Other" value="other"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs6 sm6 md2 justify-end>
              <v-menu
                lazy
                :close-on-content-click="false"
                v-model="dob_menu"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="Date of Birth(DOB)"
                  v-model="dob"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="dob" title="Date of Birth(DOB)" no-title scrollable actions>
                  <template scope="{ save_dob, cancel_dob }"></template>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs6 sm6 md2>
              <v-text-field label="Adhar No" v-model="adhar" v-on:focus="dismiss()"></v-text-field>
            </v-flex>

            <v-flex xs6 sm6 md2>
              <v-text-field label="Blood Group" v-model="blood_group" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
            <v-flex xs6 sm6 md1>
              <v-text-field label="House" v-model="house" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout xs4 row wrap justify-center>
            <v-flex xs3 sm3 md2>
              <v-text-field label="Father Name" v-model="father_name" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
            <v-flex xs3 sm3 md2>
              <v-text-field label="Email" v-model="email" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
            <v-flex xs3 sm3 md2>
              <v-text-field label="Father Mob" v-model="father_mobile" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
            <v-flex xs3 sm3 md2>
              <v-text-field label="Mother Name" v-model="mother_name" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
            <v-flex xs3 sm3 md2>
              <v-text-field label="Mother Mob" v-model="mother_mobile" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout xs6 row wrap justify-center>
            <v-flex xs6 sm6 md2>
              <v-text-field
                label="Father Occupation"
                v-model="father_occupation"
                v-on:focus="dismiss()"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm6 md2>
              <v-text-field
                label="Mother Occupation"
                v-model="mother_occupation"
                v-on:focus="dismiss()"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm6 md2 justify-space-between>
              <v-radio-group v-model="transport" @click="dismiss()" row>
                <v-radio label="Bus User" value="bus_user"></v-radio>
                <v-radio label="Walker" value="walker"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs6 sm6 md2>
              <v-text-field label="Bus Route" v-model="bus_rout" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
            <v-flex xs6 sm6 md2>
              <v-text-field label="Bus Stop" v-model="bus_stop" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout xs4 row wrap justify-center>
            <v-flex xs6 sm6 md10>
              <v-text-field label="Address" v-model="address" v-on:focus="dismiss()"></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout xs4 row wrap justify-space-around>
            <div class="text-xs-center">
              <v-btn
                :loading="loading"
                :disabled="loading"
                color="info"
                @click="loader = 'loading'"
                v-on:click="validate_entries()"
              >
                Add Student
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
            </div>
          </v-layout>
          <v-alert :value="showDismissibleAlert" :type="alert_type">{{ alert_message }}</v-alert>
        </v-container>
      </v-form>
      <v-dialog v-model="confirm" persistent max-width="360">
        <v-card>
          <v-card-title class="headline">{{ caption }}</v-card-title>
          <v-card-text>{{ alert_message }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click="add_student()">OK</v-btn>
            <v-btn color="green darken-1" flat="flat" @click="confirm = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>