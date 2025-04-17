
# Workman

## Getting Started

### Deploying Locally

#### 1. Clone the Repository

```bash
git clone repo_link
cd krsyonix
```

#### 2. Creaate a .env file

```bash
DATABASE_URL= 
NEXT_PUBLIC_HOST_URL="http://localhost:3000" # -> change it in production
AUTH_URL=http://localhost:3000 # -> change it in production
NEXT_PUBLIC_HOME_URL= # home page url (actual xorvane main page url or domain name)
CRON_SECRET= # secret for cron job to send to an endpoint

MAILER_PASSWORD=   # for recieving mails
MAILER_EMAIL=

NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

AUTH_SECRET=
NEXTAUTH_SECRET= # either one of them
AUTH_TRUST_HOST=true

GCS_FILE_NAME=gcs-key.json
GCS_BUCKET_NAME=xorvane-workman
NEXT_PUBLIC_GCP_CDN=  # cdn link(loadbalancer ip)

NEXT_PUBLIC_MONTHLY_PRICE=
NEXT_PUBLIC_YEARLY_PRICE=
NEXT_PUBLIC_PAYPAL_ENV="Sandbox" # "Sandbox" or "Production" -> production while deploying it
```
#### 3. Also place your gcs-key.json file in the root if using GCP.

#### 4. 
```bash
npm install
npm run dev
```

#### 5. Check errors for production
```bash 
npm run build
```

#### 6.  ``` npm run start ```

### Deploying in Production

### Configure nginx : 

#### 1. Install nginx
```bash
sudo apt update
sudo apt install nginx -y
```

#### 2. 
```bash
sudo nano /etc/nginx/sites-available/krsyonix
```

#### 3.
```bash
server {
  listen 80;
  server_name yourdomain.com; # add the domain name or the ip address if not applicable.

  location / {
    proxy_pass http://localhost:3000; # since the app is running on 3000
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

#### 4.
```bash
sudo ln -s /etc/nginx/sites-available/krsyonix /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Same steps as development till step 5 ( skip ```npm run dev``` )

### Make sure you change the localhost to the actual domain name

```bash
npm i -g pm2
pm2 start "npm run start" --name krysonix
pm2 save
pm2 logs # check the logs
```

### To make sure the schedular is running (to delete the subscription when it is expired)
#### Go to /src/app/api/schedular/route.ts for more info...
```bash
curl http://__ip__/api/schedular?secret=CRON_SECRET #in .env
```