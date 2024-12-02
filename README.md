# 500kalima CMS Dashboard

This project is a CMS dashboard for **500kalima.com**, built using **Next.js** and **TypeScript**. The dashboard is currently accessible only by admins, but we will provide an example URL (e.g., [test.500kalima.com](https://test.500kalima.com)) where you can test the CMS dashboard on a dummy blog.

## Prerequisites

Before you start using the CMS dashboard, ensure the following:

1. **500kalima API server** must be up and running. This is crucial for the CMS to function correctly.
2. Clone and set up the API server by following the instructions in the [500kalima API repository](https://github.com/AQA20/500kalima).

## Setup Guide

### 1. Clone the repository

```bash
git clone https://github.com/AQA20/500kalima-cms.git
cd 500kalima-cms
```

### 2. Install dependencies

Run the following command to install the necessary dependencies:

```bash
npm install
```

**Important:**

Due to the use of Next.js 15 and React 19, you may encounter peer dependency conflicts. If this happens, you may need to use the `--legacy-peer-deps` or `--force` flags to bypass version checks and proceed with the installation.

```bash
npm install --legacy-peer-deps
```

or

```bash
npm install --force
```

These flags should be used with caution. It's highly recommended to update your dependency versions as much as possible to ensure long-term stability.

### 3. Set up environment variables

Create a `.env` file at the root of the project, and configure the required environment variables.

Please check the `example.env` file to find all the required

environment variables. You'll need to configure the `API_URL` to point to your running 500kalima API server.

Example `.env` file:

```bash
API_URL=https://api.500kalima.com
```

Make sure to replace the API_URL with your actual API server URL.

### 4. Run the CMS dashboard

To run the development server with Turbopack, use the following command:

```bash
npm run dev
```

This will start the CMS dashboard on http://localhost:3000 by default.

### 5. Accessing the CMS Dashboard

To access the CMS dashboard, you will need admin credentials. If you want to test the dashboard on a dummy blog, we will provide login details and a test URL (e.g., test.500kalima.com) shortly.

## Available Scripts

Here are the available scripts for different tasks:

`dev`: Runs the development server with Turbopack.

```bash
npm run dev
```

`build`: Builds the application for production.

```bash
npm run build
```

`start`: Starts the production server.

```bash
npm run start
```

`lint`: Runs the ESLint checks on the code.

```bash
npm run lint
```

`fix`: Runs Prettier to format the code.

```bash
npm run fix
```

`e2e`: Runs the Playwright end-to-end tests.

```bash
npm run e2e
```

`test`: Runs the unit tests using Vitest.

```bash
npm run test
```

`coverage`: Runs tests with coverage reporting.

```bash
npm run coverage
```

## Contributing

Feel free to contribute to this project by submitting issues and pull requests. To get started, fork the repository and create a branch for your changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
