// Sabhi markers ko select karein
const markers = document.querySelectorAll('.bar-marker');

// --- NEW REFERENCES (Image & Overlay ke liye) ---
const heartImgEl = document.querySelector('.heart-img');
const heartOverlayEl = document.querySelector('.heart-fill-overlay');

// --- NEW: Completion Flags ---
let isLdlComplete = false;
let isTgComplete = false;
let isHdlComplete = false;
let isFinalStepReady = false;

// Elements ke references
// NOTE: badgeEl yahan se remove kar diya gaya hai
const tgOverlayEl = document.querySelector('.mace-overlay');
const hdlOverlayEl = document.querySelector('.mace-overlay-5');
const ldlOverlayEl = document.querySelector('.mace-overlay-ldl'); 
const finalOverlayEl = document.querySelector('.mace-overlay-final');
const dysInfoEl = document.querySelector('.dyslipidemia-info');
const nextBtn = document.getElementById('nextBtn'); // Button Reference


// --- CONFIGURATION ---
const offset = 10; 

markers.forEach(marker => {
    // Mouse (Desktop)
    marker.addEventListener('mousedown', (e) => startDrag(e, marker));
    
    // Touch (Mobile)
    marker.addEventListener('touchstart', (e) => startDrag(e, marker));
});

function startDrag(e, marker) {
    e.preventDefault(); 

    const container = marker.parentElement;
    const containerRect = container.getBoundingClientRect();
    const containerHeight = container.offsetHeight;
    const markerHeight = marker.offsetHeight;

    function onMove(event) {

        // 1. Agar LDL (Pink) marker hai
        if (marker.classList.contains('ldl-bg')) {
            if(heartImgEl) heartImgEl.src = 'pink_heart.png'; // Image Pink Heart
            
            // Default Pink rehne do (Blue/Grey classes hata do)
            if(heartOverlayEl) {
                heartOverlayEl.classList.remove('theme-blue', 'theme-grey');
            }
        }
        
        // 2. Agar TG (Orange/Blue Context) marker hai
        else if (marker.classList.contains('tg-bg')) {
            if(heartImgEl) heartImgEl.src = 'blue_heart.png'; // Image Blue Heart
            
            // Blue Theme Add karo
            if(heartOverlayEl) {
                heartOverlayEl.classList.remove('theme-grey');
                heartOverlayEl.classList.add('theme-blue');
            }
        }
        
        // 3. Agar HDL (Green/Grey Context) marker hai
        else if (marker.classList.contains('hdl-bg')) {
            if(heartImgEl) heartImgEl.src = 'grey_heart.png'; // Image Grey Heart
            
            // Grey Theme Add karo
            if(heartOverlayEl) {
                heartOverlayEl.classList.remove('theme-blue');
                heartOverlayEl.classList.add('theme-grey');
            }
        }
        
        let clientY;
        if (event.type.includes('touch')) {
            clientY = event.touches[0].clientY;
        } else {
            clientY = event.clientY;
        }

        let newBottom = containerRect.bottom - clientY;
        const maxMove = containerHeight - markerHeight;
        
        if (newBottom < offset) newBottom = offset;
        if (newBottom > (maxMove - offset)) newBottom = maxMove - offset;

        // 1. Current Marker Move
        marker.style.bottom = newBottom + 'px';
        
        // 2. Others Reset Logic (Radio Button Behavior)
        markers.forEach(otherMarker => {
            if (otherMarker !== marker) {
                otherMarker.style.bottom = offset + 'px'; 
            }
        });

        // Percentage Calculation
        let clickableRange = maxMove - (offset * 2); 
        let currentPosition = newBottom - offset;     
        
        let percentage = (currentPosition / clickableRange) * 100;

        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;

        // --- COMMON LOGIC: Check Completion ---
        if (percentage > 90) {
            if (marker.classList.contains('ldl-bg')) isLdlComplete = true;
            if (marker.classList.contains('tg-bg')) isTgComplete = true;
            if (marker.classList.contains('hdl-bg')) isHdlComplete = true;
            
            checkAllCompleted(); 
        }

        // =========================================================
        // CASE 1: LDL Marker (Pink)
        // =========================================================
        if (marker.classList.contains('ldl-bg')) {
            
            // Hide other overlays
            if(tgOverlayEl) tgOverlayEl.classList.remove('visible');
            if(hdlOverlayEl) hdlOverlayEl.classList.remove('visible');

            let maxHeartFill = 20;
            let visualFillPercent = (percentage / 100) * maxHeartFill;
            updateHeartFill(visualFillPercent, percentage); 

            // Text Overlay Logic
            if (percentage > 95) {
                 if (ldlOverlayEl) ldlOverlayEl.classList.add('visible');
            } else {
                 if (ldlOverlayEl) ldlOverlayEl.classList.remove('visible');
            }
        }
        
        // =========================================================
        // CASE 2: TG Marker (Orange)
        // =========================================================
        else if (marker.classList.contains('tg-bg')) {
            
            // Hide other overlays
            if(hdlOverlayEl) hdlOverlayEl.classList.remove('visible');
            if(ldlOverlayEl) ldlOverlayEl.classList.remove('visible');

            let maxHeartFill = 25; 
            let visualFillPercent = (percentage / 100) * maxHeartFill;
            updateHeartFill(visualFillPercent, percentage);

            // Text Overlay Logic
            if (percentage > 95) {
                if (tgOverlayEl) tgOverlayEl.classList.add('visible'); 
            } 
            else {
                if (tgOverlayEl) tgOverlayEl.classList.remove('visible');
            }
        }

        // =========================================================
        // CASE 3: Non-HDL Marker (Green)
        // =========================================================
        else if (marker.classList.contains('hdl-bg')) {
            
            // Hide other overlays
            if(tgOverlayEl) tgOverlayEl.classList.remove('visible');
            if(ldlOverlayEl) ldlOverlayEl.classList.remove('visible');

            let maxHeartFill = 33; 
            let visualFillPercent = (percentage / 100) * maxHeartFill;
            updateHeartFill(visualFillPercent, percentage);

            // Text Overlay Logic
            if (percentage > 95) {
                if (hdlOverlayEl) hdlOverlayEl.classList.add('visible');
            } else {
                if (hdlOverlayEl) hdlOverlayEl.classList.remove('visible');
            }
        }
    }

    // --- FUNCTION TO CHECK ALL COMPLETION ---
    function checkAllCompleted() {
    // Agar teeno me se KOI EK BHI (OR condition) true hai, to button dikhao
    if (isLdlComplete || isTgComplete || isHdlComplete) { 
        if (nextBtn) {
            nextBtn.classList.add('show');
        }
    }
}

    function updateHeartFill(fillPercent, rawPercentage) {
        if (heartOverlayEl) {
            heartOverlayEl.style.setProperty('--fill-percent', fillPercent + '%');
            
            if (rawPercentage <= 1) {
                heartOverlayEl.style.opacity = '0';
            } else {
                heartOverlayEl.style.opacity = '1';
            }
        }
    }

    function stopDrag() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', stopDrag);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', stopDrag);
}

