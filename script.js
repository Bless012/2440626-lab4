const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

// Helper functions
function showElement(element) {
    element.classList.remove('hidden');
}

function hideElement(element) {
    element.classList.add('hidden');
}

function clearContent(element) {
    element.innerHTML = '';
}

// Fetch country data and update DOM
async function fetchCountryData(countryName) {
    try {
        showElement(loadingSpinner);
        clearContent(countryInfo);
        clearContent(borderingCountries);
        errorMessage.textContent = '';
        hideElement(errorMessage);

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error('Country not found');
        const data = await response.json();
        const country = data[0];

        // Update country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;

        // Bordering countries
        if (country.borders && country.borders.length > 0) {
            for (let code of country.borders) {
                const borderResp = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResp.json();
                const borderCountry = borderData[0];

                const div = document.createElement('div');
                div.innerHTML = `
                    <p>${borderCountry.name.common}</p>
                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                `;
                borderingCountries.appendChild(div);
            }
        } else {
            borderingCountries.innerHTML = '<p>No bordering countries</p>';
        }

    } catch (error) {
        errorMessage.textContent = error.message;
        showElement(errorMessage);
    } finally {
        hideElement(loadingSpinner);
    }
}

// Event listeners
searchBtn.addEventListener('click', () => {
    const country = countryInput.value.trim();
    if (country) fetchCountryData(country);
});

countryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const country = countryInput.value.trim();
        if (country) fetchCountryData(country);
    }
});

// Hide spinner initially
hideElement(loadingSpinner);