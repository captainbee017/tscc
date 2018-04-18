Vue.use(VueMultiselect);

var app3 = new Vue({
  el: '#app',
  template: `
  <div class="row">
      <div class="col-sm-12" v-show="categories.length>0">
          <div v-show="!category"> Select Category </div>
          <div v-show="category">Selected Category :{{category.name}}
                 <a class="btn btn-xs" @click="changeCategory()">
                   Change Category </a>
          </div>
      </div>
      <div class="col-sm-4">
          <div class="category" v-for="c in categories">
              <a @click="categoryForm(c)">{{c.name}} </a>
                  <div class="" v-show="c.branch.length>0">

                      <div class="" v-for="c1 , index1 in c.branch ">

                          <a @click="categoryForm(c1)">
                                      --{{c1.name}} </a>
                          <div class="row" v-show="c1.branch.length>0">

                              <div class="" v-for="c2 , index2 in c1.branch ">

                                  <a @click="categoryForm(c2)"> ----{{c2.name}} </a>

                              </div>
                          </div>
                      </div>
                  </div>
          </div>
      </div>

      <div class="col-sm-8" v-show="category">

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

          <div class="form-group" v-show="has_district">
            <label for="district">District</label>
            <vselect :options="districts" label="name" :value="''" v-model="district" :allow-empty="true" :loading="loading"
                 :select-label="''" :show-labels="false" :internal-search="true"  :placeholder="'Select District'" :multiple=false track-by="id" :hide-selected="true">
                <template slot="noResult">NO Districts Available</template>
                <template slot="afterList" slot-scope="props"><div v-show="districts.length==0" class="wrapper-sm bg-danger">
                No Districts</div></template>
            </vselect>

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

  `,

  data: {
    call_type: rare_settings.ticket_type,
    categories: [],
    category: '',
    phone_number: '',
    comment: '',
    loading: false,
    show_category_form :false,
    show_categories :false,
    other_properties:{},
    has_district: true,
    district: '',
    districts: [],

  },
  methods:{
      loadDatas: function(){
            var self = this;
            var options = {'call_type': self.call_type};

            function successCallback(response) {
                self.categories = response.body;
            }

            function errorCallback() {
                console.log('failed');
            }
            self.$http.get('/core/category/', {params:  options}).then(successCallback, errorCallback);
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

      setQueryType: function(val){
          var self= this;

          self.category = '';
          self.show_categories = true;
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
            if(self.has_district && self.district!=''){

                ticket.district = self.district.id;
            }


            function successCallback(response) {
                self.category= '',
                self.phone_number = '',
                self.comment = '',
                self.district = '',
                self.show_category_form  = false,
                self.show_categories  = true,
                self.other_properties = {},
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

  components: {'vselect': VueMultiselect.default},


  created() {

      var self = this;
      self.loadDatas();
      self.loadDistricts();
      self.setQueryType(self.call_type);

  },
  watch:{
    category: function (newVal, oldVal) {
                var self = this;
                if (newVal) {
                    Object.keys(newVal.other_properties).forEach(function(key,index) {

                    self.other_properties[key] = "";


                });

                self.has_district = newVal.has_district;
                }else{
                    self.other_properties = {};
                    self.has_district = false;
                }

            },

  },
});