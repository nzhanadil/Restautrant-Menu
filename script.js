import {data} from './datafile.js'
const menuLabelsDiv = document.querySelector('.menu-labels')
const menuDiv = document.getElementById('menu')
const search = document.getElementById('search-input')
const clearBtn = document.querySelector('.clear-btn')
let cartItems = []
let selectedCategory;
let seachValue ='';

//getting all menu labels
const getUniqueLabels = (data) => {
    const array = []
    for(let arr of data){
        if(!array.includes(arr.category))
            array.push(arr.category)       
    }
    return array
}
//method for Capitalizing Words
const capitalize = (word) => word.charAt(0).toUpperCase()+word.slice(1)
// getting arr of categories
const categories = ['all', ...getUniqueLabels(data)].concat(['cart'])
//creating needed Menu Label buttons
categories.every(el=> menuLabelsDiv.innerHTML += `<button class="menu-label" id="${el}">${capitalize(el)}</button>`)
document.getElementById('cart').innerHTML += ` (<span class="cart-amount">0</span>)`

const cartAmount = document.querySelector('.cart-amount')

getDefaultScreen()
function getDefaultScreen(){
    getCategoryItems(categories[0], data)
    activateAddToCartBtns()
    document.getElementById(categories[0]).classList.add('active-menu-label')
    selectedCategory = categories[0]
}
//adding eventListeners to each button
categories.forEach(id =>{ 
    document.getElementById(id).addEventListener('click', (event)=>{
        document.getElementById(selectedCategory).classList.remove('active-menu-label')
        event.target.classList.add('active-menu-label') 
        id==='cart' ? getCategoryItems(id, cartItems) : getCategoryItems(id, data)
    })
})
search.addEventListener('keyup', ()=>{
    seachValue = search.value.trim()
    if(seachValue!=='') clearBtn.style.display='inline'
    getCategoryItems(selectedCategory, selectedCategory==='cart'? cartItems:data)
})
clearBtn.addEventListener('click', ()=>{
    seachValue = ''
    search.value = ''
    clearBtn.style.display='none'
    getCategoryItems(selectedCategory, selectedCategory==='cart'? cartItems:data)
})
function getCategoryItems(category, data){
    menuDiv.innerHTML = ''
    for(let el of data){
        let itemLeft = `<div class="item-left"><img src="${el.img}"></div>`
        let addOrRemove = category==='cart' ? `<button class="remove-from-cart" id="${el.id}">Remove from cart</button>`:`<button class="add-to-cart" id="${el.id}">Add To Cart</button>`
        let itemRight = `<div class="item-right"><p><strong>${el.title}</strong> $${el.price}</p><p>${el.desc}</p>${addOrRemove}</div>`
        let fullElement = `<div class="item">${itemLeft}${itemRight}</div>`
        let condition = (el.title+ el.desc).toLowerCase().includes(seachValue.toLowerCase())
        if(category==='all'){
            menuDiv.innerHTML += seachValue==='' ? fullElement : condition ? fullElement : "";
        }else if(el.category===category){
            menuDiv.innerHTML += seachValue==='' ? fullElement : condition ? fullElement : "";
        }else if(category==='cart'){
            menuDiv.innerHTML += seachValue==='' ? fullElement : condition ? fullElement : "";
        }
    }
    if(menuDiv.innerHTML === ''){
        menuDiv.innerHTML = `<div class="nothing-to-display">No Items To Display</div>`
    }
    activateRemoveFromCartBtns()
    activateAddToCartBtns()
    selectedCategory = category;
}
function activateAddToCartBtns(){
    document.querySelectorAll('.add-to-cart').forEach(addToCartBtn =>{
        addToCartBtn.addEventListener('click', ()=>{
            cartItems.push(data[parseInt(addToCartBtn.id)-1])
            cartAmount.innerText = cartItems.length
        })
    })
}
function activateRemoveFromCartBtns(){
    document.querySelectorAll('.remove-from-cart').forEach(removeFromCart =>{
        removeFromCart.addEventListener('click', ()=>{
            for(let i = 0; i<cartItems.length; i++){
                if(cartItems[i].id==removeFromCart.id){
                    cartItems = cartItems.slice(0, i).concat(cartItems.slice(i+1))
                    cartAmount.innerText = cartItems.length
                    getCategoryItems('cart', cartItems)
                    i=cartItems.length
                }
            }
        })
    })
}