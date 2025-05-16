## Moniqa: Track your money without friction — no categories, no spreadsheets, just habits.

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
- [x] Home Screen (Add Expense Button, View Budget Modal, View Expenses, Filter By Day/Week/Month, click on expense to edit/delete)
- [ ] To think on what more features to add to the Home Screen and how to make it better and more user friendly
- [ ] Settings Screen
  - [x] Basic UI for the settings screen
  - [ ] App Settings - Manage Currency, Budget, Categories (add & delete), notification reminder, clear data
  - [ ] Account Settings (just a placeholder for now (won't contain much data anyways as logging in through google/apple id any ways))
  - Help & Support (contact support (will consist of mailto link), About the app (Will be a screen about me, why i made this app, my other apps and social media links), Delete Account, Terms of Service, Privacy Policy)
- [ ] Figure out the summary screen idea
- [ ] Add Auth (Google, Apple) - Figure out which platform to use
- [ ] Add App Lock
- [ ] Add Notifications
- [ ] A lot more
