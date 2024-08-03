function collapseNavbar() {
    const navbarToggleButton = document.querySelector('.navbar-toggler');

    if (navbarToggleButton && !navbarToggleButton.classList.contains('collapsed')) {
        navbarToggleButton.click();
    }
}


window.addEventListener('scroll', function() {
    
    collapseNavbar();
});
window.addEventListener('click', function() {
    
    collapseNavbar();
});

const idLinks = document.querySelectorAll('a[href^="#"]');
idLinks.forEach(link => {

    link.addEventListener('click', function() {
        collapseNavbar();
    });
});

const spreadsheetId = '1sT1S19aLOvhhLqo48A6ziAadDQWENr8LPgqEsjo4KAk';
const apiKey = 'AIzaSyBf_5YvsBm5daTtfK0oHZTho4p3Y8o483w';

function createTableElement(title, rows) {
    const container = document.createElement('div');
    container.classList.add('table-container');
    container.classList.add('rounder');

    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    titleElement.classList.add('my-2');
    container.appendChild(titleElement);

    const table = document.createElement('table');

    rows.forEach((row, index) => {
        let tr = document.createElement('tr');

        
        

        row.forEach((cell) => {
            let td = document.createElement('td');
            if (index === 0) {
                td.style.border = '2px solid #217f34'; // Adjust the border style as needed
            }
            // Check for TRUE or FALSE values to replace with checkboxes
            if (cell === 'TRUE') {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = true;
                checkbox.disabled = true; 
                checkbox.classList.add('custom-checkbox', 'true-checkbox');
                td.appendChild(checkbox);
            } else if (cell === 'FALSE') {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = false;
                checkbox.disabled = true;
                checkbox.classList.add('custom-checkbox', 'false-checkbox');
                td.appendChild(checkbox);
            } else {
                td.textContent = cell;
            }

            tr.appendChild(td);
        });

        table.appendChild(tr);
    });

    container.appendChild(table);

    return container;
}




async function fetchAndRenderSheet(sheet) {
    const range = `${sheet.sheetName}`; // Fetch all data from the sheet

    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`);
        const data = await response.json();
        const tableContainer = document.getElementById('sheets-tables');

        if (data.values) {
            const tableElement = createTableElement(sheet.title, data.values);
            tableContainer.appendChild(tableElement);
        } else {
            console.error('No data found for', sheet.sheetName);
        }
    } catch (error) {
        console.error('Error fetching data from', sheet.sheetName, error);
    }
}

// Fetch the sheet metadata and render the sheets in the correct order
fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey}`)
    .then(response => response.json())
    .then(async metadata => {
        // Order sheets by index to match their order in Google Sheets
        const orderedSheets = metadata.sheets
            .sort((a, b) => a.properties.index - b.properties.index)
            .map(sheet => ({
                sheetName: sheet.properties.title,
                title: sheet.properties.title
            }));

        // Fetch and render each sheet sequentially to preserve order
        for (const sheet of orderedSheets) {
            await fetchAndRenderSheet(sheet);
        }
    })
    .catch(error => console.error('Error fetching sheet metadata:', error));
