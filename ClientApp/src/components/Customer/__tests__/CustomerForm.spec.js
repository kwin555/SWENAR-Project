import React from "react";
import CustomerForm from "../CustomerForm";
import { shallow } from "enzyme";

describe("CustomerForm tests", () => {
  it("shows customer forms with things rendered", () => {
    const props = {
      Name: "",
      number: "",
    };
    const wrapper = shallow(<CustomerForm {...props}></CustomerForm>);
    expect(wrapper).toMatchSnapshot();
  });
});
