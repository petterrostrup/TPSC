docker build -t petterrostrup/node-api .

docker run -p 49160:8080 -d petterrostrup/node-api