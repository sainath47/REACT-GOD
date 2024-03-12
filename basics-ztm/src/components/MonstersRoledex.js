import React, { Component } from "react";
import "../App.css";

class MonstersRoledex extends Component {
  constructor() {
    super();
console.log('1') // constructer runs before all
    this.state = {
      //   monster1: {
      //     name: "Linda",
      //   },
      //   monster2: {
      //     name: "Frank",
      //   },
      //   monster3: {
      //     name: "Jacky",
      //   },
      // };
      monsters: [
        // {
        //   name: "Linda",
        // },
        // {
        //   name: "Frank",
        // },
        // {
        //   name: "Jacky",
        // },
      ],
    };
  }

  componentDidMount() {
    console.log('3')// component mounted so this will be executed & the state will be updated after executing the time consuming operations & re-render happens due to state update
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) =>
        // console.log(response)
        response.json()
      )
      .then((users) => {
        // this.setState(()=>{
        //   return {monsters: users}
        // })
      // console.log(users,"users")
      this.setState({monsters:users})
      
      });
  }

  render() {
    console.log('2') //render happens after constructer 
    return (
      <div className="App">
        {/* <h1>
            {this.state.monster1.name}
        </h1>
        <h1>
            {this.state.monster2.name}
        </h1>
        <h1>
            {this.state.monster3.name}
        </h1> */}
        {this.state.monsters.map((monster) => {
          return <h1 key={monster.name}>{monster.name}</h1>;
        })}
      </div>
    );
  }
}

export default MonstersRoledex;
