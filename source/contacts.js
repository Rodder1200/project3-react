var cont = new Vue({
    el: '#cont',
    data: {
        counter: 0,
        textareaVal: '',
        options: [],
        selected: '',
        imgs: [],
        other: false,
        email: '',
        photoInvalid: false,
        errors: {
            enquiry_type: false,
            user_name: false, 
            email: false, 
            subject: false, 
            description: false,
            other: false}
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
        selected: function () {
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
            var file = document.querySelectorAll('input[type=file]')[cont.imgs.length].files[0];
            var input = document.querySelectorAll('input[type=file]')[cont.imgs.length];
            var firstInput = document.querySelector('#c_form_hiddenAdd');
            var textCont = document.querySelector('.c_form_text_cont');
            var regV = /image\//gi;
            var img = new Image();

            img.src = window.URL.createObjectURL(file);  
            
            if (regV.test(file.type)) {
                img.onload = function() {
                    var width = img.naturalWidth,
                        height = img.naturalHeight;
                        
                        if (file.size < 5242880 && width >= 300 && height >= 300) {
                            cont.imgs.push(img.src);
                            input.setAttribute('readonly', '');
                            input.style.width = '0';
                            input.style.height = '0';
                            firstInput.style.marginRight = '0px';
                            textCont.style.marginTop = '-170px';
                            cont.photoInvalid = false;
                        } else {
                            cont.photoInvalid = true;
                            input.removeAttribute('readonly');
                        }                       
                    }    
            } else {
                cont.photoInvalid = true;
            }
        },

        onClose: function(e) {
            var index = this.imgs.indexOf(e.target.id);
            var lastInput = document.querySelectorAll('input[type=file]')[cont.imgs.length - 1];
            var textCont = document.querySelector('.c_form_text_cont');
            var firstInput = document.querySelector('#c_form_hiddenAdd');

            this.imgs.splice(index, 1);
            lastInput.style.width = '130px';
            lastInput.style.height = '170px';

            if (this.imgs == "") {
                textCont.style.marginTop = '0px';
                firstInput.style.marginRight = '-130px';
                firstInput.style.height = '170px';
            }
        },

        onSubmit: function(e) {
            var regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var required = document.querySelectorAll('[data-check=required]');
            var email = document.querySelector('input[name=email]');
            var other = document.querySelector('input[name=other]');
            
            required.forEach(function(item){
                if (!item.value) {
                    item.classList.add('c_form_error_border');
                    cont.errors[item.name] = true;
                    e.preventDefault();
                } else {
                    item.classList.remove('c_form_error_border');
                    cont.errors[item.name] = false;
                }
            });

            if (!regEmail.test(this.email)) {
                email.classList.add('c_form_error_border');
                this.errors.email = true;
                e.preventDefault();
            } else {
                email.classList.remove('c_form_error_border');
                this.errors.email = false;
            }

            if (this.other && !other.value) {
                other.classList.add('c_form_error_border');
                this.errors.other = true;
                e.preventDefault();
            } else if (this.other && other.value) {
                other.classList.remove('c_form_error_border');
                this.errors.other = false;
            } else {
                this.errors.other = false;
            }
        }
    }
});