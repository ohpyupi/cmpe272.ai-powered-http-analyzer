const packageJson = require('../../package.json');

const appInfo = () => {
  const copy = { ...packageJson };
  const dependencies = Object.keys(copy.dependencies).map((dep) => `${dep}@${packageJson.dependencies[dep]}`);
  copy.dependencies = dependencies;
  return copy;
};

module.exports = { appInfo };