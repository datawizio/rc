# React Components

[![Build Status](https://github.com/datawizio/rc/actions/workflows/release.yml/badge.svg)](https://github.com/datawizio/rc/actions)
[![GitHub Package Version](https://img.shields.io/github/package-json/v/datawizio/rc?color=red&label=Version)](https://github.com/datawizio/rc)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A comprehensive React components library built with TypeScript, Ant Design, and modern web technologies. This library provides a collection of reusable, customizable, and production-ready components for building data-driven applications.

## 📦 Installation

> **⚠️ Prerequisites**: Make sure you've configured your `.npmrc` file and authenticated with GitHub Packages (see [NPM Configuration](#npm-configuration) below).

```bash
# Using npm
npm install @datawizio/rc

# Using yarn
yarn add @datawizio/rc

# Using pnpm
pnpm add @datawizio/rc
```


## 🛠️ Local Development

### Setting up the Library for Development

#### 1. **Clone and install dependencies:**
```bash
git clone https://github.com/datawizio/rc.git
cd rc
yarn install
```

#### 2. **Build the library:**
```bash
yarn build
```

#### 3. **Link the library globally:**
```bash
yarn link
```

### Using the Library in Your Project

#### 1. **In your project directory, link to the local library:**
```bash
yarn link "@datawizio/rc"
```

#### 2. **Import and use components:**
```tsx
import { Button, Table } from '@datawizio/rc';
```

## 📦 Publishing & Configuration

### NPM Configuration

This library is published to **GitHub Packages**. To use it, you'll need to configure your `.npmrc` file.
Copy the content of the `.npmrc.example` file to the `.npmrc` in the project root.
You can do it by running the following command:

```bash
cp .npmrc.example .npmrc
```

Replace `{TOKEN}` with your personal GitHub token.

> Read more about [working with the npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

## 🤝 Contributing

We welcome contributions! Please see our [Code Conventions](docs/code-conventions.md) for guidelines on how to contribute to this project.

---

Built with ❤️ by the Datawiz.io team
