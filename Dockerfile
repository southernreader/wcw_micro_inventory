FROM node
COPY . /app
WORKDIR /app
ENV PORT 3406
CMD ["node", "app.js"]