if (nextBtn) {
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Default rok do

        // --- PHASE 1: Agar Animation abhi tak nahi hua hai ---
        if (!isFinalStepReady) {
            
            // 1. Next Button ko Hide karo
            nextBtn.classList.remove('show');

            // 2. Charts & Footer ko Hide karo
            const chartsContainer = document.querySelector('.charts-container');
            const footerCitation = document.querySelector('.footer-citation');
            
            if(chartsContainer) chartsContainer.classList.add('fade-out');
            if(footerCitation) footerCitation.classList.add('fade-out');

            // 3. Naya Info Box Show karo (Charts ki jagah)
            if(dysInfoEl) {
                // Thoda delay taki chart jane ke baad ye aaye smooth lage
                setTimeout(() => {
                    
                    // --- NEW LOGIC START: Remove Space of Old Elements ---
                    // Jaise hi naya box aaye, purane elements ko layout se hata do
                    // taaki mobile me wo upar khali jagah na rokein.
                    if(chartsContainer) chartsContainer.style.display = 'none';
                    if(footerCitation) footerCitation.style.display = 'none';
                    // --- NEW LOGIC END ---

                    // Pehle isko layout me wapis lao (space lene lagega)
                    dysInfoEl.style.display = 'flex'; 
                    
                    // Ek chota sa delay (50ms) zaroori hai taki browser ko pata chale 
                    // ki display change hua hai, tabhi transition animation kaam karega.
                    setTimeout(() => {
                        dysInfoEl.classList.add('visible');
                    }, 50);

                }, 300);
            }

            // 4. Heart Image & Theme Change Logic (Same as before)
            if(heartImgEl) heartImgEl.src = 'dark_blue_heart.png';

            if(heartOverlayEl) {
                heartOverlayEl.classList.remove('theme-blue', 'theme-grey');
                heartOverlayEl.classList.add('theme-dark-blue');
                heartOverlayEl.style.setProperty('--fill-percent', '0%');
                heartOverlayEl.style.opacity = '1';
            }

            // Hide other texts
            if(tgOverlayEl) tgOverlayEl.classList.remove('visible');
            if(hdlOverlayEl) hdlOverlayEl.classList.remove('visible');
            if(ldlOverlayEl) ldlOverlayEl.classList.remove('visible');

            // 5. Animation Sequence Start
            // Delay 1: 0.5s baad Wave Upar aayegi
            setTimeout(() => {
                if(heartOverlayEl) {
                    heartOverlayEl.style.setProperty('--fill-percent', '50%'); // Ya 60% jo tumhari requirement thi
                }

                // Delay 2: 0.6s (Total 1.1s) baad Text aayega
                setTimeout(() => {
                    if(finalOverlayEl) {
                        finalOverlayEl.classList.add('visible');
                    }

                    // --- NEW REQUIREMENT: Button Re-appear Logic ---
                    // Text dikhne ke 1 SECOND baad button aana chahiye.
                    // Text 1.1s (cumulative) pe aaya.
                    // To Button 1.1s + 1s = 2.1s pe aayega.
                    
                    setTimeout(() => {
                        // Button wapis dikhao
                        nextBtn.classList.add('show');
                        
                        // Flag true kar do, taki next click pe page change ho
                        isFinalStepReady = true;

                    }, 200); // 0.2 Second wait after text appears

                }, 600); // Text animation delay

            }, 500); // Wave start delay

        } 
        
        // --- PHASE 2: Agar Animation ho chuka hai (User ne wapis click kiya) ---
        else {
            // Ab seedha 3.html pe bhej do
            window.location.href = '3.html';
        }
    });
}