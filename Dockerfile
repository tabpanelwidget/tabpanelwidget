FROM node:10.24.1

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY testpage/package.json testpage/package-lock.json ./testpage/

RUN cd testpage && npm install

COPY . .

RUN cd testpage && npm run build

EXPOSE 8000

CMD cd testpage/dist && python -m SimpleHTTPServer
