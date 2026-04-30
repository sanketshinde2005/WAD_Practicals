// Dummy product data (15 items to demonstrate pagination)
const products = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: `$${((i + 1) * 10).toFixed(2)}`,
    image: `https://via.placeholder.com/50?text=P${i + 1}`
}));

const rowsPerPage = 10;
let currentPage = 1;

// Function to display table rows for the current page
function displayTable(page) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = products.slice(start, end);

    const tbody = document.getElementById("product-list");
    tbody.innerHTML = ""; // Clear existing rows

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

// Function to setup pagination buttons
function setupPagination() {
    const pageCount = Math.ceil(products.length / rowsPerPage);
    const paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = ""; // Clear existing buttons

    // Only show pagination if there is more than 1 page (i.e. more than 10 items)
    if (pageCount <= 1) return;

    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement("button");
        button.innerText = i;
        
        // Highlight the current page button
        if (i === currentPage) {
            button.classList.add("active");
        }
        
        // Add click event to change page
        button.addEventListener("click", () => {
            currentPage = i;
            displayTable(currentPage);
            setupPagination(); // Re-render buttons to update active state
        });
        
        paginationDiv.appendChild(button);
    }
}

// Initial render
displayTable(currentPage);
setupPagination();
