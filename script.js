const usuarios = [
{
usuario: "gestor",
senha: "1234",
nivel: "GESTOR"
},
{
usuario: "funcional",
senha: "1234",
nivel: "FUNCIONAL"
}
];

let usuarioLogado = null;

/**********************
 * SISTEMA CAUTELA - FIREBASE ONLY
 **********************/

let militares = [];
let materiais = [];
let cautelas = [];

/**********************
 * LOGIN
 **********************/
function entrar() {

let usuario =
document.getElementById("usuario").value;

let senha =
document.getElementById("senha").value;

let encontrado =
usuarios.find(u =>
u.usuario === usuario &&
u.senha === senha
);

if (!encontrado) {

alert("Usuário ou senha incorretos");

return;

}

usuarioLogado = encontrado;

document.getElementById("login").style.display = "none";

document.getElementById("sistema").style.display = "block";

aplicarPermissoes();

renderizar();

}

/**********************
 * CARREGAMENTO GERAL
 **********************/
async function carregarTudo() {
  await Promise.all([
    carregarMilitares(),
    carregarMateriais(),
    carregarCautelas()
  ]);

  renderizar();
}

function aplicarPermissoes() {

if (usuarioLogado.nivel === "GESTOR") {

return;

}

let botoesGestor =
document.querySelectorAll(".somenteGestor");

botoesGestor.forEach(botao => {

botao.style.display = "none";

});

}

/**********************
 * MILITARES
 **********************/
async function cadastrarMilitar() {
  const nome = document.getElementById("militarNome").value;

  if (!nome) return alert("Digite um nome");

  await addDoc(collection(db, "militares"), {
    nome
  });

  document.getElementById("militarNome").value = "";
  await carregarMilitares();
}

async function carregarMilitares() {
  const snap = await getDocs(collection(db, "militares"));

  militares = [];

  snap.forEach(docSnap => {
    militares.push({
      id: docSnap.id,
      nome: docSnap.data().nome
    });
  });
}

async function excluirMilitar(id) {
  if (!confirm("Deseja excluir este militar?")) return;

  await deleteDoc(doc(db, "militares", id));

  await carregarMilitares();
  renderizar();
}

/**********************
 * MATERIAIS
 **********************/
async function cadastrarMaterial() {
  const nome = document.getElementById("materialNome").value;
  const qtd = Number(document.getElementById("materialQtd").value);

  if (!nome || qtd <= 0) return;

  await addDoc(collection(db, "materiais"), {
    nome,
    qtd
  });

  document.getElementById("materialNome").value = "";
  document.getElementById("materialQtd").value = "";

  await carregarMateriais();
}

async function carregarMateriais() {
  const snap = await getDocs(collection(db, "materiais"));

  materiais = [];

  snap.forEach(docSnap => {
    materiais.push({
      id: docSnap.id,
      nome: docSnap.data().nome,
      qtd: docSnap.data().qtd
    });
  });
}

async function excluirMaterial(id) {
  if (!confirm("Deseja excluir o material?")) return;

  await deleteDoc(doc(db, "materiais", id));

  await carregarMateriais();
  renderizar();
}

/**********************
 * CAUTELAS
 **********************/
async function gerarCautela() {
  const militar = document.getElementById("militarSelect").value;
  const materialId = document.getElementById("materialSelect").value;
  const qtd = Number(document.getElementById("qtdCautela").value);

  if (!militar || !materialId || qtd <= 0) {
    return alert("Preencha todos os campos corretamente");
  }

  const material = materiais.find(m => m.id === materialId);

  if (!material) return alert("Material não encontrado");
  if (material.qtd < qtd) return alert("Estoque insuficiente");

  // atualiza estoque
  await updateDoc(doc(db, "materiais", material.id), {
    qtd: material.qtd - qtd
  });

  // cria cautela
  await addDoc(collection(db, "cautelas"), {
    militar,
    material: material.nome,
    qtd,
    data: new Date().toLocaleDateString(),
    status: "ATIVA",
    dataDevolucao: ""
  });

  document.getElementById("qtdCautela").value = "";

  await carregarCautelas();
  await carregarMateriais();

  renderizar();
}

async function carregarCautelas() {
  const snap = await getDocs(collection(db, "cautelas"));

  cautelas = [];

  snap.forEach(docSnap => {
    cautelas.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });
}

