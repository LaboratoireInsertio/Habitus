#!/bin/bash
#installation Update and installation of habitus - Sensors

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
