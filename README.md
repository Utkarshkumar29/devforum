📰 DevForum – Social Posting & Scheduling Platform (Next.js + Redis + BullMQ)
📖 Overview

DevForum is a social media scheduling and posting platform built with Next.js, Redis, and BullMQ for asynchronous task handling. It allows users to create posts, upload files, and schedule content with a sleek, responsive interface.

🚀 Features

📝 Post creation with image, file, and poll uploads

🕓 Scheduled posting using BullMQ and Redis

⚡ Optimized performance through Redis caching

🔔 Notification and queue-based microservice architecture

💻 Responsive and secure UI with reusable Next.js components

☁️ Deployed via Vercel (Frontend) and Render (Backend)

🧰 Tech Stack

Frontend: Next.js, React.js, TailwindCSS

Backend: Node.js, Express.js, Redis, BullMQ

Database: MongoDB

Deployment: Vercel, Render

⚙️ Installation
# Clone repository
git clone https://github.com/Utkarshkumar29/DevForum.git
cd DevForum

# Install dependencies
npm install

# Run app
npm run dev

🧠 Performance Optimization

Implemented Redis caching to reduce API latency

Improved scalability using microservices and async job queues

🌐 Live Demo

👉 [DevForum Live Demo](https://devforum.vercel.app)

📎 Backend services hosted on Render; first request may take 30–60 seconds due to cold start.
