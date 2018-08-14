var cont = new Vue({
    el: '#cont',
    data: {
        counter: 0,
        textareaVal: '',
        options: [],
        selected: '',
        imgs: [],
        other: false,
        name: '',
        email: '',
        photoInvalid: false,
        nameValid: false,
        emailValid: false,
        enquiryValid: false,
        subjectValid: false,
        descrValid: false,
        nameError: false,
        emailError: false
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
            var fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            var fileValid = fileTypes.some(function(item){
                return item == file.type;
            });

            if (file.size < 5242880 && fileValid) {
                this.imgs.push(src);
                this.photoInvalid = false;
            } else {
                this.photoInvalid = true;
            }
        },

        onClose: function(e) {
            var index = this.imgs.indexOf(e.target.id);

            this.imgs.splice(index, 1);
        },

        onSubmit: function(e) {
            var regName = /[\wа-я]+/ig;
            var regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var name = document.querySelector('input[name=name]');
            var email = document.querySelector('input[name=email]');
            var select = document.querySelector('select');
            var other = document.querySelector('input[name=other]');
            var subject = document.querySelector('input[name=subject]');
            var descr = document.querySelector('textarea[name=description]');

            this.nameValid = regName.test(this.name);
            this.emailValid = regEmail.test(this.email);
            
            if (!this.nameValid) {
                this.nameError = true; 
                name.classList.add('c_form_error_border');
                e.preventDefault();
            } else {
                name.classList.remove('c_form_error_border');
                this.nameError = false;
            }

            if (!this.emailValid) {
                email.classList.add('c_form_error_border');
                this.emailError = true;
                e.preventDefault();
            } else {
                email.classList.remove('c_form_error_border');
                this.emailError = false;
            }

            if (this.selected && !this.other) {
                this.enquiryValid = true;
                select.classList.remove('c_form_error_border');
            } else if (this.selected && this.other && other.value) {
                this.enquiryValid = true;
                select.classList.remove('c_form_error_border');
                other.classList.remove('c_form_error_border');
            } else if (this.other && !other.value) {
                this.enquiryValid = false;
                other.classList.add('c_form_error_border');
                e.preventDefault();
            } else {
                this.enquiryValid = false;
                select.classList.add('c_form_error_border');
                e.preventDefault();
            }

            if (!subject.value) {
                subject.classList.add('c_form_error_border');
                this.subjectValid = false;
                e.preventDefault();
            } else {
                this.subjectValid = true;
                subject.classList.remove('c_form_error_border');
            }

            if (!descr.value) {
                descr.classList.add('c_form_error_border');
                this.descrValid = false;
                e.preventDefault();
            } else {
                this.descrValid = true;
                descr.classList.remove('c_form_error_border');
            }

            // if  (this.nameValid &&
            //     this.emailValid &&
            //     this.enquiryValid &&
            //     this.subjectValid &&
            //     this.descrValid) {
            //         console.log('Congrculation');
            //     }
            
        }
    }
});