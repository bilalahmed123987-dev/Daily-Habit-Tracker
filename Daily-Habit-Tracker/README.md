✔️ Daily Habit Tracker

A clean, responsive, and feature-rich web application built with vanilla HTML5, CSS3, and JavaScript. Designed to help users build daily consistency, monitor weekly routines, track streaks, and maintain habits—all without needing account creation or backend servers.

📌 Project Overview

The Daily Habit Tracker provides immediate visual feedback to encourage user consistency. With zero backend dependencies, all habit data and user preferences stay saved locally inside the browser using the Web Storage API (localStorage).

This project was created as part of the Introduction to ICT Lab (CL-1000) course at FAST-NUCES, Karachi.

✨ Key Features

⏱️ Dynamic Time-Aware Hero Header: Displays custom greetings based on the time of day (Good morning, Good afternoon, Good evening) along with dynamic motivational status messages.

📊 Real-Time Progress Dashboard: Tracks:

Today's Completion Rate (%) with animated green progress bar.

Last 7 Days Consistency (%) across all active habits.

Best Streak Overall across all logged habits.

🎨 Custom Habit Creation & Icon Picker: Choose from 8 color-coded habit categories (Water 💧, Education 📚, Exercise 🏃, Sleep 😴, Relax 🧘, Healthy Food 🥗, Writing ✍️, Coding 💻).

📅 7-Day Interactive Tracking Strip: View and toggle habit completion status for today or any of the past 6 days.

🔥 Automated Streak Engine: Calculates current consecutive-day streaks and historical personal bests dynamically.

🌗 Light & Dark Theme Toggle: Includes automatic detection of system dark mode preferences and manual toggle override.

🎉 Celebratory Confetti & Toast Notifications: Triggers celebratory particle animations when 100% of habits are completed for the day.

💾 Browser Storage Persistence: Retains habit lists, completion logs, and theme settings via localStorage.

📱 Fully Responsive & Accessible: Responsive grid layouts (down to mobile viewports) with ARIA attributes and prefers-reduced-motion compliance.

📁 Project Structure

daily-habit-tracker/
├── index.html     # Semantic HTML5 layout and accessibility markup
├── style.css      # CSS variables, custom theme tokens, Grid/Flex layouts, & animations
├── script.js     # Habit state management, date calculations, storage, & UI rendering
└── README.md      # Project documentation


🛠️ Tech Stack & Tools

Frontend: HTML5, CSS3 (CSS Variables, Flexbox, CSS Grid), JavaScript (ES6+ ES module pattern)

Data Storage: Browser localStorage API

IDE: Visual Studio Code

Testing: Chrome Developer Tools, Live Server Extension

🚀 Getting Started

No external installation, dependencies, or node packages are required to run this project.

Prerequisites

A modern web browser such as Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari.

Running the App Locally

Clone the Repository:

git clone https://github.com/your-username/daily-habit-tracker.git


Navigate into the Project Folder:

cd daily-habit-tracker


Open in Browser:

Double-click index.html to launch it in your default browser.

Or open the project in Visual Studio Code and launch with the Live Server extension.

📖 How to Use

Add a Habit: Select an icon category, type your habit title in the input box, and click Add Habit.

Log Completion:

Click the checkmark circular button on a habit card to complete it for Today.

Click any date pill on the 7-day strip to log or un-log past check-ins.

Monitor Progress: Check top cards for completion percentages and active streak counters.

Switch Theme: Click the 🌙 / ☀️ icon in the header to switch between Dark and Light mode.

Delete a Habit: Click the Delete button at the bottom right of a card and confirm the popup.

💻 Code Architecture Highlights

Data Model: Habits are stored as simple JSON objects:

{
  id: 1718901234567,
  name: "Drink 8 glasses of water",
  icon: "💧",
  doneDates: ["2026-11-23", "2026-11-22"]
}
Date Utilities: Dates are converted into YYYY-MM-DD string keys using local date methods to avoid UTC off-by-one errors.

Consecutive Streak Logic: Scans backwards from today (or yesterday if today isn't ticked yet) to count consecutive daily occurrences.

Date Utilities: Dates are converted into YYYY-MM-DD string keys using local date methods to avoid UTC off-by-one erro
Consecutive Streak Logic: Scans backwards from today (or yesterday if today isn't ticked yet) to count consecutive daily occurrences.
