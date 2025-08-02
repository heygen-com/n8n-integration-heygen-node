# Local development

If n8n-nodes-heygen-official in some folder "/home/username/projects/n8n-heygen-node" after changing code of this node, we need:

1. In this folder run `npm run build && npm link`
2. Go to global n8n folder and sub-folder "custom" (for example: ~/.n8n/custom) and from this folder run `npm link n8n-nodes-heygen-official` where "n8n-nodes-heygen-official" is name of this package (in package.json)
3. Run `n8n start` to start local n8n server
4. Now we should be able to find HeyGen node
5. Link operations need to be done only one time, then after changes in code, just run `npm run build` and then `n8n start` to see changes

# Lint

6. Run `npm run lint` to check for errors or `npm run lintfix` to automatically fix errors when possible.

Important: Some of lint errors do not follow logic, so we can skip them.

# Publish

7. [Publish](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry) your package to npm.

## More information

Refer to [documentation on creating nodes](https://docs.n8n.io/integrations/creating-nodes/) for detailed information on building your own nodes.
