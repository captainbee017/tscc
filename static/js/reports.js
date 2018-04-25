var app3 = new Vue({
  el: '#app',
  template: `
  <div class="container">
    <div class="row mb-2" v-show="!show_ticket_form">
            <div class="col-sm-6">
                <div class="input-group">
                  <input type="text" class="form-control" placeholder="Search Phone..." v-model="search_key">
                </div>
              </div>
              <div class="col-sm-6">
                <vselect :options="categories" label="name" :value="''" v-model="searchCategory" :allow-empty="true" :loading="loading"
                     :select-label="''" :show-labels="false" :internal-search="true"  :placeholder="'Select Category'" :multiple=false track-by="id" :hide-selected="true">
                    <template slot="noResult">NO Categories Available</template>
                    <template slot="afterList" slot-scope="props"><div v-show="categories.length==0" class="wrapper-sm bg-danger">
                    No Categories</div></template>
                </vselect>

            </div>
  </div>
  <div class="col-sm-8 offset-md-2" v-show="show_ticket_form">
        <h4> {{ticket.category_display}} </h4>
        <form>
            <div class="form-group">
            <label for="phone_number">Phone</label>
            <input type="text" class="form-control" id="phone_number" aria-describedby="emailHelp"
            placeholder="Enter Phone" v-model="ticket.phone_number">
            <small id="emailHelp" class="form-text text-muted">Enter Phone Number.</small>
          </div>


          <div class="form-group" v-for="(k, v) in other_properties">
            <label >{{v}}</label>
            <input type="text" class="form-control"
            placeholder=""  v-bind:id="v"  v-bind:ref="v" v-bind:value="k"  @change="formHandler(v)">
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

          <div class="form-group" v-show="has_type">
            <label for="type">Type</label>
            <vselect :options="type_options" label="name" :value="''" v-model="ticket.types" :allow-empty="true" :loading="loading"
                 :select-label="''" :show-labels="false" :internal-search="true"  :placeholder="'Select type'" :multiple=false track-by="id" :hide-selected="true">
                <template slot="noResult">NO Types Available</template>
                <template slot="afterList" slot-scope="props"><div v-show="type_options.length==0" class="wrapper-sm bg-danger">
                No Types</div></template>
            </vselect>

        </div>

          <div class="form-group">
            <label for="exampleInputEmail1">Comment</label>
            <textarea v-model="ticket.comment" placeholder="add Comment" rows="3" class="form-control"></textarea>
          </div>

          <div class="form-group">
          <label for="status">Status</label>
            <select v-model="ticket.status" class="form-control">
              <option>Pending</option>
              <option>Inprogress</option>
              <option>Completed</option>
            </select>
          </div>

           <div class="form-group">

            <a  class="btn btn-primary text-white" @click="saveTicket()">Update Ticket</a>

        </div>

          </form>
  </div>

  <div class="row" v-show="!show_ticket_form">

         <table class="table table-striped">
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
      <th class="text-center" scope="col" v-show="[can_approve, can_delete]"><i class="fa fa-cogs"></i></th>
      <!-- <th scope="col" v-show="can_approve">Edit</th>
      <th scope="col" v-show="can_delete">Delete</th> -->
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
      <td>
        <a title="Edit" v-show="can_approve" @click="editTicket(t)" class="btn btn-sm btn-secondary">
          <i class="fa fa-edit"></i>
        </a>
        <a title="Delete" v-show="can_delete" @click="deleteTicket(t)" class="btn btn-sm btn-secondary">
          <i class="fa fa-trash"></i>
        </a>
      </td>
    </tr>
    <tr v-if="tickets.length==0">
    <td colspan="11">No Tickets</td>
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
    type_options: [],
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
    has_type: false,
    call_type: rare_settings.ticket_type,
    can_approve: rare_settings.can_approve,
    can_delete: rare_settings.can_delete,
    searchCategory:'',
  },
  methods:{
    loadTagFromArray: function (tags){
        if(!tags || tags=="null") return ''
        var tags_array = '';
        var self = this;
        for (var i = 0; i < self.type_options.length; i++) {
                if (tags == self.type_options[i].id) {
                    tags_array = (self.type_options[i]);
                }
            }

            return tags_array;

    },
            formHandler: function(key){
                    var self = this;
                    console.log(key);
                    console.log(document.getElementById(key).value);
                    val = document.getElementById(key).value;
                    self.other_properties[key] = val;
                    console.log(self.other_properties);

                },
    loadCategories: function(){
            var self = this;
            var options = {'call_type': self.call_type};

            function successCallback(response) {
                self.categories = response.body;
            }

            function errorCallback() {
                console.log('failed');
            }
            self.$http.get('/core/main-categories/', {params:  options}).then(successCallback, errorCallback);
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

            if(self.searchCategory.hasOwnProperty("id")){
                options.category = self.searchCategory.id;
            }
            if(self.search_key.length>0){
                options.search_key = self.search_key;
               }

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
        if(self.ticket.phone_number.length <1){

         new PNotify({
                    title: 'failed',
                    text: 'Phone No Required',
                    type: 'error'
                });
                        return

      }
              self.ticket.category = self.ticket.category.id;

            if(self.ticket.hasOwnProperty("district")){
                if(self.ticket.district.hasOwnProperty("id")){
                    self.ticket.district = self.ticket.district.id;

                }else{

                    self.ticket.district = "";
                }
                }
            if(self.ticket.hasOwnProperty("types")){
                if(self.ticket.types.hasOwnProperty("id")){
                    self.ticket.types = self.ticket.types.id;

                }else{

                    self.ticket.types = "";
                }
                }
            self.ticket.other_properties = self.other_properties;



            function successUpdateCallback(response) {
            console.log(response);
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
                self.show_ticket_form = false;

            }

            function errorCallback(response) {

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

                self.$http.put('/core/ticket/'+ self.ticket.id +'/', self.ticket, options).then(successUpdateCallback, errorCallback);




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

            self.$dialog.confirm('Please confirm to continue')
                .then(function () {

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

                })
                .catch(function () {
                    console.log('Clicked on cancel')
                });


      },


  },
  components: {'vselect': VueMultiselect.default},


  created() {

      var self = this;
      self.loadDatas();
      self.loadCategories();

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
                console.log(newVal.category.other_properties);
                    Object.keys(newVal.category.other_properties).forEach(function(key,index) {

                    if(newVal.other_properties.hasOwnProperty(key)){
                        self.other_properties[key] = newVal.other_properties[key];

                    }else{
                        self.other_properties[key] = "";
                    }





                });
                    self.has_district = newVal.category.has_district;
                    self.has_type = newVal.category.has_type;
                    self.type_options = newVal.category.type_options;
                    self.ticket.types = self.loadTagFromArray(newVal.types);
                }else{
                    self.other_properties = {};
                }

            },
        searchCategory: function (newVal, oldVal) {
                var self = this;
                if (newVal) {
                    self.loadDatas();
                }

                },
        search_key: function (newVal, oldVal) {
                var self = this;
                    self.loadDatas();

                },

  },
});