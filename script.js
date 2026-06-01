let militares =
JSON.parse(localStorage.getItem("militares")) || [];

let materiais =
JSON.parse(localStorage.getItem("materiais")) || [];

let cautelas =
JSON.parse(localStorage.getItem("cautelas")) || [];

function salvar(){
localStorage.setItem(
"militares",
JSON.stringify(militares)
);

localStorage.setItem(
"materiais",
JSON.stringify(materiais)
);

localStorage.setItem(
"cautelas",
JSON.stringify(cautelas)
);

renderizar();
}

function entrar(){

let u=document.getElementById("usuario").value;
let s=document.getElementById("senha").value;

if(u==="admin" && s==="123"){
document.getElementById("login").style.display="none";
document.getElementById("sistema").style.display="block";
}
}

function cadastrarMilitar(){

let nome=
document.getElementById("militarNome").value;

militares.push(nome);

salvar();
}

function cadastrarMaterial(){

let nome=
document.getElementById("materialNome").value;

let qtd=
Number(
document.getElementById("materialQtd").value
);

materiais.push({
nome,
qtd
});

salvar();
}

function gerarCautela(){

let militar=
document.getElementById("militarSelect").value;

let material=
document.getElementById("materialSelect").value;

let qtd=
Number(
document.getElementById("qtdCautela").value
);

cautelas.push({
militar,
material,
qtd,
data:new Date().toLocaleDateString()
});

salvar();
}

function renderizar(){

let lm=
document.getElementById("listaMilitares");

if(lm){

lm.innerHTML="";

militares.forEach(m=>{

lm.innerHTML+=`<li>${m}</li>`;

});
}

let lmat=
document.getElementById("listaMateriais");

if(lmat){

lmat.innerHTML="";

materiais.forEach(m=>{

lmat.innerHTML+=
`<li>${m.nome} - ${m.qtd}</li>`;

});
}

let sm=
document.getElementById("militarSelect");

if(sm){

sm.innerHTML="";

militares.forEach(m=>{

sm.innerHTML+=
`<option>${m}</option>`;

});
}

let sMat=
document.getElementById("materialSelect");

if(sMat){

sMat.innerHTML="";

materiais.forEach(m=>{

sMat.innerHTML+=
`<option>${m.nome}</option>`;

});
}

let lc=
document.getElementById("listaCautelas");

if(lc){

lc.innerHTML="";

cautelas.forEach(c=>{

lc.innerHTML+=`
<li>
${c.militar}
-
${c.material}
-
${c.qtd}
-
${c.data}
</li>
`;

});
}
}

renderizar();
