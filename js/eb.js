const csvmaker = function (data) {
    // Empty array for storing the values
    const csvRows = [];

    // Headers is basically the keys of an object
    const headers = Object.keys(data);

    // Add headers as the first row
    csvRows.push(headers.join(','));

    // Push each object's values into the array
    const values = headers.map(header => data[header]);
    csvRows.push(values.join(','));

    // Returning the array joining with a new line
    return csvRows.join('\n');
}

const download = function (csvdata) {
    // Create a Blob for the CSV data
    const blob = new Blob([csvdata], { type: 'text/csv' });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create an anchor(a) tag of HTML
    const a = document.createElement('a');

    // Set the anchor tag attributes for downloading
    a.setAttribute('href', url);
    a.setAttribute('download', 'download.csv');

    // Perform a download with a click
    a.click();
}

const get = async function () {
    try {
        const response = await fetch('http://localhost:8081/seat');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Combine data into a single CSV string
        const csvdata = data.map(csvmaker).join('\n');

        // Download the CSV file
        download(csvdata);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Getting element by id and adding
// event listener to listen every time
// the button is pressed
const btn = document.getElementById('action');
btn.addEventListener('click', get);
