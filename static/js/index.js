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
            v.src = labUrl(method, obj);
            v.load();
            v.play().catch(() => {});  // muted, so autoplay is allowed
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
    let first = true;
    SIZES.forEach(([sz, szFull]) => {
        const lbl = document.createElement('div');
        lbl.className = 'ot-size';
        lbl.title = szFull;
        lbl.innerHTML = `<span>${sz}</span>`;
        grid.appendChild(lbl);
        GEOMETRIES.forEach(g => CELLS[g][sz].forEach(obj => {
            const btn = makeThumb(obj);
            grid.appendChild(btn);
            if (first) { selectObject(obj, btn); first = false; }  // default-select first cell
        }));
    });
}

function buildInTheWildCarousel() {
    const root = document.getElementById('itw-carousel');
    if (!root) return;
    OBJECTS.forEach(obj => {
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML =
            `<video preload="none" muted loop playsinline controls>` +
            `<source src="${itwUrl(obj)}" type="video/mp4"></video>` +
            `<p class="subtitle">${pretty(obj)}</p>`;
        root.appendChild(item);
    });
    const insts = bulmaCarousel.attach('#itw-carousel', {
        slidesToScroll: 1, slidesToShow: 1, loop: true, infinite: true,
        autoplay: false, navigation: true, pagination: true,
    });
    // Play only the visible slide; pause the rest (preload=none -> only it fetches)
    const playActive = () => {
        const vids = root.querySelectorAll('video');
        vids.forEach(v => v.pause());
        const active = root.querySelector('.slider-item.is-active video, .is-active video');
        if (active) active.play().catch(() => {});
    };
    if (insts && insts.length) {
        insts[0].on('after:show', playActive);
        playActive();
    }
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
