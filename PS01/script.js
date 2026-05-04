
const products = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: `$${((i + 1) * 10).toFixed(2)}`,
    image: `https://via.placeholder.com/50?text=P${i + 1}`
}));

const rowsPerPage = 10;
let currentPage = 1;

function displayTable(page) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = products.slice(start, end);

    const tbody = document.getElementById("product-list");
    tbody.innerHTML = ""; 

    paginatedItems.forEach(product => {
        const row = `
            <tr>
                <td><img src="${product.image}" alt="${product.name}"></td>
                <td>${product.name}</td>
                <td>${product.price}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function setupPagination() {
    const pageCount = Math.ceil(products.length / rowsPerPage);
    const paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = ""; 

    
    if (pageCount <= 1) return;

    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement("button");
        button.innerText = i;
        
        
        if (i === currentPage) {
            button.classList.add("active");
        }
        
        
        button.addEventListener("click", () => {
            currentPage = i;
            displayTable(currentPage);
            setupPagination(); 
        });
        
        paginationDiv.appendChild(button);
    }
}

displayTable(currentPage);
setupPagination();
