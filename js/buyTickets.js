// This function will send the customer data to the server
/*async function saveCustomer() {
    let customer = {};
    customer.id = Number(document.getElementById("customer-id").innerText);
    customer.email = document.getElementById("email").value;
    customer.firstName = document.getElementById("firstName").value;
    customer.lastName = document.getElementById("lastName").value;
    customer.birthday = document.getElementById("birthday").value;

    try {
        let response = await fetch('http://localhost:8081/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customer),
        });

        let data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

    function setUpHandlers() {
        document.getElementById("submitButtonId").onclick = saveCustomer;
        //... other code
    }

    setUpHandlers()

  /*  try {
        let response = await fetch('/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customer),
        });

        let data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function setUpHandlers() {
    document.getElementById("submitButtonId").onclick = saveCustomer;
    // Assuming you have a button with the ID 'btn-add-student' that needs this handler
    // You might need to provide the function 'makeNewStudent' or replace this handler with the correct one.
   // document.getElementById("btn-add-student").onclick = makeNewStudent;
}
setUpHandlers();

function makeNewStudent() {
    // You'll need to provide the 'showModal' function or replace this with the desired behavior.
    showModal({
        id: null,
        email: "",
        firstName: "",
        lastName: "",
        birthday: null
    });*/

let nextId = 200;
let customers = [
    {id: 100, firstName: "Madeleine", lastName: "Flynn", email: "madeleine@email.com", birthday: "2012-03-12"},
    {id: 101, firstName: "Cecile", lastName: "Benson", email: "cecile@email.com", birthday: "2011-09-21"}
]

const URLcustomers = "http://localhost:8081/customers";
const URLcustomer  = "http://localhost:8081/customer";
/*
function setUpHandlers() {
    console.log("Setting up handlers...");

    console.log(document.getElementById("customer-table-body"));
    console.log(document.getElementById("submitButtonId"));
    document.getElementById("customer-table-body").onclick = handleTableClick;
    document.getElementById("submitButtonId").onclick = saveCustomer;
}
document.addEventListener('DOMContentLoaded', (event) => {
    setUpHandlers();
    fetchCustomers();
});*/

document.getElementById("customer-table-body").addEventListener('click', handleTableClick);
document.getElementById("submitButtonId").addEventListener('click', saveCustomer);

function handleTableClick(evt) {
    //evt.preventDefault();
    //evt.stopPropagation();
    const target = evt.target;

    if (target.dataset.idDelete) {
        const idToDelete = Number(target.dataset.idDelete);
        const options = makeOptions("DELETE");
        fetch(`${URLcustomer}/${idToDelete}`, options)
            .then(handleHttpErrors)
            .catch(err => {
                if(err.apiError){
                    console.error("Full API error: ", err.apiError);
                } else {
                    console.error(err.message);
                }
            });
        customers = customers.filter(c => c.id !== idToDelete);
        makeRows();
    }

    if (target.dataset.idEdit) {
        const idToEdit = Number(target.dataset.idEdit);
        const customer = customers.find(c => c.id === idToEdit);
        showModal(customer);
    }
}

function makeNewCustomer() {
    showModal({
        id: null,
        firstName: "",
        lastName: "",
        email: "",
        birthday: ""
    });
}

function showModal(customer) {
    const myModal = new bootstrap.Modal(document.getElementById('customer-modal'));
    document.getElementById("modal-title").innerText = customer.id ? "Edit Customer" : "Add Customer";
    document.getElementById("customer-id").innerText = customer.id;
    document.getElementById("input-firstName").value = customer.firstName;
    document.getElementById("input-lastName").value = customer.lastName;
    document.getElementById("input-email").value = customer.email;
    document.getElementById("input-birthday").value = customer.birthday;
    myModal.show();
}

async function saveCustomer() {
    let customer = {};
   // customer.id = Number(document.getElementById("customer-id").innerText); // Assuming you have a hidden field with ID `customer-id`
    customer.firstName = document.getElementById("first_Name").value;
    customer.lastName = document.getElementById("last_Name").value;
    customer.email = document.getElementById("email").value;
    customer.birthday = document.getElementById("birthday").value;

        //... rest of the function remains the same


    if (customer.id) {
        const options = makeOptions("PUT", customer);
        try {
            customer = await fetch(`${URLcustomer}/${customer.id}`, options);
        } catch(err) {
            handleError(err);
        }
        customers = customers.map(c => (c.id === customer.id) ? customer : c);
    } else {
        const options = makeOptions("POST", customer);
        try {
            customer = await fetch(URLcustomer, options).then(handleHttpErrors);
        } catch(err) {
            handleError(err);
        }
        customers.push(customer);
    }
    makeRows();

}

async function fetchCustomers() {
    try {
        customers = await fetch(URLcustomers).then(handleHttpErrors);
    } catch (err) {
        handleError(err);
    }
    makeRows();
}

function makeRows() {
    const rows = customers.map(c => `
      <tr>
          <td>${c.id}</td>
          <td>${c.firstName} ${c.lastName}</td>
          <td>${c.email}</td>
          <td>${c.birthday}</td>
          <td><a data-id-delete=${c.id} href="#">Delete</a></td>
          <td><a data-id-edit='${c.id}' href="#">Edit</a></td>
      </tr>
  `);
    document.getElementById("customer-table-body").innerHTML = rows.join("");
}

function makeOptions(method, body) {
    const opts = {
        method: method,
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    };
    if (body) {
        opts.body = JSON.stringify(body);
    }
    return opts;
}

async function handleHttpErrors(res) {
    if (!res.ok) {
        const text = await res.text();
        try {
            const errorResponse = JSON.parse(text);
            const error = new Error(errorResponse.message);
            error.apiError = errorResponse;
            throw error;
        } catch (e) {
            throw new Error(text || 'Unknown error');
        }
    }
    return res.json();
}
function handleError(err) {
    if(err.apiError) {
        console.error("Full API error:", err.apiError);
    } else {
        console.error(err.message);
    }
}

