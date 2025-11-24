# ================================
# Stage 1: Build ứng dụng
# ================================
FROM node:20-alpine AS builder
WORKDIR /app

# Cài Python + build tools + ffmpeg (mediasoup + fluent-ffmpeg)
RUN apk add --no-cache python3 py3-pip make g++ ffmpeg \
    && ln -sf /usr/bin/python3 /usr/bin/python

# KHÔNG set NODE_ENV ở đây để npm ci cài cả devDependencies
# (vì @tailwindcss/postcss đang ở devDependencies)

# Nhận biến môi trường public của Next (nếu bạn truyền từ docker-compose)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_VERSION
ARG NEXT_PUBLIC_X_API_KEY
ARG NEXT_PUBLIC_CHECK_STUDENT_CARD_URL

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_API_VERSION=${NEXT_PUBLIC_API_VERSION}
ENV NEXT_PUBLIC_X_API_KEY=${NEXT_PUBLIC_X_API_KEY}
ENV NEXT_PUBLIC_CHECK_STUDENT_CARD_URL=${NEXT_PUBLIC_CHECK_STUDENT_CARD_URL}

# Cài dependencies theo lockfile (BAO GỒM devDependencies)
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copy toàn bộ source code vào image
COPY . .

# Build Next.js
RUN npm run build && npm cache clean --force

# ================================
# Stage 2: Runtime production
# ================================
FROM node:20-alpine AS runner
WORKDIR /app

# Runtime mới là production
ENV NODE_ENV=production

# Cài ffmpeg cho compress / xử lý media nếu cần
RUN apk add --no-cache ffmpeg

# Tạo user non-root để chạy app an toàn hơn
RUN addgroup -g 1001 nodejs && adduser -D -u 1001 nextjs -G nodejs

# Copy từ builder sang
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Tạo thư mục cache + uploads và phân quyền
RUN mkdir -p /app/.next/cache \
    && mkdir -p /app/public/uploads \
    && chown -R nextjs:nodejs /app/.next /app/public/uploads \
    && chmod -R 755 /app/public/uploads

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
