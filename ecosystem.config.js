module.exports = {
  apps: [{
    name: "n-live-backend",
    script: "src/index.js"
  }],
  deploy: {
    production: {
      user: "root",
      host: ["159.65.121.10"],
      ref: "origin/main",
      repo: "git@github.com:nfactorial-incubator/live-backend.git",
      path: "~/n-live-backend",
      'post-setup': "ls -la",
      'pre-deploy-local': "echo 'Starting deployment...'",
      'post-deploy': "npm install",
    },
  }
}

