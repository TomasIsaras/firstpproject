function collapseNavbar(event) {
    const navbarToggleButton = document.querySelector('.navbar-toggler');
    const isNavbarCollapsed = navbarToggleButton && !navbarToggleButton.classList.contains('collapsed');
    
    
    const clickedElement = event?.target;
    const isCarouselControl = clickedElement && (clickedElement.closest('.carousel') || clickedElement.closest('.navbar-toggler'));
    
    
    if (isNavbarCollapsed && !isCarouselControl) {
        navbarToggleButton.click();
    }
}

window.addEventListener('scroll', function(event) {
    collapseNavbar(event);
});

window.addEventListener('click', function(event) {
    collapseNavbar(event);
});

const idLinks = document.querySelectorAll('a[href^="#"]');
idLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        collapseNavbar(event);
    });
});


const spreadsheetId = '1sT1S19aLOvhhLqo48A6ziAadDQWENr8LPgqEsjo4KAk';
const apiKey = 'AIzaSyBf_5YvsBm5daTtfK0oHZTho4p3Y8o483w';

function createTableElement(title, rows) {
    const container = document.createElement('div');
    container.classList.add('table-container');
    container.style='overflow-y: scroll;scrollbar-width: none;';
    
    
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
                td.style.border = '2px solid #217f34'; 
            }
            
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

let currentIndex = 0;

function showSlide(index) {
    const track = document.querySelector('.carousel-track');
    const totalImages = document.querySelectorAll('.carousel-image').length;
    const imagesPerSlide = getImagesPerSlide();

    if (index >= totalImages / imagesPerSlide) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = Math.floor(totalImages / imagesPerSlide) - 1;
    } else {
        currentIndex = index;
    }

    const translateXValue = -(currentIndex * 100);
    track.style.transform = `translateX(${translateXValue}%)`;
}

function nextSlide() {
    showSlide(currentIndex + 1);
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

function getImagesPerSlide() {
    const width = window.innerWidth;
    if (width > 1024) {
        return 3; 
    } else if (width > 768) {
        return 2; 
    } else {
        return 1; 
    }
}


window.onload = () => showSlide(0);


window.onresize = () => showSlide(currentIndex);




fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey}`)
    .then(response => response.json())
    .then(async metadata => {
        
        const orderedSheets = metadata.sheets
            .sort((a, b) => a.properties.index - b.properties.index)
            .map(sheet => ({
                sheetName: sheet.properties.title,
                title: sheet.properties.title
            }));

        
        for (const sheet of orderedSheets) {
            await fetchAndRenderSheet(sheet);
        }
    })
    .catch(error => console.error('Error fetching sheet metadata:', error));
