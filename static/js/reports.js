var app3 = new Vue({
  el: '#app',
  template: `
  <div class="grid">
      <div class="row">

         <table class="table table-stripped">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Phone</th>
      <th scope="col">Category</th>
      <th scope="col">Date</th>
      <th scope="col">District</th>
      <th scope="col">Datas</th>
      <th scope="col">Status</th>
      <th scope="col">Comment</th>
      <th scope="col" colspan="2" v-show="can_approve">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="t , index in tickets">
      <th scope="row">{{index+1}}</th>
      <th>{{t.phone_number}}</th>
      <th>{{t.category_display}}</th>
      <th >{{t.date_display}}</th>
      <th >{{t.district_display}}</th>
      <td>
        <div v-for="(v,k) in t.other_properties">
        {{k}} : {{v}}<br>
        </div>
      </td>
      <td>{{t.status}}</td>
      <td>{{t.comment}}</td>
      <td><a v-show="can_approve" @click="approve(t)">Approve</a></td>
      <td><a v-show="can_approve" @click="edit(t)">Edit</a></td>
    </tr>
    </tbody>
    </table>

      </div>



  </div>

  `,

  data: {
    tickets: [],
    ticket: [],
    categories: [],
    category: '',
    phone_number: '',
    comment: '',
    filtered_categories: [],
    show_category_form :false,
    show_categories :false,
    other_properties:{},
    call_type: rare_settings.ticket_type,
    can_approve: rare_settings.can_approve,
  },
  methods:{
      loadDatas: function(){
            var self = this;
            var options = {'call_type': self.call_type};

            function successCallback(response) {
                self.tickets = response.body;
            }

            function errorCallback() {
                console.log('failed');
            }
            self.$http.get('/core/ticket/', {params:  options}).then(successCallback, errorCallback);
      },

        saveTicket : function (){
        var self = this;
        var ticket = {};
        ticket.category = self.category.id;
        if(self.phone_number.length <1){

         new PNotify({
                    title: 'failed',
                    text: 'Phone No Required',
                    type: 'error'
                });
                        return

      }

            let csrf = $('[name = "csrfmiddlewaretoken"]').val();
            let options = {
                headers: {
                    'X-CSRFToken': csrf
                }
            };

            ticket.phone_number = self.phone_number;
            ticket.comment = self.comment;
            ticket.other_properties = self.other_properties;


            function successCallback(response) {
                self.category= '',
                self.phone_number = '',
                self.comment = '',
                self.show_category_form  = false,
                self.show_categories  = false,
                self.other_properties = {},
                self.filtered_categories = [];
                new PNotify({
                    title: 'Ticket Saved',
                    text: 'Ticket ' + response.body.phone_number + ' Saved'
                });


            }
            function successUpdateCallback(response) {
                new PNotify({
                    title: 'ticket Updated',
                    text: 'category ' + response.body.phone_number + ' Updated'
                });
//                var category_index = -1;
//                for(var i=0; i < self.tickets.length; i++){
//                    if(self.tickets[i].id == response.body.id){
//                    category_index = i;
//                    }
//
//                }
//                console.log(category_index);
//                Vue.set(self.tickets, category_index, response.body);

            }

            function errorCallback(response) {
            console.log(response);

                if (response.body.error) {

                new PNotify({
                    title: 'failed',
                    text: response.body.error,
                    type: 'error'
                });

                } else {
                new PNotify({
                    title: 'failed',
                    text: 'Ticket Failed to Save',
                    type: 'error'
                });

                }
            }
            console.log(ticket);

                self.$http.put('/core/ticket/', ticket.id, options).then(successCallback, errorCallback);




      },
      approve : function (t){
        var self = this;
        console.log(t);
      },
      edit : function (t){
        var self = this;
      },


  },


  created() {

      var self = this;
      self.loadDatas();
      self.can_approve = false;
      if(rare_settings.can_approve =="True"){
        self.can_approve = true;
      }

  },
  watch:{
//    category: function (newVal, oldVal) {
//                var self = this;
//                if (newVal) {
//                    Object.keys(newVal.other_properties).forEach(function(key,index) {
//
//                    self.other_properties[key] = "";
//
//
//                });
//                }else{
//                    self.other_properties = {};
//                }
//
//            },

  },
});