async function descautelar(id) {
  const cautela = cautelas.find(c => c.id === id);
  if (!cautela) return;

  const material = materiais.find(m => m.nome === cautela.material);
  if (!material) return;

  // devolve estoque
  await updateDoc(doc(db, "materiais", material.id), {
    qtd: material.qtd + cautela.qtd
  });

  // atualiza cautela
  await updateDoc(doc(db, "cautelas", id), {
    status: "DEVOLVIDA",
    dataDevolucao: new Date().toLocaleDateString()
  });

  await carregarCautelas();
  await carregarMateriais();

  renderizar();
}

/**********************
 * FILTROS
 **********************/
function filtrar(listaId, inputId) {
  const filtro = document.getElementById(inputId).value.toLowerCase();

  document.querySelectorAll(`#${listaId} li`).forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(filtro)
      ? ""
      : "none";
  });
}

/**********************
 * RENDER
 **********************/
function renderizar() {
  renderMilitares();
  renderMateriais();
  renderSelects();
  renderCautelas();
}

function renderMilitares() {
  const el = document.getElementById("listaMilitares");
  if (!el) return;

  el.innerHTML = "";

  militares.forEach(m => {
    el.innerHTML += `
      <li>
        <button onclick="document.getElementById('militarSelect').value='${m.nome}'">
          ${m.nome}
        </button>

        <button onclick="excluirMilitar('${m.id}')" style="background:red;margin-left:10px;">
          🗑️
        </button>
      </li>
    `;
  });
}

function renderMateriais() {
  const el = document.getElementById("listaMateriais");
  if (!el) return;

  el.innerHTML = "";

  materiais.forEach(m => {
    el.innerHTML += `
      <li style="padding:10px;background:#fff;border-radius:8px;margin-bottom:10px;">
        <b>${m.nome}</b><br>
        Estoque: ${m.qtd}

        <button onclick="excluirMaterial('${m.id}')" style="float:right;background:red;">
          🗑️
        </button>
      </li>
    `;
  });
}

function renderSelects() {
  const sm = document.getElementById("militarSelect");
  const smat = document.getElementById("materialSelect");

  if (sm) {
    sm.innerHTML = "";
    militares.forEach(m => {
      sm.innerHTML += `<option>${m.nome}</option>`;
    });
  }

  if (smat) {
    smat.innerHTML = "";
    materiais.forEach(m => {
      smat.innerHTML += `<option value="${m.id}">${m.nome}</option>`;
    });
  }
}

function renderCautelas() {
  const el = document.getElementById("listaCautelas");
  if (!el) return;

  el.innerHTML = "";

  cautelas.forEach(c => {
    el.innerHTML += `
      <li style="padding:15px;background:#fff;margin-bottom:10px;border-radius:10px;">
        <b>👤 ${c.militar}</b><br>
        📦 ${c.material}<br>
        🔢 ${c.qtd}<br>
        📅 ${c.data}<br>
        📌 ${c.status}

        ${c.status !== "DEVOLVIDA" ? `
          <button onclick="descautelar('${c.id}')">↩️ Devolver</button>
        ` : ""}

        <button onclick="gerarPdfCautela('${c.id}')">📄 PDF</button>
        <button onclick="gerarQRCode('${c.id}')">📱 QR</button>
      </li>
    `;
  });
}

/**********************
 * PDF
 **********************/
function gerarPdfCautela(id) {
  const c = cautelas.find(x => x.id === id);
  if (!c) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("TERMO DE CAUTELA", 70, 20);
  doc.text(`Militar: ${c.militar}`, 20, 50);
  doc.text(`Material: ${c.material}`, 20, 70);
  doc.text(`Qtd: ${c.qtd}`, 20, 90);
  doc.text(`Data: ${c.data}`, 20, 110);

  doc.save(`cautela-${c.militar}.pdf`);
}

/**********************
 * QR CODE
 **********************/
function gerarQRCode(id) {
  const c = cautelas.find(x => x.id === id);
  if (!c) return;

  const texto =
    `Militar: ${c.militar}\nMaterial: ${c.material}\nQtd: ${c.qtd}`;

  const w = window.open("", "_blank", "width=400,height=400");

  w.document.write(`<div id="qrcode"></div>`);

  new QRCode(w.document.getElementById("qrcode"), texto);
}
