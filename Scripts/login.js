document.querySelector('.form-container').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email-field').value;
    const password = document.getElementById('password-field').value;

    const form = { email, password };

    try {
        const response = await fetch('/api/login', {

        });

        const result = await response.json();
    } catch (error) {
        
    }
});