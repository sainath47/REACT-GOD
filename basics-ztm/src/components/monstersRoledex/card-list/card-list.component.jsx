import { Component } from "react";

import "./card-list.styles.css";
import Card from "../card/card.component";
class CardList extends Component {
  render() {
    console.log(this.props);
    console.log("renderFromCardList");
    //re-renders happens when props get updated & when setState is called
    /**
     how it happens basically is?
     parentcomponent gets called & then child component 
     data is called as soon as the setState is updated then again the parent & then child 
     */
    const { monsters } = this.props;
    return (
      <div className="card-list">
        {monsters.map((monster) => {
          return <Card key={monster.id} monster={monster} />;
        })}
      </div>
      // <div></div>(you can another div in here, 1 component 1 div)
    );
  }
}

export default CardList;
