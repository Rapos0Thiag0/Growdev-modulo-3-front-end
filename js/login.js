const url = "https://growdev-mod-3-back.herokuapp.com";
const urlDev = "http://localhost:5000";

function login() {
  const usuario = document.querySelector("#usuarioNoLogin");
  const senha = document.querySelector("#senhaNoLogin");
  const user = JSON.parse(localStorage.getItem(usuario.value));
  axios
    .get(`${url}/api/${user.id}`, user)
    .then((response) => {})
    .catch((err) => {
      console.log(err.response);
      if (err.response.data.error === "empty_fields") {
        modal1.style.display = "block";
      } else if (err.response.data.error === "user_exist") {
        modal2.style.display = "block";
      }
    });
  const modal1 = document.querySelector("#modal1");
  const modal2 = document.querySelector("#modal2");
  const botaoFecharModal1 = document.querySelector("#modal_1");
  const botaoFecharModal2 = document.querySelector("#modal_2");

  function resetarInputs() {
    document.querySelector("#usuarioNoLogin").value = "";
    document.querySelector("#senhaNoLogin").value = "";
  }

  if (user) {
    if (user.senha === senha.value) {
      logado(user);
      window.location.href =
        "recados.html?user=" + user.nome + "&id=" + user.id;
    } else {
      modal1.style.display = "block";
      resetarInputs();
    }
  } else {
    modal2.style.display = "block";
    resetarInputs();
  }

  botaoFecharModal1.addEventListener("click", () => {
    modal1.style.display = "none";
  });
  botaoFecharModal2.addEventListener("click", () => {
    modal2.style.display = "none";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const botaoEntrar = document.querySelector("#botaoEntrarLogin");

  window.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
      login();
    }
  });

  botaoEntrar.addEventListener("click", () => {
    login();
  });
});

function logado(user) {
  const usuarioLogado = user;
  localStorage.setItem("Logado - " + user.nome, JSON.stringify(usuarioLogado));
}
