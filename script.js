
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

const video = document.getElementById('webcam');
const statusDiv = document.getElementById('status');
const gestureDebug = document.getElementById('gesture-debug');
const fileInput = document.getElementById('file-input');
const container = document.getElementById('pdf-container');

let handposeModel = null;
let scrollInterval = null;
let currentDirection = null; // 'up', 'down', or null

async function setupApp() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        video.srcObject = stream;
        
        handposeModel = await handpose.load();
        
        statusDiv.textContent = "TensorFlow JS Ready";
        statusDiv.className = "status ready";
        
        detectHand();
    } catch (err) {
        statusDiv.textContent = "Error: Webcam or Model failed";
        statusDiv.style.background = "#f8d7da";
        console.error(err);
    }
}

async function detectHand() {
    if (video.readyState === video.HAVE_ENOUGH_DATA && handposeModel) {
        const predictions = await handposeModel.estimateHands(video);
        
        if (predictions.length > 0) {
            const hand = predictions[0];
            const extendedFingers = countExtendedFingers(hand.landmarks);
            
            gestureDebug.textContent = `Fingers: ${extendedFingers}`;

            // Gesture Decision Logic
            if (extendedFingers >= 4) {
                startScrolling('down');
            } else if (extendedFingers === 1) {
                startScrolling('up');
            } else {
                stopScrolling();
            }
        } else {
            gestureDebug.textContent = "Fingers: 0 (No hand)";
            stopScrolling();
        }
    }
    requestAnimationFrame(detectHand);
}

// Helper function to check which fingers are up
function countExtendedFingers(landmarks) {
    // Landmarks indices for fingertips and pip joints (lower joint)
    const fingerTips = [8, 12, 16, 20]; // Index, Middle, Ring, Pinky
    const fingerPips = [6, 10, 14, 18];
    
    let count = 0;

    // Check 4 long fingers (if tip is higher up on screen than the lower joint)
    // Note: In webcams, Y goes downwards, so "higher up" means a smaller Y value
    for (let i = 0; i < 4; i++) {
        if (landmarks[fingerTips[i]][1] < landmarks[fingerPips[i]][1]) {
            count++;
        }
    }

    // Check Thumb (Uses X coordinate relative to the hand base orientation)
    // If thumb tip is outside the thumb base joint, it's extended
    const thumbTipX = landmarks[4][0];
    const thumbBaseX = landmarks[2][0];
    const wristX = landmarks[0][0];

    // Accounts for left/right hand flipping orientation
    if (wristX > thumbBaseX && thumbTipX < thumbBaseX) count++;
    if (wristX < thumbBaseX && thumbTipX > thumbBaseX) count++;

    return count;
}

function startScrolling(direction) {
    // If we are already scrolling in this direction, do nothing
    if (currentDirection === direction) return;

    // If direction changed, clear the old interval first
    stopScrolling();

    currentDirection = direction;
    const scrollAmount = direction === 'down' ? 14 : -14;

    scrollInterval = setInterval(() => {
        container.scrollBy({ top: scrollAmount, behavior: 'auto' }); 
    }, 30);
}

document.body.appendChild(Object.assign(document.createElement('style'), { textContent: '#pdf-container { scroll-behavior: auto !important; }' }));

function stopScrolling() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
    currentDirection = null;
}

// Handle PDF Upload
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    container.innerHTML = ''; 
    
    const fileReader = new FileReader();
    fileReader.onload = async function() {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.5 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            container.appendChild(canvas);
            
            await page.render({ canvasContext: context, viewport: viewport }).promise;
        }
    };
    fileReader.readAsArrayBuffer(file);
});

setupApp();
