# File Selection Table

## Overview

This project demonstrates a **File Selection Table** built using **React**. It includes basic functionality for selecting and deselecting files, with a "Download Selected" button that simulates file download by alerting the user with the selected file details.

The project is built with modern JavaScript, using **CSS Modules** for scoped styling and **Jest** along with **React Testing Library (RTL)** for testing. This ensures the code is both modular and well-tested.

## Installation

To get started, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vpellegrino/file-selection-table.git
   cd file-selection-table
   ```

2. **Install dependencies**:
   Ensure you have Node.js installed (tested with `v18.13.0`), then run:
   ```bash
   npm install
   ```

   This will install all the necessary dependencies, including React, React DOM, and the testing libraries.

## Running the Project

To start the project in development mode:

```bash
npm start
```

This will start a development server, and you can view the application at [http://localhost:3000](http://localhost:3000).

The app will automatically reload if you make changes to the code.

## Building for Production

To create a production build, run:

```bash
npm run build
```

This will create a production-ready build of the app in the `build` folder, optimized for performance.

## Running Tests

The project is set up with Jest and React Testing Library for unit testing. To run the tests:

```bash
npm test
```

## Linting and Formatting

### Lint JavaScript

To run ESLint to check for errors in your JavaScript code:

```bash
npm run lint:js
```

### Lint CSS

To run Stylelint to check for errors in your CSS:

```bash
npm run lint:css
```

### Auto-format code with Prettier

To automatically format JavaScript and CSS files:

```bash
npm run format
```

## Troubleshooting

- **Port conflicts**: If port 3000 is already in use, you can specify a different port:
  ```bash
  PORT=3001 npm start
  ```

- **Dependency issues**: If you run into issues with dependencies or package versions, try removing `node_modules` and `package-lock.json`, then reinstalling:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
