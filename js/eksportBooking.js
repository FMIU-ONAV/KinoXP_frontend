const csvmaker = function(data) {
    const headers = Object.keys(data);
    const values = headers.map(header => data[header]);
    return headers.join(',') + '\n' + values.join(',');
}

const download = function(csvdata) {
    const blob = new Blob([csvdata], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'download.csv');
    a.click();
}

const get = async function() {
    try {
        const response = await fetch('http://localhost:8081/seat');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const csvdata = data.map(csvmaker).join('\n');
        download(csvdata);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('action');
    if (btn) {
        btn.addEventListener('click', get);
    } else {
        console.error('Element with ID "action" not found.');
    }
});
