var app3 = new Vue({
  el: '#app',
  template: `
  <div class="grid">
      <div class="row">

         <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Phone</th>
      <th scope="col">Date</th>
      <th scope="col">Datas</th>
      <th scope="col">Status</th>
      <th scope="col">Comment</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="t , index in tickets">
      <th scope="row">{{index+1}}</th>
      <th>{{t.phone_number}}</th>
      <th >{{t.call_time}}</th>
      <td>{{t.other_properties}}</td>
      <td>{{t.status}}</td>
      <td>{{t.comment}}</td>
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
  },
  methods:{
      loadDatas: function(){
            var self = this;
            var options = {};

            function successCallback(response) {
                self.tickets = response.body;
            }

            function errorCallback() {
                console.log('failed');
            }
            self.$http.get('/core/ticket/', [options]).then(successCallback, errorCallback);
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


  },


  created() {

      var self = this;
      self.loadDatas();

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