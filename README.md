# NodeAPI Demo

This is a barebones Express.js API

## Features
- Simple Express server
- Health check endpoint at `/health`

## Getting Started

### 1. Install dependencies
```
npm install
```

### 2. Start the server
```
node index.js
```

The server will run on port 80 by default. You can change the port in index.js

### 3. Test the health endpoint
Visit `http://yourip:80/health` in your browser or use curl:
```
curl http://localhost:80/health
```

## Deployment on Azure VM (Ubuntu) - use sudo if not initialize from a userscript
apt update
apt install -y nodejs npm git
git clone https://github.com/hswg94/nodeapi-demo.git
cd nodeapi-demo
npm i
node index.js
