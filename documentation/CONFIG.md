<p align="center">
  <div align="center">
    <img src="../images/logos/logo.svg" alt="Logo" style="width:25%">
  </div>
</p>

# CentOS Web Server Configuration

The following are instructions for configuring a CentOS web server to run OpticExplorer.

## 1) Update System

First, make sure that your system is up to date.

```
sudo yum update
```

## 2) Install Apache

Install the Apache web server software.

```
sudo yum install httpd
```

## 3) Start Apache

Start the Apache web server.

```
sudo service httpd start
```

## 4) Configure Firewall

Configure your firewall to accept http and https requests.

```
sudo firewall-cmd --zone=public --add-service=http --permanent
sudo firewall-cmd --zone=public --add-service=https --permanent
firewall-cmd --reload
```

## 5) Set Up Virtual Host

Go to /etc/httpd/conf.d and create the file "vhost.conf" with the following:

```
<VirtualHost *:80>
    ServerAdmin webmaster@yourdomain.com
    ServerName yourdomain.com
    ServerAlias yourdomain.com
    DocumentRoot /var/www/html/yourdomain.com/prod
    DirectoryIndex index.php index.html
    ErrorLog /var/www/html/yourdomain.com/logs/error.log
    CustomLog /var/www/html/yourdomain.com/logs/access.log combined
    RewriteEngine on
    RewriteCond %{SERVER_NAME} =yourdomain.com
    RewriteCond %{SERVER_NAME} =www.yourdomain.com
    RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>
```

## 6) Create File System

Go go /var/www/html/yourdomain.com and create the following directories:

```
mkdir prod
mkdir logs
```

## 7) Install Utilities

Install the zip utilities.

```
sudo yum install zip
sudo yum install unzip
```

## 8) Upload Files

Upload your web application files to your web server's production directory.  

```
cd /var/www/html/yourdomain.com/prod
ls
```

## 9) Configure SELinux
In the following file: /etc/selinux/config, set:

```
SELINUX=permissive
```

Then, make sure to reboot the server for this change to take effect.

## 10) Start Apache

Start the Apache web server.  Your web application should now be visible at your web server's URL.

```
service httpd start
```