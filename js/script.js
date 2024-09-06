// Assuming this is on your main page (index.html)

function performSearch() {
    // Get the search query from the input box
    const query = document.getElementById('search-query').value;
    // Determine which search engine to use based on the page background    
    const engine = document.body.classList.contains('gemini-background') ? 'gemini' : 'wikipedia';

    // Get the results list element and clear previous results
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';

    // Check if the search query is empty
    if (!query) {
        alert('Please enter a search query.');
        return;
    }

    // Perform the search based on the selected engine
    if (engine === 'gemini') {
        searchGemini(query);
    } else if (engine === 'wikipedia') {
        searchWikipedia(query);
    }
}

// Function to search using the Gemini API
async function searchGemini(query) {
    displayGeminiResults("Please wait"); // Show a loading message

    const requestBody = {
        contents: [{
            parts: [{
                text: query
            }]
        }]
    };

    try {
        // Send a POST request to the Gemini API (replace with your actual API key)
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDN40DfPeXOLG7vpu16SYWrFkpZgyaLABU', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json(); // Parse the JSON response
        const results = processGeminiData(data); // Extract the relevant content
        displayGeminiResults(results); // Display the results
    } catch (error) {
        console.error('Error fetching Gemini data:', error);
        displayGeminiResults("Error occurred. Please try again."); // Display error message
    }
}

// Function to display the results from Gemini
function displayGeminiResults(text) {
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = ''; // Clear any previous content

    const container = document.createElement('div');
    container.classList.add('gemini-text');

    // Display a loading message with animated dots if text starts with "Please wait"
    if (text.startsWith("Please wait")) {
        const waitMessage = document.createElement('p1');
        waitMessage.textContent = text;
        waitMessage.style.fontSize = '30px'; // Increase font size for "Please wait"
        waitMessage.style.color = '#70757a'; // Gray text color
        container.appendChild(waitMessage);

        let dotCount = 0;
        const interval = setInterval(() => {
            dotCount = (dotCount % 3) + 1; // Cycle through 3 dots
            waitMessage.textContent = `${text}${'.'.repeat(dotCount)}`;
        }, 350); // Interval for adding dots (500ms)

        // Stop the animation and update the message once content is loaded
        window.addEventListener('load', () => {
            clearInterval(interval);
            waitMessage.textContent = "Content loaded."; // Replace with loaded message
        });

    }    else {

        // Display regular content
        const sections = text.split('\n\n'); // Split text into sections
        sections.forEach(section => {
            const sectionElement = document.createElement('div');
            if (section.startsWith('**')) {
                sectionElement.classList.add('heading');
                section = section.substring(2, section.length - 2); // Remove '**' from start and end
                sectionElement.textContent = section;
                sectionElement.innerHTML = '<br>' + sectionElement.innerHTML; // Add a line break
            } else {
                sectionElement.classList.add('paragraph');
                sectionElement.innerHTML = section.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold text
            }
            container.appendChild(sectionElement);
        });
    }

    resultsList.appendChild(container); // Add the content to the results list
}


// Function to extract content from Gemini API response

function processGeminiData(data) {
    const content = data.candidates[0]?.content?.parts?.[0]?.text;
    return content || "No content found";  // Return the content or a default message
}

// // Function to search using the Wikipedia API
// function searchWikipedia(query) {
//     const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`;

//     // Fetch search results from Wikipedia API
//     fetch(url)
//         .then(response => response.json())
//         .then(data => {

//             // Map search results to a simpler format
//             const results = data.query.search.map(item => ({
//                 title: item.title,
//                 snippet: item.snippet,
//                 link: `https://en.wikipedia.org/wiki/${item.title}`
//             }));
//             displayWikiResults(results); // Display the results
//         })
//         .catch(error => console.error('Error:', error)); // Log any errors
// }

// // Function to display Wikipedia search results
// function displayWikiResults(results) {
//     const resultsList = document.getElementById('results-list');
//     resultsList.innerHTML = '';
//         // Show loader
//   const loader = document.getElementById("loader");
//   loader.style.display = "block";
//   // Show loader
    
//     results.forEach(result => {
//         //   loader
//     loader.style.display = "none";
//     //    loader
        
//         const li = document.createElement('li');
        
//         li.innerHTML = `<h3><a href="${result.link}" target="_blank">${result.title}</a></h3><p>${result.snippet}</p>`;
//         resultsList.appendChild(li); // Add each result to the list
//     });
// }


// Function to search using the Wikipedia API
function searchWikipedia(query) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`;

    // Show loader before fetching data
    const loader = document.getElementById("loader");
    loader.style.display = "block";

    // Fetch search results from Wikipedia API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Map search results to a simpler format
            const results = data.query.search.map(item => ({
                title: item.title,
                snippet: item.snippet,
                link: `https://en.wikipedia.org/wiki/${item.title}`
            }));

            displayWikiResults(results); // Display the results
        })
        .catch(error => console.error('Error:', error))
        .finally(() => {
            // Hide loader after fetching data is complete
            loader.style.display = "none";
        });
}

// Function to display Wikipedia search results
function displayWikiResults(results) {
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';

    results.forEach(result => {
        const li = document.createElement('li');
        li.innerHTML = `<h3><a href="${result.link}" target="_blank">${result.title}</a></h3><p>${result.snippet}</p>`;
        resultsList.appendChild(li); // Add each result to the list
    });
}
