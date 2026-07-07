let orders = [];

async function loadOrders(){

const sort =
document.getElementById("sortOrders").value;

let query =
db.from("orders").select("*");

switch(sort){

case "new":
query=query.eq("status","Нове");
break;

case "processing":
query=query.eq("status","В обробці");
break;

case "sent":
query=query.eq("status","Відправлено");
break;

case "done":
query=query.eq("status","Виконано");
break;

case "cancel":
query=query.eq("status","Скасовано");
break;

}

query=query.order("created_at",{ascending:false});

const {data,error}=await query;

if(error){
console.log(error);
return;
}

orders=data;

renderOrders();

}

loadOrders();

function updateStatusColor(select){

select.className="";

switch(select.value){

case "Нове":
select.classList.add("status-new");
break;

case "В обробці":
select.classList.add("status-processing");
break;

case "Відправлено":
select.classList.add("status-sent");
break;

case "Виконано":
select.classList.add("status-done");
break;

case "Скасовано":
select.classList.add("status-cancel");
break;

}

}

function renderOrders(list = orders){

const tbody =
document.getElementById("ordersTable");

const cards =
document.getElementById("ordersCards");

tbody.innerHTML = "";
cards.innerHTML = "";

list.forEach(order=>{

/* ---------- ПК ---------- */

tbody.innerHTML += `

<tr>

<td>${order.id}</td>

<td>${order.order_number || "-"}</td>

<td>${formatDate(order.created_at)}</td>

<td>${order.customer_name}</td>

<td>${order.phone}</td>

<td>${order.email || "-"}</td>

<td>${order.city}</td>

<td>${order.total_price}$</td>

<td>

<select onchange="changeStatus(${order.id},this.value)">

<option value="Нове" ${order.status=="Нове"?"selected":""}>🟠 Нове</option>

<option value="В обробці" ${order.status=="В обробці"?"selected":""}>🔵 В обробці</option>

<option value="Відправлено" ${order.status=="Відправлено"?"selected":""}>🚚 Відправлено</option>

<option value="Виконано" ${order.status=="Виконано"?"selected":""}>✅ Виконано</option>

<option value="Скасовано" ${order.status=="Скасовано"?"selected":""}>❌ Скасовано</option>

</select>

</td>

<td>

<button onclick="showOrder(${order.id})">

👁

</button>

</td>

</tr>

`;


/* ---------- Телефон ---------- */

cards.innerHTML += `

<div class="order-card">

<div class="card-header">

<div class="card-number">

${order.order_number}

</div>

<select
class="card-status"
onchange="changeStatus(${order.id},this.value)">

<option value="Нове" ${order.status=="Нове"?"selected":""}>🟠 Нове</option>

<option value="В обробці" ${order.status=="В обробці"?"selected":""}>🔵 В обробці</option>

<option value="Відправлено" ${order.status=="Відправлено"?"selected":""}>🚚 Відправлено</option>

<option value="Виконано" ${order.status=="Виконано"?"selected":""}>✅ Виконано</option>

<option value="Скасовано" ${order.status=="Скасовано"?"selected":""}>❌ Скасовано</option>

</select>

</div>

<div class="card-info">

<div>👤 ${order.customer_name}</div>

<div>📞 ${order.phone}</div>

<div>📍 ${order.city}</div>

<div>📅 ${formatDate(order.created_at)}</div>

<div>💰 ${order.total_price}$</div>

</div>

<button
class="view-order-btn"
onclick="showOrder(${order.id})">

👁 Переглянути

</button>

</div>

`;

});

}

function formatDate(date){

if(!date) return "-";

const d = new Date(date);

return d.toLocaleString("uk-UA");

}

function filterOrders(){

const q =
document
.getElementById("orderSearch")
.value
.toLowerCase();

const filtered = orders.filter(order=>

(order.order_number || "")
.toLowerCase()
.includes(q)

||

(order.customer_name || "")
.toLowerCase()
.includes(q)

||

(order.phone || "")
.toLowerCase()
.includes(q)

);

renderOrders(filtered);

}

async function changeStatus(id,status){

const {error}=await db
.from("orders")
.update({
status:status
})
.eq("id",id);

if(error){

alert(error.message);
return;

}

loadOrders();

}
function showOrder(id){

const order =
orders.find(o=>o.id===id);

if(!order) return;

let products = "";

if(order.products){

order.products.forEach(item=>{

products += `

<div style="margin-bottom:12px">

<b>${item.name}</b><br>

Кількість: ${item.quantity}<br>

Ціна: ${item.price}$

</div>

`;

});

}

document.getElementById("orderInfo").innerHTML = `

<p><b>Номер:</b> ${order.order_number}</p>

<p><b>Дата:</b> ${formatDate(order.created_at)}</p>

<p><b>Покупець:</b> ${order.customer_name}</p>

<p><b>Телефон:</b> ${order.phone}</p>

<p><b>Email:</b> ${order.email || "-"}</p>

<p><b>Місто:</b> ${order.city}</p>

<p><b>Доставка:</b> ${order.delivery_type}</p>

<p><b>Адреса:</b> ${order.branch}</p>

<hr>

<h3>Товари</h3>

${products}

<hr>

<h3>

Загальна сума:
${order.total_price}$

</h3>

`;

document
.getElementById("orderModal")
.style.display="flex";

}

function closeOrder(){

document
.getElementById("orderModal")
.style.display="none";

}

window.onscroll = function(){

const btn =
document.getElementById("scrollTopBtn");

if(document.documentElement.scrollTop > 350){

btn.style.display = "block";

}else{

btn.style.display = "none";

}

}

function scrollToTop(){

window.scrollTo({

top:0,
behavior:"smooth"

});

}