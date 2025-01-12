module.exports = {
  apps: [
    {
      name: process.env.PM2_NAME || 'admin-dev',
      script: 'npm start',
      env: {
        PORT: process.env.PORT || '3003',
        NEXT_ENVIRONMENT: process.env.NEXT_PUBLIC_NODE_ENV,
      },
    },
  ],
};
