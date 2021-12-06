const url = "https://growdev-mod-3-back.herokuapp.com";
const urlDev = "http://localhost:5000";

// garante que a tabela comece com todo o conteúdo visível.
document.addEventListener("DOMContentLoaded", () => {
  mostrarTabela();
});

// função para pegar os valores dos parametros de nome e id.
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// pega o parametro nome do usuário logado.
const user = getParameterByName("user");

// pega o parametro id do usuário logado.
const userId = getParameterByName("id");

//busca as informações do usuário Logado no localStorage.
const logado = JSON.parse(localStorage.getItem("Logado - " + user));
// console.log(logado);

// evita que um usuário que não esteja logado acesse a pagina de outro usuário
function verificarLogado() {
  if (logado == null) {
    alert("Voçê não está logado!");
    window.location.href = "./index.html";
  }
}
verificarLogado();

// função que carrega as informações na tabela.
async function mostrarTabela() {
  await axios.get(`${url}/api/` + userId).then((response) => {
    let msgs = response.data.data;
    const table = document.querySelector("#tbody");

    table.innerHTML = "";

    for (let i = 0; i < msgs.mensagens.length; i++) {
      let tagTr = tbody.insertRow();

      let td_id = tagTr.insertCell();
      let td_descricao = tagTr.insertCell();
      let td_detalhamento = tagTr.insertCell();
      let td_acoes = tagTr.insertCell();

      td_id.innerHTML = i;
      td_descricao.innerHTML = msgs.mensagens[i].desc;
      td_detalhamento.innerHTML = msgs.mensagens[i].det;

      let imgEditar = document.createElement("img");
      imgEditar.src = "./img/edit.svg";
      imgEditar.setAttribute("onclick", "editarLinha(" + i + ")");

      let imgExcluir = document.createElement("img");
      imgExcluir.src = "./img/delet.svg";
      imgExcluir.setAttribute("onclick", "apagarLinha(" + i + ")");

      td_acoes.appendChild(imgEditar);
      td_acoes.appendChild(imgExcluir);
    }
  });
}

function apagarLinha(posicao) {
  const userLogado = JSON.parse(localStorage.getItem("Logado - " + user));
  let id = posicao;

  if (confirm("Deseja realmente deletar esta mensagem?")) {
    axios
      .delete(`${url}/api/${userId}/mensagem/${id}`)
      .then((response) => {
        console.log(response);

        userLogado.mensagens.splice(id, 1);
        localStorage.setItem("Logado - " + user, JSON.stringify(userLogado));
        mostrarTabela();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return mostrarTabela();
}

function editarLinha(posicao) {
  let id = posicao;
  axios.get(`${url}/api/${userId}/mensagem/${id}`).then((response) => {
    let msg = response.data.message;
    let novaDesc = msg.desc;
    let novoDet = msg.det;
    document.querySelector("#descricaoRecados").value = novaDesc;
    document.querySelector("#detalhamentoRecados").value = novoDet;
  });
  const botaoAtualizar = document.querySelector("#botaoAtualizarRecados");
  const botaoSalvar = document.querySelector("#botaoSalvarRecados");

  botaoAtualizar.style.display = "block";
  botaoSalvar.style.display = "none";

  botaoAtualizar.addEventListener("click", () => {
    const desNova = document.querySelector("#descricaoRecados").value;
    const detNovo = document.querySelector("#detalhamentoRecados").value;
    axios
      .put(`${url}/api/${userId}/mensagem/${id}`, {
        desc: desNova,
        det: detNovo,
      })
      .then((response) => {
        mostrarTabela();
        resetarInputs();
      });
    botaoAtualizar.style.display = "none";
  });
}

//---------------------------

function addMensagem(desc, det) {
  const descricaoNova = desc;
  const detalhamentoNovo = det;
  if (
    !!!descricaoNova ||
    descricaoNova == "" ||
    !!!detalhamentoNovo ||
    detalhamentoNovo == ""
  ) {
    alert("Preencha os campos de descrição e detalhamento!");
  } else {
    axios
      .post(`${url}/api/` + userId, {
        desc: descricaoNova,
        det: detalhamentoNovo,
      })
      .then((response) => {
        mostrarTabela();
        const userLogado = JSON.parse(localStorage.getItem("Logado - " + user));
        const userLogado1 = JSON.parse(localStorage.getItem(user));
        userLogado.mensagens.push({
          desc: descricaoNova,
          det: detalhamentoNovo,
        });
        userLogado1.mensagens.push({
          desc: descricaoNova,
          det: detalhamentoNovo,
        });
        localStorage.setItem("Logado - " + user, JSON.stringify(userLogado));
        localStorage.setItem(user, JSON.stringify(userLogado));
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

const botaoSalvar = document.querySelector("#botaoSalvarRecados");
botaoSalvar.addEventListener("click", () => {
  const descricaoNova = document.querySelector("#descricaoRecados");
  const detalhamentoNovo = document.querySelector("#detalhamentoRecados");

  addMensagem(descricaoNova.value, detalhamentoNovo.value);
  mostrarTabela();
  resetarInputs();
});

function resetarInputs() {
  document.querySelector("#descricaoRecados").value = "";
  document.querySelector("#detalhamentoRecados").value = "";
}

function logout() {
  localStorage.removeItem("Logado - " + user);
  location.href = "index.html";
}
