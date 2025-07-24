# Zone01 Student Profile – GraphQL Dashboard

A personalized web application that displays your Zone01 student journey by fetching data directly from the GraphQL API.

##  Overview

This project is a sleek and interactive profile dashboard built to visualize your achievements and progress at **Zone01 Kisumu**. By integrating with the official GraphQL API, the app provides clear and dynamic views of your stats—from XP growth to project outcomes—all in real time.

##  Features

### Authentication System

* Secure login using your Zone01 email or username
* JWT-based session authentication
* Logout functionality
* Feedback for invalid login attempts

### Student Profile

* User identification (name, email, login, etc.)
* Real-time XP tracking
* Breakdown of project results
* Audit participation overview
* Skill progression snapshots

### Interactive Statistics

* Custom-built SVG graphs
* XP Progress Over Time graph
* Pass/Fail Ratio for submitted projects
* Audit involvement statistics (coming soon)
* Responsive and mobile-friendly layout

##  Tech Stack

| Category        | Technology                     |
| --------------- | ------------------------------ |
| Frontend        | HTML, CSS, JavaScript          |
| Auth System     | JWT (JSON Web Tokens)          |
| API Integration | GraphQL                        |
| Graphs          | SVG (Scalable Vector Graphics) |
| Hosting         | GitHub Pages                   |

##  API Endpoints

* **GraphQL Queries:**
  `https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql`

* **Auth Endpoint:**
  `https://learn.zone01kisumu.ke/api/auth/signin`

##  Getting Started

###  Prerequisites

* A modern browser (Chrome, Firefox, Edge)
* Zone01 login credentials
* Basic knowledge of GraphQL (optional but helpful)

###  Installation

```bash
git clone https://learn.zone01kisumu.ke/git/wambita/graphql
cd graphql
```

Then, launch using your browser or a live server (e.g., VS Code Live Server extension).

###  Usage

1. Go to the login screen
2. Enter your Zone01 credentials
3. View your personalized stats
4. Log out securely after use

##  Deployment

Hosted on GitHub Pages
 [View Live Demo](https://wambita.github.io/graphql)

##  Learning Goals

* Apply GraphQL queries to retrieve structured data
* Implement JWT-based authentication flows
* Use SVGs for visualizing dynamic data
* Design with accessibility and responsiveness in mind
* Strengthen frontend development skills

