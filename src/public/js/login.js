document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("login-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;

      const res = await fetch("/auth/login", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });


      if (res.status === 401) {
        addErrorMessage("Invalid credentials");
        return;
      }

      if (!res.ok) {
        addErrorMessage("An error occurred");
        return;
      }


      res.json().then((data)=>{
        if(!data.accessToken){
          return;
        }

        
        localStorage.setItem("token", data.token);
        window.location.href = `/users/profile/${data.user.user_id}`;
      });
    });
});


function addErrorMessage(message){
  const alert = document.getElementById("alert");
  alert.innerText = message;
  alert.classList.remove("hidden");
}