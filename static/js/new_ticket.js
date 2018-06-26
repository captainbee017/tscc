Vue.use(VueMultiselect);

Vue.directive('focus', {
    bind: function () {
        this.el.focus();
    }
});


var app3 = new Vue({
    el: '#app',
    template: `
        <div class="">
        <div class="">
                <div class="row align-items-start">
                    <div class="col-md-3" v-for="c in categories">
                        <div class="card m-2 border-0">
                            <div class="card-body px-2" v-on:mouseover="mouseOver" @mouseleave=mouseLeave>
                                <div class="header parent-category">
                                    <p class="my-2" @click="categoryForm(c)">
                                        {{ c.name }}
                                        <span class="float-right" v-show="c.branch.length > 0">^</span>
                                        
                                    </p>
                                </div>
                                <div class="sub-category" v-bind:class="[active, ]" v-for="c1 , index1 in c.branch" 
                                    v-on:mouseover="mouseOver" @mouseleave=mouseLeave>
                                    <p class="ml-3">
                                        <a @click="categoryForm(c1)" class="py-2">
                                            {{ c1.name }}
                                        </a>
                                    </p>
                                    <p class="ml-5" v-show="c1.branch.length>0" v-for="c2, index in c1.branch">
                                        <a @click="categoryForm(c2)" class="submenu-item">{{ c2.name }}</a>
                                    </p>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            <div class="col-sm-12" v-show="category">
                <hr width="100%">
                <h3 class="category-header py-3"></h3>
                <form class="">
                    <div class="row">
                        <div class="form-group col-sm-3">
                            <input type="text" placeholder="Phone Number" ref="phone_number" 
                                class="form-control" id="phone_number" v-model="phone_number">
                                <!-- <small id="emailHelp" class="form-text text-muted">Enter Phone Number.</small> -->
                        </div>
                        <div class="form-group col-sm-3" v-for="(k, v) in category.other_properties">
                            <input type="text" class="form-control" v-bind:placeholder="v" 
                                v-bind:id="v"  v-bind:ref="v"  @change="formHandler(v)">
                        </div>

                        <div class="form-group" v-show="has_type">
                            <vselect :options="type_choices" label="name" :value="''" v-model="types" 
                                :allow-empty="true" :loading="loading" :select-label="''" :show-labels="false" 
                                :internal-search="true"  :placeholder="'Type'" :multiple=false track-by="id" 
                                :hide-selected="true">
                                <template slot="noResult">NO Types Available</template>
                                <template slot="afterList" slot-scope="props">
                                    <div v-show="type_choices.length==0" class="wrapper-sm bg-danger">No Options</div>
                                </template>
                            </vselect>
                        </div>
                        
                        <div class="form-group col-sm-3" v-show="has_district">
                            <vselect :options="districts" label="name" :value="''" v-model="district" :allow-empty="true" :loading="loading" :select-label="''" :show-labels="false" :internal-search="true"  :placeholder="'Select District'" :multiple=false track-by="id" :hide-selected="true">
                                <template slot="noResult">NO Districts Available</template>
                                <template slot="afterList" slot-scope="props">
                                    <div v-show="districts.length==0" class="wrapper-sm bg-danger">No Districts</div>
                                </template>
                            </vselect>
                        </div>
                        <div class="form-group col-sm-4">
                            <textarea v-model="comment" placeholder="Add Comment" rows="1" class="form-control"></textarea>
                        </div>
                        <div class="form-group col align-self-end">
                            <a  class="btn btn-primary text-white" @click="saveTicket()">Save Ticket</a>
                        </div>
                    </div>
                </form>
            </div>

            <div class="col-sm-12" v-show="categories.length == 0">
                <div class="alert alert-danger text-center"><i class="fa fa-exclamation-circle"></i> No records to show</div>
            </div>
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
        has_type: true,
        district: '',
        types: '',
        districts: [],
        type_choices: [],
        available_types: [],
        active: false,
    },
    methods:{

        mouseOver: function (ev){
            $(ev.currentTarget).children('.sub-category').removeClass('show');
            $(ev.currentTarget).children('.sub-category').removeClass('hide');
            $(ev.currentTarget).children('.sub-category').addClass('show');

            // set color
            $(ev.currentTarget).removeClass('primary-text-color');
            $(ev.currentTarget).addClass('primary-text-color');

            // set box border
            $(ev.currentTarget).parent('.card').removeClass('box-shadow');
            $(ev.currentTarget).parent('.card').addClass('box-shadow');

            $(ev.currentTarget).parent('.card').removeClass('zi');
            $(ev.currentTarget).parent('.card').addClass('zi');

        },

        mouseLeave: function(ev){
            $(ev.currentTarget).children('.sub-category').removeClass('hide');
            $(ev.currentTarget).children('.sub-category').removeClass('show');
            $(ev.currentTarget).children('.sub-category').addClass('hide');
            
            $(ev.currentTarget).removeClass('primary-text-color');
            $(ev.currentTarget).parent('.card').removeClass('box-shadow');

            $(ev.currentTarget).parent('.card').removeClass('zi');
        },

        loadTagsFromArray: function (tags){
            if(!tags || tags=="null") return []
            var tags_array = [];
            var self = this;
            for (var i = 0; i < self.available_types.length; i++) {
                    if (tags.indexOf(self.available_types[i].id) != -1) {
                        tags_array.push(self.available_types[i]);
                    }
                }
                return tags_array;
            },

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

        loadTypes: function(){
            var self = this;
            var options = {};

            function successCallback(response) {
                self.available_types = response.body;
            }

            function errorCallback() {
                console.log('failed');
            }
            self.$http.get('/core/types/', {params:  options}).then(successCallback, errorCallback);
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
            self.$nextTick(() => self.$refs.phone_number.focus())
            $('.category-header').html(val.name);

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
            if(self.has_type && self.types!=''){

                ticket.types = self.types.id;
                console.log(ticket.types);
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
//            console.log(ticket);

            self.$http.post('/core/ticket/', ticket, options).then(successCallback, errorCallback);
        },
    },

    components: {'vselect': VueMultiselect.default},

    created() {

      var self = this;
      self.loadDatas();
      self.loadDistricts();
      self.loadTypes();
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
                self.has_type = newVal.has_type;
                console.log(newVal.types);
                self.type_choices = self.loadTagsFromArray(newVal.types);
            }else{
                self.other_properties = {};
                self.has_district = false;
                self.has_type = false;
                self.type_choices = [];
                self.types = [];
            }
        },
    },
});