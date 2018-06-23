var app3 = new Vue({
  el: '#app',
  template: `
    <div class="container ml-0 pl-0" style="font-size: 13px;">
        <div class="row">
            <div class="col-md-8">
                <div class="card border-0">
                    <div v-show="call_type==1">
                        <div class="card-header p-2">Query Categories
                            <a @click="newCategory()" class="btn btn-sm btn-secondary float-right">
                                <i class="fa fa-plus-circle"></i> Add Main category
                            </a>
                        </div>
                        <div class="card-body">
                            <div class="row px-2 pt-2" v-for="c , index in query_categories">
                                <div class="col-md-8">
                                    {{c.name}}
                                </div>
                                <div class="col-md-4">
                                    <a @click="subCategory(c, index)" title="New Sub Category" class="btn btn-sm btn-secondary pull-right">
                                        <i class="fa fa-plus-circle"></i> Add
                                    </a>
                                    <a @click="detailCategory(c, index)" title="Edit Details" class="btn btn-sm btn-secondary pull-right mx-2">
                                        <i class="fa fa-edit"></i> Edit
                                    </a>
                                </div>
                                <div class="col-sm-12" v-show="c.branch.length>0">
                                    <div class="col-sm-6" v-for="c1 , index1 in c.branch ">
                                        {{c1.name}}
                                        <a class="btn btn-sm btn-secondary" @click="subCategory(c1, index1)" title="New Sub Category"><i class="fa fa-plus"></i> Add </a>
                                        <a class="btn btn-sm btn-secondary m-2" @click="detailCategory(c1, index1)" title="Edit Details"><i class="fa fa-edit"></i>Edit </a>
                                        <div class="col-sm-12" v-show="c1.branch.length>0">
                                            <div class="col-sm-12" v-for="c2 , index2 in c1.branch ">
                                            <span>{{c2.name}}</span>
                                                <a class="btn btn-sm btn-secondary" @click="subCategory(c2, index2)" title="New Sub Category"><i class="fa fa-plus"></i>Add</a>
                                                <a class="btn btn-sm btn-secondary m-2" @click="detailCategory(c2, index2)" title="Edit Details"><i class="fa fa-edit"></i> Edit</a>
                                                        <div class="col-sm-12" v-show="c2.branch.length>0">
                                                    <div class="col-sm-12" v-for="c3 , index3 in c2.branch ">
                                                        {{c3.name}}
                                                        <a class="btn btn-sm btn-secondary m-2" @click="detailCategory(c3, index1)" title="Edit Details"><i class="fa fa-edit"></i> Edit</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr width="100%" class="text-muted m-1 mx-2">
                            </div>
                        </div>
                        <div v-if="query_categories.length === 0">
                            <div class="alert alert-warning">No categories</div>
                        </div>
                    </div>

                    <div v-show="call_type==2">
                        <div class="card-header">Complain Categories
                         <a @click="newCategory()" class="btn btn-sm btn-secondary float-right">
                            <i class="fa fa-plus-circle"></i> Add Main category
                        </a></div>
                        <div class="card-body p-3">
                            <div class="row pt-3" v-for="c , index in complain_categories">
                                <div class="col-md-8">
                                    {{c.name}}
                                </div>
                                <div class="col-md-4">
                                    <a title="Add sub category" @click="subCategory(c, index)" class="btn btn-sm btn-secondary pull-right">
                                        <i class="fa fa-plus-circle"></i> Add
                                    </a>
                                    <a title="edit" @click="detailCategory(c, index)" class="btn btn-sm btn-secondary pull-right mx-2">
                                        <i class="fa fa-edit"></i> Edit
                                    </a>
                                </div>
                                <div class="col-sm-12" v-show="c.branch.length>0">
                                    <div class="col-sm-12" v-for="c1 , index1 in c.branch ">
                                        {{c1.name}}
                                        <a title="Add sub category" class="btn btn-sm btn-secondary" @click="subCategory(c1, index1)" ><i class="fa fa-plus"></i> Add</a>
                                        <a title="Edit" class="btn btn-sm btn-secondary m-2" @click="detailCategory(c1, index1)"><i class="fa fa-edit"></i> Edit</a>
                                        <div class="col-sm-12" v-show="c1.branch.length>0">
                                            <div class="col-sm-12" v-for="c2 , index2 in c1.branch ">
                                            {{c2.name}}
                                                <a title="Add sub category" class="btn btn-sm btn-secondary" @click="subCategory(c2, index2)"><i class="fa fa-plus"></i> Add </a>
                                                <a title="Edit" class="btn btn-sm btn-secondary m-2" @click="detailCategory(c2, index2)"><i class="fa fa-edit"></i> Edit</a>
                                                        <div class="col-sm-12" v-show="c2.branch.length>0">
                                                    <div class="col-sm-12" v-for="c3 , index3 in c2.branch ">
                                                        {{c3.name}}
                                                        <a title="Edit" class="btn btn-sm btn-secondary m-2" @click="detailCategory(c3, index1)" ><i class="fa fa-edit"></i>Edit </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="complain_categories.length === 0">
                            <div class="alert alert-warning">No categories</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card border-0" v-show="show_category_form">
                    <div class="card-header p-2">
                        Add category
                    </div>
                    <div class="card-body p-2">
                        <form>
                            <div class="form-group">
                                <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                placeholder="Enter Name Of Category" v-model="category.name">
                                <small id="emailHelp" class="form-text text-muted">Enter Category Name e.g. new Sim.</small>
                            </div>
                            <div class="form-check">
                                <label for="" class="text-muted form-check-label">
                                    <input type="checkbox" class="form-check-input" id="has_district" v-model="category.has_district">
                                    Choose if this form contains district
                                </label>
                            </div>
                            <hr />
                            <div class="form-check">
                                <label for="" class="text-muted form-check-label">
                                    <input type="checkbox" class="form-check-input" id="has_type"  v-model="category.has_type">
                                    Choose if this form contains Type Option
                                </label>
                            </div>
                            <div class="form-group" v-show="show_type_form">
                                <label for="typeform" class="type_form">
                                    New Type Option
                                </label>
                                <input type="text" class="form-control" id="typeform" aria-describedby="typeHelp"
                                placeholder="Enter Name Of Option" v-model="option_name">

                                <a class="btn btn-sm btn-info text-white my-2" @click="saveOption()">
                                    <i class="fa fa-plus-save"></i> Save This Option
                                </a>

                            </div>

                            <div class="form-group" v-show="category.has_type">
                                <label for="types">Type Options</label>
                                <vselect :options="type_options" label="name" :value="'[]'" v-model="category.types" :allow-empty="true" :loading="loading"
                                     :select-label="''" :show-labels="false" :internal-search="true"  :placeholder="'Select Types'" :multiple=true track-by="id" :hide-selected="true">
                                    <template slot="noResult">NO Types Available</template>
                                    <template slot="afterList" slot-scope="props">
                                    <div  class="wrapper-sm bg-danger">
                                    <a class="text-white p-3" title="click to add New Type" @click="addType()"><i class="fa fa-plus-circle"></i> Add</a>
                                    </div></template>
                                </vselect>
                            </div>
                            
                            <hr />
                            <div class="form-group">
                                <strong> Additional form fields</strong>
                                <table class="table table-bordered">
                                    <tr>
                                        <td>New Field</td>
                                        <td>Field Type</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type="text" class="form-control" id="key" placeholder="Field Name" v-model="property.key">
                                        </td>
                                        <td>
                                            <select class="form-control" v-model="property.value">
                                                <option value="text">Text</option>
                                                <option value="number">Number</option>
                                            </select>
                                        </td>
                                        <td>
                                            <a class="btn btn-sm btn-info text-white" @click="addField()"><i class="fa fa-plus-circle"></i> Add</a>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <div class="form-group">

                                <table class="table">
                                    <thead>
                                        <tr>
                                            <td>Name</td>
                                            <td>Type</td>
                                            <td><i class="fa fa-cogs"></i></td>
                                        </tr>
                                    </thead>
                                    <tr v-for="(v, k) in category.other_properties">
                                        <td> {{ k }}     </td>
                                        <td>  &nbsp; {{ v }}     </td>
                                        <td>  &nbsp;  <a  class="btn btn-sm btn-danger text-white" @click="deleteField(k)">
                                            <i class="fa fa-trash"></i> Delete</a>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <hr />
                            <div class="form-group">
                                <a  class="btn btn-success btn-sm text-white" @click="saveCategory()">Save Category</a>
                                <a  class="btn btn-warning btn-sm text-white" @click="show_category_form=false">Cancel</a>
                                <a  v-show="category.id" class="btn btn-sm btn-danger text-white" @click="deleteCategory()">Delete</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

  `,

  data: {
    seen: true,
    categories: [],
    types: [],
    type_options: [],
    loading :false,
    show_category_form :false,
    show_type_form :false,
    has_type :false,
    option_name :"",
    call_type: rare_settings.ticket_type,
    category :{'name':'', 'call_type':rare_settings.ticket_type,'other_properties':{}, 'has_district':true,
     'has_type':false, 'types':[]},
    property: {'key':'', 'val':''},
  },
  methods:{
    loadTagsFromArray: function (tags){
        if(!tags || tags=="null") return []
        var tags_array = [];
        var self = this;
        for (var i = 0; i < self.types.length; i++) {
                if (tags.indexOf(self.types[i].id) != -1) {
                    tags_array.push(self.types[i]);
                }
            }

            return tags_array;

    },

      deleteCategory: function(){
            var self = this;
            self.$dialog.confirm('Please confirm to Delete')
                .then(function () {

                    let csrf = $('[name = "csrfmiddlewaretoken"]').val();
                    let options = {
                        headers: {
                            'X-CSRFToken': csrf
                        }
                    };


            function successCallback(response) {
                self.loadDatas();
                new PNotify({
                    title: 'deleted',
                    text: "Category deleted",
                    type: 'info'
                });

            }

            function errorCallback(errorResponse) {
                console.log(errorResponse);
                new PNotify({
                    title: 'failed',
                    text: errorResponse.error,
                    type: 'error'
                });
            }
            self.$http.delete('/core/category/' + self.category.id + '/', options).then(successCallback, errorCallback);




                })
                .catch(function () {
                    console.log('Cancel')
                });



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
                self.types = response.body;
            }

            function errorCallback() {
                console.log('failed');
            }
            self.$http.get('/core/types/', {params:  options}).then(successCallback, errorCallback);
      },
      newCategory: function(val){
          var self = this;
          self.show_category_form = true;
          self.category = {'name':'', 'call_type':self.call_type,'other_properties':{},  'has_district':true,
            'has_type':false, 'types':[]};

//           console.log(self.category);


      },
      addType: function (){
      var self = this;

        self.show_type_form = true;
        self.option_name = "";
      },

    saveOption: function (){
      var self = this;
      if(self.option_name.length <1){
         new PNotify({
                    title: 'failed',
                    text: 'Option Name Required',
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

        function successCallback(response) {
                    self.show_type_form = true;
                    self.option_name = "";
                    self.type_options.push(response.body);
                    self.category.types.push(response.body);

                new PNotify({
                    title: 'Option Saved',
                    text: 'Option ' + response.body.name + ' Saved'
                });


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
                    text: 'Option Failed to Save',
                    type: 'error'
                });

                }
            }

           let  type = {};
            type.name = self.option_name;

      self.$http.post('/core/types/', type, options).then(successCallback, errorCallback);



      },
      addField : function(){
      var self = this;
      if(self.property.key.length>0){
       if(!self.property.value){
        self.property.value = "text";
       }
        if(self.category.other_properties == ""){
        console.log("reached");
            self.categories.other_properties = {};
        }
        self.category.other_properties[self.property.key]=self.property.value;
        self.property =  {'key':'', 'val':''};

      }else{
      new PNotify({
                    title: 'failed',
                    text: 'Please Enter Type Name',
                    type: 'error'
                });
      }

      },
      deleteField: function(k){
        var self = this;
        var self_property = {};

        Object.entries(self.category.other_properties).forEach(
            ([key, value]) => {if(key!=k ){self_property[key]=value;}}
        );
        self.category.other_properties = self_property;

      },
      saveCategory : function (){
        var self = this;
        if(self.category.name.length <1){

         new PNotify({
                    title: 'failed',
                    text: 'Category Name Required',
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

            var tags = self.category.types.map(function (a) {
                    return parseInt(a.id);
                });
            self.category.types = tags;

//            console.log(self.category);

            function successCallback(response) {
            self.show_category_form = false;
            self.show_type_form = false;
            self.type_options = [];
            self.category = {'name':'', 'call_type':response.body.call_type,'other_properties':{},
                        'has_district':true, 'has_type':false, 'types':[]}
                new PNotify({
                    title: 'Category Saved',
                    text: 'category ' + response.body.name + ' Saved'
                });

//                self.categories.push(response.body);
            self.loadTypes();
            self.loadDatas();

            }
            function successUpdateCallback(response) {
            self.show_category_form = false;
            self.show_type_form = false;
            self.category = {'name':'', 'call_type':response.body.call_type,'other_properties':{}, 'has_district':true,
                                'has_type':true, 'types':[]
                                 };
                new PNotify({
                    title: 'Category Updated',
                    text: 'category ' + response.body.name + ' Saved'
                });
//                var category_index = -1;
//                for(var i=0; i < self.categories.length; i++){
//                    if(self.categories[i].id == response.body.id){
//                    category_index = i;
//                    }
//
//                }
//                console.log(category_index);
//                Vue.set(self.categories, category_index, response.body);
                    self.loadTypes();
                    self.loadDatas();

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
                    text: 'Category Failed to Save',
                    type: 'error'
                });

                }
            }
            if(self.category.hasOwnProperty("id")){
                self.$http.put('/core/category/'+ self.category.id +'/', self.category, options).then(successUpdateCallback, errorCallback);
            }else{
                self.$http.post('/core/category/', self.category, options).then(successCallback, errorCallback);

            }


      },
      detailCategory: function(c, index){
        var self = this;
        self.category = c;
        var tags = self.loadTagsFromArray(self.category.types);
        self.category.types = tags;
        self.show_category_form = true;
        console.log(self.category);
      },
      subCategory: function(c, index){
        var self = this;
        self.category = {'name':'', 'call_type':self.call_type,'other_properties':{}, parent:c.id, 'has_district':true,
         'has_type':false, 'types':[]};
        self.show_category_form = true;
      },

  },
  computed: {
            query_categories: function(){
                var self = this;
                var filtered = self.categories.filter(function (c) {
                return c.call_type == 1;
            });
                return filtered;
            },
            complain_categories: function(){
            var self = this;
                var filtered = self.categories.filter(function (c) {
                return c.call_type == 2;
            });
                return filtered;
            },
    },
    components: {'vselect': VueMultiselect.default},
  created() {
      var self = this;
      self.loadDatas();
      self.loadTypes();
  },
  watch:{

  },
});