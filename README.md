# 🚗 Car Dealer CMS — Full-Stack Car Marketplace with AI + K8s + Observability

A production-grade car marketplace platform with a dual-console architecture — an admin CMS for managing listings and a user-facing storefront for browsing and booking vehicles. Deployed on AWS EKS with full observability stack.

**Live Demo** → [car-dealer.rsxdev.co.in](https://rsxdev.co.in) | **GitHub** → [Raghvendra9402](https://github.com/Raghvendra9402)

---

## Screenshots

### Grafana — Node Exporter (CPU / Memory / Disk)

![Node Exporter Dashboard](./docs/grafana-node-exporter.png)

### Grafana — tRPC Request Metrics (P95 / P99 Latency)

![tRPC Metrics](./docs/grafana-trpc-metrics.png)

### Grafana — Average Request Duration per Container

![Request Duration](./docs/grafana-request-duration.png)

> Loki log dashboards coming soon

---

## Architecture

```
                    ┌─────────────────────────────────┐
                    │         AWS EKS Cluster          │
                    │                                  │
  User/Admin  ───▶  │  Nginx Ingress Controller        │
  (HTTPS)          │         ↓                        │
                    │  car-dealer-app (Pod)            │
                    │    Next.js + tRPC                │
                    │         ↓                        │
                    │  PostgreSQL (RDS)                │
                    │                                  │
                    │  Observability Stack:            │
                    │  Prometheus → Grafana            │
                    │  Loki → Grafana (logs)           │
                    │  Node Exporter (host metrics)    │
                    │                                  │
                    │  ArgoCD (GitOps deployments)     │
                    │  Cert-Manager (TLS certs)        │
                    │  HPA (auto scaling)              │
                    │  Sealed Secrets                  │
                    └─────────────────────────────────┘
                              ↓
                         AWS S3
                    (Loki log storage +
                     car image uploads)
```

---

## Features

**Admin Console:**

- Create and manage car listings
- Upload car images → stored in AWS S3
- AI-powered image scraping using Gemini Vision — automatically fills vehicle details (make, model, year, mileage, price) from uploaded photos
- View customer booking details per listing
- Tabbed UI for car details and customer management

**User Storefront:**

- Browse car listings with multiple filters (make, model, price range, year, fuel type)
- Book a car on a specific date
- Clean responsive UI

---

## Tech Stack

| Layer              | Tech                            |
| ------------------ | ------------------------------- |
| Frontend + Backend | Next.js (App Router)            |
| API Layer          | tRPC + React Query              |
| Database           | PostgreSQL + Prisma ORM         |
| Background Jobs    | Inngest                         |
| File Storage       | AWS S3                          |
| AI                 | Gemini Vision (image scraping)  |
| Styling            | Tailwind CSS + shadcn/ui        |
| Container          | Docker                          |
| Orchestration      | Kubernetes (AWS EKS)            |
| IaC                | Terraform                       |
| GitOps             | ArgoCD                          |
| Ingress            | Nginx Ingress Controller        |
| TLS                | Cert-Manager (Let's Encrypt)    |
| Autoscaling        | HPA (Horizontal Pod Autoscaler) |
| Secrets            | Sealed Secrets                  |
| Metrics            | Prometheus + Node Exporter      |
| Logs               | Loki + S3 backend               |
| Dashboards         | Grafana                         |

---

## Infrastructure

Full VPC + EKS infrastructure is managed via Terraform in a separate repo:

**Infrastructure Repo** → [aws-vpc-eks-infra](https://github.com/Raghvendra9402/aws-vpc-eks-infra.git)

### What the infra repo provisions:

**Networking:**

```
VPC
├── Public Subnets  (NAT Gateway, Load Balancer)
│     └── Internet Gateway
│     └── Elastic IP
│     └── NAT Gateway
└── Private Subnets (EKS nodes, RDS)
      └── Route Tables
```

**EKS Cluster:**

```
EKS Control Plane
└── Node Groups (EC2 worker nodes)
    └── Add-ons:
        ├── Metrics Server
        ├── Cluster Autoscaler
        ├── Nginx Ingress Controller
        ├── Cert-Manager
        ├── ArgoCD
        ├── Prometheus
        ├── Loki (logs → S3)
        ├── Grafana
        └── Sealed Secrets
```

---

## Observability

### Metrics — Prometheus + Grafana

**Node-level metrics (Node Exporter):**

- CPU usage, memory usage, disk I/O
- Network traffic
- System uptime

**Application-level metrics (custom tRPC instrumentation):**

- Total tRPC requests
- Active requests
- P95 request latency
- P99 request latency
- Average request duration per endpoint per container

### Logs — Loki + S3 + Grafana

- All pod logs shipped to Loki
- Loki uses S3 as backend storage (cost-efficient, no disk)
- Queryable via Grafana LogQL

### Dashboards

| Dashboard          | What it shows                                      |
| ------------------ | -------------------------------------------------- |
| Node Exporter Full | CPU, Memory, Disk, Network per node                |
| tRPC Metrics       | Request rate, latency percentiles, active requests |
| Request Duration   | Average response time per container/endpoint       |
| Loki Logs          | Full application log stream with filtering         |

---

## GitOps with ArgoCD

All Kubernetes manifests are in the [ops_repo](https://github.com/Raghvendra9402/ops-repo/tree/main/production/car-dealer-cms). ArgoCD watches the repo and automatically syncs changes to the cluster.

```
ArgoCD → watches the ops-repo → applies k8s manifests → EKS cluster
```

Any `git push` to the `main` branch triggers an automatic deployment.

---

## HPA — Horizontal Pod Autoscaler

The application scales automatically based on CPU utilization:

```yaml
minReplicas: 1
maxReplicas: 5
targetCPUUtilizationPercentage: 70
```

Cluster Autoscaler handles node-level scaling when pods can't be scheduled.

---

## Repo Structure

```
car-dealer-cms/
  app/                   # Next.js app router
  components/            # UI components (shadcn)
  trpc/                # tRPC routers
  prisma/                # Database schema
  inngest/               # Background job functions
  lib/                   # Shared utilities
  docs/                  # Screenshots and architecture
  Dockerfile
  .env.example
  README.md
```

---

## Local Setup

### Prerequisites

- Node.js 20+
- Docker
- PostgreSQL

### 1. Clone and install

```bash
git clone https://github.com/Raghvendra9402/car-dealer-cms
cd car-dealer-cms
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

```bash
# .env.example

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/car_dealer

# Authentiction
BETTER_AUTH_SECRET=your_betterauth_secret
BETTER_AUTH_URL=your_app_base_url

# AWS S3 (car image uploads)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your_bucket_name

# AI
GEMINI_API_KEY=your_gemini_api_key

# Upstash_redis
UPSTASH_REDIS_REST_URL=your_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token

# Resend- Email service
RESEND_API_KEY=your_resend_api_key
```

### 3. Database setup

```bash
npx prisma migrate dev
npx prisma db seed
```

### 4. Run locally

```bash
npm run dev
```

---

## Deploying to Kubernetes

Infrastructure must be provisioned first:

```bash
# 1. Provision VPC + EKS
git clone https://github.com/Raghvendra9402/aws-vpc-eks-infra.git
cd aws-vpc-eks-infra
terraform init
terraform apply

# 2. Configure kubectl
aws eks update-kubeconfig --region ap-south-1 --name your-cluster-name

# 3. Create sealed secret for app env vars
kubectl create secret generic car-dealer-secret \
  --from-env-file=.env \
  --dry-run=client -o yaml | kubeseal -o yaml > k8s/sealed-secret.yaml

# 4. Push to GitHub → ArgoCD auto-deploys
git add k8s/
git commit -m "deploy: update manifests"
git push
```

ArgoCD picks up the changes and deploys to the cluster automatically.

---

## Security

- **Sealed Secrets** — Kubernetes secrets are encrypted before committing to Git. Only the cluster can decrypt them.
- **Private subnets** — EKS nodes run in private subnets, not directly accessible from the internet
- **Nginx Ingress** — single entry point for all traffic
- **Cert-Manager** — automatic TLS certificate provisioning via Let's Encrypt
- **IAM Roles for Service Accounts (IRSA)** — pods access S3 via IAM role, no static credentials

---

Built by [@rsxdev](https://rsxdev.co.in)
