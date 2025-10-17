# React Components

[![Build Status](https://github.com/datawizio/rc/actions/workflows/release.yml/badge.svg)](https://github.com/datawizio/rc/actions)
[![GitHub Package Version](https://img.shields.io/github/package-json/v/datawizio/rc?color=red&label=Version)](https://github.com/datawizio/rc)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A comprehensive React components library built with TypeScript, Ant Design, and modern web technologies. 
This library provides a collection of reusable, customizable, 
and production-ready components for building data-driven applications.

## 📦 Installation

This library is published to **GitHub Packages**. To use it, you'll need to configure your `.npmrc` file. 
Copy the content of the `.npmrc.example` file to the `.npmrc` in the project root. 
You can do it by running the following command:

```bash
cp .npmrc.example .npmrc
```

Replace `{TOKEN}` with your personal GitHub token.

> Read more about [working with the npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

After configuring the `.npmrc` file, you can install the library in your project:

```bash
yarn add @datawizio/rc
```

## 🛠️ Local Development

### Prerequisites

The Node.js version used for this project is specified in the `.nvmrc` file.
We recommend using [_Node Version Manager (NVM)_](https://github.com/nvm-sh/nvm) 
to set up the correct Node.js version on your machine.

The project also uses [`yarn`](https://github.com/yarnpkg/yarn) as the package managers.

### Development Workflow

After making some changes in the `rc` library locally, build it with:

```bash
yarn build:dev
```

If you want to test your local changes in another project without publishing a new version, 
you can link the `@datawizio/rc` package:

```bash
# In the library folder
yarn link

# In your project folder
yarn link "@datawizio/rc"
```

Before building your project for production, make sure to unlink the library from your project:

```bash
yarn unlink "@datawizio/rc"
```

## 🤝 Contributing

Please see our [Code Conventions](docs/code-conventions.md) for guidelines on how to contribute to this project.

---

Built with 💜 by the Datawiz.io team
