const urlAPI = "https://6800a30bb72e9cfaf7281b89.mockapi.io/product";
let currentEditId = null;

function getProduct() {
    fetch(urlAPI)
        .then(res => res.json())
        .then(data => {
            const tableBody = document.querySelector(".product-list");
            tableBody.innerHTML = ""; 

            data.forEach((product, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${product.title}</td>
                    <td>${product.description}</td>
                    <td><img src="${product.image}" style="width: 50px; height: 50px;" /></td>
                    <td>${product.quan}</td>
                    <td>${product.price}</td>
                    <td>
                        <button class="btn btn-primary edit-id" data-id="${product.id}">Sửa</button>
                        <button class="btn btn-danger delete-id" data-id="${product.id}">Xóa</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            setupButtons();
        })
        .catch(err => console.error("Fetch error:", err));
}

function setupButtons() {
    document.querySelectorAll(".edit-id").forEach(button => {
        button.onclick = () => editProduct(button.dataset.id);
    });

    document.querySelectorAll(".delete-id").forEach(button => {
        button.onclick = () => deleteProduct(button.dataset.id);
    });
}

function editProduct(id) {
    fetch(`${urlAPI}/${id}`)
        .then(res => res.json())
        .then(product => {
            document.querySelector("#product-title").value = product.title;
            document.querySelector("#product-description").value = product.description;
            document.querySelector("#product-image").value = product.image;
            document.querySelector("#product-quan").value = product.quan;
            document.querySelector("#product-price").value = product.price;

            document.querySelector("#form-title").textContent = "Sửa sản phẩm";
            document.querySelector("#add-product-form button").textContent = "Cập nhật sản phẩm";
            currentEditId = id;
        });
}

function deleteProduct(id) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;

    fetch(`${urlAPI}/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        alert("Xóa thành công!");
        getProduct();
    })
    .catch(err => console.error("Delete error:", err));
}

const addProductForm = document.getElementById("add-product-form");
addProductForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const product = {
        title: document.getElementById("product-title").value.trim(),
        description: document.getElementById("product-description").value.trim(),
        image: document.getElementById("product-image").value.trim(),
        quan: Number(document.getElementById("product-quan").value),
        price: Number(document.getElementById("product-price").value),
    };

    const method = currentEditId ? "PUT" : "POST";
    const apiUrl = currentEditId ? `${urlAPI}/${currentEditId}` : urlAPI;

    fetch(apiUrl, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    })
    .then(res => res.json())
    .then(() => {
        getProduct();
        addProductForm.reset();
        document.querySelector("#form-title").textContent = "Thêm sản phẩm";
        document.querySelector("#add-product-form button").textContent = "Thêm sản phẩm";
        currentEditId = null;
    })
    .catch(err => console.error("Lỗi thêm/sửa:", err));
});

getProduct();