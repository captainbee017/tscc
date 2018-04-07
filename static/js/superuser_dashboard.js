var app3 = new Vue({
  el: '#app',
  template: `
  <div class="container">
       
      <div class="col-sm-4" v-show="show_category_form">
      Category Form for <span v-show="!category.hasOwnProperty('id')">new</span>  <span v-show="category.call_type =='1'"> Query</span>
      <span v-show="category.call_type =='2'"> Complain</span> Type

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
                    <td>  &nbsp;  <a  class="btn btn-xs btn-primary" @click="deleteField(k)">Delete</a>      </td>

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
                <select v-model="property.value">
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                </select>
              </div>

              <div class="col-sm-4">
              <a  class="btn btn-xs btn-primary" @click="addField()">Add Field</a>
              </div>

          </div>

          </div><br>

          <div class="form-group">

            <a  class="btn btn-primary" @click="saveCategory()">Save Category</a>

        </div>
        </form>

      </div>
  </div>
</div>
</div>

  `,

  data: {
    seen: true,
    categories: [],
    show_category_form :false,
    category :{'name':'', 'call_type':1,'other_properties':{}},
    property: {'key':'', 'val':''},
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
      manageCallDetails: function(){
          var self = this;
          self.$http.get('/core/call-lists/', [])
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
            self.category = {'name':'', 'call_type':response.body.call_type,'other_properties':{}}
                new PNotify({
                    title: 'Category Saved',
                    text: 'category ' + response.body.name + ' Saved'
                });

                self.categories.push(response.body);

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