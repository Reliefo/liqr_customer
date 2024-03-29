import React from "react";
import {  Collapse, Form } from "react-bootstrap";

const CollapseDetails = props => {
  //$rest-font 
  const rest_font = 'Inconsolata';

  // const {
    // dispatch,
    // state: { cartData }
  // } = React.useContext(StoreContext);

  function handleChange(event) {
    props.item.instructions = event.target.value;
  }

  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <span
        style={{
          fontFamily: rest_font,
          fontSize: "12px",
          paddingLeft: "2%"
        }}
        onClick={() => setOpen(!open)}
      >
        Add Cooking Instructions
        <span
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
          className={open ? "arrow-up" : "arrow-down"}
        ></span>
        </span>
        <Collapse in={open}>
          <div id="example-collapse-text" style={{ paddingTop: "2%" }}>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Control
                onChange={event => {
                  handleChange(event);
                }}
                maxLength = {300}
                as="textarea"
                rows="3"
                placeholder="Special Instructions"
              />
            </Form.Group>
          </div>
        </Collapse>
    </div>
  );
};

export default CollapseDetails;
