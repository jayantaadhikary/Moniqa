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
  - [x] Add a Toast after successful expense addition
  - [ ] Swipe to delete expenses
  - [x] Add Income feature
    - [x] Add Income
    - [x] View total income of month in the budget card
    - [ ] View income list
    - [ ] Edit/Delete Income
  - [ ] Add Search feature for expenses

- [ ] To think on what more features to add to the Home Screen and how to make it better and more user friendly

- [x] Summary & Analytics Screen

  - [x] Basic UI for the summary screen
  - [x] View spending by month, week and year.
  - [x] Line Graph for visualizing spending trends
  - [x] View top spendings by category
  - [x] View Spending compared to budget & income

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
4. Advanced Analytics - Select Custom Date Ranges
5. Attach Receipts to expenses
6. Recurring & Scheduled Expenses
7. Widgets
8. AI Integration (Maybe 🤷‍♂️ )
9. Support an indie developer ❤️
