const url = "https://growdev-mod-3-back.herokuapp.com";
const urlDev = "http://localhost:8080";

// função para pegar os valores dos parametros de nome e id.
function getParameterByName(name, urlDev = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// pega o parametro nome do usuário logado.
const user = getParameterByName("nome");

// pega o parametro id do usuário logado.
const userId = getParameterByName("uid");

//busca as informações do usuário Logado no localStorage.
const idUserLogado = JSON.parse(localStorage.getItem("user_id"));

// evita que um usuário que não esteja logado acesse a pagina de outro usuário
async function verificarLogado() {
  if (idUserLogado === null) {
    alert("Voçê não está logado!");
    window.location.href = "./index.html";
  } else {
    await axios.get(`${urlDev}/user/` + idUserLogado).then(() => {
      mostrarTabela();
    });
  }
}
verificarLogado();

// função que carrega as informações na tabela.
async function mostrarTabela() {
  await axios.get(`${urlDev}/user/` + idUserLogado).then((response) => {
    let msgs = response.data.mensagens;
    // console.log(response.data);
    const table = document.querySelector("#tbody");

    table.innerHTML = "";

    // msgs.forEach((msg) => {
    //   console.log(msg);
    //   let id = msg.uid;
    //   let tagTr = tbody.insertRow();

    //   let td_descricao = tagTr.insertCell();
    //   let td_detalhamento = tagTr.insertCell();
    //   let td_acoes = tagTr.insertCell();

    //   td_descricao.innerHTML = msg.descricao;
    //   td_detalhamento.innerHTML = msg.detalhamento;

    //   let imgEditar = document.createElement("img");
    //   imgEditar.src = "./img/edit.svg";
    //   imgEditar.setAttribute("onclick", "editarLinha(" + id + ")");

    //   let imgExcluir = document.createElement("img");
    //   imgExcluir.src = "./img/delet.svg";
    //   imgExcluir.setAttribute("onclick", "apagarLinha(" + id + ")");

    //   td_acoes.appendChild(imgEditar);
    //   td_acoes.appendChild(imgExcluir);
    // });

    for (let i = 0; i < msgs.length; i++) {
      let id = msgs[i].uid;
      // console.log(id);
      let tagTr = tbody.insertRow();

      let td_descricao = tagTr.insertCell();
      let td_detalhamento = tagTr.insertCell();
      let td_acoes = tagTr.insertCell();

      td_descricao.innerHTML = msgs[i].descricao;
      td_detalhamento.innerHTML = msgs[i].detalhamento;

      let imgEditar = document.createElement("img");
      imgEditar.src = "./img/edit.svg";
      imgEditar.setAttribute("onclick", `editarLinha('${id}')`);

      let imgExcluir = document.createElement("img");
      imgExcluir.src = "./img/delet.svg";
      imgExcluir.setAttribute("onclick", `apagarLinha('${id}')`);

      td_acoes.appendChild(imgEditar);
      td_acoes.appendChild(imgExcluir);
    }
  });
}

function apagarLinha(posicao) {
  let id = posicao;

  if (confirm("Deseja realmente deletar esta mensagem?")) {
    axios
      .delete(`${urlDev}/user/${idUserLogado}/msg/${id}`)
      .then((response) => {
        console.log(response);

        mostrarTabela();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

async function editarLinha(posicao) {
  let id = posicao;

  await axios.get(`${urlDev}/user/${idUserLogado}/msg/${id}`).then((res) => {
    console.log(res.data);
    let msg = res.data;
    let novaDesc = msg.descricao;
    let novoDet = msg.detalhamento;
    document.querySelector("#descricaoRecados").value = novaDesc;
    document.querySelector("#detalhamentoRecados").value = novoDet;
  });

  const botaoAtualizar = document.querySelector("#botaoAtualizarRecados");
  const botaoSalvar = document.querySelector("#botaoSalvarRecados");

  botaoAtualizar.style.display = "block";
  botaoSalvar.style.display = "disable";
  botaoSalvar.style.display = "none";

  botaoAtualizar.addEventListener("click", () => {
    const desNova = document.querySelector("#descricaoRecados").value;
    const detNovo = document.querySelector("#detalhamentoRecados").value;

    await axios
      .put(`${urlDev}/user/${idUserLogado}/msg/${posicao}`, {
        descricao: desNova,
        detalhamento: detNovo,
      })
      .then(() => {
        mostrarTabela();
        resetarInputs();

        botaoAtualizar.style.display = "none";
        botaoSalvar.style.display = "block";
      });
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
      .post(`${urlDev}/user/${idUserLogado}/msg`, {
        descricao: descricaoNova,
        detalhamento: detalhamentoNovo,
      })
      .then(() => {
        mostrarTabela();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

const botaoSalvar = document.querySelector("#botaoSalvarRecados");
botaoSalvar.addEventListener("click", () => {
  const descricaoNova = document.querySelector("#descricaoRecados").value;
  const detalhamentoNovo = document.querySelector("#detalhamentoRecados").value;

  addMensagem(descricaoNova, detalhamentoNovo);
  resetarInputs();
});

function resetarInputs() {
  document.querySelector("#descricaoRecados").value = "";
  document.querySelector("#detalhamentoRecados").value = "";
}

function logout() {
  localStorage.removeItem("user_id");
  location.href = "index.html";
}
