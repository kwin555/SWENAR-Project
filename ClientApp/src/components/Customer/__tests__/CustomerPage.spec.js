import React from "react";
import CustomerPage from "../CustomerPage";
import { shallow } from "enzyme";
import axios from "axios";

describe("CustomerPage tests", () => {
  it("shows customer page with things rendered", () => {
    const props = {
      Name: "",
      number: "",
      redirect: false,
      match: {
        params: 3,
      },
    };

    const wrapper = shallow(<CustomerPage {...props} />);
    expect(wrapper.instance()).not.toEqual(null);
  });

  it("shows customer page with things rendered", () => {
    const props = {
      Name: "",
      number: "",
      redirect: true,
      match: {
        params: 3,
      },
    };

    const wrapper = shallow(<CustomerPage {...props} />);
    expect(wrapper.instance()).not.toEqual(null);
  });

  it("shows customer page with things rendered", () => {
    const props = {
      Name: "",
      number: "",
      redirect: true,
      match: {
        params: 3,
      },
    };

    const wrapper = shallow(<CustomerPage {...props} />, {
      disableLifecycleMethods: false,
    });

    expect(wrapper.instance()).not.toEqual(null);
  });
});
