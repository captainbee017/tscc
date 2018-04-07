var app3 = new Vue({
    el: '#app',
    template: `
        <div class="container">
            <table class="table table-striped">
                <thead>
                    <tr><th>SN</th>
                        <th>Category</th>
                        <th>Phone Number</th>
                        <th>Status</th>
                    </tr>
                </thead>
            </table>
        </div>`
    data: {
        seen: true,
    },
    methods: {},
})