var app3 = new Vue({
  el: '#app',
  template: `
  <div>
    <div class="row" v-show="!show_ticket_form">
            <div class="col-sm-12">
                <div class="input-group">
                  <input type="text" class="form-control" placeholder="Search for..." v-model="search_key" @change="searchTickets()">
                  <span class="input-group-btn">
                    <button class="btn btn-default" type="button">Go!</button>
                  </span>
                </div>
              </div>
  </div>
  <div class="col-sm-8 col-sm-offset-4" v-show="show_ticket_form">
        <h4> {{ticket.category_display}} </h4>
        <form>
            <div class="form-group">
            <label for="phone_number">Phone</label>
            <input type="text" class="form-control" id="phone_number" aria-describedby="emailHelp"
            placeholder="Enter Phone" v-model="ticket.phone_number">
            <small id="emailHelp" class="form-text text-muted">Enter Phone Number.</small>
          </div>


          <div class="form-group" v-for="(k, v) in ticket.other_properties">
            <label >{{v}}</label>
            <input type="text" class="form-control"
            placeholder=""  v-bind:id="v"  v-bind:ref="v"  @change="formHandler(v)">
          </div>

          <div class="form-group" v-show="has_district">
            <label for="district">District</label>
            <vselect :options="districts" label="name" :value="''" v-model="ticket.district" :allow-empty="true" :loading="loading"
                 :select-label="''" :show-labels="false" :internal-search="true"  :placeholder="'Select District'" :multiple=false track-by="id" :hide-selected="true">
                <template slot="noResult">NO Districts Available</template>
                <template slot="afterList" slot-scope="props"><div v-show="districts.length==0" class="wrapper-sm bg-danger">
                No Districts</div></template>
            </vselect>

        </div>

          <div class="form-group">
            <label for="exampleInputEmail1">Comment</label>
            <textarea v-model="ticket.comment" placeholder="add Comment" rows="3"></textarea>
          </div>

           <div class="form-group">

            <a  class="btn btn-primary" @click="saveTicket()">Update Ticket</a>

        </div>

          </form>
  </div>

  <div class="row" v-show="!show_ticket_form">

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
      <th scope="col" colspan="2" v-show="can_approve">Change Status</th>
      <th scope="col" v-show="can_delete">Actions</th>
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
      <td><a v-show="can_approve && t.status=='Pending'" @click="setInProgress(t)">set in Progress</a></td>
      <td><a v-show="can_approve && t.status=='Inprogress'" @click="setCompleted(t)">set Completed</a></td>
      <td><a v-show="can_approve" @click="editTicket(t)">Edit</a></td>
      <td><a v-show="can_delete" @click="deleteTicket(t)">Delete</a></td>
    </tr>
    </tbody>
    </table>

      </div>



  </div>

  `,

  data: {
    search_key:"",
    tickets: [],
    ticket: [],
    districts: [],
    categories: [],
    category: '',
    phone_number: '',
    comment: '',
    filtered_categories: [],
    loading :false,
    show_category_form :false,
    show_categories :false,
    show_ticket_form :false,
    other_properties:{},
    has_district: false,
    call_type: rare_settings.ticket_type,
    can_approve: rare_settings.can_approve,
    can_delete: rare_settings.can_delete,
  },
  methods:{
            formHandler: function(key){
                    var self = this;
                    console.log(key);
                    console.log(document.getElementById(key).value);
                    val = document.getElementById(key).value;
                    self.other_properties[key] = val;
                    console.log(self.other_properties);

                },
    loadDistricts: function(){
            var self = this;
            var options = {};
            self.loading = true;

            function successCallback(response) {
                self.loading = false;
                self.districts = response.body;
            }

            function errorCallback() {
                self.loading = false;
                console.log('failed');
            }
            self.$http.get('/core/districts/', {params:  options}).then(successCallback, errorCallback);
      },
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
    searchTickets: function(){
            var self = this;
            var options = {'search_key': self.search_key,'call_type':self.call_type};

            function successCallback(response) {
                self.tickets = response.body;
            }

            function errorCallback(errorResponse) {
                console.log(errorResponse);
            }
            self.$http.get('/core/ticket/', {params:  options}).then(successCallback, errorCallback);
      },

    saveTicket : function (){
        var self = this;
        let csrf = $('[name = "csrfmiddlewaretoken"]').val();
            let options = {
                headers: {
                    'X-CSRFToken': csrf
                }
            };
        var ticket = {};
        ticket.category = self.ticket.category.id;
        if(self.ticket.phone_number.length <1){

         new PNotify({
                    title: 'failed',
                    text: 'Phone No Required',
                    type: 'error'
                });
                        return

      }
            ticket.phone_number = self.ticket.phone_number;
            ticket.id = self.ticket.id;
            ticket.district = self.district;
            ticket.comment = self.comment;
            ticket.other_properties = self.other_properties;



            function successUpdateCallback(response) {
                new PNotify({
                    title: 'ticket Updated',
                    text: 'ticket ' + response.body.phone_number + ' Updated'
                });
                var category_index = -1;
                for(var i=0; i < self.tickets.length; i++){
                    if(self.tickets[i].id == response.body.id){
                    category_index = i;
                    }

                }
                console.log(category_index);
                Vue.set(self.tickets, category_index, response.body);

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

                self.$http.put('/core/ticket/'+ ticket.id +'/',ticket, options).then(successUpdateCallback, errorCallback);




      },
      setInProgress : function (t){
        var self = this;
        var options = {'status': "Inprogress", "pk":t.id};

            function successCallback(response) {
                console.log(response.body.pk);
                var category_index = -1;
                for(var i=0; i < self.tickets.length; i++){
                    if(self.tickets[i].id == response.body.pk){
                    category_index = i;
                    }

                }
                var ticket_updated = self.tickets[category_index];
                    ticket_updated.status = "Inprogress"
                Vue.set(self.tickets, category_index, ticket_updated);

                new PNotify({
                    title: 'success',
                    text: 'Ticket In Progress',
                });

            }

            function errorCallback(errorResponse) {
                console.log(errorResponse.error);
                new PNotify({
                    title: 'failed',
                    text: errorResponse.error,
                    type: 'error'
                });
            }
            self.$http.get('/core/ticket-approve/', {params:  options}).then(successCallback, errorCallback);

      },
      setCompleted : function (t){
        var self = this;
        var options = {'status': "Completed", "pk":t.id};

            function successCallback(response) {
                console.log(response.body.pk);
                new PNotify({
                    title: 'success',
                    text: 'Ticket Completed',
                });
                var category_index = -1;
                for(var i=0; i < self.tickets.length; i++){
                    if(self.tickets[i].id == response.body.pk){
                    category_index = i;
                    }

                }
                var ticket_updated = self.tickets[category_index];
                    ticket_updated.status = "Completed"
                Vue.set(self.tickets, category_index, ticket_updated);

            }

            function errorCallback(errorResponse) {
                console.log(errorResponse.error);
                new PNotify({
                    title: 'failed',
                    text: errorResponse.error,
                    type: 'error'
                });
            }
            self.$http.get('/core/ticket-approve/', {params:  options}).then(successCallback, errorCallback);

      },
      editTicket : function (t){
        var self = this;
        self.loadDistricts();
            var options = {};

            function successCallback(response) {
                self.ticket = response.body;
                self.show_ticket_form = true;
            }

            function errorCallback() {
                console.log('failed');
            }
            self.$http.get('/core/ticketdata/'+ t.id+'/', {params:  options}).then(successCallback, errorCallback);



      },
      canceleditTicket : function (t){
        var self = this;
        self.show_ticket_form = false;
      },
      deleteTicket : function (t){
        var self = this;
        var options = {"pk":t.id};

            function successCallback(response) {
                console.log(response.body.pk);
                new PNotify({
                    title: 'success',
                    text: 'Ticket Deleted',
                });
                let _index = self.tickets.findIndex(x => x.id == response.body.pk);
                self.tickets.splice(_index, 1);

            }

            function errorCallback(errorResponse) {
                console.log(errorResponse.error);
                new PNotify({
                    title: 'failed',
                    text: errorResponse.error,
                    type: 'error'
                });
            }
            self.$http.get('/core/ticket-delete/', {params:  options}).then(successCallback, errorCallback);
      },


  },
  components: {'vselect': VueMultiselect.default},


  created() {

      var self = this;
      self.loadDatas();
      self.can_approve = false;
      if(rare_settings.can_approve =="True"){
        self.can_approve = true;
      }
      self.can_delete = false;
      if(rare_settings.can_delete =="True"){
        self.can_delete = true;
      }

  },
  watch:{
    ticket: function (newVal, oldVal) {
                var self = this;
                if (newVal) {
                    Object.keys(newVal.category.other_properties).forEach(function(key,index) {

                    self.other_properties[key] = "";


                });
                    self.has_district = newVal.category.has_district;
                }else{
                    self.other_properties = {};
                }

            },

  },
});