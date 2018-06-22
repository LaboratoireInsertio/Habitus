#!/bin/bash
#installation Update and installation of habitus - Sensors

echo "-----------------------------------------------------------------------"
echo "---------------- basic routine update ;)-------------------------------"
echo "-----------------------------------------------------------------------"
sudo apt-get -y upgrade
sudo apt-get -y update

echo "-----------------------------------------------------------------------"
echo "---------------- installation nodejs and npm --------------------------"
echo "-----------------------------------------------------------------------"
#More information about nodejs here : https://nodejs.org/en/
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get -y install nodejs

echo "-----------------------------------------------------------------------"
echo "---------------- Installation other dependancies ----------------------"
echo "-----------------------------------------------------------------------"
sudo apt-get -y install git vim

echo "-----------------------------------------------------------------------"
echo "---------------- Installation of PM2 via npm --------------------------"
echo "-----------------------------------------------------------------------"
#More information about PM2  here : http://pm2.keymetrics.io/docs/usage/quick-start/
sudo npm install pm2 -g
sudo env PATH=$PATH:/usr/local/bin pm2 startup systemd -u pi --hp /home/pi


echo "-----------------------------------------------------------------------"
echo "---------------- Install Cloud9 ---------------------------------------"
echo "-----------------------------------------------------------------------"
#Installation Cloud9 and rules security with iptables based on this tutorial : https://habilisbest.com/installing-cloud-9-on-your-raspberry-pi
# https://habilisbest.com/raspberrypi-secure-personal-server-step-3-hardening-security
sudo touch /etc/iptables.firewall.rules
echo '*filter

# --------------loopback

#-------------- open port for cloud9
-A INPUT -p tcp -m tcp --dport 8383 -j ACCEPT
-A INPUT -i lo -j ACCEPT
-A INPUT -d 127.0.0.0/8 -j REJECT
# --------------Already was there
-A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
# --------------allow DHCP
-A INPUT -p udp -m udp --sport 67 --dport 68 -j ACCEPT
# -------------- LOG iptables denied calls
-A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 7
# -------------- SSH
-A INPUT -p tcp -m tcp --dport 44 -j ACCEPT
# -------------- WEB
-A INPUT -p tcp -m tcp --dport 80 -j ACCEPT
-A INPUT -p tcp -m tcp --dport 443 -j ACCEPT
# -------------- PING
-A INPUT -p icmp --icmp-type echo-request -j ACCEPT
# -------------- Outgoing
-A OUTPUT -j ACCEPT
# -------------- Drop all other inbound - default deny unless explicitly
# allowed policy
-A INPUT -j DROP
-A FORWARD -j DROP
COMMIT' | sudo tee -a /etc/iptables.firewall.rules
sudo iptables-restore < /etc/iptables.firewall.rules

#automate rules on every restart
sudo touch /etc/network/if-pre-up.d/firewall
echo '#!/bin/sh
/sbin/iptables-restore < /etc/iptables.firewall.rules'
sudo chmod +x /etc/network/if-pre-up.d/firewall


cd ~
git clone git://github.com/c9/core.git c9sdk
cd c9sdk
scripts/install-sdk.sh
ln -s ~/c9sdk/server.js ~/server_cloud9.js

echo "-----------------------------------------------------------------------"
echo "---------------- Install Repo Habitus ---------------------------------"
echo "-----------------------------------------------------------------------"
git clone https://github.com/LaboratoireInsertio/habitus.git #put git on organization InsertioLab
cd habitus
git checkout develop
npm install


echo "-----------------------------------------------------------------------"
echo "---------------- Installation arduino-dk ------------------------------"
echo "-----------------------------------------------------------------------"
#Arduino-dk is for pushing code on an arduino via command line
#Demonstration video : https://www.youtube.com/watch?v=qAM2S27FWAI
sudo apt-get -y install arduino-mk


#Launch the app with PM2 + cloud9
cd ..
pm2 --name cloud9 start ~/server_cloud9.js -- -p 8383 -l 0.0.0.0  --auth Insertio:revolting166165?Brownian -w ~/habitus/
pm2 --name rasp start ~/habitus/app_rasp.js
pm2 save