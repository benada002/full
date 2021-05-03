module.exports = {
    extends: ['airbnb-typescript'],
    parserOptions: {
        project: './tsconfig.json',
    },
    rules: {
        "import/no-cycle": 0,
        "max-classes-per-file": 0,
        "class-methods-use-this": 0,
        "react/prop-types": 0
    }
};