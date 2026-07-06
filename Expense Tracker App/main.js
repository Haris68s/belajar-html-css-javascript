let transaksi = [];
let editId = null;
const RENDER_EVENT = "transaction:updated";
const STORAGE_KEY = "penyimpana_transaksi";
const generateId = () => +new Date();

console.log(generateId());

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("transactionForm");
  const inputForm = document.getElementById("searchTransactionForm");
  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const keterangan = document.getElementById("transactionFormTitleInput").value;
    const nominal = document.getElementById("transactionFormAmountInput").value;
    const tanggal = document.getElementById("transactionFormDateInput").value;
    const type = document.getElementById("transactionFormTypeSelect").value;
    const amount = parseInt(nominal);

    if (keterangan === "") {
      alert("keterangan kosong");
      return;
    }
    if (nominal < 1) {
      alert("nominal tidak valid");
      return;
    }

    if (editId === null) {
      const id = generateId();
      const transactionData = generatedObject(id, keterangan, amount, tanggal, type);

      transaksi.push(transactionData);
      console.log(transaksi);
      const save = JSON.stringify(transaksi);
      localStorage.setItem(STORAGE_KEY, save);
      document.dispatchEvent(new Event(RENDER_EVENT));
    } else {
      const target = findData(editId);
      target.title = keterangan;
      target.amount = amount;
      target.date = tanggal;
      target.type = type;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(transaksi));
      editId = null;
      document.dispatchEvent(new Event(RENDER_EVENT));
    }

    submitForm.reset();
    updateDashboard();
  });
  inputForm.addEventListener("input", (event) => {
    const keyword = event.target.value;
    const keywordToLowerCase = keyword.toLowerCase();
    if (keywordToLowerCase === "") {
      document.dispatchEvent(new Event(RENDER_EVENT));
    } else {
      const filterInput = transaksi.filter((item) => {
        return item.title.toLowerCase().includes(keywordToLowerCase);
      });
      renderTransaksi(filterInput);
    }
  });
  loadTransaksi();
  document.dispatchEvent(new Event(RENDER_EVENT));
});

function generatedObject(id, title, amount, date, type) {
  return {
    id,
    title,
    amount,
    date,
    type,
  };
}

function loadTransaksi() {
  const getData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(getData);

  if (data !== null) {
    for (const object of data) {
      transaksi.push(object);
    }
  }
}

function buatArus(listTransaksi) {
  const textInfo = document.createElement("h3");
  textInfo.setAttribute("data-testid", "transactionItemTitle");
  textInfo.innerText = listTransaksi.title;
  const nominalOutput = document.createElement("p");
  nominalOutput.setAttribute("data-testid", "transactionItemAmount");
  nominalOutput.innerText = ` Nominal: Rp${listTransaksi.amount}`;
  const dateOutput = document.createElement("p");
  dateOutput.setAttribute("data-testid", "transactionItemDate");
  dateOutput.innerText = `waktu: ${listTransaksi.date}`;
  const typeOutput = document.createElement("p");
  typeOutput.setAttribute("data-testid", "transactionItemType");
  typeOutput.innerText = `tipe: ${listTransaksi.type}`;

  const buttonContainer = document.createElement("div");
  const buttonChange = document.createElement("button");
  const buttonEdit = document.createElement("button");
  buttonChange.innerText = "Ubah tipe";
  buttonChange.addEventListener("click", function () {
    changeType(listTransaksi.id);
  });
  buttonChange.setAttribute("data-testid", "transactionItemEditTypeButton");
  const buttonDelete = document.createElement("button");
  buttonDelete.innerText = "Hapus";
  buttonDelete.setAttribute("data-testid", "transactionItemDeleteButton");
  buttonDelete.addEventListener("click", function () {
    removeTransaksi(listTransaksi.id);
  });
  buttonEdit.innerText = "edit";
  buttonEdit.addEventListener("click", () => {
    editData(listTransaksi.id);
  });
  buttonChange.classList.add("button-function");
  buttonEdit.classList.add("button-function");
  buttonDelete.classList.add("button-function");
  buttonContainer.append(buttonChange, buttonDelete, buttonEdit);

  const container = document.createElement("div");
  container.setAttribute("data-testid", "transactionItem");

  container.append(textInfo, nominalOutput, dateOutput, typeOutput, buttonContainer);

  console.log(container);
  return container;
}

function renderTransaksi(dataTransaksi) {
  console.log(dataTransaksi);
  const containerIncome = document.getElementById("incomeList");
  const containerExpense = document.getElementById("expenseList");

  containerIncome.innerHTML = "";
  containerExpense.innerHTML = "";

  for (const data of dataTransaksi) {
    const elementData = buatArus(data);
    if (data.type === "income") {
      containerIncome.append(elementData);
    } else {
      containerExpense.append(elementData);
    }
  }
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(transaksi);
  renderTransaksi(transaksi);
  updateDashboard();
});

function changeType(typeid) {
  const target = findData(typeid);

  if (target.type === "income") {
    target.type = "expense";
  } else if (target.type === "expense") {
    target.type = "income";
  }
  const save = JSON.stringify(transaksi);
  localStorage.setItem(STORAGE_KEY, save);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeTransaksi(transaksiId) {
  const target = findDataIndex(transaksiId);
  console.log(target);

  if (target === -1) return;
  transaksi.splice(target, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  const save = JSON.stringify(transaksi);
  localStorage.setItem(STORAGE_KEY, save);
}

function findData(dataId) {
  for (const data of transaksi) {
    if (data.id === dataId) {
      return data;
    }
  }
  return null;
}

function findDataIndex(dataId) {
  const index = transaksi.findIndex((item) => item.id === dataId);
  return index;
}

function updateDashboard() {
  let totalIncome = 0;
  let totalExpense = 0;

  const total = transaksi.reduce((acc, item) => {
    if (item.type === "income") {
      totalIncome += item.amount;
      return (acc += item.amount);
    } else {
      totalExpense += item.amount;
      return (acc -= item.amount);
    }
  }, 0);

  console.log(totalExpense);
  console.log(totalIncome);

  const saldoField = document.getElementById("saldo");
  const incomeField = document.getElementById("income");
  const expenseField = document.getElementById("expense");
  incomeField.innerText = `Rp${totalIncome}`;
  expenseField.innerText = `Rp${totalExpense}`;
  saldoField.innerText = `Rp${total}`;
}

function editData(idTransaksi) {
  const target = findData(idTransaksi);
  console.log(target);

  let keterangan = document.getElementById("transactionFormTitleInput");
  let nominal = document.getElementById("transactionFormAmountInput");
  let tanggal = document.getElementById("transactionFormDateInput");
  let type = document.getElementById("transactionFormTypeSelect");

  keterangan.value = target.title;
  nominal.value = target.amount;
  tanggal.value = target.date;
  type.value = target.type;

  editId = idTransaksi;
}
