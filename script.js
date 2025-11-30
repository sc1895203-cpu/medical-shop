function searchProduct() {
    let query = document.getElementById("searchInput").value.toLowerCase();
    let products = document.querySelectorAll(".product");

    products.forEach((item) => {
        let name = item.querySelector("h3").textContent.toLowerCase();
        if(name.includes(query)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}
document.getElementById("searchInput").addEventListener("input", searchProduct);

const searchInput = document.getElementById("searchInput");
const suggestionBox = document.getElementById("suggestionBox");

searchInput.addEventListener("input", async function () {
  const query = this.value;

  if (query.length === 0) {
    suggestionBox.innerHTML = "";
    return;
  }

   const res = await fetch(`http://backend-medical-shop2-production.up.railway.app/search?q=${query}`);
  const data = await res.json();

  suggestionBox.innerHTML = data
    .map(item => `<div class="suggestion-item" onclick="selectProduct('${item.name}')">${item.name}</div>`)
    .join("");
});

async function selectProduct(name) {
  const res = await fetch(`http://backend-medical-shop2-production.up.railway.app/search?q=${name}`);
  const data = await res.json();

  console.log(data); // later display product card
  suggestionBox.innerHTML = "";
  searchInput.value = name;
}

async function loadAllProducts() {
  const res = await fetch("http://backend-medical-shop2-production.up.railway.app/products");
  const data = await res.json();

  let html = "";
  data.forEach(item => {
    html += `
      <div class="product">
        <h3>${item.name}</h3>
        <p>${item.description || ""}</p>
        <p>Price: ₹${item.price}</p>
        <img src="${item.image}" width="100"/>
        <button onclick="openOrderForm('${item.name}',${item.price})" style="background:#ffb6c1;">Order Now</button>
      </div>
      <hr/>
    `;
  });

  document.getElementById("productsContainer").innerHTML = html;
}

loadAllProducts();
let selectedProduct = "";
let selectedPrice = "";

function openOrderForm(name, price) {
  selectedProduct = name;
  selectedPrice = price;

  document.getElementById("orderProduct").innerHTML =
    "Product: " + name + "<br>Price: ₹" + price;

  document.getElementById("orderForm").style.display = "block";
}

function closeOrderForm() {
  document.getElementById("orderForm").style.display = "none";
}

async function submitOrder() {
  const name = document.getElementById("custName").value;
  const phone = document.getElementById("custPhone").value;
  const address = document.getElementById("custAddress").value;

  const orderData = {
    product: selectedProduct,
    price: selectedPrice,
    name,
    phone,
    address
  };

  const res = await fetch("http://backend-medical-shop2-production.up.railway.app/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData)
  });

  const message = await res.text();
  alert(message);

  closeOrderForm();
}

