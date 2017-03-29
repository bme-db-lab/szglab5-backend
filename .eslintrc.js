module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "airbnb-base",
    "rules": {
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": 1,
        "indent": [
            "error",
            2,
            {
              "SwitchCase": 1
            }
        ],
        "comma-dangle": 0,
        "global-require": 0,
        "linebreak-style": 0
    }
};
