document.getElementById('submitButtonId').addEventListener('click', function() {
    const customerData = {
        // Assuming your form fields have ids like "email", "firstName", etc.
        email: document.getElementById('email').value,
        firstName: document.getElementById('firstName').value,
        // ... capture other fields ...
    };

    fetch('/customer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
})