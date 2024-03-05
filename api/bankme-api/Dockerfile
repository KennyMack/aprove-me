FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production
ENV DATABASE_URL file:db/dev.db

RUN npm ci --only=production && npm cache clean --force

RUN npm install -g ts-node && npx prisma migrate dev --name user && npx prisma db seed

USER node

FROM node:18-alpine AS production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist/apps/bankme-api ./dist
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma

EXPOSE 3000

CMD [ "node", "dist/main.js" ]

#ENTRYPOINT ["tail"]
#CMD ["-f","/dev/null"]
