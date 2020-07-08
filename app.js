// descobre o tipo de dispositivo
const getDeviceType = () => {
    const ua = navigator.userAgent;

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
    }
    if (
        /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)
    ) {
        return 'mobile';
    }

    return 'desktop';
};

// inicia as ações do layout mobile
const initMobile = () => {
    const colors = document.querySelector('.colors');
    colors.onclick = event => {
        if (event.target.classList.contains('checkbox') && !event.target.classList.contains('checked')) {
            selectFilter('.colors div .checkbox', event.target);
            updateClothsIntoDOM(event.target.id);
        }
    }
    const sizes = document.querySelector('.sizes');
    sizes.onclick = event => {
        if (event.target.tagName === 'DIV') {
            selectFilter('.sizes div', event.target);
            updateClothsIntoDOM(event.target.id);
        }
    }
    const prices = document.querySelector('.prices');
    prices.onclick = event => {
        const low = event.target.dataset.lowprice;
        const big = event.target.dataset.bigprice;

        if (event.target.classList.contains('checkbox')) {
            selectFilter('.prices div .checkbox', event.target);
            updateClothsIntoDOM(low, big);
        }
    }
    const expandColor = document.querySelector('#expand_colors');
    let isColorExpanded = false;
    expandColor.onclick = () => {
        if (!isColorExpanded) {
            document.querySelector('.colors').style.height = 'unset';
            isColorExpanded = true;
        } else {
            document.querySelector('.colors').style.height = '30px';
            isColorExpanded = false;
        }
    }

    const expandSize = document.querySelector('#expand_sizes');
    let isSizeExpanded = false;
    expandSize.onclick = () => {
        if (!isSizeExpanded) {
            document.querySelector('.sizes').style.height = 'unset';
            isSizeExpanded = true
        } else {
            document.querySelector('.sizes').style.height = '30px';
            isSizeExpanded = false;
        }
    }

    const expandPrice = document.querySelector('#expand_prices');
    let isPriceExpanded = false;
    expandPrice.onclick = () => {
        if (!isPriceExpanded) {
            document.querySelector('.prices').style.height = 'unset';
            isPriceExpanded = true;
        } else {
            document.querySelector('.prices').style.height = '30px';
            isPriceExpanded = false;
        }
    }

    const closeFilter = document.querySelector('#close_filters');
    closeFilter.onclick = () => {
        document.querySelector('.mobile-filter').style.display = 'none';
        document.querySelector('body').style.overflow = 'unset';
    }

    const openFilter = document.querySelector('#filter_btn');
    openFilter.onclick = () => {
        document.querySelector('.mobile-filter').style.display = 'block';
        document.querySelector('body').style.overflow = 'hidden';
    }

    const closeOrder = document.querySelector('#close_orders');
    closeOrder.onclick = () => {
        document.querySelector('.mobile-order').style.display = 'none';
        document.querySelector('body').style.overflow = 'unset';
    }

    const openOrder = document.querySelector('#order_btn');
    openOrder.onclick = () => {
        document.querySelector('.mobile-order').style.display = 'block';
        document.querySelector('body').style.overflow = 'hidden';
    }
}

// insere a estilização móvel se o dispositivo for móvel
const insertMobileStyle = () => {
    const device = getDeviceType();
    console.log(device);

    if (device == 'tablet' || device == 'mobile') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './mobile-style.css';
        document.querySelector('head').append(link);
        initMobile();
    }
}
insertMobileStyle();

// busca os dados dos produtos
const getClothes = async () => {
    try {
        const res = await fetch('./clothes.json')
            .then(res => res.json())
            .then(clothesArr => clothesArr.clothes);

        return res;
    } catch (err) {
        console.error(err);
    }
}
let clothes;
const cartNumberIcon = document.querySelector('#cart_items');
const clothesDisplay = document.querySelector('#display')
const loadBtn = document.querySelector('#load_more');

let clothesArr,
    sessionStorageArr = JSON.parse(sessionStorage.getItem('cart')),
    clothesCartArr = sessionStorage.getItem('cart') !== null ? sessionStorageArr : [];

// console.log(clothesCartArr);

if (clothesCartArr.length !== 0) {
    cartNumberIcon.classList.remove('hidden');
    cartNumberIcon.innerHTML = clothesCartArr.length;
}

// insere os produtos na pagina
const insertClothsIntoDOM = async () => {
    clothes = await getClothes();

    clothes.map(({ id, name, price, maxTimes, timesValue, image }) => {
        let template = document.createElement('div');
        template.classList.add('clothes');
        template.innerHTML = `
                <img src="./images/${image}" alt="${name}" name="${name}">
                <div class="info">
                    <span>${name.toUpperCase()}</span>
                    <span>R$ ${price.toFixed(2).toString().replace(".", ",")}</span>
                    <span>até ${maxTimes}x de R$${timesValue.toFixed(2).toString().replace(".", ",")}</span>
                 
                </div>
                <button onclick="addToCart(${id})">COMPRAR</button>
            </div>`
        clothesDisplay.append(template);
    })
    // console.log(clothes);
}
insertClothsIntoDOM();

