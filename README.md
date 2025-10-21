# Node API Demo
A simple Node.js REST API for basic math operations with automated CI/CD deployment to AWS EC2.

## Features
- **Math Operations**: Addition, subtraction, multiplication, division endpoints
- **Health Check**: Built-in health monitoring endpoint
- **Containerized**: Docker-ready with production Dockerfile
- **CI/CD Pipeline**: GitLab CI automated testing, building, and deployment
- **AWS Deployment**: Automated deployment to EC2 with health validation

## API Endpoints

| Endpoint | Method | Parameters | Example |
|----------|--------|------------|---------|
| `/add` | GET | `a`, `b` | `/add?a=5&b=3` → `{"result": 8}` |
| `/subtract` | GET | `a`, `b` | `/subtract?a=10&b=4` → `{"result": 6}` |
| `/multiply` | GET | `a`, `b` | `/multiply?a=3&b=7` → `{"result": 21}` |
| `/divide` | GET | `a`, `b` | `/divide?a=15&b=3` → `{"result": 5}` |
| `/health` | GET | - | `/health` → `"Health Check OK"` |
| `/` | GET | - | Root endpoint |

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm start
```

The app runs on `http://localhost:3000` (or `PORT` environment variable).

### Docker

```bash
# Build image
docker build -t nodeapi-demo .

# Run container
docker run -d -p 3000:3000 --name nodeapi-demo nodeapi-demo

# Test
curl http://localhost:3000/health
```

## Deployment

### Automated CI/CD

The project includes a GitLab CI pipeline that:

1. **Install** - Installs dependencies and caches `node_modules`
2. **Test** - Runs Jest test suite
3. **Build** - Creates Docker image tagged with commit SHA
4. **Deploy** - Deploys to EC2 with health validation

**Required GitLab CI Variables:**
- `IMAGE_NAME` - Container registry path
- `REGISTRY_USER`- Docker Username
- `REGISTRY_PASS` - Docker Password
- `SSH_KEY` - Private key file for EC2 access (File variable)

### Manual Deployment

```bash
# Build and push image
docker build -t your-registry/nodeapi-demo:latest .
docker push your-registry/nodeapi-demo:latest

# Deploy to EC2
ssh ec2-user@your-instance "sudo docker pull your-registry/nodeapi-demo:latest"
ssh ec2-user@your-instance "sudo docker rm -f nodeapi-demo || true"
ssh ec2-user@your-instance "sudo docker run -d --name nodeapi-demo -p 80:3000 your-registry/nodeapi-demo:latest"
```

## Infrastructure

### EC2 Setup
The app deploys to Amazon Linux 2023 with:
- Docker installed and running
- Instance must be accessible via SSH with provided key

## Architecture

```
GitLab CI → Container Registry → EC2 Instance → Docker Container
Access through docker Port 5000/5001 mapped to App Port 3000
```


### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Test coverage
npm run test:coverage
```

### Adding New Endpoints

1. Create utility function in `utils/`
2. Add route handler in `index.js`
3. Write tests in `__tests__/`
4. Commit and push (auto-deploys via CI/CD)

## Monitoring

### Health Checks

The `/health` endpoint returns:
- **200 OK**: Service is healthy
- Logs client IP for debugging
- Used by CI/CD for deployment validation

### Container Logs

```bash
# View live logs
docker logs -f nodeapi-demo

# On EC2
ssh ec2-user@instance "sudo docker logs -f nodeapi-demo"
```

### Debugging Network

```bash
# Check container IP
docker inspect -f <container_name>