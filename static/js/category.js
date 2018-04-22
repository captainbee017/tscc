var app3 = new Vue({
  el: '#app',
  template: `
    <div class="container">
        <div class="row">
            <div class="col-md-7">
                <div class="card">
                    <div v-show="call_type==1">
                        <div class="card-header">Query Categories
                        <a @click="newCategory()" class="btn btn-sm btn-secondary">
                                        <i class="fa fa-plus-circle"></i> Add Main category
                        </a>
                        </div>
                        <div class="card-body p-3">
                            <div class="row pt-3" v-for="c , index in query_categories">
                                <div class="col-md-6">
                                    {{c.name}}
                                </div>
                                <div class="col-md-6">
                                    <a @click="subCategory(c, index)" title="New Sub Category" class="btn btn-sm btn-secondary">
                                        <i class="fa fa-plus-circle"></i> Add
                                    </a>
                                    <a @click="detailCategory(c, index)" title="Edit Details" class="btn btn-sm btn-secondary">
                                        <i class="fa fa-edit"></i> Edit
                                    </a>
                                </div>
                                <div class="col-sm-12" v-show="c.branch.length>0">
                                    <div class="col-sm-6" v-for="c1 , index1 in c.branch ">
                                        {{c1.name}}
                                        <a class="btn btn-sm btn-secondary" @click="subCategory(c1, index1)" title="New Sub Category"><i class="fa fa-plus"></i> Add </a>
                                        <a class="btn btn-sm btn-secondary" @click="detailCategory(c1, index1)" title="Edit Details"><i class="fa fa-edit"></i>Edit </a>
                                        <div class="col-sm-12" v-show="c1.branch.length>0">
                                            <div class="col-sm-12" v-for="c2 , index2 in c1.branch ">
                                            <span>{{c2.name}}</span>
                                                <a class="btn btn-sm btn-secondary" @click="subCategory(c2, index2)" title="New Sub Category"><i class="fa fa-plus"></i>Add</a>
                                                <a class="btn btn-sm btn-secondary" @click="detailCategory(c2, index2)" title="Edit Details"><i class="fa fa-edit"></i> Edit</a>
                                                        <div class="col-sm-12" v-show="c2.branch.length>0">
                                                    <div class="col-sm-12" v-for="c3 , index3 in c2.branch ">
                                                        {{c3.name}}
                                                        <a class="btn btn-sm btn-secondary" @click="detailCategory(c3, index1)" title="Edit Details"><i class="fa fa-edit"></i> Edit</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!--<div v-for="c , index in query_categories">
                            {{c.name}}
                            <a @click="subCategory(c, index)" title="New Sub Category"><i class="fa fa-plus"></i> </a>
                            <a  @click="detailCategory(c, index)" title="Edit Details"><i class="fa fa-edit"></i> </a>
                            <div class="col-sm-12" v-show="c.branch.length>0">
                                <div class="col-sm-6" v-for="c1 , index1 in c.branch ">
                                    {{c1.name}}
                                    <a @click="subCategory(c1, index1)" title="New Sub Category"><i class="fa fa-plus"></i> </a>
                                    <a @click="detailCategory(c1, index1)" title="Edit Details"><i class="fa fa-edit"></i> </a>
                                    <div class="col-sm-12" v-show="c1.branch.length>0">
                                        <div class="col-sm-6" v-for="c2 , index2 in c1.branch ">
                                            {{c2.name}}
                                            <a  @click="detailCategory(c1, index1)" title="Edit Details"><i class="fa fa-edit"></i> </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> -->
                        <div v-if="query_categories.length === 0">
                            <div class="alert alert-warning">No categories</div>
                        </div>
                    </div>

                    <div v-show="call_type==2">
                        <div class="card-header">Complain Categories
                         <a @click="newCategory()" class="btn btn-sm btn-secondary">
                                        <i class="fa fa-plus-circle"></i> Add Main category
                        </a></div>
                        <div class="card-body p-3">
                            <div class="row pt-3" v-for="c , index in complain_categories">
                                <div class="col-md-6">
                                    {{c.name}}
                                </div>
                                <div class="col-md-6">
                                    <a title="Add sub category" @click="subCategory(c, index)" class="btn btn-sm btn-secondary">
                                        <i class="fa fa-plus-circle"></i> Add
                                    </a>
                                    <a title="edit" @click="detailCategory(c, index)" class="btn btn-sm btn-secondary">
                                        <i class="fa fa-edit"></i> Edit
                                    </a>
                                </div>
                                <div class="col-sm-12" v-show="c.branch.length>0">
                                    <div class="col-sm-12" v-for="c1 , index1 in c.branch ">
                                        {{c1.name}}
                                        <a title="Add sub category" class="btn btn-sm btn-secondary" @click="subCategory(c1, index1)" ><i class="fa fa-plus"></i> Add</a>
                                        <a title="Edit" class="btn btn-sm btn-secondary" @click="detailCategory(c1, index1)"><i class="fa fa-edit"></i> Edit</a>
                                        <div class="col-sm-12" v-show="c1.branch.length>0">
                                            <div class="col-sm-12" v-for="c2 , index2 in c1.branch ">
                                            {{c2.name}}
                                                <a title="Add sub category" class="btn btn-sm btn-secondary" @click="subCategory(c2, index2)"><i class="fa fa-plus"></i> Add </a>
                                                <a title="Edit" class="btn btn-sm btn-secondary" @click="detailCategory(c2, index2)"><i class="fa fa-edit"></i> Edit</a>
                                                        <div class="col-sm-12" v-show="c2.branch.length>0">
                                                    <div class="col-sm-12" v-for="c3 , index3 in c2.branch ">
                                                        {{c3.name}}
                                                        <a title="Edit" class="btn btn-sm btn-secondary" @click="detailCategory(c3, index1)" ><i class="fa fa-edit"></i>Edit </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--<div v-for="c , index in complain_categories">
                            <div class="col-sm-12" v-show="c.branch.length>0">
                                <div class="col-sm-6" v-for="c1 , index1 in c.branch ">
                                    {{c1.name}}
                                    <a @click="subCategory(c1, index1)" title="New Sub Category"><i class="fa fa-plus"></i> </a>
                                    <a @click="detailCategory(c1, index1)" title="Edit Details"><i class="fa fa-edit"></i> </a>
                                    <div class="col-sm-12" v-show="c1.branch.length>0">
                                        <div class="col-sm-6" v-for="c2 , index2 in c1.branch ">
                                            {{c2.name}}
                                            <a @click="detailCategory(c2, index2)" title="Edit Details"><i class="fa fa-edit"></i> </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>-->
                        <div v-if="complain_categories.length === 0">
                            <div class="alert alert-warning">No categories</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="card" v-show="show_category_form">
                    <div class="card-header">
                        Add category
                    </div>
                    <div class="card-body p-3">
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
                            <div class="form-check">
                                <label for="" class="text-muted form-check-label">
                                    <input type="checkbox" class="form-check-input" id="has_type"  v-model="has_type">
                                    Choose if this form contains Type Option
                                </label>
                            </div>
                            <div class="form-group" v-show="show_type_form">
                                <label for="typeform" class="type_form">
                                    New Type Option
                                </label>
                                <input type="text" class="form-control" id="typeform" aria-describedby="typeHelp"
                                placeholder="Enter Name Of Option" v-model="option_name">

                                 <a class="btn btn-xs btn-info text-white" @click="saveOption()"><i class="fa fa-plus-save"></i> Save</a>

                            </div>

                            <div class="form-group" v-show="has_type">
                                        <label for="types">Type Options</label>
                                        <vselect :options="type_options" label="name" :value="'[]'" v-model="category.types" :allow-empty="true" :loading="loading"
                                             :select-label="''" :show-labels="false" :internal-search="true"  :placeholder="'Select Types'" :multiple=false track-by="id" :hide-selected="true">
                                            <template slot="noResult">NO Types Available</template>
                                            <template slot="afterList" slot-scope="props">
                                            <div  class="wrapper-sm bg-danger">
                                            <a title="click to add New TYpe" @click="addType()"><i class="fa fa-plus-circle"></i> Add</a>
                                            </div></template>
                                        </vselect>

                            </div>

                            <div class="form-group">
                                <strong> Additional form fields</strong>
                                <table class="table">
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

                            <br>

                            <div class="form-group">
                                <a  class="btn btn-success text-white" @click="saveCategory()">Save Category</a>
                                <a  class="btn btn-warning text-white" @click="show_category_form=false">Cancel</a>
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
            'has_type':false, 'types':[]}


      },
      addType: function (){
      var self = this;
        self.show_type_form = true;
        self.option_name = "";
      },

    saveOption: function (){
      var self = this;
        self.show_type_form = true;
        self.option_name = "";
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


            function successCallback(response) {
            self.show_category_form = false;
            self.category = {'name':'', 'call_type':response.body.call_type,'other_properties':{}, 'has_district':true}
                new PNotify({
                    title: 'Category Saved',
                    text: 'category ' + response.body.name + ' Saved'
                });

//                self.categories.push(response.body);
            self.loadDatas();

            }
            function successUpdateCallback(response) {
            self.show_category_form = false;
            self.category = {'name':'', 'call_type':response.body.call_type,'other_properties':{}, 'has_district':true};
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
        self.show_category_form = true;
      },
      subCategory: function(c, index){
        var self = this;
        self.category = {'name':'', 'call_type':self.call_type,'other_properties':{}, parent:c.id, 'has_district':true},
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
  },
  watch:{

  },
});