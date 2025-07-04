# NodeAPI Demo

This is a barebones Express.js API designed for easy deployment on an Azure VM running Ubuntu.

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
npm start
```

The server will run on port 3000 by default. You can change the port by setting the `PORT` environment variable.

### 3. Test the health endpoint
Visit `http://<your-vm-ip>:3000/health` in your browser or use curl:
```
curl http://localhost:3000/health
```

## Deployment on Azure VM (Ubuntu)
1. SSH into your VM.
2. Clone or copy this project to the VM.
3. Make sure Node.js and npm are installed (`node -v` and `npm -v`).
4. Run `npm install` and `npm start` as above.
5. Use a process manager like `pm2` for production (optional).

