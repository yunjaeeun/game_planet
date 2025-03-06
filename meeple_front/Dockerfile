# Meeple Frontend Dockerfile

# 빌드 단계
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# 배포 단계
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

## Nginx 설정 파일 복사 (필요 시)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]