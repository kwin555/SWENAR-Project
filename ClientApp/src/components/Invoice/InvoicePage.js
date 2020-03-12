import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import { URL } from "./InvoiceConstants";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

const style = {
  height: "500px",
  width: "610px",
  justifyContent: "center"
};

export class InvoicePage extends Component {
  static displayName = InvoicePage.name;
  constructor(props) {
    super(props);
    this.state = {
      customers: []
    };
  }

  fetchInvoice = () => {
    fetch(`${URL}/${this.props.id}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ invoice: data });
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount = () => {
    this.fetchInvoice();
  };

    columns = [
      {
        field: "id",
        name: "ID",
        cellRenderer: params => {
          var link = document.createElement("a");
          link.href = "/customerpage/" + params.value;
          link.innerText = params.value;
          return link;
        }
      },
      { field: "name", name: "Name" },
      { field: "number", name: "Number" }
    ];

  render = () => {
    console.log(this.state.invoice);
    return (
      <div>
        <div>
          <h3>Invoices</h3>
          <hr />
        </div>
        <div className='ag-theme-balham' style={style}>
          <AgGridReact
          columnDefs={this.columns}
          rowData={this.state.customers}
          ></AgGridReact>
        </div>
      </div>
    );
  };
}
