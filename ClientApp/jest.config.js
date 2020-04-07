module.exports = {
  roots: ["./src"],
  transformIgnorePatterns: ["node_modules"],
  coverageThreshold: {
    global: {
      statement: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
  modulePaths: ["<rootDir>/src"],
  coverageDirectory: "build/code_coverage",
  collectCoverageFrom: ["src/components"],
  coverageReporters: ["html", "text"],
  globals: {
    "process.env.NODE_ENV": "test",
  },
  resetModules: true,
  testURL: "http://localhost",
};
