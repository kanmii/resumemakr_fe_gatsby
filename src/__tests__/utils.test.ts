import { stripTypeName } from "../components/utils";

describe("stripTypeName", () => {
  it("does nothing if object is primitive type", () => {
    expect(stripTypeName("1")).toBe("1");
  });

  it("strips from object", () => {
    expect(
      stripTypeName({
        a: "1",
        __typename: "yes"
      })
    ).toEqual({ a: "1" });
  });

  it("strips from array", () => {
    expect(
      stripTypeName([
        {
          a: "1",
          __typename: "yes"
        },

        {
          b: "2",
          __typename: "no"
        }
      ])
    ).toEqual([{ a: "1" }, { b: "2" }]);
  });
});
