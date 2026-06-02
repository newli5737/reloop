/** PM2 — chạy trên VPS tại /home/reloop */
module.exports = {
  apps: [
    {
      name: 'reloop-api',
      cwd: '/home/reloop/server',
      script: 'dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
