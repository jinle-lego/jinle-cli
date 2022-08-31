module.exports = {
    "linters": {
        "packages/**/*.{js,ts}": ["eslint --fix"]
    },
    "ignore": ["node_modules", "packages/**/__tests__", "packages/**/dist"]
}
