import React from "react";
import { Table as RBTable, Button, Collapse, Form } from "react-bootstrap";

const CollapseDetails = props => {
  const [open, setOpen] = React.useState(false);
  return (
    <span>
      <span
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        className= {open ? "arrow-up" : "arrow-down"}>
      </span>
        
      <Collapse in={open}>
        <div id="example-collapse-text" style = {{ paddingTop : '2%'}}>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Control
              as="textarea"
              rows="3"
              placeholder="Special Instructions"
            />
          </Form.Group>
        </div>
      </Collapse>
    </span>
  );
};

export default CollapseDetails;
