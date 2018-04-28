let bus = new Vue();
// define the item component
Vue.component('item', {
  template: '#item-template',
  props: {
    model: Object
  },
  data: function () {
    return {
      open: false
    }
  },
  computed: {
    isFolder: function () {
      return this.model.branch &&
        this.model.branch.length
    }
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    changeType: function () {
      if (!this.isFolder) {
        Vue.set(this.model, 'children', [])
        this.addChild()
        this.open = true
      }
    },
    addChild: function () {
      this.model.branch.push({
        name: 'new stuff'
      })
    },
    loadReports: function(c){
    bus.$emit('sub_category_selected', c)

    },
  }
})

let app3 = new Vue({
  el: '#app',
  template: `
  <div class="px-5">
    
    <div class="col-md-12">
        <div class="row">

            <div class="col-md-2" style="border-right: 1px solid #E1E1E1;">
                <div id="accordion">            
                    <div class="" v-for="c in categories" >
                        <div :id="'headingTwo_' + c.id"></div>
                            <a class="btn-link primary-text-color collapsed" data-toggle="collapse" 
                            :data-target="'#collapseTwo_' + c.id" aria-expanded="false" :aria-controls="'collapseTwo_' + c.id"
                             style="text-decoration: none;" @click="setMCategory(c)" >
                                {{ c.name }}
                            </a>
                        <ul :id="'collapseTwo_' + c.id" class="collapse" aria-labelledby="'headingTwo_' + c.id"
                         data-parent="#accordion" style="list-style-type:none;">
                            <item class="primary-text-color" :model="treeData"></item>
                        </ul>
                        <hr width="100%">
                    </div>
                </div>
            </div>
            <div class="col-md-10">
                <div class="row">   
                    <div class="col-md-6 align-bottom" id="category-title">
                        All Reports
                    </div>
                    <div class="col-md-6">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Search by Phone Number" v-model="search_key">
                        </div>
                    </div>
                </div>
                <div class="row my-3">
                    <div class="col-md-12">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Phone</th>
                                    <!-- <th scope="col">Category</th> -->
                                    <th scope="col">Date</th>
                                    <th scope="col">District</th>
                                    <th scope="col" v-for="(v,k) in searchCategory.other_properties">{{k}}</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Comment</th>
                                    <th class="text-center" scope="col" v-show="[can_approve, can_delete]"><i class="fa fa-cogs"></i></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="t , index in tickets">
                                    <th>{{t.phone_number}}</th>
                                    <!-- <th>{{t.category_display}}</th> -->
                                    <th >{{t.date_display}}</th>
                                    <th >{{t.district_display}}</th>
                                    <td v-for="(v,k) in t.other_properties">{{v}}</td>
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
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
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
    treeData: {},
    middle_pages: [],
    previous: '',
    next: '',
    current: 1,
  },
  methods:{
    loadTagFromArray: function (tags){
        if(!tags || tags=="null") return ''
        let tags_array = '';
        let self = this;
        for (let i = 0; i < self.type_options.length; i++) {
                if (tags == self.type_options[i].id) {
                    tags_array = (self.type_options[i]);
                }
            }

            return tags_array;

    },
            formHandler: function(key){
                    let self = this;
                    console.log(key);
                    console.log(document.getElementById(key).value);
                    val = document.getElementById(key).value;
                    self.other_properties[key] = val;
                    console.log(self.other_properties);

                },
    paginationData: function (url) {
            let self = this;

            function successCallback(response) {
                self.tickets = response.body.results;
                self.next = response.body.next;
                let rex = /page=[0-9]+/;
                self.total = response.body.count;
                self.next = response.body.next;
                self.previous = response.body.previous;

                self.middle_pages = [];
                let pages = Math.floor(self.total / 50);
                if (self.total % 50) {
                    pages += 1;
                }
                if (response.body.next) {
                    let k = response.body.next;
                    let np = k.match(rex)[0].split("=")[1];
                    self.current = parseInt(np) - 1;
                    for (let i = 1; i < pages + 1; i++) {
                        if (i < 5 || (Math.abs(i - self.current) < 5) || i > (pages - 5)) {
                            let npa = "page=" + i;
                            let tmp = k;
                            let next_url = tmp.replace(rex, npa)
                            self.middle_pages.push({
                                'index': i,
                                'url': next_url
                            });
                        }
                    }



                } else if (response.body.previous) {
                    let k = response.body.previous;

                    if (k.match(rex) == null) {
                        self.middle_pages.push({
                            'index': "previous",
                            'url': response.body.previous
                        });
                        self.middle_pages.push({
                            'index': 2,
                            'url': response.body.previous
                        });
                        self.current = 2;
                    } else {

                        let np = k.match(rex)[0].split("=")[1];
                        self.current = parseInt(np) + 1;

                        for (i = 1; i <= pages; i++) {
                            if (i < 5 || (Math.abs(i - self.current) < 5) || i > (pages - 5)) {
                                let npa = "page=" + i;
                                let tmp = k;
                                let next_url = tmp.replace(rex, npa)
                                self.middle_pages.push({
                                    'index': i,
                                    'url': next_url
                                });
                            }
                        }
                    }
                }
            }

            function errorCallback() {
                console.log('failed');
            }
            self.$http.get(url)
                .then(successCallback, errorCallback);

        },
    loadCategories: function(){
            let self = this;
            let options = {'call_type': self.call_type};

            function successCallback(response) {
                self.categories = response.body;
            }

            function errorCallback() {
                console.log('failed');
            }
            self.$http.get('/core/main-categories/', {params:  options}).then(successCallback, errorCallback);
      },
      loadsubCategories: function(c){
            let self = this;
            let options = {};

            function successCallback(response) {
                self.treeData = response.body;
            }

            function errorCallback() {
                console.log('failed');
            }
            self.$http.get('/core/category/'+ c.id+'/', {params:  options}).then(successCallback, errorCallback);
      },
    loadDistricts: function(){
            let self = this;
            let options = {};
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
            let self = this;
            let options = {'call_type': self.call_type};
            self.tickets = [];

            if(self.searchCategory.hasOwnProperty("id")){
                options.category = self.searchCategory.id;
            }
            if(self.search_key.length>0){
                options.search_key = self.search_key;
               }

            function successCallback(response) {
                self.tickets = response.body.results;

                self.next = response.body.next;
                let rex = /page=[0-9]+/;
                self.total = response.body.count;
                self.next = response.body.next;
                self.previous = response.body.previous;

                self.middle_pages = [];
                let pages = Math.floor(self.total / 50);
                if (self.total % 50) {
                    pages += 1;
                }
                if (response.body.next) {
                    let k = response.body.next;
                    let np = k.match(rex)[0].split("=")[1];
                    self.current = parseInt(np) - 1;
                    for (let i = 1; i < pages + 1; i++) {
                        if (i < 5 || (Math.abs(i - self.current) < 5) || i > (pages - 5)) {
                            let npa = "page=" + i;
                            let tmp = k;
                            let next_url = tmp.replace(rex, npa)
                            self.middle_pages.push({
                                'index': i,
                                'url': next_url
                            });
                        }
                    }



                } else if (response.body.previous) {
                    let k = response.body.previous;
                    let np = k.match(rex)[0].split("=")[1];
                    self.current = parseInt(np) + 1;

                    for (let i = 1; i <= pages; i++) {
                        if (i < 5 || (Math.abs(i - self.current) < 5) || i > (pages - 5)) {
                            let npa = "page=" + i;
                            let tmp = k;
                            let next_url = tmp.replace(rex, npa)
                            self.middle_pages.push({
                                'index': i,
                                'url': next_url
                            });
                        }
                    }


                }

            }

            function errorCallback() {
                console.log('failed');
            }
            self.$http.get('/core/ticket/', {params:  options}).then(successCallback, errorCallback);
      },

    searchTickets: function(){
            let self = this;
            let options = {'search_key': self.search_key,'call_type':self.call_type};

            function successCallback(response) {
                self.tickets = response.body;
            }

            function errorCallback(errorResponse) {
                console.log(errorResponse);
            }
            self.$http.get('/core/ticket/', {params:  options}).then(successCallback, errorCallback);
      },

    saveTicket : function (){
        let self = this;
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
                let category_index = -1;
                for(let i=0; i < self.tickets.length; i++){
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
        let self = this;
        let options = {'status': "Inprogress", "pk":t.id};

            function successCallback(response) {
                console.log(response.body.pk);
                let category_index = -1;
                for(let i=0; i < self.tickets.length; i++){
                    if(self.tickets[i].id == response.body.pk){
                    category_index = i;
                    }

                }
                let ticket_updated = self.tickets[category_index];
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
        let self = this;
        let options = {'status': "Completed", "pk":t.id};

            function successCallback(response) {
                console.log(response.body.pk);
                new PNotify({
                    title: 'success',
                    text: 'Ticket Completed',
                });
                let category_index = -1;
                for(let i=0; i < self.tickets.length; i++){
                    if(self.tickets[i].id == response.body.pk){
                    category_index = i;
                    }

                }
                let ticket_updated = self.tickets[category_index];
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
        let self = this;
        self.loadDistricts();
            let options = {};

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
        let self = this;
        self.show_ticket_form = false;
      },
      deleteTicket : function (t){
        let self = this;

            self.$dialog.confirm('Please confirm to continue')
                .then(function () {

                    let options = {"pk":t.id};

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
      setMCategory: function (c){
        let self= this;
        self.tickets=[];
        self.loadsubCategories(c);
        self.searchCategory = c;
        $("#category-title").html(c.name);

      },


  },
  components: {'vselect': VueMultiselect.default},


  created() {

      let self = this;
//      self.loadDatas();
      self.loadCategories();

      self.can_approve = false;
      if(rare_settings.can_approve =="True"){
        self.can_approve = true;
      }
      self.can_delete = false;
      if(rare_settings.can_delete =="True"){
        self.can_delete = true;
      }
      bus.$on('sub_category_selected', function(category){
            self.searchCategory = category;
        });

  },
  watch:{
        ticket: function (newVal, oldVal) {
                let self = this;
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
                let self = this;
                if (newVal) {
                    self.loadDatas();
                }

                },
        search_key: function (newVal, oldVal) {
                let self = this;
                    self.loadDatas();

                },

  },
});