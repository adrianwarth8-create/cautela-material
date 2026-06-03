alert("script carregou");

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

async function cadastrarMilitar() {

alert("Botão clicado");

let nome =
document.getElementById("militarNome").value;

if (!nome) {
alert("Digite um nome");
return;
}

try {

await addDoc(
collection(db, "militares"),
{
nome: nome
}
);

alert("Militar salvo no Firebase!");

} catch (erro) {

alert(
"ERRO:\n" +
erro.name +
"\n\n" +
erro.message
);

}

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
data: new Date().toLocaleDateString(),
status: "ATIVA",
dataDevolucao: ""
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

cautela.status = "DEVOLVIDA";

cautela.dataDevolucao =
new Date().toLocaleDateString();

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

cautelas.forEach((c, index) => {

if (!c.id) {
c.id = Date.now() + index;
}

if (!c.status) {
c.status = "ATIVA";
}

let li = document.createElement("li");

li.innerHTML = `
<b>${c.militar}</b><br>
Material: ${c.material}<br>
Qtd: ${c.qtd}<br>
Retirada: ${c.data}<br>
Status: ${c.status}
`;

if (c.status === "DEVOLVIDA") {

li.innerHTML += `<br>
Devolvido em: ${c.dataDevolucao}`;

} else {

let btn =
document.createElement("button");

btn.textContent =
"Descautelar";

btn.onclick = function () {
descautelar(c.id);
};

li.appendChild(btn);
}

lc.appendChild(li);

});

}

}

renderizar();

async function gerarPdfUltimaCautela() {

if (cautelas.length === 0) {
alert("Nenhuma cautela cadastrada.");
return;
}

const cautela =
cautelas[cautelas.length - 1];

const { jsPDF } =
window.jspdf;

const doc =
new jsPDF();

doc.setFontSize(16);
doc.text(
"TERMO DE CAUTELA",
70,
20
);

doc.setFontSize(12);

doc.text(
`Militar: ${cautela.militar}`,
20,
50
);

doc.text(
`Material: ${cautela.material}`,
20,
70
);

doc.text(
`Quantidade: ${cautela.qtd}`,
20,
90
);

doc.text(
`Data: ${cautela.data}`,
20,
110
);

doc.text(
"Assinatura do Militar:",
20,
160
);

doc.line(
20,
170,
120,
170
);

doc.save(
`Cautela-${cautela.militar}.pdf`
);
}
