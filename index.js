const { HeygenNode } = require('./nodes/HeygenNode/HeygenNode.node');
const { HeyGenApi } = require('./credentials/HeyGenApi.credentials');

module.exports = {
  nodes: [HeygenNode],
  credentials: [HeyGenApi],
};
