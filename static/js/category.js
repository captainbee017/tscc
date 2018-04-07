var app3 = new Vue({
  el: '#app',
  template: `
      <div class="row">

  <div class="col-sm-6">Query
  <a @click="newCategory(1)"> <i class="fa fa-plus">Add New Query Category</i></a>
  </div>
  <div class="col-sm-6">Complain
  <a @click="newCategory(2)"> <i class="fa fa-plus">Add New Complain Category</i></a>
  </div>

  <!-- Force next columns to break to new line -->
  <div class="w-100"></div>

  <div class="col-sm-6">
        <table class="table">
            <thead>
            <tr>
            <th scope="col">SN</th>
            <th scope="col">Name</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="c , index in query_categories ">
            <td>
                {{index+1}}
            </td>
            <td>
                {{c.name}}
            </td>
            </tr>
            </tbody>
        </table>
  </div>


  <!-- Force next columns to break to new line -->
  <div class="w-100"></div>

  <div class="col-sm-6">
        <table class="table">
            <thead>
            <tr>
            <th scope="col">SN</th>
            <th scope="col">Name</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="c , index in complain_categories ">
            <td>
                {{index+1}}
            </td>
            <td>
                {{c.name}}
            </td>
            </tr>
            </tbody>
        </table>
  </div>
</div>

  `,

  data: {
    seen: true,
    categories: [],
  },
  methods:{
      loadDatas: function(){
            var self = this;
            var options = {};

            function successCallback(response) {
                self.categories = response.body;
                console.log(self.categories);
            }

            function errorCallback() {
                console.log('failed');
            }
            self.$http.get('/core/category/', [options]).then(successCallback, errorCallback);
      },
      newCategory: function(){
      var self = this;
      console.log("new");
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