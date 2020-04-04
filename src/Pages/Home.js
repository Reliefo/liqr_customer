import React from "react";
import { Card, Image } from "react-bootstrap";
import dummyPic from "assets/dummypic.jpeg";
import vodkaPic from "assets/vodka.jpg";
import { StoreContext } from "Store";
import * as TYPES from "Store/actionTypes.js";

const Home = () => {
  const { dispatch, state } = React.useContext(StoreContext);

  React.useEffect(() => {
    console.log("home screen");
    dispatch({ type: TYPES.SET_NAV, payload: "Home" });
  }, []);

  return (
    <>
      {/* <div style={{height:"100vh", background:'#004A77'}}>
      <input type="text" />
    </div> */}
      <div className="category">
        {[...Array(5)].map((_, idx) => (
          <Card className="category-card" key={`category-cards-${idx}`}>
            <Card.Title>Beer</Card.Title>
            <Card.Body className="category-body">
              <ul>
                {[...Array(5)].map((_, idx) => (
                  <li key={`menu-${idx}`}>some item</li>
                ))}
              </ul>
              <Image
                src={vodkaPic}
                roundedCircle
                height="100px"
                width="100px"
              />
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Home;
