import React,{ Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../layouts/Home.css';
import { Script } from 'vm';

class Authorized extends Component {
    componentDidMount() {
        this.props.userAuthorized("(username)"); // Potentially replace with username if can get
    }
    //buttonClick(){
    //    console.log("came here")
    //    
    //}
     
    // getHashParams() {
    //     var hashParams = {};
    //     var e, r = /([^&;=]+)=?([^&;]*)/g,
    //         q = window.location.hash.substring(1);
    //     e = r.exec(q)
    //     while (e) {
    //        hashParams[e[1]] = decodeURIComponent(e[2]);
    //        e = r.exec(q);
    //     }
    //     console.log(hashParams)
    //     return hashParams;
    //   }

    render() {
        console.log(this.props)
        // var apiKey = this.props.location.search
        // var callbackUri = 'http://localhost:5000/authorized' + apiKey
        // window.location.href = 'http://localhost:3000'
        return (
          <div className="App">
            <header className="App-header">
            <h1>Authorized</h1>
            <Redirect to="/" />
            </header>
          </div>
        );
      }
}

export default Authorized;
