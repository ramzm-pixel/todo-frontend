const error_message = document.getElementById("error-message");
const error_box = document.getElementById("error-box");
const login_email_username = document.getElementById("login-email-username");
const login_password = document.getElementById("login-password");
const login_button = document.getElementById("login-button");

async function login() {
  login_email_username.ariaInvalid = null
  login_password.ariaInvalid = null
  error_box.style.display = "none"

  const email_username = login_email_username.value
  const password = login_password.value
  
  if (email_username == "") {
    login_email_username.ariaInvalid = "true"
    error_box.style.display = "block"
    error_message.textContent = "Please enter your email or username"
    return;
  }
  if (password == "") {
    login_password.ariaInvalid = "true"
    error_box.style.display = "block"
    error_message.textContent = "Please enter your password"
    return;
  } 

  const options = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username_or_email: email_username,
      password: password
    })
  }
  try {
    
    const result = await fetch(`${API_BASE_URL}/login`, options)
    const body = await result.json()

    if (result.status === 401){
      error_box.style.display = "block"
      error_message.textContent = body.detail
      return;
    }

    const token = body.access_token
    localStorage.setItem("access_token", token)
    window.location.href = "main.html"
    
  } catch{
    error_box.style.display = "block"
    error_message.textContent = "Couldn't reach the server. Check your connection and try again."
    return;
  }

}

login_button.addEventListener("click", async () =>{
  login()
})