webpackJsonp([1],{"7zck":function(e,t){},NHnr:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=s("7+uW"),n=s("mtWM"),i=s.n(n),r={name:"HelloWorld",data:function(){return{msg:"Welcome to ClassUp",input:{user:"",password:""},show_it:!0,alert_type:"",alert_message:"",response:"",showDismissibleAlert:!1}},methods:{dismiss:function(){this.showDismissibleAlert=!1},login:function(){var e=this;if(""!=this.input.user&&""!=this.input.password){console.log("username and password have been specified");var t=this.$store.getters.get_server_ip;console.log(t);var s=t.concat("/auth/login/");i()({method:"POST",url:s,data:this.input}).then(function(t){e.response=t.data,console.log(e.response),"success"==t.data.outcome?(e.show_it=!1,e.alert_type="success",e.showDismissibleAlert=!0,e.alert_message=t.data.message,e.$store.dispatch("set_logged_status",!0),e.$store.dispatch("set_user",e.input.user),e.$store.dispatch("set_user_name",t.data.user_name),e.$store.dispatch("set_user_type",t.data.user_type),e.$store.dispatch("set_school_name",t.data.school_name),e.$store.dispatch("set_id",t.data.school_id),e.$router.push("/dashboard")):(e.showDismissibleAlert=!0,e.alert_message=t.data.message,e.alert_type="error",e.$store.dispatch("set_logged_status",!1),e.$store.dispatch("set_user","unknown"),e.$store.dispatch("set_user_name",""),e.$store.dispatch("set_user_type","unknown"),e.$store.dispatch("set_school_name","ClassUp"),e.$store.dispatch("set_id",0))},function(t){e.alert_type="error",e.alert_message="an error occured in contacting the server",console.log(e.alert_message),console.error(t.response),e.$emit("authenticated",!1)})}else this.alert_type="error",this.alert_message="A username and password must be present",console.log(this.alert_message),this.showDismissibleAlert=!0,this.dismissCountDown=this.dismissSecs},get_logged_status:function(){return this.$store.getters.get_logged_status}}},o={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return e.show_it?s("v-app",{attrs:{id:"hello"}},[s("div",{staticClass:"hello"},[s("v-content",[s("v-container",[s("v-layout",{attrs:{"align-center":"","justify-center":""}},[s("v-flex",{attrs:{xs12:"",sm8:"",md4:""}},[s("img",{attrs:{src:"https://storage.cloud.google.com/classup/classup2/static/prod/images/ClassUp_mobile_logo.png?_ga=2.134540216.-83250823.1538650499"}}),e._v(" "),s("h1",[e._v(e._s(e.msg))]),e._v(" "),s("h2",[e._v("Please Login")]),e._v(" "),s("v-card",{staticClass:"elevation-12"},[s("v-card-text",[s("v-form",[s("v-text-field",{attrs:{"prepend-icon":"person",label:"Login",type:"text"},on:{focus:function(t){return e.dismiss()}},model:{value:e.input.user,callback:function(t){e.$set(e.input,"user",t)},expression:"input.user"}}),e._v(" "),s("v-text-field",{attrs:{"prepend-icon":"lock",label:"Password",id:"password",type:"password"},on:{focus:function(t){return e.dismiss()}},model:{value:e.input.password,callback:function(t){e.$set(e.input,"password",t)},expression:"input.password"}})],1)],1),e._v(" "),s("v-card-actions",[s("v-spacer"),e._v(" "),s("v-btn",{on:{click:function(t){return e.login()}}},[e._v("Login")])],1)],1),e._v(" "),s("v-alert",{attrs:{value:e.showDismissibleAlert,type:e.alert_type}},[e._v(e._s(e.alert_message))])],1)],1)],1)],1)],1)]):e._e()},staticRenderFns:[]};var l={name:"App",components:{hello:s("VU/8")(r,o,!1,function(e){s("ZSVR")},"data-v-164bafb0",null).exports},data:function(){return{waiting:!1,drawer:{open:!0,clipped:!1,fixed:!1,permanent:!1,mini:!1},toolbar:{fixed:!0,clippedLeft:!1},footer:{fixed:!0,clippedLeft:!0},fee_items:[{title:"Take Fee",action:this.student_search},{title:"Correction",action:this.correction},{title:"Defaulter Report",action:this.defaulter_report}],report_items:[{title:"Monthly Attendance of Class"}],right:null}},methods:{toggleDrawer:function(){this.drawer.permanent?(this.drawer.permanent=!this.drawer.permanent,this.drawer.clipped=!0,this.toolbar.clippedLeft=!0):this.drawer.open=!this.drawer.open},logout:function(){this.drawer.open=!1,this.$store.dispatch("set_logged_status",!1),this.$store.dispatch("set_user","unknown"),this.$store.dispatch("set_user_type","unknown"),this.$store.dispatch("set_school_name","ClassUp"),this.$store.dispatch("set_id",0),this.$router.replace("/")},student_search:function(){this.$store.dispatch("set_coming_status","fee_payment"),this.$router.replace("/student_search")},defaulter_report:function(){var e=this;alert("Report will be downloaded. This can take some time"),e.waiting=!0;var t=this.$store.getters.get_server_ip,s=this.$store.getters.get_school_id,a=t.concat("/erp/defaulter_list/",s,"/");i.a.get(a,{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},responseType:"arraybuffer"}).then(function(t){console.log(t);var s=window.URL.createObjectURL(new Blob([t.data])),a=document.createElement("a");a.href=s;a.setAttribute("download","fee_defaulter_report.xlsx"),document.body.appendChild(a),a.click(),e.waiting=!1,confirm("Fee Defaulter Report downloaded")}).catch(function(e){console.log(e)}).then(function(){})},correction:function(){this.$store.dispatch("set_coming_status","correction"),this.$router.replace("/student_search")}},computed:{get_title:function(){return this.$store.getters.get_school_name},get_user_name:function(){return this.$store.getters.get_user_name},get_logged_status:function(){return this.$store.getters.get_logged_status}}},_={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("v-app",[s("div",{attrs:{id:"app"}},[e.get_logged_status?s("v-toolbar",{attrs:{app:"",fixed:e.toolbar.fixed,"clipped-left":e.toolbar.clippedLeft}},[s("v-toolbar-side-icon",{attrs:{disabled:!e.get_logged_status},on:{click:function(t){return t.stopPropagation(),e.toggleDrawer(t)}}}),e._v(" "),s("v-toolbar-title",[e._v(e._s(e.get_title))]),e._v(" "),s("v-spacer"),e._v(" "),s("v-toolbar-items",[s("v-chip",{attrs:{color:"indigo","text-color":"white"}},[s("v-avatar",[s("v-icon",[e._v("account_circle")])],1),e._v("\n          "+e._s(e.get_user_name)+"\n        ")],1),e._v(" "),s("v-btn",{attrs:{flat:"",disabled:!e.get_logged_status},on:{click:function(t){return e.logout()}}},[e._v("Log Out")])],1)],1):e._e(),e._v(" "),e.get_logged_status?s("v-navigation-drawer",{attrs:{app:"",clipped:e.drawer.clipped,fixed:e.drawer.fixed,permanent:e.drawer.permanent,"mini-variant":e.drawer.mini},model:{value:e.drawer.open,callback:function(t){e.$set(e.drawer,"open",t)},expression:"drawer.open"}},[s("v-divider"),e._v("`\n      "),s("v-list",{staticClass:"pt-0",attrs:{dense:""}},[s("v-list-group",{attrs:{"prepend-icon":"",value:"true"},scopedSlots:e._u([{key:"activator",fn:function(){return[s("v-list-tile",[s("v-list-tile-title",[e._v("Fees Management")])],1)]},proxy:!0}])},[e._v(" "),e._l(e.fee_items,function(t){return s("v-list-tile",{key:t.title,on:{click:t.action}},[s("v-list-tile-action",[s("v-icon",[e._v(e._s(t.icon))])],1),e._v(" "),s("v-list-tile-content",[s("v-list-tile-title",[e._v(e._s(t.title))])],1)],1)})],2),e._v(" "),s("v-list-group",{attrs:{"prepend-icon":"",value:"true"},scopedSlots:e._u([{key:"activator",fn:function(){return[s("v-list-tile",[s("v-list-tile-title",[e._v("Reports")])],1)]},proxy:!0}])},[e._v(" "),e._l(e.report_items,function(t){return s("v-list-tile",{key:t.title,on:{click:t.action}},[s("v-list-tile-action",[s("v-icon",[e._v(e._s(t.icon))])],1),e._v(" "),s("v-list-tile-content",[s("v-list-tile-title",[e._v(e._s(t.title))])],1)],1)})],2)],1)],1):e._e(),e._v(" "),[s("div",{staticClass:"text-xs-center"},[e.waiting?s("v-progress-circular",{attrs:{size:70,width:7,color:"purple",indeterminate:""}}):e._e()],1)],e._v(" "),s("hello"),e._v(" "),s("v-footer",{attrs:{app:"",fixed:e.footer.fixed,"clipped-left":e.footer.clippedLeft}},[s("span",{staticClass:"caption mx-3"},[e._v("© 2019, EmergeTech Mobile Products & Services Pvt Ltd")])]),e._v(" "),s("router-view")],2)])},staticRenderFns:[]};var c=s("VU/8")(l,_,!1,function(e){s("wrgk")},"data-v-dadd3136",null).exports,d=s("/ocq"),u={render:function(){var e=this.$createElement;return(this._self._c||e)("v-app",{attrs:{id:"dashboard"}})},staticRenderFns:[]},h=s("VU/8")({name:"Dashboard"},u,!1,null,null,null).exports,m=s("zoC0"),p={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("v-app",[s("v-content",{staticClass:"ma-0 pa-0 ta-0"},[s("h2",[e._v("Fee Details")]),e._v(" "),s("v-layout",{attrs:{row:"",wrap:""}},[s("v-flex",{attrs:{"d-flex":"",xs6:"","order-xs5":"","offset-sm3":""}},[s("v-layout",{attrs:{column:""}},[s("v-flex",{attrs:{"d-flex":"",xs6:""}},[s("h5",[e._v("Student:")]),e._v(" "),s("h3",[e._v(e._s(e.student_name))]),e._v(" "),s("h5",[e._v("Class:")]),e._v(" "),s("h3",[e._v(e._s(e.the_class))]),e._v(" "),s("h5",[e._v("Reg/Adm/Sch No")]),e._v(" "),s("h3",[e._v(e._s(e.student_erp_id))]),e._v(" "),s("h5",[e._v("Parent")]),e._v(" "),s("h3",[e._v(e._s(e.parent))])])],1)],1)],1),e._v(" "),s("v-flex",{attrs:{"d-flex":"",xs6:"","order-xs7":"","offset-sm3":""}},[s("v-data-table",{staticClass:"elevation-1",attrs:{headers:e.headers,items:e.heads,"hide-actions":"true",loading:"true"},scopedSlots:e._u([{key:"items",fn:function(t){return[s("tr",{on:{click:function(s){return e.showAlert(t.item)}}},[s("td",{staticClass:"text-xs-left"},[e._v(e._s(t.item.head))]),e._v(" "),s("td",{staticClass:"text-xs-left"},[e._v(e._s(t.item.amount))])])]}}])})],1),e._v(" "),s("v-flex",{attrs:{"d-flex":"",xs7:"","order-xs10":"","offset-sm3":""}},[s("v-form",[s("v-container",{attrs:{fluid:""}},[s("v-layout",{attrs:{row:"",wrap:""}},[s("v-flex",{attrs:{"d-flex":"",xs2:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"Due this Month/Qtr",disabled:"true"},model:{value:e.due_this_term,callback:function(t){e.due_this_term=t},expression:"due_this_term"}})],1),e._v(" "),s("v-flex",{attrs:{"d-flex":"",xs2:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"Previous Due",disabled:"true"},model:{value:e.previous_due,callback:function(t){e.previous_due=t},expression:"previous_due"}})],1),e._v(" "),s("v-flex",{attrs:{"d-flex":"",xs2:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"Paid Till Date",disabled:"true"},on:{focus:function(t){return e.dismiss()}},model:{value:e.paid_till_date,callback:function(t){e.paid_till_date=t},expression:"paid_till_date"}})],1),e._v(" "),s("v-flex",{attrs:{"d-flex":"",xs2:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"Delay",disabled:"true"},model:{value:e.delay,callback:function(t){e.delay=t},expression:"delay"}})],1),e._v(" "),s("v-flex",{attrs:{"d-flex":"",xs2:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"Penalty"},on:{focus:function(t){return e.dismiss()}},model:{value:e.late_fee,callback:function(t){e.late_fee=t},expression:"late_fee"}})],1)],1),e._v(" "),s("v-layout",{attrs:{row:"",wrap:""}},[s("v-flex",{attrs:{xs2:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"Other/One time Charges"},on:{focus:function(t){return e.dismiss()}},model:{value:e.one_time,callback:function(t){e.one_time=t},expression:"one_time"}})],1),e._v(" "),s("v-flex",{attrs:{xs2:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"Discount"},on:{focus:function(t){return e.dismiss()}},model:{value:e.discount,callback:function(t){e.discount=t},expression:"discount"}})],1),e._v(" "),s("v-flex",{attrs:{xs2:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"Net Payable",disabled:"true"},model:{value:e.net_payable,callback:function(t){e.net_payable=t},expression:"net_payable"}})],1),e._v(" "),s("v-flex",{attrs:{xs2:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"Actual Paid"},on:{focus:function(t){return e.dismiss()}},model:{value:e.actual_paid,callback:function(t){e.actual_paid=t},expression:"actual_paid"}})],1),e._v(" "),s("v-flex",{attrs:{xs3:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"Remaining Balance",disabled:"true"},model:{value:e.balance,callback:function(t){e.balance=t},expression:"balance"}})],1)],1),e._v(" "),s("v-layout",{attrs:{row:"",wrap:""}},[s("v-flex",{attrs:{xs4:"",sm3:"",md5:""}},[s("v-radio-group",{attrs:{row:""},on:{click:function(t){return e.dismiss()}},model:{value:e.payment_mode,callback:function(t){e.payment_mode=t},expression:"payment_mode"}},[s("v-radio",{attrs:{label:"Cash",value:"cash"}}),e._v(" "),s("v-radio",{attrs:{label:"Cheque",value:"cheque"}}),e._v(" "),s("v-radio",{attrs:{label:"Card",value:"card"}})],1)],1),e._v(" "),s("v-flex",{attrs:{xs3:"",sm3:"",md2:""}},[s("v-text-field",{attrs:{label:"Cheque No"},on:{focus:function(t){return e.dismiss()}},model:{value:e.cheque_no,callback:function(t){e.cheque_no=t},expression:"cheque_no"}})],1),e._v(" "),s("v-flex",{attrs:{xs3:"",sm3:"",md2:""}},[s("v-text-field",{attrs:{label:"Bank"},on:{focus:function(t){return e.dismiss()}},model:{value:e.bank,callback:function(t){e.bank=t},expression:"bank"}})],1)],1),e._v(" "),s("v-layout",{attrs:{row:"",wrap:""}},[s("v-btn",{attrs:{color:"success"},on:{click:e.validate_fee}},[e._v("Accept Fee")])],1),e._v(" "),s("v-alert",{attrs:{value:e.showDismissibleAlert,type:e.alert_type}},[e._v(e._s(e.alert_message))])],1)],1)],1),e._v(" "),s("v-dialog",{attrs:{persistent:"","max-width":"360"},model:{value:e.confirm,callback:function(t){e.confirm=t},expression:"confirm"}},[s("v-card",[s("v-card-title",{staticClass:"headline"},[e._v(e._s(e.caption))]),e._v(" "),s("v-card-text",[e._v(e._s(e.alert_message))]),e._v(" "),s("v-card-actions",[s("v-spacer"),e._v(" "),s("v-btn",{attrs:{color:"green darken-1",flat:"flat"},on:{click:function(t){return e.process_fee()}}},[e._v("OK")]),e._v(" "),s("v-btn",{attrs:{color:"green darken-1",flat:"flat"},on:{click:function(t){e.confirm=!1}}},[e._v("Cancel")])],1)],1)],1)],1)],1)},staticRenderFns:[]},f=s("VU/8")(m.a,p,!1,null,null,null).exports,v={name:"StudentSearch",data:function(){return{show_search_criteria:!0,show_student_list:!1,loader:null,loading:!1,reg_no:"",first_name:"",last_name:"",the_class:"",class_list:[],students:[],alert_type:"",alert_message:"",showDismissibleAlert:!1,headers:[{text:"Student Name",align:"left",sortable:!1,value:"name"},{text:"Reg/Adm/Sch Number",value:"reg_no"},{text:"Class",value:"the_class"},{text:"Parent",value:"parent"}]}},mounted:function(){var e=this,t=this.$store.getters.get_school_id,s=this.$store.getters.get_server_ip.concat("/academics/class_list/",t,"/");i.a.get(s).then(function(t){e.class_list=t.data;for(var s=0;s<t.data.length;s++)e.class_list[s]=t.data[s].standard;console.log(e.class_list)}).catch(function(e){console.log(e)})},methods:{search:function(){var e=this,t=!0;if(""==this.reg_no&&""==this.first_name&&(this.alert_message="Search criteria provided is NOT Enough.",this.showDismissibleAlert=!0,t=!1),""!=this.first_name&&""==this.reg_no&&""==this.the_class&&(this.alert_message="Please specify Class",this.showDismissibleAlert=!0,t=!1),t){var s=this.$store.getters.get_server_ip,a=this.$store.getters.get_school_id,n=s.concat("/student/list/",a,"/","in_params","/","in_params");i.a.get(n,{params:{reg_no:this.reg_no,first_name:this.first_name,last_name:this.last_name,the_class:this.the_class}}).then(function(t){if(0==t.data.length)e.alert_message="Student not found. Please change the search criteria and try again",e.showDismissibleAlert=!0,e.alert_type="error";else{e.show_search_criteria=!1;for(var s=0;s<t.data.length;s++){var a={};a.reg_no=t.data[s].student_erp_id,a.name=t.data[s].fist_name+" "+t.data[s].last_name,a.the_class=t.data[s].current_class+"-"+t.data[s].current_section,a.parent=t.data[s].parent,a.adm_fee=t.data[s].adm_fee,console.log(a),e.students.push(a)}console.log(e.students),e.show_student_list=!0}}).catch(function(e){console.log(e)}).then(function(){})}console.log(this.reg_no)},dismiss:function(){this.showDismissibleAlert=!1},showAlert:function(e){if(!event.target.classList.contains("btn__content")){var t=this.$store.getters.get_coming_from;if(console.log(t),"fee_payment"==t)confirm("Are you sure you want to process the fees for "+e.name+" ("+e.reg_no+")?")&&(this.$store.dispatch("set_student_id",e.reg_no),this.$store.dispatch("set_student_name",e.name),this.$store.dispatch("set_parent",e.parent),this.$router.replace("/fee_payment"));if("correction"==t)if(confirm("Are you sure you want to do correction for "+e.name+" ("+e.reg_no+")?")){this.$store.dispatch("set_student_id",e.reg_no),this.$store.dispatch("set_student_name",e.name);var s=e.current_class;console.log(s);var a=e.current_section;console.log(a),this.$store.dispatch("set_student_class",e.the_class),this.$store.dispatch("set_parent",e.parent),this.$router.replace("/correction")}}}}},g={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("v-app",[s("v-content",[e.show_search_criteria?s("v-form",[s("v-container",{attrs:{fluid:""}},[s("h2",[e._v("Student Search")]),e._v(" "),s("v-layout",{attrs:{xs4:"",row:"",wrap:"","justify-center":""}},[s("v-flex",{attrs:{xs6:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"Reg/Adm/Sch Number"},on:{focus:function(t){return e.dismiss()}},model:{value:e.reg_no,callback:function(t){e.reg_no=t},expression:"reg_no"}})],1),e._v(" "),s("v-flex",{attrs:{xs6:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"First Name"},on:{focus:function(t){return e.dismiss()}},model:{value:e.first_name,callback:function(t){e.first_name=t},expression:"first_name"}})],1),e._v(" "),s("v-flex",{attrs:{xs6:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"Surname/Last Name"},on:{focus:function(t){return e.dismiss()}},model:{value:e.last_name,callback:function(t){e.last_name=t},expression:"last_name"}})],1),e._v(" "),s("v-flex",{attrs:{xs6:"",sm6:"",md2:""}},[s("v-select",{attrs:{items:e.class_list,label:"Class/Standard"},on:{focus:function(t){return e.dismiss()}},model:{value:e.the_class,callback:function(t){e.the_class=t},expression:"the_class"}})],1)],1),e._v(" "),s("v-layout",{attrs:{xs4:"",row:"",wrap:"","justify-space-around":""}},[s("div",{staticClass:"text-xs-center"},[s("v-btn",{attrs:{loading:e.loading,disabled:e.loading,color:"info"},on:{click:[function(t){e.loader="loading"},function(t){return e.search()}]}},[e._v("\n              Search\n              "),s("span",{staticClass:"custom-loader",attrs:{slot:"loader"},slot:"loader"},[s("v-icon",{attrs:{light:""}},[e._v("cached")])],1)])],1),e._v(" "),s("v-alert",{attrs:{value:e.showDismissibleAlert,type:e.alert_type}},[e._v(e._s(e.alert_message))])],1)],1)],1):e._e(),e._v(" "),s("v-flex",{attrs:{"d-flex":"",xs8:"","order-xs5":"","offset-sm2":""}},[e.show_student_list?s("v-data-table",{staticClass:"elevation-1",attrs:{headers:e.headers,items:e.students},scopedSlots:e._u([{key:"items",fn:function(t){return[s("tr",{on:{click:function(s){return e.showAlert(t.item)}}},[s("td",{staticClass:"text-xs-left"},[e._v(e._s(t.item.name))]),e._v(" "),s("td",{staticClass:"text-xs-left"},[e._v(e._s(t.item.reg_no))]),e._v(" "),s("td",{staticClass:"text-xs-left"},[e._v(e._s(t.item.the_class))]),e._v(" "),s("td",{staticClass:"text-xs-left"},[e._v(e._s(t.item.parent))])])]}}])}):e._e()],1)],1)],1)},staticRenderFns:[]};var x=s("VU/8")(v,g,!1,function(e){s("dU/q")},null,null).exports,b=s("bOdI"),y=s.n(b),w={name:"Correction",data:function(){var e;return e={school_id:"",student_id:"",reg_no:"",the_class:"",student_name:"",parent:"",alert_message:"",show_payment_history:!0,show_payment_details:!1,receipt_corrected:"",penalty:"",one_time:"",discount:"",amount_paid:"",payment_history:[],alert_type:""},y()(e,"alert_message",""),y()(e,"showDismissibleAlert",!1),y()(e,"headers",[{text:"Date",align:"left",sortable:!1,value:"date"},{text:"Receipt Number",value:"receipt_number"},{text:"Amount Paid",value:"amount_paid"}]),e},mounted:function(){var e=this,t=this.$store.getters.get_school_id;this.$store.getters.get_student_id;this.student_name=this.$store.getters.get_student_name,this.parent=this.$store.getters.get_parent,e.reg_no=this.$store.getters.get_student_id,this.the_class=this.$store.getters.get_student_class;var s=this.$store.getters.get_server_ip.concat("/erp/get_fee_history/");i.a.get(s,{params:{school_id:t,reg_no:e.reg_no}}).then(function(t){if(0==t.data.length)e.alert_message="No payment associated with this student could be found.",e.showDismissibleAlert=!0,e.alert_type="error";else{e.show_payment_history=!0,e.show_payment_details=!1;for(var s=0;s<t.data.length;s++){var a={};a.date=t.data[s].date,a.receipt_number=t.data[s].receipt_number,a.amount=t.data[s].amount,a.fine=t.data[s].fine,a.one_time=t.data[s].one_time,a.discount=t.data[s].discount,e.payment_history.push(a)}console.log(e.payment_history)}}).catch(function(e){console.log(e)})},methods:{search:function(){var e=this,t=!0;if(""==this.reg_no&&""==this.first_name&&(this.alert_message="Search criteria provided is NOT Enough.",this.showDismissibleAlert=!0,t=!1),""!=this.first_name&&""==this.reg_no&&""==this.the_class&&(this.alert_message="Please specify Class",this.showDismissibleAlert=!0,t=!1),t){var s=this.$store.getters.get_server_ip,a=this.$store.getters.get_school_id,n=s.concat("/student/list/",a,"/","in_params","/","in_params");i.a.get(n,{params:{reg_no:this.reg_no,first_name:this.first_name,last_name:this.last_name,the_class:this.the_class}}).then(function(t){if(0==t.data.length)e.alert_message="Student not found. Please change the search criteria and try again",e.showDismissibleAlert=!0,e.alert_type="error";else{e.show_search_criteria=!1;for(var s=0;s<t.data.length;s++){var a={};a.reg_no=t.data[s].student_erp_id,a.name=t.data[s].fist_name+" "+t.data[s].last_name,a.the_class=t.data[s].current_class+"-"+t.data[s].current_section,a.parent=t.data[s].parent,a.adm_fee=t.data[s].adm_fee,console.log(a),e.students.push(a)}console.log(e.students),e.show_student_list=!0}}).catch(function(e){console.log(e)}).then(function(){})}console.log(this.reg_no)},dismiss:function(){this.showDismissibleAlert=!1},showAlert:function(e){event.target.classList.contains("btn__content")||confirm("Are you sure you want to do correction for "+e.receipt_number+" (date: "+e.date+", amount: "+e.amount+")?")&&(this.show_payment_history=!1,this.show_payment_details=!0,console.log(e.amount),this.receipt_corrected=e.receipt_number,this.penalty=e.fine,this.one_time=e.one_time,this.discount=e.discount,this.amount_paid=e.amount)},correction:function(){if(confirm("Are you sure you want to apply this correction?")){var e,t=this.$store.getters.get_server_ip,s=this.$store.getters.get_school_id,a=t.concat("/erp/correct_fee/",s,"/");i.a.post(a,(e={receipt_corrected:this.receipt_corrected,penalty:this.penalty,due_this_term:this.due_this_term,one_time:this.one_time,fine:this.late_fee},y()(e,"one_time",this.one_time),y()(e,"discount",this.discount),y()(e,"amount_paid",this.amount_paid),e)).then(function(e){console.log(e),confirm("Fees successfully corrected"),self.$router.replace("/student_search")}).catch(function(e){console.log(e)}).then(function(){})}}}},k={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("v-app",[s("v-container",{attrs:{fluid:""}},[s("v-content",[e.show_payment_history?s("h2",[e._v("Fee Payment History")]):e._e(),e._v(" "),e.show_payment_history?s("v-layout",{attrs:{"justify-center":""}},[s("v-flex",{attrs:{"d-flex":"",xs6:""}},[s("v-layout",{attrs:{column:""}},[s("v-flex",{attrs:{"d-flex":"",xs6:""}},[s("h5",[e._v("Student:")]),e._v(" "),s("h3",[e._v(e._s(e.student_name))]),e._v(" "),s("h5",[e._v("Class:")]),e._v(" "),s("h3",[e._v(e._s(e.the_class))]),e._v(" "),s("h5",[e._v("Reg/Adm/Sch No")]),e._v(" "),s("h3",[e._v(e._s(e.reg_no))]),e._v(" "),s("h5",[e._v("Parent")]),e._v(" "),s("h3",[e._v(e._s(e.parent))])])],1)],1)],1):e._e(),e._v(" "),s("v-layout",{attrs:{"justify-center":""}},[s("v-flex",{attrs:{"d-flex":"",xs6:""}},[e.show_payment_history?s("v-data-table",{staticClass:"elevation-1",attrs:{headers:e.headers,items:e.payment_history},scopedSlots:e._u([{key:"items",fn:function(t){return[s("tr",{on:{click:function(s){return e.showAlert(t.item)}}},[s("td",{staticClass:"text-xs-left"},[e._v(e._s(t.item.date))]),e._v(" "),s("td",{staticClass:"text-xs-left"},[e._v(e._s(t.item.receipt_number))]),e._v(" "),s("td",{staticClass:"text-xs-left"},[e._v(e._s(t.item.amount))]),e._v(" "),s("td",{staticClass:"text-xs-left"},[e._v(e._s(t.item.parent))])])]}}])}):e._e()],1)],1)],1)],1),e._v(" "),s("v-flex",{attrs:{"d-flex":"",xs7:"","order-xs10":"","offset-sm3":""}},[e.show_payment_details?s("v-form",[s("h3",[e._v("Please Correct")]),e._v(" "),s("v-container",{attrs:{fluid:""}},[s("v-layout",{attrs:{row:"",wrap:""}},[s("v-flex",{attrs:{"d-flex":"",xs2:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"Penalty"},model:{value:e.penalty,callback:function(t){e.penalty=t},expression:"penalty"}})],1),e._v(" "),s("v-flex",{attrs:{"d-flex":"",xs2:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"Other/One Time"},model:{value:e.one_time,callback:function(t){e.one_time=t},expression:"one_time"}})],1),e._v(" "),s("v-flex",{attrs:{"d-flex":"",xs2:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"Discount"},on:{focus:function(t){return e.dismiss()}},model:{value:e.discount,callback:function(t){e.discount=t},expression:"discount"}})],1),e._v(" "),s("v-flex",{attrs:{"d-flex":"",xs2:"",sm6:"",md2:""}},[s("v-text-field",{attrs:{label:"Amount Paid"},on:{focus:function(t){return e.dismiss()}},model:{value:e.amount_paid,callback:function(t){e.amount_paid=t},expression:"amount_paid"}})],1)],1),e._v(" "),s("v-layout",{attrs:{row:"",wrap:""}},[s("v-btn",{attrs:{color:"success"},on:{click:e.correction}},[e._v("Update Payment")]),e._v(" "),s("v-btn",{attrs:{color:"success"},on:{click:e.validate_fee}},[e._v("Cancel")])],1),e._v(" "),s("v-alert",{attrs:{value:e.showDismissibleAlert,type:e.alert_type}},[e._v(e._s(e.alert_message))])],1)],1):e._e()],1)],1)},staticRenderFns:[]},S=s("VU/8")(w,k,!1,null,null,null).exports;a.default.use(d.a);var E=new d.a({routes:[{path:"/",name:"App",component:c},{path:"/dashboard",name:"Dashboard",component:h},{path:"/student_search",name:"StudentSearch",component:x},{path:"/fee_payment",name:"FeePayment",component:f},{path:"/correction",name:"Coprrection",component:S}]}),A=s("uUlv");a.default.use(A.a);var D=new A.a.Store({state:{server_ip:"https://www.classupclient.com",logged_status:!1,logged_user:"unknown",user_name:"unknown",user_type:"unknown",school_id:0,student_id:"unknown",student_name:"unknown",student_class:"unknown",parent:"unknown",school_name:"ClassUp",coming_from:"unknown",adm_fee:!1},mutations:{SET_LOGGED_STATUS:function(e,t){e.logged_status=t},SET_USER:function(e,t){e.logged_user=t},SET_USER_NAME:function(e,t){e.user_name=t},SET_USER_TYPE:function(e,t){e.user_type=t},SET_ID:function(e,t){e.school_id=t},SET_SCHOOL_NAME:function(e,t){e.school_name=t},SET_STUDENT_ID:function(e,t){e.student_id=t},SET_STUDENT_NAME:function(e,t){e.student_name=t},SET_STUDENT_CLASS:function(e,t){e.student_class=t},SET_PARENT:function(e,t){e.parent=t},SET_ADM_FEE:function(e,t){e.adm_fee=t},SET_COMING_STATUS:function(e,t){e.coming_from=t}},actions:{set_logged_status:function(e,t){e.commit("SET_LOGGED_STATUS",t)},set_user:function(e,t){e.commit("SET_USER",t)},set_user_name:function(e,t){e.commit("SET_USER_NAME",t)},set_user_type:function(e,t){e.commit("SET_USER_TYPE",t)},set_id:function(e,t){e.commit("SET_ID",t)},set_school_name:function(e,t){e.commit("SET_SCHOOL_NAME",t)},set_student_id:function(e,t){e.commit("SET_STUDENT_ID",t)},set_student_name:function(e,t){e.commit("SET_STUDENT_NAME",t)},set_student_class:function(e,t){e.commit("SET_STUDENT_CLASS",t)},set_parent:function(e,t){e.commit("SET_PARENT",t)},set_adm_fee:function(e,t){e.commit("SET_ADM_FEE",t)},set_coming_status:function(e,t){e.commit("SET_COMING_STATUS",t)}},getters:{get_logged_status:function(e){return e.logged_status},get_logged_user:function(e){return e.logged_user},get_user_name:function(e){return e.user_name},get_user_type:function(e){return e.user_type},get_school_id:function(e){return e.school_id},get_school_name:function(e){return e.school_name},get_server_ip:function(e){return e.server_ip},get_student_id:function(e){return e.student_id},get_student_name:function(e){return e.student_name},get_student_class:function(e){return e.student_class},get_parent:function(e){return e.parent},get_adm_fee:function(e){return e.adm_fee},get_coming_from:function(e){return e.coming_from}}}),$=s("3EgV"),T=s.n($);s("7zck");a.default.use(T.a),a.default.config.productionTip=!1,new a.default({el:"#app",router:E,store:D,components:{App:c},template:"<App/>"})},ZSVR:function(e,t){},"dU/q":function(e,t){},wrgk:function(e,t){},zoC0:function(module,__webpack_exports__,__webpack_require__){"use strict";var __WEBPACK_IMPORTED_MODULE_0_axios__=__webpack_require__("mtWM"),__WEBPACK_IMPORTED_MODULE_0_axios___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);__webpack_exports__.a={name:"FeePayment",data:function(){return{school_id:"",student_id:"",student_erp_id:"",the_class:"",student_name:"",parent:"",alert_message:"",heads:[],headers:[{text:"Head",align:"left",sortable:!1,value:"name"},{text:"Amount",value:"reg_no"}],due_till_now:0,due_this_term:0,paid_till_date:0,dues:0,delay:"No Delay",late_fee:0,one_time:0,discount:0,actual_paid:0,payment_mode:"",cheque_no:"N/A",bank:"N/A",showDismissibleAlert:!1,alert_type:"error",confirm:!1,caption:""}},computed:{previous_due:function previous_due(){var self=this;return this.dues+eval(this.due_till_now)},net_payable:function net_payable(){var self=this;return this.due_this_term+eval(self.late_fee)+eval(self.one_time)+eval(this.previous_due)-this.discount-this.paid_till_date},balance:function(){return this.net_payable-this.actual_paid}},mounted:function(){var e=this,t=this.$store.getters.get_school_id,s=this.$store.getters.get_student_id;this.student_name=this.$store.getters.get_student_name,this.parent=this.$store.getters.get_parent;var a=this.$store.getters.get_server_ip.concat("/erp/fee_details/");__WEBPACK_IMPORTED_MODULE_0_axios___default.a.get(a,{params:{school_id:t,student_id:s}}).then(function(t){var s;for(e.student_erp_id=t.data.reg_no,e.the_class=t.data.current_class,s=0;s<t.data.heads.length;s++){var a={};a.head=t.data.heads[s].head,a.amount=t.data.heads[s].amount,e.heads.push(a)}e.due_till_now=t.data["Due till now"],console.log(e.due_till_now),e.due_this_term=t.data["Due this term"],e.dues=t.data["Previous Outstanding"],e.paid_till_date=t.data["Paid till date"],e.delay=t.data["Days Delay"]+" Days/"+t.data["Weeks Delay"]+" Weeks"}).catch(function(e){console.log(e)})},methods:{validate_fee:function(){if(0==this.actual_paid)return this.alert_message="Please enter actual fees paid",void(this.showDismissibleAlert=!0);if(""==this.payment_mode)return this.alert_message="Please select a Payment mode",void(this.showDismissibleAlert=!0);if("cheque"==this.payment_mode){if(console.log("payment mode cheque"),"N/A"==this.cheque_no||""==this.cheque_no)return this.cheque_no="",this.alert_message="Please enter cheque number",void(this.showDismissibleAlert=!0);if("N/A"==this.bank||""==this.bank)return this.bank="",this.alert_message="Please enter Bank Name",void(this.showDismissibleAlert=!0)}if(this.actual_paid<this.net_payable){console.log("short fee case");var e=this.balance;this.caption="Short Fees Alert",this.alert_message="Fees paid is less than Net payable by "+e,this.alert_message+=". This will be added to the Balance. Do you want to proceed?",this.confirm=!0}if(this.actual_paid>this.net_payable){console.log("excess fee case");var t=this.actual_paid-this.net_payable;this.caption="Excess Fees Alert",this.alert_message="Fees paid is more than Net payable by "+t,this.alert_message+=". This will be adjusted in future payments. Do you want to proceed?",this.confirm=!0}this.actual_paid==this.net_payable&&this.process_fee()},process_fee:function(){var e=this;console.log("inside process fees"),this.confirm=!1;var t=this.$store.getters.get_server_ip,s=this.$store.getters.get_school_id,a=t.concat("/erp/process_fee/",s,"/");__WEBPACK_IMPORTED_MODULE_0_axios___default.a.post(a,{reg_no:this.student_erp_id,heads:this.heads,due_this_term:this.due_this_term,previous_due:this.previous_due,fine:this.late_fee,one_time:this.one_time,discount:this.discount,net_payable:this.net_payable,actual_paid:this.actual_paid,balance:this.balance,mode:this.payment_mode,cheque_no:this.cheque_no,bank:this.bank}).then(function(t){console.log(t);var s=window.URL.createObjectURL(new Blob([t.data])),a=document.createElement("a");a.href=s;var n=e.student_name+" ("+e.student_erp_id+")";n+="_fee_receipt.pdf",a.setAttribute("download",n),document.body.appendChild(a),a.click(),confirm("Fees successfully deposited"),e.$router.replace("/student_search")}).catch(function(e){console.log(e)}).then(function(){})},dismiss:function(){this.showDismissibleAlert=!1}}}}},["NHnr"]);
//# sourceMappingURL=app.790c4f7c660c929af202.js.map