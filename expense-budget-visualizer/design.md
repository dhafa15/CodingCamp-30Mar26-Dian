# Design Document: Expense & Budget Visualizer

## Overview

The Expense & Budget Visualizer is a fully client-side single-page web application. It lets users record expenses, define per-category budgets, and visualize monthly spending — all without a backend or build step. Data is persisted exclusively via the browser's Local Storage API.

The app is deployed as a static site (GitHub Pages) consisting of exactly three files:
- `index.html` — markup and structure
- `css/style.css` — all styling
- `js/script.js` — all application logic

No external frameworks, bundlers, or package managers are used. The only permitted external dependency is Chart.js loaded via CDN for rendering the spending visualizer.

### Goals

- Zero-setup: open `index.html` and it works
- All state lives in `localStorage`; refreshing the page restores everything
- Responsive, clean UI that works across Chrome, Firefox, Edge, and Safari

---

## Architecture

The app follows a simple **MVC-lite** pattern entirely within `js/script.js`:

```
┌─────────────────────────────────────────────────────┐
│                     index.html                      │
│  (static markup — forms, lists, canvas, selectors)  │
└────────────────────┬────────────────────────────────┘
                     │ DOM events
                     ▼
┌─────────────────────────────────────────────────────┐
│                   js/script.js                      │
│                                                     │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────┐ │
│  │  Storage     │   │  State /     │   │  UI /   │ │
│  │  Layer       │◄──│  Business    │──►│  Render │ │
│  │  (CRUD on    │   │  Logic       │   │  Layer  │ │
│  │  localStorage│   │              │   │         │ │
│  └──────────────┘   └──────────────┘   └─────────┘ │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
              localStorage
         (expenses / categories / budgets)
```

### Data Flow

1. On page load, the Storage Layer reads all data from `localStorage` into in-memory arrays/objects.
2. User interactions (form submits, button clicks) trigger Business Logic functions.
3. Business Logic validates input, mutates in-memory state, then calls the Storage Layer to persist.
4. After every mutation, the Render Layer re-renders the affected UI sections (expense list, summary, chart).

All rendering is synchronous and DOM-based — no virtual DOM, no reactive framework.

---

## Components and Interfaces

### Storage Layer

Responsible for reading and writing to `localStorage`. Wraps all access in try/catch to handle `localStorage` being unavailable (e.g., private browsing quota exceeded).

```js
const STORAGE_KEYS = {
  expenses:   'ebv_expenses',
  categories: 'ebv_categories',
  budgets:    'ebv_budgets'
};

function loadData()          // returns { expenses, categories, budgets }
function saveExpenses(arr)   // serializes and writes expenses array
function saveCategories(arr) // serializes and writes categories array
function saveBudgets(obj)    // serializes and writes budgets map { categoryName: amount }
```

### In-Memory State

Three module-level variables hold the current application state:

```js
let expenses   = [];  // Expense[]
let categories = [];  // string[]
let budgets    = {};  // { [categoryName: string]: number }
```

### Business Logic Functions

```js
// Expenses
function addExpense(amount, category, date, description)
function deleteExpense(id)
function getExpensesForMonth(year, month)  // returns filtered Expense[]

// Categories
function addCategory(name)
function deleteCategory(name)
function categoryHasExpenses(name)         // returns boolean

// Budgets
function setBudget(category, amount)
function getBudget(category)               // returns number | null

// Summary
function getMonthlySummary(year, month)
// returns { totals: { [cat]: number }, grandTotal: number, overBudget: string[] }
```

### Render / UI Layer

```js
function renderExpenseList(filterCategory, filterMonth)
function renderCategorySelector()
function renderCategoryList()
function renderMonthlySummary(year, month)
function renderChart(year, month)
function showFieldError(fieldId, message)
function clearErrors()
function showNotification(message, type)  // type: 'error' | 'info'
```

### Event Handlers (wired in `init()`)

| Event | Element | Handler |
|---|---|---|
| submit | `#expense-form` | `handleAddExpense()` |
| click | `#add-category-btn` | `handleAddCategory()` |
| click | `#set-budget-btn` | `handleSetBudget()` |
| click | `.delete-expense-btn` | `handleDeleteExpense(id)` |
| click | `.delete-category-btn` | `handleDeleteCategory(name)` |
| change | `#month-selector` | `handleMonthChange()` |
| change | `#filter-category` | `handleFilterChange()` |

---

## Data Models

### Expense

```js
{
  id:          string,   // crypto.randomUUID() or Date.now().toString()
  amount:      number,   // positive float, e.g. 12.50
  category:    string,   // must match an existing category name
  date:        string,   // ISO date string "YYYY-MM-DD"
  description: string    // optional, may be empty string
}
```

### Category

Categories are stored as a plain `string[]` in `localStorage`. Each entry is a unique category name (trimmed, stored as-entered, compared case-insensitively).

### Budget

Budgets are stored as a plain object (map) in `localStorage`:

```js
{
  "Food": 300,
  "Transport": 100
}
```

Key is the category name; value is the monthly budget amount (positive number).

### localStorage Schema

| Key | Type | Description |
|---|---|---|
| `ebv_expenses` | JSON string | Serialized `Expense[]` |
| `ebv_categories` | JSON string | Serialized `string[]` |
| `ebv_budgets` | JSON string | Serialized `{ [name]: number }` |

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

