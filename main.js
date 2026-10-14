const itemInput = document.getElementById("itemInput");
const quantity = document.getElementById("quantity");
const price = document.getElementById("price");
const addBtn = document.getElementById("addBtn");
const itemList = document.getElementById("itemList");
const clearBtn = document.getElementById("clearBtn");
const totalEl = document.getElementById("total");

const STORAGE_KEY = "shoppingList";

function loadItems() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const items = loadItems();

const formatKES = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
});

function render() {
  itemList.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.dataset.index = index;

    const lineTotal = item.price * item.quantity;

    const label = document.createElement("span");
    label.textContent = `${item.name} x${item.quantity} (${formatKES.format(item.price)} each) - ${formatKES.format(lineTotal)}`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("btn-edit");

    li.append(label, editBtn);

    if (item.purchased) {
      li.classList.add("purchased");
    }
    itemList.appendChild(li);
  });

  updateTotal();
}

function addItem() {
  const name = itemInput.value.trim();
  const cost = parseFloat(price.value);
  const qty = quantity.value === "" ? 1 : parseInt(quantity.value, 10);

  if (!name || Number.isNaN(cost) || Number.isNaN(qty) || qty < 1) {
    alert("Please enter an item name, a price, and a quantity of at least 1.");
    return;
  }

  items.push({ name: name, price: cost, quantity: qty, purchased: false });
  saveItems();
  render();

  itemInput.value = "";
  quantity.value = "";
  price.value = "";
  itemInput.focus();
}

function updateTotal() {
  const total = items
    .filter((item) => item.purchased)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  totalEl.textContent = formatKES.format(total);
}

function clearList() {
  if (items.length === 0) return;

  if (confirm("Clear the entire list?")) {
    items.length = 0;
    saveItems();
    render();
  }
}

function editItem(index) {
  const item = items[index];

  const newName = prompt("Edit item name:", item.name);
  if (newName === null) return;

  const newQty = prompt("Edit quantity:", item.quantity);
  if (newQty === null) return;

  const newPrice = prompt("Edit price (each):", item.price);
  if (newPrice === null) return;

  const qty = parseInt(newQty, 10);
  const cost = parseFloat(newPrice);

  if (!newName.trim() || Number.isNaN(qty) || qty < 1 || Number.isNaN(cost)) {
    alert("Invalid name, quantity or price. No changes were made.");
    return;
  }

  item.name = newName.trim();
  item.quantity = qty;
  item.price = cost;
  saveItems();
  render();
}

addBtn.addEventListener("click", addItem);
clearBtn.addEventListener("click", clearList);

itemList.addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return;

  const index = Number(li.dataset.index);

  if (event.target.classList.contains("btn-edit")) {
    editItem(index);
    return;
  }

  items[index].purchased = !items[index].purchased;
  saveItems();
  render();
});

render();
