const USUARIO_VALIDO = "tomiybran";
const CONTRASEÑA_VALIDA = "1234";

if (localStorage.getItem("logueado") === "true") {
  window.location.href = "home.html";
}

document.getElementById("login-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const usuario = document.getElementById("username").value.trim();
  const contraseña = document.getElementById("password").value;
  if (usuario === USUARIO_VALIDO && contraseña === CONTRASEÑA_VALIDA) {
    localStorage.setItem("logueado", "true");
    window.location.href = "home.html";
  } else {
    document.getElementById("error").textContent = "Usuario o contraseña incorrectos";
  }
});
