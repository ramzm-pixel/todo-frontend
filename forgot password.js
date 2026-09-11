const forgot_password_email = document.getElementById("forgot-password-email");
const forgot_password_button = document.getElementById("forgot-password-button");
const message_box = document.getElementById("message-box")
const message_text = document.getElementById("message-text")

function show_error(message){
    message_box.style.display = "block"
    message_box.style.backgroundColor = "#D93526"
    message_text.textContent = message
}

function show_success() {
    message_box.style.display = "block"
    message_box.style.backgroundColor = "#62D926"
    message_text.textContent = "Check your inbox for the password reset link"
}

async function send_email() {
    message_box.style.display = "none"
    forgot_password_email.ariaInvalid = null

    const email = forgot_password_email.value

    if (email == ""){
        show_error("Please enter a valid email");
        forgot_password_email.ariaInvalid = "true"
        return;
    }

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email
        })
    }

    try{
        const result = await fetch(`${API_BASE_URL}/forgot-password`, options)

        if (result.status == 400 || result.status == 422 ) {
            show_error("Please enter a valid email");
            return;
        }

        show_success()
        
    } catch{
        show_error("Couldn't reach the server. Check your connection and try again.");
    }

}

forgot_password_button.addEventListener("click", async () => {
    send_email();
})