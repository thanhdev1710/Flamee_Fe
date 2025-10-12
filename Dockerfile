# ================================
# Stage 1: Base image dùng chung
# ================================
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# ================================
# Stage 2: Cài đặt dependencies
# ================================
FROM base AS deps
# Copy file package để tách layer cache
COPY package.json package-lock.json* ./
# Cài đặt dependencies production (bỏ devDeps)
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force

# Tạo thư mục cache cho Next.js runtime
RUN mkdir -p /app/.next/cache \
    && chown -R node:node /app/.next

# ================================
# Stage 3: Build ứng dụng
# ================================
FROM node:20-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_VERSION
ARG NEXT_PUBLIC_X_API_KEY
ARG NEXT_PUBLIC_CHECK_STUDENT_CARD_URL

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_API_VERSION=${NEXT_PUBLIC_API_VERSION}
ENV NEXT_PUBLIC_X_API_KEY=${NEXT_PUBLIC_X_API_KEY}
ENV NEXT_PUBLIC_CHECK_STUDENT_CARD_URL=${NEXT_PUBLIC_CHECK_STUDENT_CARD_URL}

# Cài full dependencies (bao gồm devDeps)
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copy toàn bộ source code
COPY . .

# Build Next.js
RUN npm run build && npm cache clean --force

# ================================
# Stage 4: Runtime production
# ================================
FROM base AS runner
WORKDIR /app

# Tạo user không có quyền root
RUN addgroup -g 1001 nodejs && adduser -D -u 1001 nextjs -G nodejs

# Copy file cần thiết để chạy production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Tạo thư mục cache và gán quyền cho user non-root
RUN mkdir -p /app/.next/cache \
    && chown -R nextjs:nodejs /app/.next

# Chạy app bằng user non-root
USER nextjs
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_API_VERSION=${NEXT_PUBLIC_API_VERSION}
# Cổng và CMD
EXPOSE 3000
CMD ["node", "server.js"]
