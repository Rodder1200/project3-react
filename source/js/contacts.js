import React from 'react';

class Contacts extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
        counter: 0,
        options: [],
        selected: '',
        imgs: [],
        other: false,
        photoInvalid: false,
        errors: {
            enquiry_type: false,
            user_name: false, 
            email: false, 
            subject: false, 
            description: false,
            other: false
        }
    };
    this.checkSelected = this.checkSelected.bind(this);
    this.setCounter = this.setCounter.bind(this);
    this.addPhoto = this.addPhoto.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    var _this = this;
    var options = this.state.options.slice();

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
            options.push(json.data[i].name);
            _this.setState({ options: options });
        }
    });
  };

  checkSelected (e) {
    if (e.target.value == 'Other') {
        this.setState({other: true});
    } else {
        this.setState({other: false});
    }   
  };

  setCounter (e) {
    this.setState({counter: e.target.value.length});
  };

  addPhoto () {
    var cont = this.state;
    var file = document.querySelectorAll('input[type=file]')[cont.imgs.length].files[0];
    var input = document.querySelectorAll('input[type=file]')[cont.imgs.length];
    var firstInput = document.querySelector('#c-hiddenAdd');
    var textCont = document.querySelector('.c-textCont');
    var cont = this.state;
    var regV = /image\//gi;
    var img = new Image();
    var imgs = this.state.imgs.slice();
    var _this = this;
   
    img.src = window.URL.createObjectURL(file);  
    
    if (regV.test(file.type)) {
        img.onload = function() {
            var width = img.naturalWidth,
                height = img.naturalHeight;

                if (file.size < 5242880 && width >= 300 && height >= 300) {
                    imgs.push(img.src);
                    _this.setState({imgs: imgs});
                    input.setAttribute('readonly', '');
                    input.style.width = '0';
                    input.style.height = '0';
                    firstInput.style.marginRight = '0px';
                    textCont.style.marginTop = '-170px';
                    _this.setState({photoInvalid: false});
                } else {
                    _this.setState({photoInvalid: true});
                    input.removeAttribute('readonly');
                }
            }
    } else {
        _this.setState({photoInvalid: true});
    }
  };

  onClose (e) {
    var cont = this.state;
    var imgs = this.state.imgs.slice();
    var index = this.state.imgs.indexOf(e.target.id);
    var lastInput = document.querySelectorAll('input[type=file]')[cont.imgs.length - 1];
    var textCont = document.querySelector('.c-textCont');
    var firstInput = document.querySelector('#c-hiddenAdd');
    
    imgs = this.state.imgs.splice(index, 1)
    this.setState({[this.state.imgs]: imgs});
    lastInput.style.width = '130px';
    lastInput.style.height = '170px';

    if (this.state.imgs == "") {
        textCont.style.marginTop = '0px';
        firstInput.style.marginRight = '-130px';
        firstInput.style.height = '170px';
    }
  };

  onSubmit (e) {
    var _this = this;
    var cont = this.state;
    var regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var required = document.querySelectorAll('[data-check=required]');
    var email = document.querySelector('input[name=email]');
    var other = document.querySelector('input[name=other]');
    
    required.forEach(function(item){
        if (!item.value) {
            item.classList.add('.c-error__border');
            cont.errors[item.name] = true;
            _this.setState({[cont.errors[item.name]] : cont.errors[item.name]});
            e.preventDefault();
        } else {
            cont.errors[item.name] = false;
            item.classList.remove('.c-error__border');
            _this.setState({[cont.errors[item.name]] : cont.errors[item.name]});
        }
    });

    if (!regEmail.test(email.value)) {
        email.classList.add('.c-error__border');
        cont.errors.email = true;
        _this.setState({[cont.errors.email] : [cont.errors.email]});
        e.preventDefault();
    } else {
        email.classList.remove('.c-error__border');
        cont.errors.email = false;
        _this.setState({[cont.errors.email] : [cont.errors.email]});
    }

    if (other && !other.value) {
        other.classList.add('.c-error__border');
        cont.errors.other = true;
        _this.setState({[cont.errors.other] : cont.errors.other});
        e.preventDefault();
    } else if (other && other.value) {
        other.classList.remove('.c-error__border');
        cont.errors.other = false;
        _this.setState({[cont.errors.other] : [cont.errors.other]});
    } else {
        cont.errors.other = false;
        _this.setState({[cont.errors.other] : [cont.errors.other]});
    }
};
  
  render() {

    var options = this.state.options.map ( (option, index) =>
        <option key = {index}> {option} </option>
    )
    var other = this.state.other ? <input type="text" placeholder="Other" name="other" /> : null
    
    var errorSelect = this.state.errors.enquiry_type ? <div className="c-error__text">Please choose an enquiry type! </div> : null
    var errorOther = this.state.errors.other ? <div className="c-error__text">Please enter your type! </div> : null
    var errorName = this.state.errors.user_name ? <div className="c-error__text">Please enter a valid name! </div> : null
    var errorEmail = this.state.errors.email ? <div className="c-error__text">Please enter a valid email address! </div> : null
    var errorSubject = this.state.errors.subject ? <div className="c-error__text">Please enter a subject!</div> : null
    var errorDescr = this.state.errors.description ? <div className="c-error__text">Please enter a description!</div> : null
    var photoError = this.state.photoInvalid ?  <div className=".c-error__photo">The photo does not meet the requirements</div> : null

    var newPhoto = this.state.imgs.map ( (newPhoto, index) =>
            <div key = {index} className=".c-newPhoto">
            <img className="c-newImg" alt="img" width="130" height="130" src={newPhoto}/>
            <button id={newPhoto} className="c-closeBut" type="button" onClick={this.onClose}></button>
        </div>
    )

    var hiddenAdd  = this.state.imgs.map ( (hiddenAdd, index) =>
        <input key = {index} className="c-hiddenAdd" type="file" accept="image/*" title=" " name="photo" onChange={this.addPhoto}/>
    )

    return (
        <form className="c-form" noValidate action="http://504080.com/api/v1/support" method="post" onSubmit={this.onSubmit}>
            <div className="c-cont">
                <div className="c-note">Fields marked "*" are required</div>
                <div>
                    <label>Enquiry Type *
                        <select name="enquiry_type" data-check="required" onChange={this.checkSelected}>
                            {options}
                        </select>
                        {errorSelect}
                    </label>
                </div>
                {other}
                {errorOther}
                <div className="c-row">
                    <div className="c-half">
                        <label>Name *
                            <input type="text" placeholder="Dentist" name="user_name" data-check="required"/>
                        </label>
                        {errorName}
                    </div>
                    <div className="c-half">
                        <label>Email *
                            <input type="email" placeholder="rachelm@gmail.com" name="email" data-check="required"/>
                        </label>
                        {errorEmail}
                    </div>
                </div>
                <div>
                    <label>Subject *
                        <input type="text" name="subject" data-check="required"/>
                        {errorSubject}
                    </label>
                </div>
                <div>
                    <label>
                        <div className="c-descr">
                            <div>Description * </div>
                            <div>({this.state.counter}/1000)</div>
                        </div>
                        <textarea maxLength="1000" name="description" data-check="required" onChange={this.setCounter}></textarea>
                        {errorDescr}
                    </label>
                </div>
                <div
                    className="c-photoCont">
                    <div className="c-hiddenCont">
                        <input id="c-hiddenAdd" type="file" accept="image/*" title=" " name="photo" onChange={this.addPhoto}/>
                    </div>
                    {newPhoto}
                    <div className="c-addPhoto">
                        {hiddenAdd}
                        <div className="c-textCont">
                            <div className="c-textCont__title">Add photo</div>
                            <div className="c-textCont__text">Minimum size of 300x300 jpeg jpg png 5 MB</div>
                            {photoError}
                        </div>
                    </div>
                </div>
                <button className="c-submit">Submit</button>
            </div>
        </form>
    )
  };
};

export default Contacts