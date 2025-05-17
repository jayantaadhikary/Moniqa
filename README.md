## Moniqa: Track your money without friction

### Features

- Track your expenses with simple UI
- Set a budget and track your progress
- View your spending habits over time
- Local Storage for data privacy
- Charts and graphs for visualizing your spending
- Dark Mode for owls (no more blinding white screens)

### Tech Stack

- React Native
- TypeScript
- Zustand
- MMKV
- Expo UI (RN Date picker package was not working with Expo Prebuild, so I used Expo UI)

### Todo:

- [x] Onboarding Screen
- [x] Screen to choose a currency, budget and default categories
- [x] Home Screen

  - [x] Add Expense
  - [x] View Budget Card
  - [x] View Expenses
  - [x] Filter By Day/Week/Month
  - [x] Click on expense to edit/delete
  - [ ] Add a Toast after successful expense addition
  - [ ] Swipe to delete expenses
  - [ ] Add Income feature
  - [ ] Make the budget card droppable to show income, expenses and savings

- [ ] To think on what more features to add to the Home Screen and how to make it better and more user friendly

- [ ] Summary & Analytics Screen

  - [x] Basic UI for the summary screen
  - [x] View spending by month, week and year.
    - [ ] Add custom date range date picker
  - [ ] Graphs for visualizing spending habits
  - [ ] View spending by category
  - [ ] View Spending compared to budget & income

- [ ] To think on what more features to add to the Summary & Analytics Screen and how to make it better and more user friendly

- [ ] Settings Screen

  - [x] Basic UI for the settings screen
  - [ ] App Settings
    - [x] Manage Currency
    - [x] Manage Budget
    - [x] Manage Categories (add & delete)
    - [ ] Notification Reminder (gentle reminder & nudges to add expenses and save money)
    - [ ] More App Settings (to be decided)
  - [ ] Account Settings (just a placeholder for now (won't contain much data anyways as logging in through google/apple id any ways))
  - Help & Support (contact support (will consist of mailto link), About the app (Will be a screen about me, why i made this app, my other apps and social media links), Delete Account, Terms of Service, Privacy Policy)

- [ ] Add Auth (Google, Apple) - Figure out which platform to use
- [ ] Add App Lock
- [ ] Add Notifications
- [ ] A lot more

### Premium Features (Coming Soon)

- These features will be available for a small fee to support the development of the app and to keep it ad-free.

1. Cloud Sync
2. Export Data (CSV, PDF)
3. Advanced Budgetting Features
4. Advanced Analytics
5. Ad Free
6. Custom Logos & Widgets
7. AI Integration (Maybe 🤷‍♂️ )
8. Support an indie developer ❤️
