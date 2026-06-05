window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

// ---- Eval-video gallery (data-driven) ----
// Videos hosted as GitHub Release assets (off the Pages cap). Flat asset names:
// <method>_<object>.mp4 with method in {cap, dex1b, hug, itw}.
const REL = "https://github.com/hug-robot/hug-robot.github.io/releases/download/videos-v1";
const OBJECTS = [
    "bowl", "card_deck", "dustpan", "easel", "eraser", "football", "glue_stick",
    "grapes", "hacky_sack", "handbell", "headphones", "lock", "match_box",
    "nail_clipper", "pear", "pepper_shaker", "picnic_basket", "pineapple",
    "rubber_duck", "saucepan", "softball", "sponge", "spray_bottle", "storage_bin",
    "strawberry", "tape_dispenser", "tape_measure", "umbrella", "wine_bottle",
    "wipe_dispenser"
];
const LAB_METHODS = [["cap", "vid-cap"], ["dex1b", "vid-dex1b"], ["hug", "vid-hug"]];

// Tabletop per-object success (out of 10), from tables/real_world_results.tex
const SCORES = {
    glue_stick:    { cap: 10, dex1b: 7,  hug: 6 },
    pepper_shaker: { cap: 5,  dex1b: 8,  hug: 10 },
    umbrella:      { cap: 7,  dex1b: 4,  hug: 5 },
    bowl:          { cap: 0,  dex1b: 3,  hug: 4 },
    spray_bottle:  { cap: 1,  dex1b: 4,  hug: 9 },
    wine_bottle:   { cap: 3,  dex1b: 7,  hug: 3 },
    strawberry:    { cap: 0,  dex1b: 4,  hug: 7 },
    hacky_sack:    { cap: 8,  dex1b: 5,  hug: 9 },
    pear:          { cap: 4,  dex1b: 10, hug: 10 },
    softball:      { cap: 0,  dex1b: 8,  hug: 5 },
    pineapple:     { cap: 5,  dex1b: 8,  hug: 10 },
    football:      { cap: 0,  dex1b: 0,  hug: 0 },
    eraser:        { cap: 0,  dex1b: 3,  hug: 6 },
    match_box:     { cap: 3,  dex1b: 5,  hug: 8 },
    card_deck:     { cap: 0,  dex1b: 3,  hug: 8 },
    sponge:        { cap: 6,  dex1b: 3,  hug: 6 },
    wipe_dispenser:{ cap: 0,  dex1b: 0,  hug: 0 },
    storage_bin:   { cap: 0,  dex1b: 0,  hug: 10 },
    nail_clipper:  { cap: 0,  dex1b: 3,  hug: 5 },
    lock:          { cap: 6,  dex1b: 6,  hug: 5 },
    dustpan:       { cap: 2,  dex1b: 5,  hug: 6 },
    handbell:      { cap: 5,  dex1b: 8,  hug: 10 },
    saucepan:      { cap: 3,  dex1b: 5,  hug: 4 },
    picnic_basket: { cap: 0,  dex1b: 1,  hug: 9 },
    rubber_duck:   { cap: 4,  dex1b: 3,  hug: 10 },
    tape_measure:  { cap: 8,  dex1b: 3,  hug: 8 },
    tape_dispenser:{ cap: 2,  dex1b: 4,  hug: 3 },
    grapes:        { cap: 6,  dex1b: 2,  hug: 10 },
    headphones:    { cap: 6,  dex1b: 7,  hug: 6 },
    easel:         { cap: 4,  dex1b: 2,  hug: 8 },
};
// In-the-wild per-object success (out of 10), from tables/real_world_results.tex (HUG in-the-wild column)
const ITW_SR = {
    glue_stick: 7, pepper_shaker: 6, umbrella: 6, bowl: 1, spray_bottle: 9, wine_bottle: 10,
    strawberry: 6, hacky_sack: 10, pear: 10, softball: 8, pineapple: 9, football: 0,
    eraser: 6, match_box: 8, card_deck: 8, sponge: 7, wipe_dispenser: 4, storage_bin: 8,
    nail_clipper: 4, lock: 6, dustpan: 6, handbell: 4, saucepan: 7, picnic_basket: 6,
    rubber_duck: 9, tape_measure: 5, tape_dispenser: 4, grapes: 3, headphones: 2, easel: 7,
};
const pretty = o => o.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
const labUrl = (method, obj) => `${REL}/${method}_${obj}.mp4`;
const itwUrl = obj => `${REL}/itw_${obj}.mp4`;
const thumbUrl = obj => `static/images/object_thumbnails/${obj}.png`;

function selectObject(obj, btn) {
    document.querySelectorAll('.object-thumb.is-active')
        .forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
    if (btn) { btn.classList.add('is-active'); btn.setAttribute('aria-selected', 'true'); }
    const sc = SCORES[obj] || {};
    LAB_METHODS.forEach(([method, id]) => {
        const v = document.getElementById(id);
        if (v) {
            v.muted = true;  // Safari checks the property (not attr) for muted autoplay
            v.src = labUrl(method, obj);
            v.load();
            const play = () => v.play().catch(() => {});
            play();
            v.addEventListener('canplay', play, { once: true });  // Safari: retry once ready
        }
        const s = sc[method];
        const rate = document.getElementById('rate-' + method);
        const bar = document.getElementById('bar-' + method);
        if (rate) rate.textContent = (s == null) ? '' : `${s}/10`;
        if (bar) bar.style.width = (s == null) ? '0' : `${s * 10}%`;
    });
}

