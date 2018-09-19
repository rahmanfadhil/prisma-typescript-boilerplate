FROM node
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

ENV NODE_ENV="production"
ENV PORT=4000
ENV JWT_SECRET="secret"
ENV PRISMA_ENDPOINT="http://https://eu1.prisma.sh/rahman-fadhil-ca7e1b/prisma-typescript/dev"

EXPOSE 4000
CMD [ "node", "dist/index.js" ]