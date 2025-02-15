cd statistak
git fetch --all
git reset --hard origin/master
cd client
yarn
cd ..
cd server
yarn
cd ..
pm2 stop main
cd client
yarn build
cd ..
cd server
yarn build
pm2 start main
