# Docker 部署指南

本指南介绍如何使用 Docker 构建和部署 collector-next 项目。

## 📋 前置要求

- Docker Engine 20.10+
- Docker Compose 2.0+ (可选，用于简化部署)
- 项目所需的环境变量配置文件 `.env.local`

## 🏗️ 项目架构

本项目使用 **Multi-Stage Build** 优化 Docker 镜像：

1. **deps** - 安装依赖
2. **builder** - 构建应用
3. **runner** - 运行时环境（最终镜像）

最终镜像使用 Next.js 的 `standalone` 输出模式，大幅减小镜像体积。

## 🚀 快速开始

### 方法一：使用 Docker Compose（推荐）

```bash
# 1. 准备环境变量
cp .env.example .env.local
# 编辑 .env.local 填入实际配置

# 2. 构建并启动容器
docker-compose up -d

# 3. 查看日志
docker-compose logs -f app

# 4. 停止容器
docker-compose down
```

### 方法二：使用 Docker 命令

```bash
# 1. 构建镜像
docker build -t collector-next:latest .

# 2. 运行容器
docker run -d \
  --name collector-next \
  -p 3000:3000 \
  --env-file .env.local \
  --restart unless-stopped \
  collector-next:latest

# 3. 查看日志
docker logs -f collector-next

# 4. 停止容器
docker stop collector-next
docker rm collector-next
```

## 📝 详细步骤说明

### 1. 准备环境变量

创建 `.env.local` 文件并配置必要的环境变量：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AWS S3 配置
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_bucket_name

# 其他配置...
```

### 2. 构建 Docker 镜像

```bash
# 基础构建
docker build -t collector-next:latest .

# 查看构建的镜像
docker images | grep collector-next

# 为镜像打标签（可选，用于版本管理）
docker tag collector-next:latest collector-next:v1.0.0
```

**构建过程说明：**
- Stage 1: 安装 Node.js 依赖（支持 npm/yarn/pnpm/bun）
- Stage 2: 构建 Next.js 应用
- Stage 3: 创建轻量级运行时镜像

### 3. 运行容器

#### 基本运行

```bash
docker run -d \
  --name collector-next \
  -p 3000:3000 \
  --env-file .env.local \
  collector-next:latest
```

#### 使用自定义端口

```bash
docker run -d \
  --name collector-next \
  -p 8080:3000 \
  --env-file .env.local \
  collector-next:latest
```

访问: `http://localhost:8080`

#### 挂载日志目录（可选）

```bash
docker run -d \
  --name collector-next \
  -p 3000:3000 \
  --env-file .env.local \
  -v $(pwd)/logs:/app/logs \
  collector-next:latest
```

### 4. 容器管理

```bash
# 查看运行状态
docker ps

# 查看日志
docker logs collector-next
docker logs -f collector-next  # 实时日志
docker logs --tail 100 collector-next  # 查看最后100行

# 进入容器
docker exec -it collector-next sh

# 重启容器
docker restart collector-next

# 停止并删除容器
docker stop collector-next
docker rm collector-next

# 查看容器资源使用
docker stats collector-next
```

### 5. 健康检查

容器内置健康检查，每30秒检查一次应用状态：

```bash
# 查看健康状态
docker inspect --format='{{.State.Health.Status}}' collector-next

# 查看详细健康日志
docker inspect collector-next | grep -A 10 "Health"
```

## 🔧 Docker Compose 详细配置

### 基础使用

```bash
# 构建并启动
docker-compose up -d

# 重新构建并启动
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose stop

# 停止并删除容器
docker-compose down

# 停止并删除容器、网络、卷
docker-compose down -v
```

### 修改配置

编辑 `docker-compose.yml` 可以调整：
- 端口映射
- 环境变量
- 重启策略
- 资源限制

示例 - 添加资源限制：

```yaml
services:
  app:
    # ... 其他配置
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M
```
