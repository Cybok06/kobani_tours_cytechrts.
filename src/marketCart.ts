import type { MarketProduct } from "./api"
export type CartItem={product:MarketProduct;quantity:number;variant?:string}
const KEY="kobani:market-cart:v1"
export const readCart=():CartItem[]=>{try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return []}}
export const writeCart=(items:CartItem[])=>{localStorage.setItem(KEY,JSON.stringify(items));window.dispatchEvent(new Event("kobani-cart"));return items}
export const addToCart=(product:MarketProduct,quantity=1,variant="")=>{const items=readCart();const found=items.find(x=>x.product.id===product.id&&x.variant===variant);if(found)found.quantity=Math.min(product.stock,found.quantity+quantity);else items.push({product,quantity:Math.min(product.stock,quantity),variant});return writeCart(items)}
export const setSelectedProduct=(slug:string)=>localStorage.setItem("kobani:selected-product",slug)
export const selectedProduct=()=>localStorage.getItem("kobani:selected-product")||""
