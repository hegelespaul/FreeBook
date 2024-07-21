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
            titleLink.setAttribute('target', '_blank');


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
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dragula/3.7.3/dragula.min.css">
                <style>
                     body {
                            margin-left: 0px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            position: relative;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 60%;
                            font-family: 'Roboto', sans-serif;
                            background-color: #f5f5f5;
                            color: #333;
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
                            color: #86a6bb; /* Modern color */
                        }
                        .header {
                            width: 100%;
                            background-color: #86a6bb;
                            color: #fff;
                            padding: 20px;
                            text-align: center;
                            border-radius: 10px;
                            margin-bottom: -20px;
                        }
                        #sheet {
                            width: 100%;
                            background-color: #ffffff;
                            padding: 20px;
                            display: grid;
                            grid-template-columns: repeat(4, 1fr);
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        #composer {
                            text-align: right;
                        }
                        #key {
                            text-align: right;
                            border-radius: 10px;
                            font-size: 16px;
                            max-width: fit-content;
                            padding: 5px;
                            background-color: #F9F9F9;
                            color: #000;
                            align-content: center;
                        }
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
                            border: solid 2px #000;
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
                            background-color: #F9F9F9;
                            border-right: 2px solid #000;
                            border-left: 2px solid #000;
                            padding: 10px;
                            white-space: pre-wrap;
                            word-wrap: break-word;
                            display: flex;
                            justify-content: space-around;
                            align-items: center;
                            text-align: center;
                            font-size: 1vw;
                            margin-bottom: 10px;
                            max-width: 100%;
                            overflow: auto;
                        }
                        pre:nth-child(n+2) {
                            margin-left: -2px;
                        }
                        .chord {
                            margin-left: 2%;
                            margin-right: 2%;
                        }
                        #video-container {
                            width: 20%;
                            height: 3%;
                            cursor: move;
                        }
                        .floating-video {
                            position: relative;
                            width: 300px;
                            height: 169px;
                            border: none;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                            cursor: move;
                        }
                        div > button {
                            position: relative;
                            background-color: #86a6bb;
                            color: #fff;
                            border: none;
                            padding: 5px 10px;
                            border-radius: 5px;
                            font-size: 14px;
                            cursor: pointer;
                            top: 20px;
                            z-index: 10000;
                        }
                        .videoFloat {
                            position: absolute;
                            display: flex;
                            flex-direction: column;
                            width: max-content;
                            height: fit-content;
                            border: none;
                            cursor: move;
                        }
                        @media (max-width: 768px) {
                            body {
                                width: 80%;
                                margin-left: 0px;
                            }
                            h2 {
                                font-size: 16px;
                            }
                            h4, h5 {
                                font-size: 1.5vw;
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
                        @media (max-width: 480px) {
                            .header {
                                margin-bottom: -20px;
                            }
                            body {
                                width: 90%;
                                margin-left: 0px;
                            }
                            h1 {
                                font-size: 5vw;
                            }
                            h2 {
                                font-size: 3vw;
                            }
                            h4, h5 {
                                font-size: 3vw;
                            }
                            pre {
                                font-size: 2.5vw;
                            }
                            #composer {
                                font-size: 8px;
                            }
                            #key {
                                font-size: 2.5vw;
                            }
                            .transpose-buttons button {  
                                font-size: 3vw;
                            }
                            .floating-video {
                                width: 150px;
                                height: 84.5px;
                            }
                            div > button {
                                font-size: 10px;
                            }
                            .floating-video {
                                width: 100%; 
                                height: auto;
                            }
                            .videoFloat {
                                width: 50%;
                            }
                        }
                </style>
                <title>${title} - ${composer}</title>
            </head>
            <body>
                <section class="header">
                    <h1>${title}</h1>
                    <p id="composer">- ${composer}</p>
                    <p id="key">&nbsp;&nbsp;&nbsp;${timesignature}
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
                        htmlContent += `<div class="chord">${chord}</div>`;
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
            <script src="https://cdnjs.cloudflare.com/ajax/libs/dragula/3.7.3/dragula.min.js"></script>
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
                videoContainer.classList.add('videoFloat');
                videoContainer.style.position = 'absolute';

                if (window.innerWidth <= 480) {
                    videoContainer.style.bottom = '0px';
                    videoContainer.style.right = '0px';
                } else {
                    videoContainer.style.bottom = '-20px';
                    videoContainer.style.right = '-20px';
                }

                const iframe = document.createElement('iframe');
                iframe.className = 'floating-video';
                iframe.width = '300'; // Adjust width as needed
                iframe.src = "${video_url.replace('watch?v=', '').replace('youtube.com/', 'hepedroza.com/videosFreeBook/downloaded_videos/')}.mp4"
                iframe.frameborder = '0';
                iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowfullscreen = true;

                // Show/Hide button
                const toggleButton = document.createElement('button');
                toggleButton.innerText = 'Hide Video';
                toggleButton.style.cursor = 'pointer';
                toggleButton.addEventListener('click', () => {
                    if (iframe.style.display !== 'none') {
                        iframe.style.display = 'none'; // Hide video
                        toggleButton.innerText = 'Show Video';
                    } else {
                        iframe.style.display = 'block'; // Show video
                        toggleButton.innerText = 'Hide Video';
                    }
                });

                videoContainer.appendChild(iframe);
                videoContainer.appendChild(toggleButton);
                document.getElementById('video-container').appendChild(videoContainer);
                makeDraggable(videoContainer);

            }

            function makeDraggable(element) {
                let isDragging = false;
                let startX, startY, initialX, initialY;

                function onPointerDown(e) {
                    isDragging = true;
                    startX = e.clientX || e.touches[0].clientX;
                    startY = e.clientY || e.touches[0].clientY;
                    initialX = element.offsetLeft;
                    initialY = element.offsetTop;

                    document.addEventListener('mousemove', onPointerMove);
                    document.addEventListener('mouseup', onPointerUp);
                    document.addEventListener('touchmove', onPointerMove, { passive: false });
                    document.addEventListener('touchend', onPointerUp);
                }

                function onPointerMove(e) {
                    if (isDragging) {
                        const x = e.clientX || e.touches[0].clientX;
                        const y = e.clientY || e.touches[0].clientY;

                        const dx = x - startX;
                        const dy = y - startY;

                        element.style.left = initialX + dx+'px';
                        element.style.top = initialY + dy+'px';

                        if (e.preventDefault) e.preventDefault(); // Prevent scrolling during drag
                    }
                }

                function onPointerUp() {
                    isDragging = false;
                    document.removeEventListener('mousemove', onPointerMove);
                    document.removeEventListener('mouseup', onPointerUp);
                    document.removeEventListener('touchmove', onPointerMove);
                    document.removeEventListener('touchend', onPointerUp);
                }

                element.addEventListener('mousedown', onPointerDown);
                element.addEventListener('touchstart', onPointerDown, { passive: false });

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
        titleLink.setAttribute('target', '_blank');


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
        titleLink.setAttribute('target', '_blank');


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

        let searchBox = document.getElementById('searchBox');
        let existingParagraph = searchBox.querySelector('p');

        if (existingParagraph) {
            existingParagraph.textContent = 'No matches Found!';
        } else {
            let paragraph = document.createElement('p');
            paragraph.textContent = 'No matches Found!';
            searchBox.appendChild(paragraph);
        }

        tunes.forEach(tune => {
            const newDiv = document.createElement('div');
            newDiv.className = 'tune';

            const titleLink = document.createElement('a');
            titleLink.href = generateNewHTMLTune(tune.title, tune.composer, tune.sections, tune.key, tune.timesignature, tune.url);
            titleLink.textContent = tune.title;
            titleLink.setAttribute('target', '_blank');


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

    if (matches.length == 1382 || matches.length == 0){
        document.getElementById('btn').style.display = "none"
    }else{
        document.getElementById('btn').style.display = "block"
    }

}

function clearSearch() {
    document.getElementById('SearchText').value = '';
}