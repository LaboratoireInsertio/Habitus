#!/bin/bash
#installation Update and installation of habitus - Sensors

echo "basic routine update ;)"
sudo apt-get -y upgrade
sudo apt-get -y update


#More information about nodejs here : https://nodejs.org/en/
echo "installation nodejs and npm"
echo
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get -y install nodejs

echo "Installation other dependancies"
echo
sudo apt-get -y install git

#More information about PM2  here : http://pm2.keymetrics.io/docs/usage/quick-start/
echo "Installation of PM2 via npm"
echo
npm install pm2 -g

#Installation Cloud9 and rules security with iptables based on this tutorial : https://habilisbest.com/installing-cloud-9-on-your-raspberry-pi
# https://habilisbest.com/raspberrypi-secure-personal-server-step-3-hardening-security

echo "Install Cloud9"
echo
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
-A INPUT -p tcp -m tcp --dport 22 -j ACCEPT
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

#automate rules on every restart
sudo touch /etc/network/if-pre-up.d/firewall
echo '#!/bin/sh
/sbin/iptables-restore < /etc/iptables.firewall.rules'
sudo chmod +x /etc/network/if-pre-up.d/firewall


cd ~
git clone git://github.com/c9/core.git c9sdk
cd c9sdk
scripts/install-sdk.sh

echo "Installation package git instagif"
git clone https://github.com/chesnel/InsertioStairs.git #put git on organization InsertioLab
cd InsertioStairs
npm install

#Launch the app with PM2 + cloud9
pm2 --name cloud9 start server.js -- -p 8383 -l 0.0.0.0  --auth Insertio:revolting166165?Brownian -w /home/pi/src/InsertioStairs/
