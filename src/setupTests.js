import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";

function noOp() {}

function createObjectURL(file) {
  return file.name;
}

if (typeof window.URL.createObjectURL === "undefined") {
  Object.defineProperty(window.URL, "createObjectURL", {
    value: createObjectURL
  });
}

if (typeof window.URL.revokeObjectURL === "undefined") {
  Object.defineProperty(window.URL, "revokeObjectURL", { value: noOp });
}
