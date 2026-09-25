const modal=document.getElementById("toolModal");
const content=document.getElementById("toolContent");
const closeModal=()=>{modal.classList.remove("show");modal.setAttribute("aria-hidden","true")};
document.getElementById("closeModal").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.querySelectorAll(".tool-card").forEach(card=>{
  card.querySelector("button").addEventListener("click",()=>openTool(card.dataset.tool));
});
document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("nav").classList.toggle("open"));

function safe(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function num(id,min=0){const v=Number(document.getElementById(id).value);return Number.isFinite(v)&&v>=min?v:null;}
function openTool(type){
 const titles={typing:"Typing Speed Test",profit:"Profit / Loss Calculator",freelance:"Freelance Fee Calculator",percentage:"Percentage & Grade Calculator",invoice:"Invoice Generator"};
 content.innerHTML=`<h2>${titles[type]}</h2><br>${markup(type)}`;
 modal.classList.add("show");modal.setAttribute("aria-hidden","false");bind(type);
}
function markup(t){
 if(t==="typing")return `<p class="muted">Type the practice text for 60 seconds. The test runs entirely in your browser.</p><p><b>Practice text:</b> The quick brown fox jumps over the lazy dog. Learning useful digital skills takes regular practice and patience.</p><textarea id="typingArea" placeholder="Start typing here..." disabled></textarea><button class="calc-btn" id="startTyping">Start Test</button><div class="result" id="typingResult">Time: 60s | WPM: 0 | Accuracy: 0%</div>`;
 if(t==="profit")return `<div class="form-grid"><div class="form-group"><label>Cost Price</label><input id="cost" type="number" min="0" step="0.01"></div><div class="form-group"><label>Selling Price</label><input id="sell" type="number" min="0" step="0.01"></div></div><button class="calc-btn" id="calcProfit">Calculate</button><div class="result" id="profitResult">Enter valid values.</div>`;
 if(t==="freelance")return `<div class="form-grid"><div class="form-group"><label>Client Payment</label><input id="payment" type="number" min="0" step="0.01"></div><div class="form-group"><label>Platform Fee %</label><input id="fee" type="number" min="0" max="100" step="0.01" value="20"></div></div><button class="calc-btn" id="calcFee">Calculate</button><div class="result" id="feeResult">Enter valid values.</div>`;
 if(t==="percentage")return `<div class="form-grid"><div class="form-group"><label>Obtained Marks</label><input id="obtained" type="number" min="0" step="0.01"></div><div class="form-group"><label>Total Marks</label><input id="total" type="number" min="0.01" step="0.01"></div></div><button class="calc-btn" id="calcPct">Calculate</button><div class="result" id="pctResult">Enter valid marks.</div>`;
 return `<p class="muted">Create an invoice locally. User-entered values are safely escaped before being displayed.</p><div class="form-grid"><div class="form-group"><label>Your Name / Business</label><input id="invFrom" maxlength="100"></div><div class="form-group"><label>Customer</label><input id="invTo" maxlength="100"></div><div class="form-group full"><label>Item / Service</label><input id="invItem" maxlength="150" value="Service"></div><div class="form-group"><label>Quantity</label><input id="invQty" type="number" min="1" max="100000" value="1"></div><div class="form-group"><label>Price</label><input id="invPrice" type="number" min="0" max="100000000" step="0.01" value="0"></div></div><button class="calc-btn" id="makeInvoice">Create Invoice</button><div id="invoicePreview"></div>`;
}
function bind(t){
 if(t==="profit")document.getElementById("calcProfit").addEventListener("click",()=>{
  const c=num("cost"),s=num("sell");if(c===null||s===null)return profitResult.textContent="Please enter valid non-negative numbers.";
  const p=s-c;profitResult.innerHTML=p>=0?`Profit: ${p.toFixed(2)}<br>Margin: ${s?((p/s)*100).toFixed(2):"0.00"}%`:`Loss: ${Math.abs(p).toFixed(2)}`;
 });
 if(t==="freelance")document.getElementById("calcFee").addEventListener("click",()=>{
  const p=num("payment"),f=num("fee");if(p===null||f===null||f>100)return feeResult.textContent="Enter payment and a fee between 0% and 100%.";
  const amount=p*f/100;feeResult.innerHTML=`Platform fee: ${amount.toFixed(2)}<br>Final earnings: ${(p-amount).toFixed(2)}`;
 });
 if(t==="percentage")document.getElementById("calcPct").addEventListener("click",()=>{
  const o=num("obtained"),t=num("total",0.01);if(o===null||t===null||o>t)return pctResult.textContent="Obtained marks must be between 0 and total marks.";
  const p=o/t*100,g=p>=80?"A+":p>=70?"A":p>=60?"B":p>=50?"C":p>=40?"D":"F";pctResult.innerHTML=`Percentage: ${p.toFixed(2)}%<br>Grade: ${g}`;
 });
 if(t==="invoice")document.getElementById("makeInvoice").addEventListener("click",()=>{
  const q=num("invQty",1),pr=num("invPrice");if(q===null||pr===null)return invoicePreview.textContent="Please enter valid quantity and price.";
  const name=safe(document.getElementById("invFrom").value||"Your Business"),to=safe(document.getElementById("invTo").value||"Customer"),item=safe(document.getElementById("invItem").value||"Service"),total=q*pr;
  invoicePreview.innerHTML=`<div class="result"><h3>${name}</h3><p>Bill to: ${to}</p><table class="invoice-items"><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr><tr><td>${item}</td><td>${q}</td><td>${pr.toFixed(2)}</td><td>${total.toFixed(2)}</td></tr></table><h3>Total: ${total.toFixed(2)}</h3><button class="calc-btn" id="printInvoice">Print / Save PDF</button></div>`;
  document.getElementById("printInvoice").addEventListener("click",()=>window.print());
 });
 if(t==="typing"){
  let interval=null,remaining=60;
  document.getElementById("startTyping").addEventListener("click",()=>{
   const area=document.getElementById("typingArea"),button=document.getElementById("startTyping");area.disabled=false;area.focus();button.disabled=true;remaining=60;
   interval=setInterval(()=>{remaining--;document.getElementById("typingResult").textContent=`Time: ${remaining}s | WPM: 0 | Accuracy: 0%`;if(remaining<=0){clearInterval(interval);finish()}},1000);
  });
  function finish(){const area=document.getElementById("typingArea"),words=area.value.trim()?area.value.trim().split(/\s+/):[],target="The quick brown fox jumps over the lazy dog. Learning useful digital skills takes regular practice and patience.".split(/\s+/);let correct=0;words.forEach((w,i)=>{if(w===target[i])correct++});const accuracy=words.length?Math.round(correct/words.length*100):0;document.getElementById("typingResult").innerHTML=`Time finished!<br>WPM: ${words.length}<br>Accuracy: ${accuracy}%`;}
 }
}