# Node.js Math API

A simple REST API for basic mathematical operations with automated GitLab CI/CD deployment to AWS EC2.

## Development Usage

### Prerequisites
- Node.js 18+ installed
- Git for version control

### Setup and Run Locally

```bash

# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm start
```

The API runs on `http://localhost:3000` by default.

### API Endpoints

| Endpoint | Method | Parameters | Example Request | Response |
|----------|--------|------------|-----------------|----------|
| `/` | GET | - | `curl http://localhost:3000/` | `OK - Container IP: 192.168.1.100, Client IP: ::1` |
| `/health` | GET | - | `curl http://localhost:3000/health` | `Health Check OK` |
| `/add` | GET | `a`, `b` | `curl "http://localhost:3000/add?a=5&b=3"` | `{"result": 8}` |
| `/subtract` | GET | `a`, `b` | `curl "http://localhost:3000/subtract?a=10&b=4"` | `{"result": 6}` |
| `/multiply` | GET | `a`, `b` | `curl "http://localhost:3000/multiply?a=3&b=7"` | `{"result": 21}` |
| `/divide` | GET | `a`, `b` | `curl "http://localhost:3000/divide?a=15&b=3"` | `{"result": 5}` |

### Testing Examples

```bash
# Health check
curl http://localhost:3000/health

# Get IP info
curl http://localhost:3000/

# Math operations
curl "http://localhost:3000/add?a=10&b=5"
curl "http://localhost:3000/subtract?a=20&b=8"
curl "http://localhost:3000/multiply?a=6&b=9"
curl "http://localhost:3000/divide?a=100&b=4"

# Error handling
curl "http://localhost:3000/divide?a=10&b=0"  # Division by zero error
```

## GitLab CI/CD Pipeline

### Overview

The project includes automated CI/CD that:
1. **Install** - Downloads dependencies
2. **Test** - Runs Jest test suite  
3. **Build** - Creates Docker image tagged with commit SHA
4. **Deploy** - Deploys to AWS EC2 with health validation

### Required GitLab Variables

Configure these in **Settings > CI/CD > Variables**:

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `IMAGE_NAME` | Variable | Container registry path | `registry.gitlab.com/username/nodeapi-demo` |
| `REGISTRY_USER` | Variable | Registry username | `gitlab-ci-token` |
| `REGISTRY_PASS` | Variable (Masked) | Registry password/token | `glpat-xxxxxxxxxxxxx` |
| `SSH_KEY` | File | Private SSH key for EC2 | Upload your private key file |

### Pipeline Stages

#### 1. Install & Test
```yaml
install:
  - npm ci                    # Clean install dependencies
  - cache node_modules/       # Cache for subsequent stages

test:
  - npm test                  # Run Jest tests
```

#### 2. Build & Push Docker Image
```yaml
build_image:
  - docker build -t "$IMAGE_NAME:$CI_COMMIT_SHORT_SHA" .
  - docker push "$IMAGE_NAME:$CI_COMMIT_SHORT_SHA"
```

Each commit gets a unique Docker image tagged with its Git commit SHA (e.g. `nodeapi-demo:a1b2c3d`).

#### 3. Deploy to EC2
```yaml
deploy:
  - ssh to EC2 instance
  - docker login to registry
  - docker pull new image
  - docker rm old containers  
  - docker run new containers on ports 5000, 5001
  - curl health checks on both instances
```

### Deployment Process

1. **Push code** to GitLab repository
2. **Pipeline triggers** automatically on push to main branch
3. **Tests run** - pipeline stops if tests fail
4. **Docker image builds** with commit SHA tag
5. **Image pushes** to GitLab Container Registry
6. **SSH deploys** to EC2:
   - Stops old containers (`nodeapi-demo-1`, `nodeapi-demo-2`)
   - Pulls latest image
   - Starts 2 new containers on ports 5000, 5001
   - Health checks both instances
7. **Pipeline succeeds** if health checks pass

### EC2 Setup Requirements

Your EC2 instance needs:
- **Amazon Linux 2023** or Ubuntu
- **Docker installed and running**
- **Security group** allowing:
  - SSH (port 22) from GitLab runners
  - HTTP (ports 5000, 5001) for the application
- **SSH key pair** with private key uploaded to GitLab

### Monitoring Deployment

```bash
# Check pipeline status in GitLab UI
# View live deployment logs in CI/CD > Pipelines

# SSH to EC2 to check containers
ssh ec2-user@your-ec2-ip
sudo docker ps                        # List running containers
sudo docker logs nodeapi-demo-1       # View app logs
sudo docker logs nodeapi-demo-2

# Test deployed application
curl http://your-ec2-ip:5000/health    # Instance 1
curl http://your-ec2-ip:5001/health    # Instance 2
```

### Manual Deployment (Backup)

If CI/CD fails, deploy manually:

```bash
# Build image locally
docker build -t nodeapi-demo:manual .

# Push to registry (if needed)
docker tag nodeapi-demo:manual your-registry/nodeapi-demo:manual
docker push your-registry/nodeapi-demo:manual

# Deploy to EC2
ssh ec2-user@your-ec2-ip
sudo docker pull your-registry/nodeapi-demo:manual
sudo docker rm -f nodeapi-demo-1 nodeapi-demo-2
sudo docker run -d --name nodeapi-demo-1 -p 5000:3000 your-registry/nodeapi-demo:manual
sudo docker run -d --name nodeapi-demo-2 -p 5001:3000 your-registry/nodeapi-demo:manual
```

### Troubleshooting CI/CD

**Pipeline fails at test stage:**
- Check test output in GitLab pipeline logs
- Run `npm test` locally to debug

**Build stage fails:**
- Verify Dockerfile syntax
- Check if base image (node:25-slim) is accessible
- Ensure Docker-in-Docker service is enabled

**Deploy stage fails:**
- Verify EC2 instance is accessible via SSH
- Check SSH_KEY variable is properly uploaded as File type
- Ensure Docker daemon is running on EC2: `sudo systemctl start docker`
- Verify registry credentials are correct

**Health check fails:**
- SSH to EC2 and check container logs: `sudo docker logs nodeapi-demo-1`
- Verify containers are running: `sudo docker ps`
- Test manually: `curl http://localhost:5000/health`

## Project Structure

```
nodeapi-demo/
├── index.js              # Main Express application
├── utils/                # Math operation modules
│   ├── add.js
│   ├── subtract.js  
│   ├── multiply.js
│   └── divide.js
├── __tests__/            # Jest test files
├── Dockerfile            # Container definition
├── .gitlab-ci.yml        # CI/CD pipeline configuration
├── package.json          # Dependencies and npm scripts
└── README.md             # This documentation
```

## Quick Reference

**Local development:**
```bash
npm install && npm test && npm start
```

**Access deployed app:**
- Instance 1: `http://your-ec2-ip:5000`
- Instance 2: `http://your-ec2-ip:5001`

**Common debugging:**
```bash
# Local
npm test                           # Run tests
curl http://localhost:3000/health  # Test locally

# Production  
ssh ec2-user@your-ec2-ip "sudo docker ps"              # Check containers
ssh ec2-user@your-ec2-ip "sudo docker logs nodeapi-demo-1"  # Check logs
```
