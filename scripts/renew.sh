pm2 stop main

certbot renew --force-renewal

pm2 start main
