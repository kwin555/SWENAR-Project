import React from "react";
import CustomerPage from "../CustomerPage";
import { shallow } from "enzyme";
import axios from "axios";
import fetchMock from "fetch-mock";

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

  it("should set customer state", () => {
    const props = {
      Name: "",
      number: "",
      redirect: false,
      match: {
        params: 3,
      },
    };

    const wrapper = shallow(<CustomerPage {...props} redirect={true} />);

    wrapper.instance().setCustomerData({ name: "kevin", number: "1234" });

    expect(wrapper.state()).toEqual({
      Name: "kevin",
      Number: "1234",
      redirect: false,
    });
  });

  it("should handle num and name  change", () => {
    const props = {
      Name: "",
      number: "",
      redirect: true,
      match: {
        params: 3,
      },
    };

    const wrapper = shallow(<CustomerPage {...props} redirect={true} />);

    wrapper.instance().handleNameNumberchange("kevin", "3234");

    expect(wrapper.state()).toEqual({
      Name: "kevin",
      Number: "3234",
      redirect: false,
    });
  });

  it("should handle num and name  change", () => {
    const props = {
      Name: "",
      number: "",
      redirect: false,
      match: {
        params: 3,
      },
    };

    const wrapper = shallow(<CustomerPage {...props} />);
    fetchMock.delete("/api/customer/3", () => {
      return 200;
    });

    wrapper.instance().handleDelete();
    wrapper.setState({ redirect: true });

    expect(wrapper.state()).toEqual({
      Name: "",
      Number: "",
      redirect: true,
    });
  });
});
