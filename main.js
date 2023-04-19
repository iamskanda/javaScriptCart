let carts = document.querySelectorAll('.add-cart');

let products = {    
    items: [{
    name: 'Grey Tshirt',
    tag: 'greytshirt',
    price: 15.00,
    inCart: 0
},
{
    name: "Grey Hoddie",
    tag: "greyhoddie",
    price: 20.00,
    inCart: 0
},
{
    name: "Black Tshirt",
    tag: "blacktshirt",
    price: 10.00,
    inCart: 0
},
{
    name: "Black Hoddie",
    tag: "blackhoddie",
    price: 25.00,
    inCart: 0
}],
    coupons: [{
    apply: false,
    discount: 20.00,
    target: 50.00,
}],}

console.log('general console ' + products.coupons[0].discount)
console.log('general console ' + products.coupons[0].apply)
// localStorage.clear()

for (let i=0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products.items[i]);
        totalCost(products.items[i])
    })
}

function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');

    if(productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}

function cartNumbers(product, action) {
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);

    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if( action == "decrease") {
        localStorage.setItem('cartNumbers', productNumbers - 1);
        document.querySelector('.cart span').textContent = productNumbers - 1;
    } else if( productNumbers ) {
        localStorage.setItem("cartNumbers", productNumbers + 1 );
        document.querySelector('.cart span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart span').textContent = 1;
    }

    setItems(product);
}

function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if(cartItems != null) {
        if(cartItems[product.tag] == undefined) {
            cartItems = {
                ...cartItems,
                [product.tag]: product
            }
        }
        cartItems[product.tag].inCart += 1; 
    } else {
        product.inCart = 1;
        cartItems = {
            [product.tag]: product
        }
    }
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalCost(product, action) {
    let cartCost = localStorage.getItem('totalCost');

    if(action == "decrease") {
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost',cartCost - product.price);
    } else if(cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem("totalCost", cartCost + product.price);
    } else {
        localStorage.setItem("totalCost", product.price);
    }
    if (cartCost >= products.coupons[0].target && products.coupons[0].apply == false) {
        discountCart();
    }
    if (cartCost < products.coupons[0].target && products.coupons[0].apply == true){
        discountCart();
    }
    console.log("My cartCost is", cartCost);
    console.log(typeof cartCost );
};

// // DISCOUNT FUNCTIONALITY // //
function discountCart() {

    let cartCost = localStorage.getItem('totalCost');

    if (cartCost >= products.coupons[0].target && products.coupons[0].apply == false) {
        localStorage.setItem("totalCost", cartCost - products.coupons[0].discount)
        products.coupons[0].apply = true

        console.log('discount added ', cartCost - products.coupons[0].discount)
    }
    else if (cartCost < products.coupons[0].target && products.coupons[0].apply == true) {
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost',cartCost + products.coupons[0].apply)
        products.coupons[0].apply = false

        console.log('discount removed discountCart() ', cartCost + products.coupons[0].discount)
	// // WHERE EVER THIS IS IMPLEMENTED IN THE CODE, MAY ALSO BE WHERE PART OF THE ISSUE OCCURS // //
    }
};

function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector(".products");
    let cartCost = localStorage.getItem('totalCost');

    // console.log(cartItems);
    if( cartItems && productContainer ) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
            <div class="product">
                <ion-icon name="close-circle"></ion-icon>
                <img src="./images/${item.tag}.jpg">
                <span>${item.name}</span>
            </div>
            <div class="price">$${item.price}.00</div>
            <div class="quantity">
                <ion-icon class="decrease" name="arrow-dropleft-circle"></ion-icon>
                <span>${item.inCart}</span>
                <ion-icon class="increase" name="arrow-dropright-circle"></ion-icon>
            </div>
            <div class="total">
                ${item.inCart * item.price}
            </div>
            `;
        });

        productContainer.innerHTML += `
            <div class="basketTotalContainer">
                <h4 class="basketTotalTitle">
                    Basket Total
                </h4>
                <h4 class="basketTotal">
                    ${cartCost}
                </h4>
        `;

    }

    deleteButtons();
    manageQuantity();
}


function deleteButtons() {
    let deleteButtons = document.querySelectorAll('.product ion-icon');
    let productName;
    let productNumbers = localStorage.getItem('cartNumbers');
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let cartCost = localStorage.getItem('totalCost');


    for(let i=0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', () => {
            productName = deleteButtons[i].parentElement.textContent.trim().toLowerCase().replace(/ /g, '');
            // console.log(productName);
            // console.log(cartItems[productName].name + " " + cartItems[productName].inCart)
            localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart );

            if (products.coupons[0].apply == true) {
                localStorage.setItem('totalCost', cartCost - ( cartItems[productName].price * cartItems[productName].inCart) + products.coupons[0].discount);

	// // THE ABOVE LINE MAY BE THE ISSUE FOR SUBTRACTING 19 INSTEAD OF 20 WHEN THE TOTAL HITS 50 // //

                delete cartItems[productName];
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                products.coupons[0].apply = false
                console.log('deletebutton was true now false ' + products.coupons[0].apply)
            }
            else if (products.coupons[0].apply == false){
                localStorage.setItem('totalCost', cartCost - ( cartItems[productName].price * cartItems[productName].inCart));
                delete cartItems[productName];
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));  
                console.log('deletebutton was false still false ' + products.coupons[0].apply)
            }

            displayCart();
            onLoadCartNumbers();
        });
    }
}

function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.decrease');
    let increaseButtons = document.querySelectorAll('.increase');
    let cartItems = localStorage.getItem('productsInCart');
    let currentQuantity = 0;
    let currentProduct = "";
    cartItems = JSON.parse(cartItems);
    console.log(cartItems);

    for(let i=0; i < decreaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', () => {
            currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim();
            console.log(currentProduct);

            if( cartItems[currentProduct].inCart > 1 ) {
                cartItems[currentProduct].inCart -= 1;
                cartNumbers( cartItems[currentProduct], "decrease" );
                totalCost( cartItems[currentProduct], "decrease" );
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
            }
        });
    }

    for(let i=0; i < increaseButtons.length; i++) {
        increaseButtons[i].addEventListener('click', () => {
            console.log("Increase button");
            currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);

            currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim();
            console.log(currentProduct);

            
            cartItems[currentProduct].inCart += 1;
            cartNumbers( cartItems[currentProduct]);
            totalCost( cartItems[currentProduct]);
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));
            displayCart();
            
        })
    }
}

onLoadCartNumbers();
displayCart();