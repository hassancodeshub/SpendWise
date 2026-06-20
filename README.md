# 🎓 Student Survival Tracker

> Helping students survive their monthly budget, one expense at a time.

Student Survival Tracker is a smart expense management web application built specifically for college students. Instead of simply recording expenses, it helps students understand their spending habits, stay within budget, and make smarter financial decisions.

## 🚀 Problem

Most students receive a fixed monthly allowance but often:

- Spend too much during the first week
- Lose track of daily expenses
- Don't know if they can afford a purchase
- Run out of money before the month ends

Traditional expense trackers show where money was spent, but they don't help students make spending decisions.

## 💡 Solution

Student Survival Tracker acts as a financial survival assistant by:

- Calculating safe daily spending limits
- Predicting end-of-month balances
- Alerting users about overspending
- Helping users decide if a purchase is affordable
- Providing actionable spending insights

---

## ✨ Features

### 📊 Smart Dashboard

View:

- Monthly Budget
- Total Spent
- Remaining Balance
- Days Remaining
- Budget Streak

---

### 💰 Daily Survival Budget

Automatically calculates the amount that can be safely spent each day.

**Formula**

```text
Daily Limit = Remaining Balance / Remaining Days
```

**Example**

```text
Remaining Balance: ₹4000
Days Left: 20

Safe Daily Budget: ₹200/day
```

---

### 🛒 Can I Afford This?

A purchase decision assistant.

Enter an item's price and instantly see:

- Whether it's affordable
- Impact on your remaining budget
- Updated daily spending limit

**Example**

```text
Current Balance: ₹2500
Item Price: ₹1200

New Daily Budget:
₹250 → ₹130/day

Status: ⚠️ Risky Purchase
```

---

### 🚨 Overspending Alerts

Detects when spending exceeds the planned budget pace.

**Example**

```text
Expected Spending: ₹1000
Actual Spending: ₹1800

⚠️ You're spending 80% faster than planned.
```

---

### 📈 End-of-Month Prediction

Analyzes spending trends and predicts:

- Estimated month-end balance
- Budget surplus
- Budget deficit

**Example**

```text
Current Average Spend: ₹300/day

Prediction:
🚨 You may exceed your budget by ₹3000.
```

---

### 🔥 Budget Streaks

Stay motivated by maintaining spending discipline.

**Example**

```text
🔥 Budget Streak: 5 Days
```

---

### 📂 Expense Categories

Track spending across categories:

- 🍔 Food
- 🚌 Travel
- ☕ Snacks
- 🎮 Entertainment
- 📚 Study
- 🛍️ Others

---

### 🧠 Smart Insights

Get personalized spending recommendations:

- Food spending is unusually high
- Daily budget exceeded
- Low balance warning
- Spending trend analysis
- Monthly survival forecast

---

## 🛠️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Local Storage
- Chart.js (for visualizations)

---

## 📱 User Flow

1. Set monthly budget.
2. Add daily expenses.
3. Track spending categories.
4. Monitor safe daily budget.
5. Check affordability before purchases.
6. Receive smart insights and alerts.
7. Stay within budget until month-end.

---

## 🎯 Target Audience

- College Students
- Hostel Residents
- Freshers Managing Their First Budget
- Scholarship Students
- Anyone Living on a Fixed Monthly Allowance

---

## 🔮 Future Enhancements

- AI-powered spending recommendations
- Receipt scanning with OCR
- Shared roommate expense tracking
- Savings goals
- Progressive Web App (PWA)
- Cloud sync and authentication

---


## 🏆 Hackathon Pitch

> Most expense trackers tell students where their money went.
>
> Student Survival Tracker tells them whether they'll survive until the end of the month.

---

## 📄 License

This project is licensed under the MIT License.

---

### Made with ❤️ for students who are always broke before month-end.