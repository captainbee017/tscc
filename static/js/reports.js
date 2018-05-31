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

Vue.component('daterangepicker', {
  props: {
    value: {
      type: [String]
    },
    options: {
      type: Object,
      // default: function(){
      //   return {
      //     format: 'YYYY-MM-DD',
      //     separator: '/'
      //   }
      // }
    }
  },
  // props: ['options', 'value', 'multiple'],
  template:
  `<input/>`,
  mounted: function () {

    // let opts = Object.assign({},{
    //     format: 'YYYY-MM-DD',
    //     separator: '/'
    // },this.options);

    var vm = this;
    // console.log('final datepicker config',this.config)
    $(this.$el)
      // .daterangepicker({format: 'YYYY-MM-DD', separator: '/'})
      .daterangepicker(this.config)
      .val(this.value)
      .trigger('change')
      // emit event on change.
      .on('apply.daterangepicker', function () {
        vm.$emit('input', this.value)
      })
      .on('change', function () {
        vm.$emit('input', this.value)
      })
  },
  computed: {
    config: function(){
      return Object.assign({},{
          "showDropdowns": false,
          locale: {
            format: 'YYYY-MM-DD',
            separator: '/'
          },
          ranges:   {
            'Today': [moment(), moment()],
             'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
             'Last 7 Days': [moment().subtract(6, 'days'), moment()],
             'Last 30 Days': [moment().subtract(29, 'days'), moment()],
             'This Month': [moment().startOf('month'), moment().endOf('month')],
             'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
      },this.options);
    }
  },
  watch: {
    value: function (value) {
      // update value
      $(this.$el).val(value).trigger('change');
    },
    // config: function (options) {
    //   console.trace('daterangepicker option changed',options)
    //   // update options
    //   $(this.$el)
    //   .daterangepicker('destroy')
    //   .daterangepicker({ data: this.config }).trigger('change')
    // }
  },
  created: function() {
      var vm = this;

  },
  destroyed: function () {
    console.log('daterangepicker destroyed');
    // $(this.$el).off().daterangepicker('destroy')
    // debugger;
    $(this.$el).data('daterangepicker').remove()
    // $(this.$el).remove();
  }
})


let app3 = new Vue({
  el: '#app',
  template: `
  <div class="pr-4">
    
    <div class="col-md-12 pl-0">
        <div class="row">
            <div class="col-md-2 pr-0" style="border-right: 1px solid #E1E1E1;">

                <div class="" v-for="c in categories" >
                    <div :class="'activeNav_' + c.id" v-on:mouseover="mouseOver" @mouseleave="mouseLeave">
                        <div>
                            <ul>
                              <item
                                class="item"
                                :model="c">
                              </item>
                            </ul>
                        </div>
                    </div>


                    <hr width="100%" class="p-0 m-0">
                </div>
                <div v-show="categories.length == 0" class="p-2">
                    <div class="alert alert-warning text-center">
                        <i class="fa fa-exclamation-circle"></i><br />
                        No Categories to show. <br />
                    </div>
                </div>
            </div>
            <div class="col-md-10" v-if="!show_ticket_form">
                <div class="row align-items-bottom">   
                    <div class="col-md-4 my-auto">
                        <h4 class="px-2 mb-0" id="category-title">All Reports</h4>
                    </div>
                    <div class="col-md-2">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Search by Phone Number" v-model="search_key">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="input-group">
                             <daterangepicker :options="datepickeroptions" name="daterange" placeholder="Select Date"  class="form-control input-xs" v-model="date"/>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="input-group">
                            <vselect :options="users" label="username" :value="''" v-model="user" :allow-empty="true" :loading="loading"
                             :select-label="''" :show-labels="false" :internal-search="true"  :placeholder="'Select CSR'" :multiple=false track-by="id" :hide-selected="true">
                            <template slot="noResult">NO CSRS Available</template>
                            <template slot="afterList" slot-scope="props"><div v-show="users.length==0" class="wrapper-sm bg-danger">
                            No CSRS</div></template>
                            </vselect>
                        </div>
                    </div>
                </div>
                <div class="row my-3">
                    <div class="col-md-12">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Phone</th>
                                     <th scope="col">CSR</th>
                                    <th scope="col">Date</th>
                                    <th scope="col" v-show="searchCategory && searchCategory.has_district">District</th>
                                    <th scope="col" v-for="(v,k) in searchCategory.other_properties">{{k}}</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Comment</th>
                                    <th class="text-center" scope="col" v-show="[can_approve, can_delete]"><i class="fa fa-cogs"></i></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="t , index in tickets">
                                    <td>{{t.phone_number}}</td>
                                    <td>{{t.csr_display}}</td>
                                    <td >{{t.date_display}}</td>
                                    <td  v-show="searchCategory && searchCategory.has_district">{{t.district_display}}</td>
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
                                <tr v-show="tickets.length == 0">
                                    <td colspan="8"><div class="alert alert-warning"><i class="fa fa-exclamation-circle"></i> No datas. Select categories.</div></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-md-10" v-if="show_ticket_form">
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
        user: '',
        users: [],
        date: '',
        datepickeroptions: {
            timePicker: false,
        }
    },
  methods:{

    mouseOver: function(c) {
        console.log('here');
        ret = c.currentTarget.className.split(" ");
        $("." + ret[0] + "").removeClass("active-menu");
        $("." + ret[0] + "").addClass("active-menu");

        $("." + ret[0] + "").find(".activeNavItem").removeClass('hide');
        $("." + ret[0] + "").find(".activeNavItem").addClass('show');
        // $(".activeNav_"+c.id).css('background-color: #fff');
    },

    mouseLeave: function(c) {
        //do noothing
        ret = c.currentTarget.className.split(" ");
        $("." + ret[0] + "").removeClass("active-menu");

        $("." + ret[0] + "").find(".activeNavItem").addClass('hide');
        $("." + ret[0] + "").find(".activeNavItem").removeClass('show');
    },


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

        loadUsers: function(){
        let self = this;
        let options = {};

        function successCallback(response) {
            self.users = response.body;
        }

        function errorCallback() {
            console.log('failed');
        }
        self.$http.get('/core/users/', {params:  options}).then(successCallback, errorCallback);
    },

    loadsubCategories: function(c){
        let self = this;
        let options = {};
        function successCallback(response) {
            // debugger;
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
        if(self.user.hasOwnProperty("id")){
            options.user = self.user.id;
        }
        if(self.search_key.length>0){
            options.search_key = self.search_key;
        }

        if(self.date.length>0){
            options.date = self.date;
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
                if(self.ticket.district &&  self.ticket.district.hasOwnProperty("id")){
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
            console.log(self.ticket);
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
      self.loadUsers();

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
        user: function (newVal, oldVal) {
                let self = this;
                    self.loadDatas();

                },
        date: function (newVal, oldVal) {
                let self = this;
                    self.loadDatas();

                },

  },
});
