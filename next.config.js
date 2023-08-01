// next.config.js
module.exports = {
  webpack: (config) => {
    config.resolve.alias['jotai'] = 'jotai';
    return config;
  },
};
