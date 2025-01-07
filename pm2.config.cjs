module.exports = {
  apps: [
    {
      name: process.env.PM2_NAME || 'admin-dev',
      script: 'npm start',
      env: {
        PORT: process.env.PORT || '3003',
      },
    },
  ],
};
