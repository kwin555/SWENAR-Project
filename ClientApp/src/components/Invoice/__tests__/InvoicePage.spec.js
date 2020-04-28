import React from "react";
import { InvoicePage } from "../InvoicePage";
import { mount, shallow } from "enzyme";

describe("Invoice Page tests", () => {
  it("shows customer forms with things rendered", () => {
    const props = { invoice: [] };
    const wrapper = shallow(<InvoicePage {...props}></InvoicePage>);
    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
  });
});