// atualiza podutos a partir da filtragem
const updateClothsIntoDOM = (param = null, maxparam = null) => {
    clothesDisplay.innerHTML = '';
    clothes.map(({ id, name, price, sizes, colors, maxTimes, timesValue, image }) => {
        if (colors === param
            || price >= param && price <= maxparam
            || 'size' + sizes.toLowerCase() === param
            || param === null) {
            let template = `<div class="clothes">
                    <img src="./images/${image}" alt="${name}" name="${name}">
                    <div class="info">
                        <span>${name.toUpperCase()}</span>
                        <span>R$ ${price.toFixed(2).toString().replace(".", ",")}</span>
                        <span>até ${maxTimes}x de R$${timesValue.toFixed(2).toString().replace(".", ",")}</span>
                     
                    </div>
                    <button onclick="addToCart(${id})">COMPRAR</button>
                </div>`

            clothesDisplay.innerHTML += template;
        }
    })
}
// adiciona produto no carrinho
const addToCart = (id) => {
    clothesArr = [...clothes];
    clothesArr = clothesArr.filter(clothes => clothes.id === id);
    clothesCartArr.push(clothesArr[0]);
    sessionStorage.setItem('cart', JSON.stringify(clothesCartArr))
    updateCartItems(clothesCartArr);
}

// remove produto do carrinho
const removeFromCart = (id) => {
    clothesCartArr = clothesCartArr.filter(clothes => clothes.id !== id);
    sessionStorage.setItem('cart', JSON.stringify(clothesCartArr));
    updateCartItems(clothesCartArr);
}

// atualiza produtos do carrinho
const updateCartItems = (arr) => {
    const totalPrice = arr.reduce((totalPrice, { price }) => totalPrice + price, 0);

    if (arr.length > 0) {
        cartNumberIcon.classList.remove('hidden');
        cartNumberIcon.innerHTML = arr.length;
    }

    let template = '';
    arr.map(clothes => {

        template += `<div><span>${clothes.name.toUpperCase()}</span>
            <span>R$ ${clothes.price.toFixed(2)}</span>
            <span class="remove" onclick="removeFromCart(${clothes.id})">x</span>
        </div>`
    })

    const cartDisplay = document.querySelector('#products');
    const finalPrice = document.querySelector('#final_price');
    cartDisplay.innerHTML = template;
    finalPrice.innerHTML = totalPrice.toFixed(2);
}
updateCartItems(clothesCartArr);

// interação com os botões de filtragem
const selectFilter = (element, selected) => {
    const DOMFilter = document.querySelectorAll(`${element}`);
    DOMFilter.forEach(element => {
        if (element == selected && !selected.classList.contains('checked')) {
            element.classList.add('checked');
        }
        else {
            element.classList.remove('checked');
        }
    })
}

// controles de filtragem
const loadMore = document.querySelector('#load_more');
loadMore.onclick = () => insertClothsIntoDOM();

const colors = document.querySelector('.filter .colors');
colors.onclick = event => {
    if (event.target.classList.contains('checkbox') && !event.target.classList.contains('checked')) {
        selectFilter('.colors div .checkbox', event.target);
        updateClothsIntoDOM(event.target.id);
    }
}
const sizes = document.querySelector('.filter .sizes');
sizes.onclick = event => {
    if (event.target.tagName === 'DIV') {
        selectFilter('.sizes div', event.target);
        updateClothsIntoDOM(event.target.id);
    }
}
const prices = document.querySelector('.filter .prices');
prices.onclick = event => {
    const low = event.target.dataset.lowprice;
    const big = event.target.dataset.bigprice;

    if (event.target.classList.contains('checkbox')) {
        selectFilter('.prices div .checkbox', event.target);
        updateClothsIntoDOM(low, big);
    }
}

const moreColors = document.querySelector('#more_colors');
moreColors.onclick = () => {
    document.querySelector('.filter .colors').style.height = 'unset';
    moreColors.style.display = 'none';
}

const resetFilters = document.querySelector('#reset');
resetFilters.onclick = () => location.reload();

// controles do carrinho
const modal = document.querySelector('#cart');
const closeModal = () => modal.classList.toggle('hidden');

const cart = document.querySelector('.nav i');
cart.onclick = () => modal.classList.toggle('hidden');

// ordena os produtos
const orderSort = (sort) => {
    clothesArr = [];

    for (let i = 0; i < clothes.length; i++) {
        clothesArr.push([clothes[i].id, clothes[i].price])
    }

    switch (sort) {
        case 'big':
            clothesArr.sort((a, b) => {
                return b[1] - a[1]
            })
            updateOrderedClothsIntoDOM()
            break;
        case 'low':
            clothesArr.sort(function (a, b) {
                return a[1] - b[1]
            })
            updateOrderedClothsIntoDOM()
            break;
    }
}

const updateOrderedClothsIntoDOM = () => {
    clothesDisplay.innerHTML = '';

    let nameArr = []
    clothesArr.map((newClothes) => {
        clothes.some(({ id, name, price, maxTimes, timesValue, image }) => {
            if (nameArr.find(element => element == name)) return

            if (newClothes[1] === price) {
                nameArr.push(name)
                let template = `<div class="clothes">
                    <img src="./images/${image}" alt="${name}" name="${name}">
                    <div class="info">
                        <span>${name.toUpperCase()}</span>
                        <span>R$ ${price.toFixed(2).toString().replace(".", ",")}</span>
                        <span>até ${maxTimes}x de R$${timesValue.toFixed(2).toString().replace(".", ",")}</span>
                     
                    </div>
                    <button onclick="addToCart(${id})">COMPRAR</button>
                </div>`

                clothesDisplay.innerHTML += template;
            }
        })
    })
}

const orderControls = document.querySelectorAll('.dropdown-content');
orderControls.forEach(control => control.onclick = event => {
    switch (event.target.id) {
        case 'order_recent':
            updateClothsIntoDOM();
            break;
        case 'order_biggest':
            orderSort('big');
            break;
        case 'order_lowest':
            orderSort('low');
            break;
    }
})