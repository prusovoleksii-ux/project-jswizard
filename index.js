import{a as g}from"./assets/vendor-B2N6ulqC.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&c(s)}).observe(document,{childList:!0,subtree:!0});function i(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function c(e){if(e.ep)return;e.ep=!0;const o=i(e);fetch(e.href,o)}})();const y="https://furniture-store-v2.b.goit.study/api",L={FURNITURES:"/furnitures"},f=8,n={furnitureList:document.querySelector(".furniture-list"),loadMoreBtn:document.querySelector(".furniture-show-more")};async function d(){const t=y+L.FURNITURES,r={page:a,limit:f};return(await g.get(t,{params:r})).data}function M(t){const r=String(t).trim().toLowerCase();return r==="#fff"||r==="#ffffff"||r==="white"?"furniture-color-item furniture-color-item--light":"furniture-color-item"}function w(t){var s;const r=((s=t.images)==null?void 0:s[0])??"",i=t.name||"Без назви",c=Number(t.price||0).toLocaleString("uk-UA"),o=(t.color||[]).slice(0,3).map(l=>`
			<li class="${M(l)}" style="background-color: ${l}"></li>
		`).join("");return`
		<li class="furniture-item">
			<img
				class="furniture-item-img"
				src="${r}"
				alt="${i}"
				width="335"
				loading="lazy"
			/>
			<div class="furniture-desc-wrap">
				<h3 class="furniture-item-name">${i}</h3>
				${o?`<ul class="furniture-colors">${o}</ul>`:""}
				<p class="furniture-item-price">${c} грн</p>
			</div>
			<button type="button" class="furniture-item-btn">Детальніше</button>
		</li>
	`}async function m(t){if(!n.furnitureList)return;if(t.length===0){n.furnitureList.innerHTML="";return}const r=t.map(w).join("");n.furnitureList.insertAdjacentHTML("beforeend",r)}function b(){n.loadMoreBtn&&n.loadMoreBtn.classList.remove("is-hidden")}function u(){n.loadMoreBtn&&n.loadMoreBtn.classList.add("is-hidden")}function p(t){a>=h?u():b()}function B(){const r=n.furnitureList.lastElementChild.getBoundingClientRect().height;window.scrollBy({top:r,behavior:"smooth"})}let h,a=1;document.addEventListener("DOMContentLoaded",async()=>{u();try{const t=await d();h=Math.ceil(t.totalItems/f),m(t.furnitures),p()}catch(t){console.error("Помилка при завантаженні меблів:",t)}});n.loadMoreBtn.addEventListener("click",async()=>{a+=1,u();try{const t=await d();m(t.furnitures),B(),p()}catch(t){console.error("Помилка при завантаженні меблів:",t)}});
//# sourceMappingURL=index.js.map
