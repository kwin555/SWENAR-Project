import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import { URL } from "./InvoiceConstants";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

const style = {
  height: "300px",
  width: "1000px",
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
    const { id } = this.props;
    console.log(id);
    fetch(`https://localhost:44375/api/invoice/GetInvoiceByCustomerId/${id}`)
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
    { field: "id", name: "ID" },
    { field: "invoiceNo", name: "Invoice Number" },
    { field: "customerNumber", name: "Customer Number" },
    { field: "customerName", name: "Customer Name" },
    { field: "amount", name: "Amount" },
    { field: "invoiceDate", name: "Invoice Date" },
    { field: "dueDate", name: "Due Date" },
    { field: "status", name: "Status" }
  ];

  render = () => {
    console.log(this.state.invoice);
    const { invoice } = this.state;
    return (
      <div>
        <div>
          <h3>Invoices</h3>
          <hr />
        </div>
        <div className='ag-theme-balham' style={style}>
          <AgGridReact
            columnDefs={this.columns}
            rowData={invoice}
          ></AgGridReact>
        </div>
      </div>
    );
  };
}
