var app3 = new Vue({
  el: '#app',
  template: `
  <div class="container">
    <div class="row" v-show="show_category_form">
        <h4>
          Category Form for <span v-show="!category.hasOwnProperty('id')">new</span>  <span v-show="category.call_type =='1'"> Query</span>
          <span v-show="category.call_type =='2'"> Complain</span> Type
       </h4>

        <form>
          <div class="form-group">
            <label for="exampleInputEmail1">Name</label>
            <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
            placeholder="Enter Name Of Category" v-model="category.name">
            <small id="emailHelp" class="form-text text-muted">Enter Category Name e.g. new Sim.</small>
          </div>

          <div class="form-group">
            <h4> Add New Fields </h4>
            <table v-show="category.other_properties">
            <thead>
                <tr>
                    <td>   Name      </td>
                    <td>  &nbsp;  Type      </td>
                    <td> &nbsp;   Action      </td>

                </tr>
            </thead>
            <tr v-for="(v, k) in category.other_properties">

                <td> {{ k }}     </td>
                <td>  &nbsp; {{ v }}     </td>
                    <td>  &nbsp;  <a  class="btn btn-xs btn-warning" @click="deleteField(k)">Delete</a>      </td>

            </tr>
            </table>
          </div>

        <div class="form-group">
            <div class="row">
              <div class="col-sm-4">
                <label for="key">New Field</label>
                <input type="text" class="form-control" id="key" placeholder="Type" v-model="property.key">
              </div>

              <div class="col-sm-4">
                <label for="val">New Field Type</label>
                <select class="form-control" v-model="property.value">
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                </select>
              </div>

              <div class="col-sm-4">
              <a  class="btn btn-xs btn-info" @click="addField()">Add Field</a>
              </div>

          </div>

          </div><br>

          <div class="form-group">

            <a  class="btn btn-info" @click="saveCategory()">Save Category</a>
            <a  class="btn btn-warning" @click="show_category_form=false">Cancel</a>

        </div>
        </form>

      </div>

      <div class="row" v-show="call_type==1">

          <div class="col-sm-12">
            <span>Query categories</span>
          <a @click="newCategory(1)" class="float-right btn btn-info btn-xs"> <i class="fa fa-plus-circle"></i> Add Top level Query</a>
          </div>
            <div class="col-sm-4" v-for="c , index in query_categories ">

                {{c.name}}
                <a @click="subCategory(c, index)" title="New Sub Category"><i class="fa fa-plus"></i> </a>
                <a @click="detailCategory(c, index)" title="Edit Details"><i class="fa fa-edit"></i> </a>
                <div class="col-sm-12" v-show="c.branch.length>0">

                    <div class="col-sm-6" v-for="c1 , index1 in c.branch ">

                        {{c1.name}}
                        <a @click="subCategory(c1, index1)" title="New Sub Category"><i class="fa fa-plus"></i> </a>
                        <a @click="detailCategory(c1, index1)" title="Edit Details"><i class="fa fa-edit"></i> </a>
                        <div class="col-sm-12" v-show="c1.branch.length>0">

                            <div class="col-sm-6" v-for="c2 , index2 in c1.branch ">

                            {{c2.name}}
                            <a @click="detailCategory(c1, index1)" title="Edit Details"><i class="fa fa-edit"></i> </a>

                            </div>
                        </div>
                    </div>



                </div>
            </div>
                <div v-if="query_categories.length === 0">
                        <div class="alert alert-warning">No categories</div>
                </div>
      </div>
      <div class="clearfix"> </div><br>
      <div class="row" v-show="call_type==2">
          <div class="col-sm-12">Complain Categories
          <a @click="newCategory(2)" class="float-right btn btn-info btn-xs"> <i class="fa fa-plus-circle"></i> Add Top Level Complain</a>
          </div>

            <div class="col-sm-4 category" v-for="c , index in complain_categories ">

                 {{c.name}}
                    <a @click="subCategory(c, index)" title="New Sub Category"><i class="fa fa-plus"></i> </a>
                    <a @click="detailCategory(c, index)" title="Edit Details"><i class="fa fa-edit"></i> </a>
                    <a @click="detailCategory(c, index)" title="Edit Details" v-show="c.branch.length>0"><i class="fa fa-eye"></i> </a>
            </div>
            <div v-if="complain_categories.length === 0">
                    <div class="alert alert-warning">No categories</div>
            </div>
        </div>
      </div>



  </div>
</div>
</div>

  `,

  data: {
    seen: true,
    categories: [],
    show_category_form :false,
    call_type: rare_settings.ticket_type,
    category :{'name':'', 'call_type':1,'other_properties':{}},
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
      newCategory: function(val){
          var self = this;
          self.show_category_form = true;
          self.category = {'name':'', 'call_type':val,'other_properties':{}}


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
            self.category = {'name':'', 'call_type':response.body.call_type,'other_properties':{}}
                new PNotify({
                    title: 'Category Saved',
                    text: 'category ' + response.body.name + ' Saved'
                });

//                self.categories.push(response.body);
            self.loadDatas();

            }
            function successUpdateCallback(response) {
            self.category = {'name':'', 'call_type':response.body.call_type,'other_properties':{}}
                new PNotify({
                    title: 'Category Updated',
                    text: 'category ' + response.body.name + ' Saved'
                });
                var category_index = -1;
                for(var i=0; i < self.categories.length; i++){
                    if(self.categories[i].id == response.body.id){
                    category_index = i;
                    }

                }
                console.log(category_index);
                Vue.set(self.categories, category_index, response.body);

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
        self.category = {'name':'', 'call_type':1,'other_properties':{}, parent:c.id},
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
  created() {
      var self = this;
      self.loadDatas();
  },
  watch:{

  },
});