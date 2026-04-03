# Requirements Document

## Introduction

The Expense & Budget Visualizer is a client-side web application that allows users to track personal expenses, define budgets per category, and visualize spending patterns through a monthly summary view. All data is stored locally in the browser using the Local Storage API. The app runs as a standalone HTML/CSS/Vanilla JS web app with no backend or build tooling required.

## Glossary

- **App**: The Expense & Budget Visualizer web application
- **Expense**: A single spending record with an amount, category, date, and optional description
- **Category**: A user-defined label used to group expenses (e.g., "Food", "Transport")
- **Budget**: A monthly spending limit set by the user for a specific category
- **Monthly_Summary**: An aggregated view of all expenses and budgets for a selected calendar month
- **Local_Storage**: The browser's built-in Local Storage API used to persist all data client-side
- **Visualizer**: The chart or graphical component that renders spending data by category

---

## Requirements

### Requirement 1: Expense Entry

**User Story:** As a user, I want to add expense records, so that I can track where my money is going.

#### Acceptance Criteria

1. THE App SHALL provide a form with fields for amount, category, date, and an optional description to record an expense.
2. WHEN a user submits the expense form with valid data, THE App SHALL save the expense to Local_Storage and display it in the expense list.
3. IF the user submits the expense form with a missing required field (amount, category, or date), THEN THE App SHALL display an inline validation error and prevent saving.
4. IF the user enters a non-numeric or negative value in the amount field, THEN THE App SHALL display a validation error indicating the amount must be a positive number.
5. WHEN an expense is saved, THE App SHALL immediately reflect the new expense in the Monthly_Summary and Visualizer without requiring a page reload.

---

### Requirement 2: Custom Categories

**User Story:** As a user, I want to create and manage my own expense categories, so that I can organize spending in a way that fits my lifestyle.

#### Acceptance Criteria

1. THE App SHALL provide an input for the user to add a new custom category by entering a category name.
2. WHEN a user adds a category with a unique name, THE App SHALL save the category to Local_Storage and make it available in the category selector for expense entry.
3. IF a user attempts to add a category with a name that already exists (case-insensitive), THEN THE App SHALL display an error and prevent the duplicate from being saved.
4. THE App SHALL display the list of all user-defined categories.
5. WHEN a user deletes a category that has no associated expenses, THE App SHALL remove it from Local_Storage and from the category selector.
6. IF a user attempts to delete a category that has associated expenses, THEN THE App SHALL display a warning and require explicit confirmation before deletion proceeds.

---

### Requirement 3: Budget Limits per Category

**User Story:** As a user, I want to set a monthly spending limit per category, so that I can control my budget.

#### Acceptance Criteria

1. THE App SHALL allow the user to assign a monthly budget amount to each category.
2. WHEN a user saves a budget for a category, THE App SHALL persist the budget value in Local_Storage.
3. IF a user enters a non-numeric or negative value as a budget amount, THEN THE App SHALL display a validation error and prevent saving.
4. WHILE viewing the Monthly_Summary, THE App SHALL display each category's budget alongside its actual spending for the selected month.
5. WHEN total spending in a category meets or exceeds the category's budget for the current month, THE App SHALL visually highlight that category to indicate the limit has been reached or exceeded.

---

### Requirement 4: Monthly Summary View

**User Story:** As a user, I want to see a summary of my expenses grouped by month, so that I can understand my spending patterns over time.

#### Acceptance Criteria

1. THE App SHALL provide a Monthly_Summary view that displays total spending per category for a user-selected month and year.
2. WHEN the user selects a different month or year, THE App SHALL update the Monthly_Summary and Visualizer to reflect only expenses recorded in that period.
3. THE App SHALL display the total combined spending across all categories for the selected month.
4. WHEN no expenses exist for the selected month, THE App SHALL display a message indicating no data is available for that period.
5. THE Visualizer SHALL render a chart representing the spending breakdown by category for the selected month.

---

### Requirement 5: Data Persistence via Local Storage

**User Story:** As a user, I want my data to be saved automatically, so that I don't lose my expenses or budgets when I close the browser.

#### Acceptance Criteria

1. THE App SHALL read all expenses, categories, and budgets from Local_Storage on page load.
2. WHEN any expense, category, or budget is created or modified, THE App SHALL write the updated data to Local_Storage immediately.
3. WHEN a user deletes an expense, THE App SHALL remove it from Local_Storage and update the Monthly_Summary and Visualizer accordingly.
4. IF Local_Storage is unavailable or throws an error during a read or write operation, THEN THE App SHALL display a non-blocking notification informing the user that data could not be saved.

---

### Requirement 6: Expense List Management

**User Story:** As a user, I want to view and delete my recorded expenses, so that I can correct mistakes and keep my records accurate.

#### Acceptance Criteria

1. THE App SHALL display a list of recorded expenses showing amount, category, date, and description for each entry.
2. THE App SHALL allow the user to filter the expense list by category or by month.
3. WHEN a user deletes an expense, THE App SHALL remove it from the list, update Local_Storage, and refresh the Monthly_Summary and Visualizer without a page reload.
4. WHEN the expense list is empty, THE App SHALL display a message indicating no expenses have been recorded.

---

### Requirement 7: Performance and Compatibility

**User Story:** As a user, I want the app to load and respond quickly across modern browsers, so that I have a smooth experience.

#### Acceptance Criteria

1. THE App SHALL load and render the initial view within 2 seconds on a standard desktop connection.
2. WHEN the user interacts with any UI control (form submission, filter change, month selection), THE App SHALL update the relevant UI within 300 milliseconds.
3. THE App SHALL function correctly in the current stable versions of Chrome, Firefox, Edge, and Safari.
4. THE App SHALL be implemented using only HTML, CSS, and Vanilla JavaScript with no external frameworks or build tools required.
5. THE App SHALL use a single CSS file located in the `css/` directory and a single JavaScript file located in the `js/` directory.
