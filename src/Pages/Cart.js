import React from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import AddRemoveItem from "components/AddRemoveItem.js";
import { StoreContext } from "Store";
import * as TYPES from "Store/actionTypes.js";
import { ReactComponent as FoodTraySVG } from "assets/food-tray.svg";
import { ReactComponent as TableSVG } from "assets/table.svg";
import { ReactComponent as EmptyCartSadIMG } from "assets/empty-card-sad.svg";
import CloseSVG from "components/CloseSVG.js";
import io from "socket.io-client";
import { Table as RBTable } from "react-bootstrap";
import Bill from "components/Bill.js";
import { ReactComponent as TableFilledIMG } from "assets/Table-Filled.svg";
import { ReactComponent as PersonalSVG } from "assets/personal.svg";
const Cart = () => {
  const {
    dispatch,
    state: { cart }
  } = React.useContext(StoreContext);

  const [state, setState] = React.useState({
    activeCart: 0 //0: Personal cart, 1: Table cart
  });

  React.useEffect(() => {
    console.log("Cart screen");
    //handling refresh issue
    dispatch({ type: TYPES.SET_NAV, payload: "Cart" });
  }, []);

  const DeleteItemHndlr = item => {
    dispatch({ type: TYPES.DEL_ITEM, payload: item._id.$oid });
  };

  const setCart = () => {
    const socket = io(
      "http://ec2-13-232-202-63.ap-south-1.compute.amazonaws.com:5050/reliefo",
      {
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization:
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1ODczOTc1OTAsIm5iZiI6MTU4NzM5NzU5MCwianRpIjoiZGU3OWFkNGQtN2JmZi00NTUwLTk0OTEtOGIxYWRlMjFmNzBmIiwiZXhwIjoxNTg3NDEyNTkwLCJpZGVudGl0eSI6IktJRDAwMSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.3AdPx1rwo6FMQuuuywV9wJL_VBkJI_M_t6PgBUbZIVE"
            }
          }
        }
      }
    );

    const body = {"table": "5e9dceb965d6ecc5fd2e114b", "orders": [{"placed_by": "5e9d3a2bde2d4753a970a546", "food_list": cart }]}
    socket.emit('place_order', JSON.stringify(body), function (answer) {console.log('ORDER SUBMITTED--->', answer)});
  }
  
    // setState(state => ({ ...state, activeCart: 1 - state.activeCart }));

  const renderPersonalCart = () => (
    <>
      {cart.map((item, idx) => (
        <Card className="cart-card cart-styling" key={`cart-card-${idx}`}>
          <Card.Body className="body">
            <p className="name">{item.name}</p>
            <AddRemoveItem className= "trial" count={item.count} id={item._id.$oid} />
            <p style={{ margin: 0, width: "15%" }}>
              &#8377; {item.price * item.count}
            </p>
            <div
              style={{ padding: ".5rem" }}
              onClick={DeleteItemHndlr.bind(this, item)}
            >
              <CloseSVG />
            </div>
          </Card.Body>
        </Card>
      ))}
    </>
  );
  const renderTableCart = () => (
    <>
      {["Mr. Naveen", "Mr. Akshay"].map((item, idx) => (
        <React.Fragment key={`table-${idx}`}>
          <p
            className="pl-3 pt-3 brand-clr"
            style={{ fontWeight: 600, textTransform: "capitalize" }}
          >
            {item}
          </p>
          <RBTable striped bordered hover>
            <thead className="table-thead">
              <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Paul Molive</td>
                <td>3</td>
                <td>234</td>
              </tr>
              <tr>
                <td>Jacob</td>
                <td>2</td>
                <td>399</td>
              </tr>
              <tr>
                <td>Anna Mull</td>
                <td>2</td>
                <td>399</td>
              </tr>
              <tr>
                <td colSpan="2">Total</td>
                <td>&#8377; 999</td>
              </tr>
            </tbody>
          </RBTable>
        </React.Fragment>
      ))}
    </>
  );
  //TODO: useEffect for this
  const orderTotal =
    cart.length !== 0
      ? cart.reduce((total, item) => total + item.price * item.count, 0)
      : "";
  const isEmpty = () => {
    if (state.activeCart === 0 && cart.length === 0) return true;
    if (state.activeCart === 1) return false; //TODO: figure this out
  };
  return (
    <>
      <ul className="menu-btn" style={{ justifyContent: "space-evenly" }}>
        <li onClick={setCart}>
          <div
            className={
              state.activeCart === 0 ? "cart-menu active" : "cart-menu"
            }
          >
            <PersonalSVG height="19px" />
            &nbsp;&nbsp;Personal
          </div>
        </li>
        <li onClick={setCart}>
          <div
            className={
              state.activeCart === 1 ? "cart-menu active" : "cart-menu"
            }
          >
            <TableSVG height="19px" />
            &nbsp;&nbsp;Table
          </div>
        </li>
      </ul>
      <div className="cart-wrapper">
        {isEmpty() && (
          <div className="empty-cart">
            <EmptyCartSadIMG />
            <p style={{ margin: 0 }}>Who likes rumbling tummy ?</p>
            <p>Neither me.</p>
          </div>
        )}
        {cart.length !== 0 && state.activeCart === 0 && renderPersonalCart()}
        {state.activeCart === 1 && renderTableCart()}
        {cart.length !== 0 && (
          <>
            <Bill orderTotal={orderTotal} />
            {state.activeCart === 0 && (
              <Row>
                <Col style={{ marginTop: "1rem" }}>
                  <div className="bill-btn" onClick={setCart}>
                    <FoodTraySVG height="25px" width="25px" />
                    <p>Place Order</p>
                  </div>
                </Col>
                <Col style={{ marginTop: "1rem" }}>
                  <div className="bill-btn" onClick={setCart}>
                    <TableSVG height="25px" width="25px" />
                    <p>Push To Table</p>
                  </div>
                </Col>
              </Row>
            )}
          </>
        )}
        {state.activeCart === 1 && (
          <>
            <Bill />
            <div className="bill-btn mt-3">
              <div className="d-flex">
                <FoodTraySVG height="25px" width="25px" />
                <p className="ml-3">Confirm Order</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
