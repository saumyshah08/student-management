let transactions=[
{id:1,desc:"Monthly Salary",amount:45000,category:"Salary",type:"income",date:"2026-09-01"},
{id:2,desc:"Grocery Shopping",amount:2200,category:"Food",type:"expense",date:"2026-09-03"},
{id:3,desc:"Uber rides",amount:450,category:"Transport",type:"expense",date:"2026-09-05"},
{id:4,desc:"Movie night",amount:800,category:"Entertainment",type:"expense",date:"2026-09-10"},
{id:5,desc:"Electricity Bill",amount:1600,category:"Bills",type:"expense",date:"2026-09-12"}];
let nextId=6,currentType="expense";
const $=id=>document.getElementById(id),fmt=n=>"₹"+Number(n).toLocaleString("en-IN",{maximumFractionDigits:2});
$("themeToggle").addEventListener("click",()=>{const r=document.documentElement;r.setAttribute("data-theme",r.getAttribute("data-theme")==="dark"?"light":"dark")});
$("typeToggle").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{$("typeToggle").querySelectorAll("button").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentType=b.dataset.type}));
$("date").valueAsDate=new Date();
$("txForm").addEventListener("submit",e=>{e.preventDefault();const desc=$("desc").value.trim(),amount=parseFloat($("amount").value),category=$("category").value,date=$("date").value;if(!desc||!amount||amount<=0)return;transactions.unshift({id:nextId++,desc,amount,category,type:currentType,date});e.target.reset();$("date").valueAsDate=new Date();render()});
$("clearAll").addEventListener("click",()=>{if(confirm("Delete all transactions?")){transactions=[];render()}});
$("filterType").addEventListener("change",render);$("filterCategory").addEventListener("change",render);
function deleteTx(id){transactions=transactions.filter(t=>t.id!==id);render()}
function updateCategories(){const f=$("filterCategory"),cats=[...new Set(transactions.map(t=>t.category))],cur=f.value;f.innerHTML='<option value="all">All Categories</option>'+cats.map(c=>'<option>'+c+'</option>').join("");if(cats.includes(cur))f.value=cur}
function render(){const income=transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0),expense=transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);$("statIncome").textContent=fmt(income);$("statExpense").textContent=fmt(expense);$("statBalance").textContent=fmt(income-expense);updateCategories();
const totals={};transactions.filter(t=>t.type==="expense").forEach(t=>totals[t.category]=(totals[t.category]||0)+t.amount);const max=Math.max(1,...Object.values(totals));const entries=Object.entries(totals).sort((a,b)=>b[1]-a[1]);$("catBars").innerHTML=entries.length?entries.map(([c,v])=>'<div class="bar-row"><div class="name">'+c+'</div><div class="bar-track"><div class="bar-fill" style="width:'+(v/max*100).toFixed(1)+'%"></div></div><div class="amt-small">'+fmt(v)+'</div></div>').join(""):'<div class="empty">No expenses yet</div>';
let list=[...transactions],type=$("filterType").value,cat=$("filterCategory").value;if(type!=="all")list=list.filter(t=>t.type===type);if(cat!=="all")list=list.filter(t=>t.category===cat);list.sort((a,b)=>new Date(b.date)-new Date(a.date));$("txBody").innerHTML=list.length?list.map(t=>'<tr><td>'+t.desc+'</td><td><span class="cat-badge">'+t.category+'</span></td><td>'+new Date(t.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})+'</td><td style="text-align:right" class="amt '+t.type+'">'+(t.type==="income"?"+":"-")+fmt(t.amount)+'</td><td style="text-align:right"><button class="del-btn" onclick="deleteTx('+t.id+')">✕</button></td></tr>').join(""):'<tr><td colspan="5" class="empty">No transactions match your filters</td></tr>'}
render();