module.exports = {
  apps: [{
    name: "n-live-backend",
    script: "src/index.js"
  }],
  deploy: {
    production: {
      user: "root",
      host: ["159.65.121.101"],
      ref: "origin/main",
      repo: "git@github.com:nfactorial-incubator/live-backend.git",
      path: "n-live-backend/",
      'post-setup': "npm install",
      'post-deploy': 'pm2 startOrRestart ecosystem.config.js --env production',
    },
  }
}

