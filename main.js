const filePath = 'JazzStandards-url.json';
let tunes = [];

fetch(filePath)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const js = data; // Now the JSON data is stored in the variable 'js'
        js.forEach(element => {
            tunes.push({
                title: element['Title'],
                composer: element['Composer'],
                sections: element['Sections'],
                key: element['Key'],
                timesignature: element['TimeSignature'],
                url: element['url']
            });
        });

        // Sort tunes by title
        tunes.sort((a, b) => a.title.localeCompare(b.title));

        tunes.forEach(tune => {
            const newDiv = document.createElement('div');
            newDiv.className = 'tune';

            const titleLink = document.createElement('a');
            titleLink.href = generateNewHTMLTune(tune.title, tune.composer, tune.sections, tune.key, tune.timesignature, tune.url);
            titleLink.textContent = tune.title;

            const composerLink = document.createElement('a');
            composerLink.href = '#';

            composerLink.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
                Composer(tune.composer); // Call Composer with the clicked composer
            });

            composerLink.textContent = tune.composer;

            const divider = document.createElement('span');
            divider.textContent = ' - ';

            newDiv.appendChild(titleLink);
            newDiv.appendChild(divider);
            newDiv.appendChild(composerLink);

            const container = document.getElementById('index');
            container.appendChild(newDiv);
        });

    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });



