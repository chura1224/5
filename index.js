document.addEventListener('DOMContentLoaded', () => {
    // Gauge animation logic
    const gaugeFill = document.querySelector('.gauge-fill');
    if (gaugeFill) {
        // Trigger animation after a short delay
        setTimeout(() => {
            gaugeFill.style.width = '0.1%';
        }, 500);
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply observer to cards and sections
    const animElements = document.querySelectorAll('.villain-card, .special-analysis, .heroes');
    animElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Simple interaction for Villain Cards
    const cards = document.querySelectorAll('.villain-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.getAttribute('data-villain');
            console.log(`${name} 빌런을 수배 중입니다...`);
            // You could add a modal or alert here
        });
    });
});
