git pull
cd client
npm install
cd ..
cd server
npm install
cd ..
pm2 stop main
cd client
npm run build
cd ..
cd server
npm run build
pm2 start main
