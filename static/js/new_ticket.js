var app3 = new Vue({
  el: '#app',
  template: `
  <div class="grid">
      <div class="row">

          <div class="col-sm-6">
              <a @click="setQueryType(1)"> <i class="fa fa-plus">Query</i></a>
              </div>
              <div class="col-sm-6">
              <a @click="setQueryType(2)"> <i class="fa fa-plus">Complain</i></a>
              </div>
            </div>
          <div class="col-sm-12" v-show="filtered_categories.length>0">
              <div v-show="!category"> Select Category </div>
              <div v-show="category">Selected Category :{{category.name}}
                     <a @click="changeCategory()">
                       Change </a>
              </div>
            <div class="col-sm-4 category" v-for="c in filtered_categories" v-show="show_categories">
                <a @click="categoryForm(c)">
                    {{c.name}} </a>
            </div>
          </div>

      <div class="col-sm-12" v-show="category">

        <form>
            <div class="form-group">
            <label for="phone_number">Phone</label>
            <input type="text" class="form-control" id="phone_number" aria-describedby="emailHelp"
            placeholder="Enter Phone" v-model="phone_number">
            <small id="emailHelp" class="form-text text-muted">Enter Phone Number.</small>
          </div>


          <div class="form-group" v-for="(k, v) in category.other_properties">
            <label >{{v}}</label>
            <input type="text" class="form-control"
            placeholder=""  v-bind:id="v"  v-bind:ref="v"  @change="formHandler(v)">
          </div>


          <div class="form-group">
            <label for="exampleInputEmail1">Comment</label>
            <textarea v-model="comment" placeholder="add Comment" rows="3"></textarea>
          </div>

           <div class="form-group">

            <a  class="btn btn-primary" @click="saveTicket()">Save Ticket</a>

        </div>

          </form>

      </div>

      </div>



  </div>

  `,

  data: {
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
                self.categories = response.body;
            }

            function errorCallback() {
                console.log('failed');
            }
            self.$http.get('/core/category/', [options]).then(successCallback, errorCallback);
      },

      setQueryType: function(val){
          var self= this;

          self.category = '';
          self.show_categories = true;

          self.filtered_categories = self.categories.filter(function (el) {
          return el.call_type == val;
        });

        },

        categoryForm: function(val){
            var self = this;
            self.category = val;
            self.show_categories = false;

        },
        changeCategory: function(){
            var self = this;
            self.category = '';
            self.show_categories = true;

        },
        formHandler: function(key){
                    var self = this;
                    console.log(key);
                    console.log(document.getElementById(key).value);
                    val = document.getElementById(key).value;
                    self.other_properties[key] = val;
                    console.log(self.other_properties);

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

                self.$http.post('/core/ticket/', ticket, options).then(successCallback, errorCallback);




      },


  },


  created() {

      var self = this;
      self.loadDatas();
//      self.setQueryType(1);

  },
  watch:{
    category: function (newVal, oldVal) {
                var self = this;
                if (newVal) {
                    Object.keys(newVal.other_properties).forEach(function(key,index) {

                    self.other_properties[key] = "";


                });
                }else{
                    self.other_properties = {};
                }

            },

  },
});