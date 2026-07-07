console.log("admin.js завантажився");
let products = [];
let imageUrl = "";

async function loadProducts(){

    console.log("loadProducts запустилась");

const { data, error } = await db
.from("products")
.select("*")
.order("name");

console.log(data);
console.log(error);

if(error){
console.log(error);
return;
}

products = data;

const select =
document.getElementById("productSelect");

select.innerHTML =
'<option value="">Оберіть товар</option>';

products.forEach(product=>{

select.innerHTML += `
<option value="${product.id}">
${product.name}
</option>
`;

});

}

loadProducts();

document
.getElementById("productSelect")
.addEventListener("change",loadProduct);

function loadProduct(){

const id =
Number(
document.getElementById(
"productSelect"
).value
);

const product =
products.find(
p=>p.id===id
);

if(!product) return;

document.getElementById(
"name"
).value =
product.name || "";

document.getElementById(
"price"
).value =
product.price || "";

document.getElementById(
"stock"
).value =
product.stock || "";

document.getElementById(
"status"
).value =
product.status || "";

document.getElementById(
"category"
).value =
product.category || "";

document.getElementById(
"brand"
).value =
product.brand || "";

document.getElementById(
"model"
).value =
product.model || "";

document.getElementById(
"characteristics"
).value =
product.characteristics || "";

imageUrl = product.image || "";

const preview =
document.getElementById(
"previewImage"
);

if(imageUrl){

preview.src = imageUrl;
preview.style.display = "block";

}else{

preview.src = "";
preview.style.display = "none";

}

}

async function saveProduct(){

const id =
Number(
document.getElementById(
"productSelect"
).value
);

if(!id){

alert(
"Оберіть товар"
);

return;

}

const file =
document.getElementById("image").files[0];

if(file){

const ext =
file.name.split(".").pop();

const fileName =
Date.now() + "." + ext;

const { error: uploadError } =
await db.storage
.from("product-images")
.upload(
fileName,
file,
{
upsert:true
}
);

if(uploadError){

console.log(uploadError);

alert("Помилка завантаження фото");

return;

}

const { data } =
db.storage
.from("product-images")
.getPublicUrl(fileName);

imageUrl =
data.publicUrl;

}

const { error } =
await db
.from("products")
.update({
    
name:
document.getElementById("name").value,

price:
Number(
document.getElementById("price").value
),

stock:
Number(
document.getElementById("stock").value
),

status:
document.getElementById("status").value,

category:
document.getElementById("category").value,

brand:
document.getElementById("brand").value,

model:
document.getElementById("model").value,

characteristics:
document.getElementById("characteristics").value,

image:imageUrl

})
.eq("id",id);

if(error){

console.log(error);

alert(error.message);

return;

}

showMessage(
"✅ Товар успішно оновлено"
);

loadProducts();

}

async function addProduct(){

const file =
document.getElementById("image").files[0];

if(file){

const ext =
file.name.split(".").pop();

const fileName =
Date.now() + "." + ext;

const { error: uploadError } =
await db.storage
.from("product-images")
.upload(
fileName,
file,
{
upsert:true
}
);

if(uploadError){

console.log(uploadError);

alert(uploadError.message);

return;

}

const { data } =
db.storage
.from("product-images")
.getPublicUrl(fileName);

imageUrl =
data.publicUrl;

}

const { error } =
await db
.from("products")
.insert({


name:
document.getElementById("name").value,

brand:
document.getElementById("brand").value,

model:
document.getElementById("model").value,

price:
Number(
document.getElementById("price").value
),

stock:
Number(
document.getElementById("stock").value
),

category:
document.getElementById("category").value,

status:
document.getElementById("status").value,

characteristics:
document.getElementById("characteristics").value,

image:
imageUrl || ""

});

console.log("INSERT ERROR:", error);

if(error){

console.log(error);

alert(error.message);

return;

}

showMessage(
"✅ Товар успішно додано"
);

document.getElementById(
"previewImage"
).src = "";

document.getElementById(
"previewImage"
).style.display = "none";

document.getElementById("name").value = "";
document.getElementById("brand").value = "";
document.getElementById("model").value = "";
document.getElementById("price").value = "";
document.getElementById("stock").value = "";
document.getElementById("category").value = "";
document.getElementById("image").value = "";
document.getElementById("characteristics").value = "";

imageUrl = "";

document.getElementById(
"fileName"
).innerText =
"Фото не вибрано";

const preview =
document.getElementById(
"previewImage"
);

if(preview){

preview.src = "";
preview.style.display = "none";

}

loadProducts();

}

async function deleteProduct(){

const id =
Number(
document.getElementById(
"productSelect"
).value
);

console.log("Видаляємо ID:", id);

if(!id){

alert("Оберіть товар");
return;

}

if(!confirm("Видалити товар?")){
return;
}

const { data, error } =
await db
.from("products")
.delete()
.eq("id",id)
.select();

console.log("DELETE RESULT:", data);
console.log("DELETE ERROR:", error);

if(error){

alert(error.message);
return;

}

showMessage(
"🗑 Товар видалено"
);

document.getElementById("productSelect").value = "";

document.getElementById("name").value = "";
document.getElementById("brand").value = "";
document.getElementById("model").value = "";
document.getElementById("price").value = "";
document.getElementById("stock").value = "";
document.getElementById("category").value = "";

document.getElementById("status").value =
"В наявності";

document.getElementById("image").value = "";

imageUrl = "";

const fileName =
document.getElementById("fileName");

if(fileName){

fileName.innerText =
"Фото не вибрано";

}

const preview =
document.getElementById("previewImage");

if(preview){

preview.src = "";
preview.style.display = "none";

}

loadProducts();

}

document
.getElementById("image")
.addEventListener("change", function(){

const file = this.files[0];

document.getElementById(
"fileName"
).innerText =

file
? "📷 " + file.name
: "Фото не вибрано";

});

function filterProducts(){

console.log("Пошук працює");
console.log(products.length);

const query =
document.getElementById(
"adminSearch"
)
.value
.toLowerCase();

const select =
document.getElementById(
"productSelect"
);

select.innerHTML =
'<option value="">Оберіть товар</option>';

products
.filter(product =>

product.name
.toLowerCase()
.includes(query)

||

(product.brand || "")
.toLowerCase()
.includes(query)

||

(product.model || "")
.toLowerCase()
.includes(query)

)
.forEach(product=>{

select.innerHTML += `

<option value="${product.id}">

${product.name}
| ${product.brand || ""}
| ${product.model || ""}

</option>

`;

});

}

function removeImage(){

if(!confirm("Видалити фото товару?")){
return;
}

imageUrl = "";

document.getElementById(
"previewImage"
).src = "";

document.getElementById(
"previewImage"
).style.display = "none";

document.getElementById(
"image"
).value = "";

document.getElementById(
"fileName"
).innerText =
"Фото не вибрано";

}

function showMessage(text){

const msg =
document.createElement("div");

msg.innerHTML = text;

msg.style.cssText = `
position:fixed;
top:20px;
right:20px;
background:#00b86b;
color:white;
padding:15px 25px;
border-radius:12px;
font-weight:bold;
font-size:16px;
z-index:99999;
box-shadow:0 0 20px rgba(0,0,0,.3);
`;

document.body.appendChild(msg);

setTimeout(()=>{

msg.remove();

},5000);

}