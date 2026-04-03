// ================= DATA =================
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || ["Food", "Transport", "Fun"];
let selectedFilter = "All";

const list = document.getElementById("list");
const balanceEl = document.getElementById("balance");

let chart;

// ================= RENDER CATEGORY =================
function renderCategories() {
  const categorySelect = document.getElementById("category");
  const filterSelect = document.getElementById("filterCategory");

  categorySelect.innerHTML = "";
  filterSelect.innerHTML = '<option value="All">All</option>';

  categories.forEach(cat => {
    const opt1 = document.createElement("option");
    opt1.value = cat;
    opt1.textContent = cat;
    categorySelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = cat;
    opt2.textContent = cat;
    filterSelect.appendChild(opt2);
  });
}

// ================= ADD CATEGORY =================
document.getElementById("addCategoryBtn").onclick = () => {
  let newCat = document.getElementById("newCategory").value.trim();

  if (!newCat) return;

  // 🔥 Capitalize (biar rapi)
  newCat = newCat.charAt(0).toUpperCase() + newCat.slice(1);

  // 🔥 prevent duplicate (case-insensitive)
  if (!categories.some(c => c.toLowerCase() === newCat.toLowerCase())) {
    categories.push(newCat);
    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories();
  }

  document.getElementById("newCategory").value = "";
};

// ================= ADD TRANSACTION =================
document.getElementById("addBtn").onclick = () => {
  const text = document.getElementById("text").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (!text || isNaN(amount) || amount <= 0) {
    alert("Masukkan data yang valid!");
    return;
  }

  const transaction = {
    id: Date.now(),
    text,
    amount,
    category
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  update();

  // reset input
  document.getElementById("text").value = "";
  document.getElementById("amount").value = "";
};

// ================= DELETE =================
function deleteItem(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  update();
}

// ================= FILTER =================
document.getElementById("filterCategory").onchange = (e) => {
  selectedFilter = e.target.value;
  update();
};

// ================= UPDATE =================
function update() {
  list.innerHTML = "";

  let totalExpense = 0;

  let filtered = selectedFilter === "All"
    ? transactions
    : transactions.filter(t => t.category === selectedFilter);

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty">No transactions</div>`;
  }

  filtered.forEach(t => {
    totalExpense += t.amount;

    const li = document.createElement("li");

    li.innerHTML = `
      <span>${t.text} (${t.category}) - $${t.amount}</span>
      <button onclick="deleteItem(${t.id})">X</button>
    `;

    list.appendChild(li);
  });

  balanceEl.innerText = `$${totalExpense.toFixed(2)}`;

  drawChart();
}

// ================= CHART =================
function drawChart() {
  const data = {};

  categories.forEach(cat => data[cat] = 0);

  transactions.forEach(t => {
    if (data[t.category] !== undefined) {
      data[t.category] += t.amount;
    }
  });

  if (chart) chart.destroy();

  const values = Object.values(data);

  // 🔥 kalau semua 0 → jangan crash
  if (values.every(v => v === 0)) return;

  chart = new Chart(document.getElementById("chart"), {
    type: "pie",
    data: {
      labels: Object.keys(data),
      datasets: [{
        data: values,
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#8e44ad",
          "#2ecc71"
        ]
      }]
    },
    options: {
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

// ================= 🌙 DARK MODE =================
const toggleBtn = document.getElementById("themeToggle");

// load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleBtn.textContent = "☀️";
}

toggleBtn.onclick = () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "🌙";
  }
};

// ================= INIT =================
renderCategories();
update();