function generateNewHTMLTune(title, composer, sections, key, timesignature, video_url) {
    key = key !== undefined ? key : '';
    timesignature = timesignature !== undefined ? timesignature : '';
    let htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="icon" href="https://cdn-icons-png.freepik.com/512/10000/10000516.png" type="image/png">
                <style>
                    body {
                        margin-left: 0px;
                        display: flex;
                        flex-direction: column;
                        align-items: center; /* Center items horizontally */
                        justify-content: center; /* Center items vertically */
                        position: relative;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 60%;
                        font-family: Arial, sans-serif;
                        background-color: #f5f5f5;
                        min-height: 100vh; 
                    }
                    ::-webkit-scrollbar { 
                        display: none; 
                    }
                    .transpose-buttons {
                        display: inline-flex;
                        flex-direction: column;
                        margin-left: 10px;
                        vertical-align: middle;
                    }
                    .transpose-buttons button {
                        background: none;
                        border: none;
                        font-size: 16px;
                        cursor: pointer;
                    }
                    .header {
                        width: 100%;
                        background-color: #ffffff;
                        padding: 20px;
                        text-align: center;
                        border-radius: 10px;
                        margin-bottom: -20px; /* Adjust as needed */
                    }
                    #sheet {
                        width: 100%;
                        background-color: #ffffff;
                        padding: 20px;
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        border-radius: 10px;
                    }
                    #composer{
                        text-align: right;
                    }
                    #key{
                        text-align: left;
                        border-radius: 10px;
                        font-size: 14px;
                        max-width: fit-content;
                        padding: 3px;
                    }
                    h1, h4, h5 {
                        margin: 0;
                        padding: 10px;
                    }
                    h1 {
                        grid-column: span 4;
                        text-align: center;
                    }
                    h2 {
                        grid-column: span 4;
                        text-align: left;
                        border: solid 2px black;
                        max-width: fit-content;
                        padding: 3px;
                    }
                    h4 {
                        grid-column: span 4;
                        border-bottom: 2px solid #ccc;
                        max-width: fit-content;
                        padding: 3px;
                    }
                    h5 {
                        grid-column: span 4;
                        color: #555;
                    }
                    pre {
                        background-color: #fafafa;
                        border-right: 2.5px solid #000;
                        border-left: 2.5px solid #000;
                        padding: 10px;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        text-align: center;
                        font-size: 1vw;
                        margin-bottom: 10px;
                        max-width: 100%; /* Ensure it does not exceed the screen width */
                        overflow: auto; /* Handle overflow content */
                    }
                        pre:nth-child(n+2) {
                        margin-left: -2.5px;
                    }
                    .chord {
                        margin-left: 2%;
                        margin-right: 2%;
                    }
                    #video-container{
                        width: 20%;
                        height: 3%;
                    }
                    .floating-video {
                        position: absolute;
                        bottom: 20px; /* Adjust as needed */
                        right: -200px; /* Adjust as needed */
                        width: 300px; /* Adjust width as needed */
                        height: 169px; /* Adjust height as needed */
                        z-index: 1000; /* Ensure it's above other content */
                        border: none;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* Optional: Add shadow for better visibility */
                    }
                    div > button {
                        position: relative;
                        background-color: #fff;
                        border: 1px solid #ccc;
                        padding: 5px 10px;
                        border-radius: 5px;
                        font-size: 14px;
                        cursor: pointer;
                        right: -200px;
                        top: 10px;
                    }
                    @media (max-width: 768px) {
                        body {
                            width: 80%;
                            margin-left: 0px;
                        }
                        h2 {
                            font-size: 16px; /* Adjust for smallest screens */
                        }
                        h4, h5 {
                            font-size: 1.5vw; /* Adjust for smallest screens */
                        }
                        pre {
                            font-size: 2vw;
                        }
                    }

                    @media print {
                        pre {
                            font-size: 2vw;
                        }   
                    }

                    /* Adjustments for smaller mobile devices */
                    @media (max-width: 480px) {
                        .header {
                            margin-bottom: -20px; /* Adjust as needed */
                        }
                        body {
                            width: 90%;
                            margin-left: 0px;
                        }
                        h1 {
                            font-size: 5vw; /* Adjust for smallest screens */
                        }
                        h2 {
                            font-size: 3vw; /* Adjust for smallest screens */
                        }
                        h4, h5 {
                            font-size: 3vw; /* Adjust for smallest screens */
                        }
                        pre {
                            font-size: 2.5vw;
                        }
                        #composer{
                            font-size: 8px;
                        }
                        #key{
                            font-size: 2.5vw;
                        }
                        .transpose-buttons button {  
                            font-size: 3vw;
                        }
                        .floating-video {
                            bottom: 80px;
                            right: 0px;
                            width: 150px;
                            height: 84.5px;
                        }
                        div > button {
                            font-size: 10px;
                            right: 0px;
                            top: -50px;
                        }
                    }
                </style>
                <title>${title} - ${composer}</title>
            </head>
            <body>
                <section class="header">
                    <h1>${title}</h1>
                    <p id="composer">- ${composer}</p>
                    <p id="key">${timesignature}
                    <span class="transpose-buttons">
                        <button onclick="transposeChords(1)">&#9650;</button>
                        <button onclick="transposeChords(-1)">&#9660;</button>
                    </span>
                    </p>
                </section>
                <section id="sheet">
        `;

    sections.forEach(section => {
        let label = section['Label'] || '';
        let mainSegment = section['MainSegment'];
        let endings = section['Endings'];
        let repeats = section['Repeats']

        if (label !== '') {
            htmlContent += `<h2>${label}</h2>`;
        }

        if (mainSegment) {
            // Remove comments if you want to include these
            // htmlContent += `<h4>Main Segment</h4>`;
            if (repeats) {
                htmlContent += `<h5>Repeats: ${repeats}</h5>`;
            }
            let singleBar = mainSegment['Chords'].split('|');
            singleBar.forEach(e => {
                let singleChord = e.split(',');
                htmlContent += `<pre>`;
                singleChord.forEach(chord => {
                    chord = chord.replace(/0/g, '°')
                    htmlContent += `<div class="chord">${chord}</div>`;
                });
                htmlContent += `</pre>`;
            });
        }

        if (endings && endings.length > 0) {
            endings.forEach((ending, index) => {
                // Remove comments if you want to include these
                htmlContent += `<h4>Ending ${index + 1}</h4>`;
                if (repeats) {
                    htmlContent += `<h5>Repeats: ${repeats}</h5>`;
                }
                let singleBar = ending['Chords'].split('|');
                singleBar.forEach(e => {
                    let singleChord = e.split(',');
                    htmlContent += `<pre>`;
                    singleChord.forEach(chord => {
                        chord = chord.replace(/0/g, '°');
                        htmlContent += `<div>${chord}</div>`;
                    });
                    htmlContent += `</pre>`;
                });
            });
        }
    });

    htmlContent += `
            </section>
            <div id="video-container" style="margin-top: 20px;">
                <!-- Video will be appended here -->
            </div>
            <script>
            
            const notes = [
                "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
                "Db", "Eb", "Gb", "Ab", "Bb"
            ];
            const enharmonics = {
                "B#": "C", "E#": "F", "Cb": "B", "Fb": "E",
                "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#",
                "C#": "Db", "D#": "Eb", "F#": "Gb", "G#": "Ab", "A#": "Bb"
            };

            let currentTransposition = 0;

            function transposeChord(chord, semitones) {
                let newChord = "";
                let regex = /^([A-Ga-g][#b]?)(.*)$/;
                let match = chord.match(regex);

                if (match) {
                    let note = match[1];
                    let rest = match[2];

                    if (enharmonics[note]) {
                        note = enharmonics[note];
                    }

                    let index = notes.indexOf(note);
                    if (index !== -1) {
                        let newIndex = (index + semitones + notes.length) % notes.length;
                        let transposedNote = notes[newIndex];

                        // Use the preferred enharmonic equivalents
                        if (enharmonics[transposedNote]) {
                            transposedNote = enharmonics[transposedNote];
                        }

                        newChord = transposedNote + rest;
                    } else {
                        newChord = chord; // If not a recognized note, return original chord
                    }
                } else {
                    newChord = chord; // If not a recognized chord, return original chord
                }

                return newChord;
            }

            function transposeChords(semitones) {
                const chordElements = document.querySelectorAll(".chord");
                chordElements.forEach(chordElement => {
                    let chord = chordElement.innerText;
                    let newChord = transposeChord(chord, semitones);
                    chordElement.innerText = newChord;
                });
            }

            function adjustFontSize() {
                const preElements = document.querySelectorAll("pre");
                preElements.forEach(pre => {
                    let fontSize = parseFloat(window.getComputedStyle(pre).fontSize);
                    while (pre.scrollWidth > pre.clientWidth && fontSize > 1) {
                        fontSize -= 0.5; // Decrease font size
                        pre.style.fontSize = fontSize + 'px';
                    }
                });
            }

            window.addEventListener("resize", adjustFontSize);
            adjustFontSize();


            // Function to embed the YouTube video
            function embedYouTubeVideo() {
                const videoContainer = document.createElement('div');
                videoContainer.style.position = 'fixed';
                videoContainer.style.bottom = '20px';
                videoContainer.style.right = '20px';
                videoContainer.style.zIndex = '1000'; // Ensure it's above other content

                const iframe = document.createElement('iframe');
                iframe.className = 'floating-video';
                iframe.width = '300'; // Adjust width as needed
                iframe.height = '169'; // Adjust height as needed
                iframe.src = "${video_url.replace('watch?v=', 'embed/').replace('youtube.com', 'youtube-nocookie.com')}"
                iframe.frameborder = '0';
                iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowfullscreen = true;

                // Close button
                const closeButton = document.createElement('button');
                closeButton.innerText = 'Close Video';
                closeButton.style.cursor = 'pointer';
                closeButton.addEventListener('click', () => {
                    document.getElementById('video-container').removeChild(videoContainer); // Remove video container on close
                });

                videoContainer.appendChild(closeButton);
                videoContainer.appendChild(iframe);
                document.getElementById('video-container').appendChild(videoContainer);
            }

            embedYouTubeVideo();

            </script>
        </body>
        </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    return url;
}


function Composer(composer) {


    document.getElementById('btn').style.display = "block"

    let matches = [];
    const text = composer.toLowerCase();


    tunes.forEach(tune => {
        if (tune.composer.toLowerCase() === text) {
            matches.push(tune);
        }
    });

    const container = document.getElementById('index');
    container.innerHTML = '';

    matches.forEach(tune => {
        const newDiv = document.createElement('div');
        newDiv.className = 'tune';

        const titleLink = document.createElement('a');
        titleLink.href = generateNewHTMLTune(tune.title, tune.composer, tune.sections, tune.key, tune.timesignature, tune.url);
        titleLink.textContent = tune.title;

        const composerSpan = document.createElement('span');
        composerSpan.textContent = tune.composer;

        const divider = document.createElement('span');
        divider.textContent = ' - ';

        newDiv.appendChild(titleLink);
        newDiv.appendChild(divider);
        newDiv.appendChild(composerSpan);

        container.appendChild(newDiv);
    });

}

function Search() {

    document.getElementById('btn').style.display = "none"

    let matches = [];
    const text = document.getElementById('SearchText').value.toLowerCase();

    tunes.forEach(tune => {
        if (tune.title.toLowerCase().includes(text)) {
            matches.push(tune);
        }
    });

    const container = document.getElementById('index');
    container.innerHTML = '';

    matches.forEach(tune => {
        const newDiv = document.createElement('div');
        newDiv.className = 'tune';

        const titleLink = document.createElement('a');
        titleLink.href = generateNewHTMLTune(tune.title, tune.composer, tune.sections, tune.key, tune.timesignature, tune.url);
        titleLink.textContent = tune.title;

        const composerLink = document.createElement('a');
        composerLink.href = '#';

        composerLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            Composer(tune.composer); // Call Composer with the clicked composer
        });
        composerLink.textContent = tune.composer;

        const divider = document.createElement('span');
        divider.textContent = ' - ';

        newDiv.appendChild(titleLink);
        newDiv.appendChild(divider);
        newDiv.appendChild(composerLink);

        container.appendChild(newDiv);
    });

    if (matches.length == 0) {

        tunes.forEach(tune => {
            const newDiv = document.createElement('div');
            newDiv.className = 'tune';

            const titleLink = document.createElement('a');
            titleLink.href = generateNewHTMLTune(tune.title, tune.composer, tune.sections, tine.timesignature, tune.url);
            titleLink.textContent = tune.title;

            const composerLink = document.createElement('a');
            composerLink.href = '#';

            composerLink.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
                Composer(tune.composer); // Call Composer with the clicked composer
            });
            composerLink.textContent = tune.composer;

            const divider = document.createElement('span');
            divider.textContent = ' - ';

            newDiv.appendChild(titleLink);
            newDiv.appendChild(divider);
            newDiv.appendChild(composerLink);

            const container = document.getElementById('index');
            container.appendChild(newDiv);
        });

    }
}

function clearSearch() {
    let field = document.getElementById('SearchText').value;
    field = '';
}