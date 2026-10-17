# vulnerable-app

Intentionally vulnerable Node.js app for SCA and container-scanning labs.
**Do not deploy to production or expose to the internet.**

- Vulnerable dependencies pinned in `package.json` / `package-lock.json`
  (express 4.16.0, lodash 4.17.15, axios 0.21.0, jsonwebtoken 8.5.1, moment 2.29.1,
  minimist 1.2.5, handlebars 4.5.3, marked 0.3.6, ejs 3.1.6, node-fetch 2.6.0)
- Outdated base image `node:14.17.0-alpine`, runs as root

## Run locally
    docker build -t vulnerable-app .
    docker run -p 8080:8080 vulnerable-app

## Run on GKE
    kubectl apply -f k8s/deployment.yaml
    kubectl port-forward svc/vulnerable-app 8080:80
    # open http://localhost:8080
