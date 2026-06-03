alert("BEM-VINDO");

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

carregarMilitaresFirebase();

} else {

alert("Usuário ou senha incorretos");

}
}

async function cadastrarMilitar() {

let nome =
document.getElementById("militarNome").value;

if (!nome) {
alert("Digite um nome");
return;
}

alert("Passou da validação");

try {

alert("Tentando salvar...");

await addDoc(
collection(db, "militares"),
{
nome: nome
}
);

alert("Militar salvo no Firebase!");

} catch (erro) {

alert(JSON.stringify(erro));

alert(erro);

alert(erro.message);

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

function excluirMilitar(nome) {

if (!confirm("Deseja excluir o militar " + nome + "?")) {
return;
}

militares = militares.filter(
m => m !== nome
);

salvar();

alert("Militar excluído com sucesso!");

}

function excluirMaterial(nome) {

if (!confirm("Deseja excluir o material?")) {
return;
}

materiais = materiais.filter(
m => m.nome !== nome
);

salvar();

alert("Material excluído!");

}

function filtrarMilitares() {

let filtro =
document.getElementById(
"pesquisaMilitar"
).value.toLowerCase();

document.querySelectorAll(
"#listaMilitares li"
).forEach(li => {

li.style.display =
li.textContent
.toLowerCase()
.includes(filtro)
? ""
: "none";

});

}

function filtrarMateriais() {

let filtro =
document.getElementById(
"pesquisaMaterial"
).value.toLowerCase();

document.querySelectorAll(
"#listaMateriais li"
).forEach(li => {

li.style.display =
li.textContent
.toLowerCase()
.includes(filtro)
? ""
: "none";

});

}

function filtrarCautelas() {

let filtro =
document.getElementById(
"pesquisaCautela"
).value.toLowerCase();

document.querySelectorAll(
"#listaCautelas li"
).forEach(li => {

li.style.display =
li.textContent
.toLowerCase()
.includes(filtro)
? ""
: "none";

});

}

function renderizar() {

let lm =
document.getElementById("listaMilitares");

if (lm) {

lm.innerHTML = "";

militares.forEach(m => {

lm.innerHTML += `
<li>

<button
onclick="
document.getElementById('militarSelect').value='${m}'
">
${m}
</button>

<button
onclick="excluirMilitar('${m}')"
style="
background:red;
margin-left:10px;
"
>
🗑️
</button>

</li>
`;

});

}
let lmat =
document.getElementById("listaMateriais");

if (lmat) {

lmat.innerHTML = "";

materiais.forEach(m => {

lmat.innerHTML += `
<li
style="
list-style:none;
margin-bottom:10px;
padding:10px;
background:white;
border-radius:8px;
border:1px solid #ccc;
">

<b>${m.nome}</b><br>

Estoque: ${m.qtd}

<button
style="
background:red;
float:right;
"
onclick="excluirMaterial('${m.nome}')"
>
🗑️
</button>

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

cautelas.forEach((c) => {

lc.innerHTML += `
<li
style="
list-style:none;
margin-bottom:15px;
padding:15px;
background:white;
border-radius:10px;
border:1px solid #ccc;
box-shadow:0 2px 5px rgba(0,0,0,0.1);
">

<b>👤 ${c.militar}</b><br><br>

📦 Material: ${c.material}<br>

🔢 Quantidade: ${c.qtd}<br>

📅 Retirada: ${c.data}<br>

📌 Status: ${c.status}

${c.dataDevolucao ?
`<br>✅ Devolvido em: ${c.dataDevolucao}`
: ""
}

<br><br>

<button
onclick="gerarPdfCautela(${c.id})">
📄 PDF
</button>

${
c.status !== "DEVOLVIDA"
?
`
<button
onclick="descautelar(${c.id})">
↩️ Descautelar
</button>
`
:
""
}

<button
onclick="gerarQRCode(${c.id})">
📱 QR Code
</button>

</li>
`;

});

}
}

async function carregarMilitaresFirebase() {

try {

const querySnapshot =
await getDocs(
collection(db, "militares")
);

militares = [];

querySnapshot.forEach((doc) => {

const dados = doc.data();

if (dados.nome) {

militares.push(dados.nome);

}

});

renderizar();

} catch (erro) {

alert(
"Erro ao carregar militares: " +
erro.message
);

}

}

carregarMilitaresFirebase();

function gerarPdfCautela(id) {

let cautela =
cautelas.find(
c => c.id === id
);

if (!cautela) {

alert("Cautela não encontrada");

return;

}

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
`Status: ${cautela.status}`,
20,
130
);

doc.text(
"Assinatura do Militar:",
20,
170
);

doc.line(
20,
180,
120,
180
);

doc.save(
`Cautela-${cautela.militar}.pdf`
);

}

  function gerarQRCode(id) {

let cautela =
cautelas.find(
c => c.id === id
);

if (!cautela) return;

let texto =

"Militar: " +
cautela.militar +

"\nMaterial: " +
cautela.material +

"\nQuantidade: " +
cautela.qtd +

"\nData: " +
cautela.data;

let janela =
window.open(
"",
"QRCode",
"width=400,height=500"
);

janela.document.write(
'<div id="qrcode"></div>'
);

new QRCode(
janela.document.getElementById(
"qrcode"
),
texto
);

}
  
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
