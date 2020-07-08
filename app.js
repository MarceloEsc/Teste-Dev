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

// insere a estilização móvel se o dispositivo for móvel
const insertMobileStyle = () => {
    const device = getDeviceType();
    console.log(device);


    if (device == 'tablet' || device == 'mobile') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './mobile-style.css';
        document.querySelector('head').append(link);
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

console.log(clothesCartArr);

if (clothesCartArr.length !== 0) {
    cartNumberIcon.classList.remove('hidden')
    cartNumberIcon.innerHTML = clothesCartArr.length
}

// insere os produtos na pagina
const insertClothsIntoDOM = async () => {
    clothes = await getClothes();

    clothes.map(({ id, name, price, maxTimes, timesValue, image }) => {
        let template = document.createElement('div')
        template.classList.add('clothes')
        template.innerHTML = `
                <img src="./images/${image}" alt="${name}" name="${name}">
                <div class="info">
                    <span>${name.toUpperCase()}</span>
                    <span>R$ ${price.toFixed(2).toString().replace(".", ",")}</span>
                    <span>até ${maxTimes}x de R$${timesValue.toFixed(2).toString().replace(".", ",")}</span>
                 
                </div>
                <button onclick="addToCart(${id})">COMPRAR</button>
            </div>`
        clothesDisplay.append(template)
    })
    console.log(clothes);
}
insertClothsIntoDOM()

const updateClothsIntoDOM = (param, maxparam = null) => {
    clothesDisplay.innerHTML = ''
    clothes.map(({ id, name, price, sizes, colors, maxTimes, timesValue, image }) => {
        if (colors === param
            || price >= param && price <= maxparam
            || 'size' + sizes.toLowerCase() === param) {

            let template = `<div class="clothes">
                    <img src="./images/${image}" alt="${name}" name="${name}">
                    <div class="info">
                        <span>${name.toUpperCase()}</span>
                        <span>R$ ${price.toFixed(2).toString().replace(".", ",")}</span>
                        <span>até ${maxTimes}x de R$${timesValue.toFixed(2).toString().replace(".", ",")}</span>
                     
                    </div>
                    <button onclick="addToCart(${id})">COMPRAR</button>
                </div>`

            clothesDisplay.innerHTML += template
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

const removeFromCart = (id) => {
    clothesCartArr = clothesCartArr.filter(clothes => clothes.id !== id);
    sessionStorage.setItem('cart', JSON.stringify(clothesCartArr))
    updateCartItems(clothesCartArr)
}

const updateCartItems = (arr) => {
    const totalPrice = arr.reduce((totalPrice, { price }) => totalPrice + price, 0);

    if (arr.length > 0) {
        cartNumberIcon.classList.remove('hidden')
        cartNumberIcon.innerHTML = arr.length
    }

    let template = ''
    arr.map(clothes => {

        template += `<div><span>${clothes.name.toUpperCase()}</span>
            <span>R$ ${clothes.price.toFixed(2)}</span>
            <span class="remove" onclick="removeFromCart(${clothes.id})">x</span>
        </div>`
    })

    const cartDisplay = document.querySelector('#products')
    const finalPrice = document.querySelector('#final_price')
    cartDisplay.innerHTML = template
    finalPrice.innerHTML = totalPrice.toFixed(2)
}
updateCartItems(clothesCartArr)

const selectFilter = (element, selected) => {
    const DOMFilter = document.querySelectorAll(`${element}`)
    DOMFilter.forEach(element => {
        if (element == selected && !selected.classList.contains('checked')) {
            element.classList.add('checked')
        }
        else {
            element.classList.remove('checked')
        }
    })
}

const loadMore = document.querySelector('#load_more')
loadMore.onclick = () => {
    insertClothsIntoDOM()
}

const colors = document.querySelector('.colors')
colors.onclick = event => {
    if (event.target.classList.contains('checkbox') && !event.target.classList.contains('checked')) {
        selectFilter('.colors div .checkbox', event.target)
        updateClothsIntoDOM(event.target.id)
    }
}
const sizes = document.querySelector('.sizes')
sizes.onclick = event => {
    if (event.target.tagName === 'DIV') {
        selectFilter('.sizes div', event.target)
        updateClothsIntoDOM(event.target.id)
    }
}
const prices = document.querySelector('.prices')
prices.onclick = event => {
    const low = event.target.dataset.lowprice
    const big = event.target.dataset.bigprice

    if (event.target.classList.contains('checkbox')) {
        selectFilter('.prices div .checkbox', event.target)
        updateClothsIntoDOM(low, big)
    }
}

const modal = document.querySelector('#cart')
const closeModal = () => {
    modal.classList.toggle('hidden')
}

const cart = document.querySelector('.nav i')
cart.onclick = () => {
    modal.classList.toggle('hidden')
}

const moreColors = document.querySelector('#more_colors')
moreColors.onclick = () => {
    document.querySelector('.colors').style.height = 'unset'
    moreColors.style.display = 'none'
}