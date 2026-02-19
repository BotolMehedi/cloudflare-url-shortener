<h1 align="center">AHCX | URL SHORTENER</h1>

<div align="center">

[![URL SHORTENER](https://img.shields.io/badge/Status-Live-brightgreen)](https://mehedi.fun/) [![Version](https://img.shields.io/badge/Version-1.0.0-green)](https://mehedi.fun/) [![License](https://img.shields.io/badge/License-MIT-yellow)](https://mehedi.fun/) [![Live Demo](https://img.shields.io/badge/Live%20Demo-https://ahcx.pages.dev/-blue)](https://ahcx.pages.dev/) 

*AHCX is a fast, secure, and scalable URL shortener application built on React (Vite) and deployed through Cloudflare Pages & Workers. It uses Cloudflare D1 as its database layer and includes a complete admin dashboard for link and system management.*

*One of the biggest advantages of this project is that it runs entirely on Cloudflare’s free tier. <font color="green">Both Cloudflare Pages and D1 Database offer generous lifetime free usage</font>, making this solution extremely cost-effective for personal projects, startups, and production-ready deployments without any hosting expenses.*


</div>

---

## 🌐 Live Demo

Experience the full functionality of the **URL SHORTENER** with all features available online!

**🚀 Web**: [https://ahcx.pages.dev/](https://ahcx.pages.dev/)


---

## ✨ Features


- **Modern UI/UX**
- **Responsive Design**
- **Admin Panel**
- **Custom Alias**
- **Link Expiration**
- **QR Code, Link Pause/Resume**
- **Realtime Link Analytics**
- **Lifetime Free Server**


## 🧩 Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Cloudflare Pages Functions (Workers runtime)
- **Database:** Cloudflare D1 (SQLite)
- **Hosting:** Cloudflare Pages


---

## 🚀 Deployment Guide

Follow the steps below to deploy the project successfully using Cloudflare Pages & Workers.

---

### 1️⃣ Fork the Repository
- First, **fork this repository** to your own GitHub account.

---

### 2️⃣ Create a Free Cloudflare Account
- Sign up or log in at **https://cloudflare.com**.

---

### 3️⃣ Deploy via Cloudflare Pages

1. Go to **Cloudflare Dashboard**.
2. Navigate to:  
   **Compute → Pages & Workers → Create Application**
3. Connect your **GitHub account**.
4. Select the **forked repository**.

---

### 4️⃣ Build Configuration

Use the following settings:

- **Framework Preset:** React (Vite)  
- **Build Command:**  
  ```
  npm install && npm run build
  ```
- **Output Directory:**  
  ```
  dist
  ```
- **Root Directory:**  
  ```
  /
  ```  
Add Environment Variables:

- **Variable Name:** `SKIP_DEPENDENCY_INSTALL`  
- **Value:** `true`  
- **Type:** Text  

Save the configuration and proceed with deployment.

---

## 🗄️ Database Setup (Cloudflare D1)

After the project is successfully deployed, follow these steps:

### 5️⃣ Create D1 Database

1. Navigate to:  
   **Storage & Databases → D1**
2. Click **Create Database**
3. Configure as follows:
   - **Database Name:** `ahcx-db`
   - **Location:** Default / automatic location

---

### 6️⃣ Import Database Schema

1. Open your newly created database.
2. Click **Explore Data**.
3. In the query editor:
   - Open the file: `cloudflare/schema.sql`
   - Copy **one schema section at a time**
   - Paste it into the query field
   - Click **Run**

⚠️ *Important:*  
Do **not** paste the entire schema at once. In some cases, this may prevent all tables from being created properly. Execute each section individually to ensure successful table creation.

---

### 7️⃣ Bind the Database to Your Project

1. Navigate to:  
   **Compute → Pages & Workers**
2. Select your deployed project.
3. Go to **Settings → Bindings**
4. Click **Add Binding**
5. Choose **D1 Database**
6. Configure:
   - **Variable Name:** `DB`
   - **Database:** `ahcx-db`
7. Save changes.

---

## ✅ Deployment Complete

Visit your deployed website. The application should now be fully functional.

### 🔐 Admin Panel

- Admin URL:  
  ```
  https://your-deployed-url/admin
  ```
- **Default Credentials:**
  - Username: `admin`
  - Password: `admin`

You can now log in and start managing the system.

---


## 🎯 Usage Guide

Good luck😴

## 💡 Feature Requests



Have an idea? We'd love to hear it:



1. **Check existing requests**

2. **Create a new issue** with:

   - Detailed description

   - Use case explanation

   - Potential implementation ideas




---

## 🤝 Contributing

I built this for myself, but I'd love to see what you can add! Here's how to contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request🎯

<div align="center">

[Star](https://github.com/BotolMehedi/cloudflare-url-shortener/stargazers) | [Issue](https://github.com/BotolMehedi/cloudflare-url-shortener/issues) | [Discussion](https://github.com/BotolMehedi/cloudflare-url-shortener/discussions)

</div>

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**TL;DR:** You can use this freely, modify it, sell it, whatever. Just don't blame me if something ______!😪

---

## ⚠️ Disclaimer

This tool is created for educational and research purposes only. Do not use it for any illegal activities. The creator is not responsible for any misuse, damage, or legal consequences caused by the use of this tool. By using this project, you agree that you are doing so at your own risk and for learning purposes only.

---

<div align="center">

### 🌟 Star this repo if you find it helpful!

[Portfolio](https://mehedi.fun) | [Email](mailto:hello@mehedi.fun) | [Github](https://github.com/BotolMehedi)

**Made with ❤️ and lots of 💦 by [BotolMehedi](https://github.com/BotolMehedi)**

</div>
