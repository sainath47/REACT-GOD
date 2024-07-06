import React, { Component } from "react";
import "./MonstersRoledex.css";
import CardList from "./card-list/card-list.component";
import SearchBox from "./search-box/search-box.component";

class MonstersRoledex extends Component {
  constructor() {
    super();
    console.log("constructor"); // constructer runs before all
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
      originalMonsters: [
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
      searchField: "",
    };
  }

  componentDidMount() {
    console.log("componentDidMount"); // component mounted so this will be executed & the state will be updated after executing the time consuming operations & re-render happens due to state update
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
        this.setState({ originalMonsters: users, filteredMonsters: users });
      });
  }

  render() {
    console.log("renderFromMonsterRoledex"); //everytime react needs to update the DOM, it runs this render method inside of this render method

    const filteredMonsters = this.state.originalMonsters.filter((monster) => {
      return monster.name.toLowerCase().includes(this.state.searchField);
    });

    const onSearchChange = (event) => {
      console.log(event.target.value);
      const searchField = event.target.value.toLowerCase();

      // this.setState({monsters: users})
      // as iam doing the backspace the state have been already filtered & backspacing the word in the input will never get back the orginal array to filter upon
      // debouncing is a technique used to limit the number of times a function is called in a short period. calling the event after some amount of delay is called debouncing
      //if another event occurs again within the delay period
      this.setState(() => {
        return {
          searchField,
        };
      });
    };

    /**THE ALL THE ABOVE FUNCTION ARE WRITTEN ABOVE CAUSE, INCLUDING IN RENDER FUNCTION WILL DECREASE THE PERFORMACE OF APPLICATION , SINCE, EVERY TIME REACT NEEDS TO UPDATE THE DOM , IT RUNS THE BELOW RENDER METHOD, so everytime the render methods is run these functions will be created in the memory, & this function never change putting this in render method is making the application less performant,
 it became performant because, if the render function want to access the onSearchChange function it can access from outside , dont have to create every time
*/

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

        {/* {filteredMonsters.map((monster) => {
          return <h1 key={monster.name}>{monster.name}</h1>;
        })} */}
        <h1 className="app-title">Monsters Rolodex</h1>
        <SearchBox
          onSearchChange={onSearchChange}
          placeholder="search monstor"
          className="search-box"
        />
        <CardList monsters={filteredMonsters} />
      </div>
    );
  }
}

export default MonstersRoledex;
