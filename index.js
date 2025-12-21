const { HeygenNode } = require('./nodes/HeygenNode/HeygenNode.node');
const { HeygenTrigger } = require('./nodes/HeygenNode/HeygenTrigger.node');
const { HeyGenApi } = require('./credentials/HeyGenApi.credentials');

module.exports = {
  nodes: [HeygenNode, HeygenTrigger],
  credentials: [HeyGenApi],
};
