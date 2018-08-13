var cont = new Vue({
    el: '#cont',
    data: {
        counter: 0,
        textareaVal: '',
        options: [],
        selected: '',
        imgs: [],
        other: false,
        addImg: false
    },
    created: function created() {
        var _this = this;

        fetch('http://504080.com/api/v1/directories/enquiry-types', {
            method: 'get'
        }).
        then(function (response) {
            if (response.ok) {
                return response.json();
            } 

            throw new Error('Network response was not ok');
        }).
        then(function (json) {
            for (var i = 0; i < json.data.length; i++) {
                _this.options.push(json.data[i].name);
            }
        });
    },

    watch: {
        selected: function (val) {
            if (this.selected == 'Other') {
                this.other = true;
            } else {
                this.other = false;
            }   
        },
        textareaVal: function(val) {
            this.counter = val.length;
        }
    },

    methods: {
        addPhoto: function() {
            var file = document.querySelector('input[type=file]').files[0];
            var src = window.URL.createObjectURL(file);

            this.imgs.push(src);
        },

        onClose: function(e) {
            var index = this.imgs.indexOf(e.target.id);

            this.imgs.splice(index, 1);
        }
    }
});