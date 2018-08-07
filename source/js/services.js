var serv = new Vue({
    el: '.centralPart',
    data: {
        imgs: [],
        titles: [],
        error: ''
    },

    created: function created() {
        var _this = this;
            // modal = document.querySelector(".modal-wrapper");

        fetch('http://504080.com/api/v1/services/categories', {
            method: 'get',
            headers: new Headers({
                'Authorization': '91abbd91b2dab6e2ac2d32e817f66b6498a5263c'
            })
        }).
        then(function (response) {
            if (response.ok) {
                return response.json();
            }  else if (response.status == 401 || response.status == 500) {
               return response.json();
            }

            throw new Error('Network response was not ok');
        }).
        then(function (json) {
            if (!json.success) {
                _this.error = json.error.description;
                document.querySelector(".modal-wrapper").classList.toggle("open"); 
            } else {
                for (var i = 0; i < json.data.length; i++) {
                    _this.imgs.push(json.data[i].icon);
                    _this.titles.push(json.data[i].title);
                }
            }    
        });
    },

    methods: {
        onClose: function () {
            var section = document.querySelector(".modal-wrapper");

            document.querySelector(".modal-wrapper").classList.toggle("open");
            section.classList.toggle("blur");
        }
    }
});