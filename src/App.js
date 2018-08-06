import React, { Component } from 'react';
import './App.css';
import './style.css';


import Map from './Map.js';




class App extends Component {
  openMenu=function(){
    if(document.getElementById("navBar").style.visibility = "hidden"){
    document.getElementById("navBar").style.visibility = "visible";
    }
    else{
      document.getElementById("navBar").style.visibility = "hidden";
    }
}


  render(){


    return (
      <div className="app">
      <div className="burgerMenu" onClick={this.openMenu}>
      Menu
      </div>
      <h2>ŚWIĘTOKRZYSKIE TRIP</h2>
      <Map/>

      </div>


    )

}

}
export default App;
