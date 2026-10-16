document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const bgContainer = document.getElementById('background-container');

    // Currently active section ID (null when on title page)
    let activeTarget = null;

    // Original text labels for each navigation link
    const originalLabels = {
        about: 'about',
        video: 'video',
        reach: 'reach'
    };

    // Backgrounds configuration for each page state
    const backgrounds = {
        title: `
            <video autoplay muted loop id="bg-video">
                <source src="index_video.webm" type="video/webm">
            </video>
        `,
        about: `
            <video autoplay muted loop id="bg-video">
                <source src="about_video.webm" type="video/webm">
            </video>
        `,
        video: `
            <img src="video-bg.jpg" class="bg-image-display" alt="Reach background">
        `,
        reach: `
            <video autoplay muted loop id="bg-video">
                <source src="reach_video.webm" type="video/webm">
            </video>
        `
    };

    // Function to load videos dynamically from videos.json
function loadVideos() {
    fetch('videos.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('dynamic-video-container');
            if (!container) return;
            
            container.innerHTML = ''; // Clear previous

            if (data.videos && data.videos.length > 0) {
                data.videos.forEach(vid => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'video-wrapper';
                    wrapper.innerHTML = `
                        <iframe 
                            src="${vid.url}" 
                            title="${vid.title}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    `;
                    container.appendChild(wrapper);
                });
            } else {
                container.innerHTML = '<p style="color: #fff;">No videos added yet.</p>';
            }
        })
        .catch(err => console.log('Error loading videos:', err));
}

// Call it when the page loads so it's ready
document.addEventListener('DOMContentLoaded', () => {
    loadVideos();
    // ... (rest of your existing script code)
});

    // Helper function to return to the opening title page
    function resetToTitlePage() {
        activeTarget = null;

        // Show title page section and hide all others
        sections.forEach(section => {
            if (section.id === 'title-page') {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Restore original navigation labels
        navLinks.forEach(item => {
            const itemTarget = item.getAttribute('data-target');
            item.textContent = originalLabels[itemTarget];
        });

        // Reset background to opening video safely
        bgContainer.innerHTML = backgrounds.title;
        const bgVideo = document.getElementById('bg-video');
        if (bgVideo) {
            bgVideo.currentTime = 0;
            bgVideo.play().catch(error => {
                // Safely handles any interruption error quietly
                console.log("Video play interrupted:", error);
            });
        }
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            // IF the clicked link is ALREADY active (it currently says "index"), go back to title page
            if (activeTarget === targetId) {
                resetToTitlePage();
                return;
            }

            // Otherwise, set new active target
            activeTarget = targetId;

            // 1. Reset all menu text labels to their original names
            navLinks.forEach(item => {
                const itemTarget = item.getAttribute('data-target');
                item.textContent = originalLabels[itemTarget];
            });

            // 2. Change the clicked link's text to "index"
            link.textContent = 'index';

            // 3. Switch active section content
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });

            // 4. Update background dynamically safely
            if (backgrounds[targetId]) {
                bgContainer.innerHTML = backgrounds[targetId];
                const activeVideo = bgContainer.querySelector('video');
                if (activeVideo) {
                    activeVideo.currentTime = 0;
                    activeVideo.play().catch(error => {
                        console.log("Video play interrupted:", error);
                    });
                }
            }
        });
    });

    // Clicking main logo also returns to title page
    const logoImg = document.querySelector('.logo');
    if (logoImg) {
        logoImg.style.cursor = 'pointer';
        logoImg.addEventListener('click', resetToTitlePage);
    }
});
