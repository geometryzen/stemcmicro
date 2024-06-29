## WARNING

stemcmicro currently uses a proprietary version of the Lerna monorepo pending the acceptance of a Pull Request (PR).

This version is available at https://github.com/geometryzen/lerna

In order to develop stemcmicro, you MUST clone this repo then take the following actions.

Read the contributing guide in Lerna and set up volta, verdaccio, etc as if you were going to develop Lerna.

In the Lerna folder, in a Terminal (1)

```
npm install
npm run build
npm run local-registry start
```

This starts a local package registry using verdaccio on port 4873.

We're going to install a modified Lerna package into this local registry.

Later, when building stemcmicro, we'll install Lerna from this local registry.

In the Lerna folder, in a second Terminal (2)

```
npm adduser --registry=http://localhost:4873
```

(test/test/test@test.io) will do for usename, passord, email.

```
npm --registry=http://localhost:4873 run lerna-release 999.9.9 --local
```

This builds the modified Lerna and publishes it to the local registry.

In the stemcmicro folder,

```
npm --registry=http://localhost:4873/ install
```

This installs dependencies in the node_modules folder.

You are now ready to build stemcmicro...

```
npm run build
```
