const packageJson = require('../../package.json');

const showVersion = (req, res, next) => {
    const appVersion = packageJson.version;
    res.setHeader('X-App-Version', appVersion);
    next();
};

module.exports = showVersion;