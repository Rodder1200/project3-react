import React from 'react';

class Services extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      imgs: [],
      titles: [],
      error: '',
      onClose: function() {
        const section = document.querySelector(".modal-wrapper");

        document.querySelector(".modal-wrapper").classList.toggle("open");
        section.classList.toggle("blur");
      }
    };
  }

  componentDidMount() {
    const _this = this;
    let imgs = this.state.imgs.slice();
    let titles = this.state.titles.slice();

    fetch('http://504080.com/api/v1/services/categories', {
            method: 'get',
            headers: new Headers({
                'Authorization': '072acf2a5e08a191499fbd5826bc6c9fda1e4741'
            })
        }).
        then(function (response) {
            if (response.ok) {
                return response.json();
            }  else if (response.status == 401 || response.status == 500) {
              return response.json();
            }
        }).
        then(function (json) {
            if (!json.success) {
                _this.setState({error: json.error.description});
                document.querySelector(".modal-wrapper").classList.toggle("open"); 
            } else {
                for (var i = 0; i < json.data.length; i++) {
                  imgs.push(json.data[i].icon);
                  _this.setState({ imgs: imgs });
                  titles.push(json.data[i].title);
                  _this.setState({ titles: titles });
                }
            } 
        }).
        catch(function (response) {
          console.log(response); 
        });
    }

  render() {

    const serviceImgs = this.state.imgs.map ( (serviceImg, index) =>
    <div key = {index} className="serviceDir__item">
      <div className="serviceDir__img_border">
        <img className="serviceDir__img" src={serviceImg}></img>
      </div>
      <div className="serviceDir__text">{this.state.titles[index]}</div>
    </div>  
    ) 

    return (
      <div className="serviceDir">
        <header className="serviceDir__header">
          <h1 className="serviceDir__title">Service Directory</h1>
          <button className="serviceDir__addNew">Add New Service</button>
        </header>
        <div className="serviceDir__services">
            {serviceImgs}
        </div>
        <div className="modal-wrapper">
          <div className="modal">
            <div className="head">
              <a className="btn-close" href="javascript:;" onClick={this.state.onClose}></a>
            </div>
            <div className="content"> {this.state.error} </div>
          </div>
        </div>
      </div> 
    )
  }
};

export default Services
