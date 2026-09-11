const error_message = document.getElementById("error-message");
const error_box = document.getElementById("error-box");
const sign_up_username = document.getElementById("sign-up-username")
const sign_up_email = document.getElementById("sign-up-email")
const sign_up_password = document.getElementById("sign-up-password")
const sign_up_confirm_password = document.getElementById("sign-up-confirm-password")
const sign_up_button = document.getElementById("sign-up-button")

async function signup() {
  sign_up_username.ariaInvalid = null
  sign_up_email.ariaInvalid = null
  sign_up_password.ariaInvalid = null
  sign_up_confirm_password.ariaInvalid = null
  error_box.style.display = "none"

  const username = sign_up_username.value;
  const email = sign_up_email.value;
  const password = sign_up_password.value;
  const confirm_password = sign_up_confirm_password.value;

  if (username == "") {
    sign_up_username.ariaInvalid = "true";
    error_message.textContent = "Please enter a valid username.";
    error_box.style.display = "block";
    return;
  }

  if (username.length < 3) {
    sign_up_username.ariaInvalid = "true";
    error_message.textContent = "Username must have at least 3 characters.";
    error_box.style.display = "block";
    return;
  }

  if (email == "" || !(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))) {
    sign_up_email.ariaInvalid = "true";
    error_message.textContent = "Please enter a valid email.";
    error_box.style.display = "block";
    return;
  }

  if (password == "") {
    sign_up_password.ariaInvalid = "true";
    error_message.textContent = "Please enter a valid password.";
    error_box.style.display = "block";
    return;
  }

  if (!(/\p{Lu}/u.test(password) && /\p{Nd}/u.test(password))) {
    sign_up_password.ariaInvalid = "true";
    error_message.textContent = "Password must contain a capital letter and a number.";
    error_box.style.display = "block";
    return;
  }

  if (confirm_password == "") {
    sign_up_confirm_password.ariaInvalid = "true";
    error_message.textContent = "Please confirm your password.";
    error_box.style.display = "block";
    return;
  }

  if (password != confirm_password) {
    sign_up_password.ariaInvalid = "true";
    sign_up_confirm_password.ariaInvalid = "true";
    error_message.textContent = "Passwords do not match.";
    error_box.style.display = "block";
    return;
  }

  const options = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
      confirm_password: confirm_password
    })
  }

  try{
    const result = await fetch(`${API_BASE_URL}/register`, options)
    const body = await result.json()

    if (!result.ok) {
      error_message.textContent = body.detail ?? "Something went wrong. Please check your input.";
      error_box.style.display = "block";
      return;
    }

    const token = body.access_token;
    localStorage.setItem("access_token", token)
    window.location.href = "main.html";
  } catch{
    error_box.style.display = "block"
    error_message.textContent = "Couldn't reach the server. Check your connection and try again."
    return;
  }
}



sign_up_button.addEventListener("click", async () => {
  signup()
})