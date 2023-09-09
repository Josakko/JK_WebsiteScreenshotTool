# JK_WebsiteScreenshotTool
Website for screenshoting other websites

## Usage

1. To setup the server your self first clone this repo:

        git clone https://github.com/Josakko/JK_WebsiteScreenshotTool/

2. Next install open ssl (using apt on debian and other distros using apt):

        sudo apt update && sudo apt install openssl -y

3. Now we will need private and public key along whit self signed certificate (self signed certificates arent ideal for production since browsers will warn users before visiting the site that proceeding is risky... so best is to get certificates signed by some certificate authority):

Generate private key:

    openssl genpkey -algorithm RSA -out private.key

Generate public key:

    openssl rsa -pubout -in private.key -out public.key

Generate and sign certificate:

    openssl req -new -x509 -sha256 -key private.key -out certificate.crt -days 365

4. Install node:

        sudo apt install node -y

5. Now just install all dependencies:
    
        npm install

6. And that is it, run the server:

        node .

Server will now serve content on `https://localhost` or `http://localhost` which will redirect to `https://localhost`

## Demo
 
Visit the website [here](). (not yet available)

Usage demo [here](). (not yet available)

<p align="center">
  <img alt="issue" src="https://github.com/Josakko/JK_WebsiteScreenshotTool/blob/main/screenshot.png?raw=true" width="1000px">
</p>

## Need Help?

If you need help contact me on my [discord server](https://discord.gg/xgET5epJE6).

## Contributors

Big thanks to all of the amazing people (only me) who have helped by contributing to this project!
