module.exports = {
  apps: [
    {
      name: "innova-dashboard",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/var/www/html/innova-dashboard",
      instances: "1",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
