module.exports = {
  collectCoverage: false,
  moduleFileExtensions: [ "ts", "tsx", "js", "jsx", "json", "node" ],
  testEnvironment: 'node',
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: ["/tests/utils/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};
