// Switch to the other page
document.getElementById('switchMap').addEventListener('click', function () {
    window.location.href = '/switchpage';  // This will navigate to page2.html
});


// pass data to backend and switch to map page
document.getElementById('switchMap').addEventListener('click', function () {
    const data = {
        "temperatureControl": parseInt(document.getElementById('temperatureControl').value),
        "treeControl": parseInt(document.getElementById('treeControl').value),
        "cloudControl": parseInt(document.getElementById('cloudControl').value)
    };

    fetch('/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Data sent successfully:', result);
        // Navigate to page2 after data is sent
        window.location.href = '/switchpage';
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
