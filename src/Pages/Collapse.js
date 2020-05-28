import React from "react";
import { Table as RBTable, Button, Collapse, Form } from "react-bootstrap";
import { StoreContext } from "Store";

const CollapseDetails = props => {
  const {
    dispatch,
    state: { activeData }
  } = React.useContext(StoreContext);

  function handleChange(event) {
    props.item.instructions = event.target.value;
  }

  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <span
        style={{
          fontFamily: "Poppins",
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
