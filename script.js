let militares =
JSON.parse(localStorage.getItem("militares")) || [];

let materiais =
JSON.parse(localStorage.getItem("materiais")) || [];

let cautelas =
JSON.parse(localStorage.getItem("cautelas")) || [];

function salvar() {

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

function entrar() {

let u =
document.getElementById("usuario").value;

let s =
document.getElementById("senha").value;

if (u === "farmacia" && s === "2356") {

document.getElementById("login").style.display =
"none";

document.getElementById("sistema").style.display =
"block";

renderizar();

} else {

alert("Usuário ou senha incorretos");

}
}

function cadastrarMilitar() {

let nome =
document.getElementById("militarNome").value;

if (!nome) return;

militares.push(nome);

document.getElementById("militarNome").value = "";

salvar();
}

function cadastrarMaterial() {

let nome =
document.getElementById("materialNome").value;

let qtd =
Number(
document.getElementById("materialQtd").value
);

if (!nome || qtd <= 0) return;

materiais.push({
nome,
qtd
});

document.getElementById("materialNome").value = "";
document.getElementById("materialQtd").value = "";

salvar();
}

function gerarCautela() {

let militar =
document.getElementById("militarSelect").value;

let material =
document.getElementById("materialSelect").value;

let qtd =
Number(
document.getElementById("qtdCautela").value
);

let materialObj =
materiais.find(
m => m.nome === material
);

if (!materialObj) {
alert("Material não encontrado");
return;
}

if (qtd <= 0) {
alert("Quantidade inválida");
return;
}

if (materialObj.qtd < qtd) {
alert("Estoque insuficiente");
return;
}

materialObj.qtd -= qtd;

cautelas.push({
id: Date.now(),
militar,
material,
qtd,
data: new Date().toLocaleDateString()
});

document.getElementById("qtdCautela").value = "";

salvar();
}

function descautelar(id) {

let cautela =
cautelas.find(
c => c.id === id
);

if (!cautela) return;

let material =
materiais.find(
m => m.nome === cautela.material
);

if (material) {

material.qtd += cautela.qtd;

}

cautelas =
cautelas.filter(
c => c.id !== id
);

salvar();

alert("Material devolvido com sucesso!");
}

function renderizar() {

let lm =
document.getElementById("listaMilitares");

if (lm) {

lm.innerHTML = "";

militares.forEach(m => {

lm.innerHTML += `
<li>${m}</li>
`;

});
}

let lmat =
document.getElementById("listaMateriais");

if (lmat) {

lmat.innerHTML = "";

materiais.forEach(m => {

lmat.innerHTML += `
<li>
${m.nome} - Estoque: ${m.qtd}
</li>
`;

});
}

let sm =
document.getElementById("militarSelect");

if (sm) {

sm.innerHTML = "";

militares.forEach(m => {

sm.innerHTML += `
<option>${m}</option>
`;

});
}

let sMat =
document.getElementById("materialSelect");

if (sMat) {

sMat.innerHTML = "";

materiais.forEach(m => {

sMat.innerHTML += `
<option>${m.nome}</option>
`;

});
}

let lc =
document.getElementById("listaCautelas");

if (lc) {

lc.innerHTML = "";

cautelas.forEach(c => {

lc.innerHTML += `
<li>
${c.militar}
-
${c.material}
-
${c.qtd}
-
${c.data}

<button onclick="descautelar(${c.id})">
Descautelar
</button>

</li>
`;

});
}
}

renderizar();
