FROM node:12.18.0-alpine3.10

# 设置时区
RUN rm -rf /etc/localtime && ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production

COPY package.json .

RUN npm config set registry https://registry.npm.taobao.org && npm install

COPY . .
EXPOSE 9060
CMD [ "npm", "start" ]