// 3x10 table: rows = size (S/M/L), columns = geometry (2 objects each),
// ordering follows tables/real_world_results.tex.
const GEOMETRIES = ["Cylindrical", "Spheroidal", "Prismatic", "Appendaged", "Amorphous"];
const SIZES = [["S", "Small"], ["M", "Medium"], ["L", "Large"]];
const CELLS = {
    Cylindrical: { S: ["glue_stick", "pepper_shaker"], M: ["umbrella", "bowl"],        L: ["spray_bottle", "wine_bottle"] },
    Spheroidal:  { S: ["strawberry", "hacky_sack"],    M: ["pear", "softball"],        L: ["pineapple", "football"] },
    Prismatic:   { S: ["eraser", "match_box"],         M: ["card_deck", "sponge"],     L: ["wipe_dispenser", "storage_bin"] },
    Appendaged:  { S: ["nail_clipper", "lock"],        M: ["dustpan", "handbell"],     L: ["saucepan", "picnic_basket"] },
    Amorphous:   { S: ["rubber_duck", "tape_measure"], M: ["tape_dispenser", "grapes"], L: ["headphones", "easel"] },
};

function makeThumb(obj) {
    const btn = document.createElement('button');
    btn.className = 'object-thumb';
    btn.type = 'button';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', 'false');
    btn.title = pretty(obj);
    btn.innerHTML =
        `<img loading="lazy" src="${thumbUrl(obj)}" alt="${pretty(obj)}">` +
        `<span>${pretty(obj)}</span>`;
    btn.addEventListener('click', () => selectObject(obj, btn));
    return btn;
}

function buildObjectTable() {
    const grid = document.getElementById('object-grid');
    if (!grid) return;
    // header row: empty corner + geometry labels (each spans its 2 object columns)
    grid.appendChild(Object.assign(document.createElement('div'), { className: 'ot-corner' }));
    GEOMETRIES.forEach(g => {
        const h = document.createElement('div');
        h.className = 'ot-geo';
        h.textContent = g;
        grid.appendChild(h);
    });
    // one row per size
    const DEFAULT_OBJ = "spray_bottle";
    let fallback = null;
    SIZES.forEach(([sz, szFull]) => {
        const lbl = document.createElement('div');
        lbl.className = 'ot-size';
        lbl.title = szFull;
        lbl.innerHTML = `<span>${sz}</span>`;
        grid.appendChild(lbl);
        GEOMETRIES.forEach(g => CELLS[g][sz].forEach(obj => {
            const btn = makeThumb(obj);
            grid.appendChild(btn);
            if (!fallback) fallback = btn;
            if (obj === DEFAULT_OBJ) selectObject(obj, btn);  // default-select spray bottle
        }));
    });
    if (!document.querySelector('.object-thumb.is-active') && fallback) fallback.click();
}

function buildInTheWildCarousel() {
    const gallery = document.getElementById('itw-gallery');
    if (!gallery) return;
    const video = document.getElementById('itw-video');
    const caption = document.getElementById('itw-caption');
    const strip = document.getElementById('itw-strip');
    let current = 0;

    const thumbs = OBJECTS.map((obj, i) => {
        const btn = document.createElement('button');
        btn.className = 'itw-thumb';
        btn.type = 'button';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', 'false');
        btn.title = pretty(obj);
        btn.innerHTML = `<img loading="lazy" src="${thumbUrl(obj)}" alt="${pretty(obj)}">`;
        btn.addEventListener('click', () => select(i));
        strip.appendChild(btn);
        return btn;
    });

    function select(i) {
        current = (i + OBJECTS.length) % OBJECTS.length;
        const obj = OBJECTS[current];
        video.src = itwUrl(obj);
        video.load();
        video.play().catch(() => {});
        const sr = ITW_SR[obj];
        caption.innerHTML = sr == null ? pretty(obj)
            : `${pretty(obj)} <span class="itw-sr">${sr}/10</span>`;
        thumbs.forEach((t, j) => {
            const on = j === current;
            t.classList.toggle('is-active', on);
            t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        thumbs[current].scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }

    gallery.querySelector('.itw-prev').addEventListener('click', () => select(current - 1));
    gallery.querySelector('.itw-next').addEventListener('click', () => select(current + 1));
    const start = OBJECTS.indexOf('spray_bottle');
    select(start === -1 ? 0 : start);
}

$(document).ready(function() {
    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Build eval gallery before attaching carousels so slides exist
    buildObjectTable();
    buildInTheWildCarousel();

	// Initialize any remaining carousels not handled above
    var carousels = bulmaCarousel.attach('.carousel:not(#itw-carousel)', options);

    bulmaSlider.attach();

    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

})
