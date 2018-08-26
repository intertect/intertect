module.exports = {
  "extends": [
    "airbnb",
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  "plugins": [
    "notice",
    "react",
  ],
  "rules": {
    "notice/notice": ["error",
      {
        "templateFile":"config/copyright.js",
        "onNonMatchingHeader": "report",
      },
    ],
  },
};

