# DOCKER-VERSION 0.3.4
FROM    h3crd-wlan1.chinacloudapp.cn:5000/tinycore-node:4.2.1 

ENV     NODE_ENV production

# The command to exec while docker has been stated
RUN     mkdir -p /workspace
ADD     src  /workspace/src

WORKDIR /workspace/src

EXPOSE  3005
EXPOSE  3006

CMD ["node", "doc.js"]
