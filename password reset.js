const reset_new_password = document.getElementById("reset-new-password");
const reset_confirm_password = document.getElementById("reset-confirm-password");
const reset_password_button = document.getElementById("reset-password-button");
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
    message_text.textContent = "Password reset successfully"
}
async function reset_password() {
    message_box.style.display = "none"
    reset_new_password.ariaInvalid = null;
    reset_confirm_password.ariaInvalid = null;

    const new_password = reset_new_password.value
    const confirm_password = reset_confirm_password.value
    const token = new URLSearchParams(window.location.search).get("token")

    if (!token){
        window.location.href = "index.html";
        return;
    }

    if (new_password == "") {
        show_error("Please enter a valid password");
        reset_new_password.ariaInvalid = "true";
        return;
    }

    if (confirm_password == ""){
        show_error("Please confirm your password");
        reset_confirm_password.ariaInvalid = "true";
        return;
    }

    if (!(/\p{Lu}/u.test(new_password) && /\p{Nd}/u.test(new_password))) {
        reset_new_password.ariaInvalid = "true";
        show_error("Password must contain a capital letter and a number.");
        return;
    }

    if (confirm_password != new_password) {
        show_error("Passwords do not match")
        reset_new_password.ariaInvalid = "true";
        reset_confirm_password.ariaInvalid = "true";
        return;
    }

    const options = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            new_password: new_password,
            confirm_password: confirm_password
        })
    };

    try{
        const result = await fetch(`${API_BASE_URL}/reset-password/${token}`, options);

        if (!result.ok) {
            const body = await result.json();
            let message = body.detail;
            if (message == "User not found") {message = "Something went wrong. Please request a new link."}
            show_error(message ?? "Something went wrong. Please check your input.");
            return;
        }

        show_success()

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } catch{
        show_error("Couldn't reach the server. Check your connection and try again.");
    }

}

reset_password_button.addEventListener("click", async () => {
    reset_password()
})