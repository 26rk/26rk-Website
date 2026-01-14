document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            setTimeout(() => {
                target.classList.remove('section-flash');
                void target.offsetWidth;
                target.classList.add('section-flash');
            }, 100);
        }
    });
});

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(91, 210, 135, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = [];
const particleCount = 100;

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

let mouseX = 0;
let mouseY = 0;

class CursorParticle {
    constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 15;
        this.y = y + (Math.random() - 0.5) * 15;
        this.size = Math.random() * 1.5 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.15 + 0.1;
        this.life = 60;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        this.opacity = (this.life / 60) * 0.25;
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const cursorParticles = [];

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.strokeStyle = `rgba(91, 210, 135, ${0.1 * (1 - distance / 150)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();

    for (let i = cursorParticles.length - 1; i >= 0; i--) {
        cursorParticles[i].update();
        cursorParticles[i].draw();
        
        if (cursorParticles[i].life <= 0 || cursorParticles[i].opacity <= 0) {
            cursorParticles.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animate);
}

animate();

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            particle.x -= dx * 0.01;
            particle.y -= dy * 0.01;
        }
    });

    if (Math.random() > 0.7) {
        cursorParticles.push(new CursorParticle(mouseX, mouseY));
    }
});

const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.8)';
    }
    
    lastScroll = currentScroll;
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .skill-card, .about-text p').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {

            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillFills = entry.target.querySelectorAll('.skill-fill');
            skillFills.forEach(fill => {
                const targetWidth = fill.getAttribute('data-width');
                if (targetWidth) {
                    setTimeout(() => {
                        fill.style.width = targetWidth + '%';
                    }, 100);
                }
            });
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

const titleText = '</26RK>';
let titleIndex = titleText.length;
let isDeleting = false;
let titleTimeout;

function animateTitle() {
    const currentTitle = titleText.substring(0, titleIndex);
    document.title = currentTitle;

    if (!isDeleting && titleIndex === titleText.length) {
        titleTimeout = setTimeout(() => {
            isDeleting = true;
            animateTitle();
        }, 2000);
    } else if (isDeleting && titleIndex > 1) {
        titleIndex--;
        titleTimeout = setTimeout(animateTitle, 100);
    } else if (isDeleting && titleIndex === 1) {
        isDeleting = false;
        titleTimeout = setTimeout(() => {
            titleIndex = 1;
            animateTitle();
        }, 500);
    } else if (!isDeleting && titleIndex < titleText.length) {
        titleIndex++;
        titleTimeout = setTimeout(animateTitle, 150);
    }
}

animateTitle();

const clickSound = new Audio('click.mp3');
clickSound.volume = 0.1;
clickSound.preload = 'auto';
clickSound.load();

let canPlaySound = true;
const soundCooldown = 100;
let mouseDownPos = { x: 0, y: 0 };
let isSelecting = false;

document.addEventListener('mousedown', (e) => {
    mouseDownPos = { x: e.clientX, y: e.clientY };
    isSelecting = false;
});

document.addEventListener('mousemove', (e) => {
    if (e.buttons === 1) {
        const distance = Math.sqrt(
            Math.pow(e.clientX - mouseDownPos.x, 2) + 
            Math.pow(e.clientY - mouseDownPos.y, 2)
        );
        if (distance > 5) {
            isSelecting = true;
        }
    }
});

document.addEventListener('click', (e) => {
    if (!isSelecting && canPlaySound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(err => console.log('Audio play failed:', err));
        
        canPlaySound = false;
        setTimeout(() => {
            canPlaySound = true;
        }, soundCooldown);
    }
    isSelecting = false;
});

let logoClickCount = 0;
let logoClickTimer = null;

document.querySelector('.logo').addEventListener('click', (e) => {
    logoClickCount++;
    
    if (logoClickTimer) {
        clearTimeout(logoClickTimer);
    }
    
    if (logoClickCount === 3) {
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
        logoClickCount = 0;
    } else {
        if (logoClickCount === 1) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        logoClickTimer = setTimeout(() => {
            logoClickCount = 0;
        }, 5000);
    }
});

console.log('%c26RK Portfolio', 'color: #5bd287; font-size: 24px; font-weight: bold;');
console.log('%cBuilt with passion for Discord bot development', 'color: #5bd287; font-size: 14px;');

const botInfo = {
    veribot: {
        title: 'Veribot',
        content: `
            <h3>Overview</h3>
            <p>Veribot was a comprehensive multi-purpose Discord bot designed to provide server administrators with a wide range of moderation and utility features.</p>
            
            <h3>Key Features</h3>
            <ul>
                <li><strong>Moderation Tools:</strong> Advanced moderation commands including kick, ban, mute, and warning systems</li>
                <li><strong>Auto-Moderation:</strong> Automated spam detection and content filtering</li>
                <li><strong>Logging System:</strong> Comprehensive server activity logging</li>
                <li><strong>Custom Commands:</strong> Ability to create custom server-specific commands</li>
                <li><strong>Role Management:</strong> Automated role assignment and management</li>
                <li><strong>Welcome System:</strong> Customizable welcome messages for new members</li>
            </ul>
            
            <h3>Why It Was Discontinued</h3>
            <p>Veribot was discontinued in 2025 to focus development efforts on more specialized bot projects. The lessons learned from Veribot's development were invaluable in creating more focused and efficient bots.</p>
            
            <h3>Legacy</h3>
            <p>At its peak, Veribot served over 99 Discord servers and helped manage over 11,000 members. It provided a robust moderation suite, logging capabilities, and a custom command system for server-specific commands.</p>
        `
    },
    voxify: {
        title: 'Voxify',
        content: `
            <h3>Overview</h3>
            <p>Voxify was a specialized Discord bot focused on voice channel management, particularly the "Join to Create" functionality that allowed users to create temporary voice channels on demand.</p>
            
            <h3>Key Features</h3>
            <ul>
                <li><strong>Join to Create:</strong> Automatic temporary voice channel creation when users join a specific channel</li>
                <li><strong>Channel Customization:</strong> Users could customize their temporary channels with names, user limits, and permissions</li>
                <li><strong>Auto-Delete:</strong> Channels automatically deleted when empty</li>
                <li><strong>Permission Management:</strong> Fine-grained control over who can join temporary channels</li>
                <li><strong>Channel Templates:</strong> Pre-configured channel templates for different use cases</li>
                <li><strong>Activity Tracking:</strong> Statistics on voice channel usage</li>
            </ul>
            
            <h3>Why It Was Discontinued</h3>
            <p>Voxify was discontinued in early 2025 as Discord introduced native features that overlapped with Voxify's core functionality. The bot had served its purpose well and paved the way for future voice-focused projects.</p>
            
            <h3>Impact</h3>
            <p>Voxify was used in over 20 servers and created hundreds of temporary voice channels, making voice chat more flexible and organized for gaming communities and study groups.</p>
        `
    },
    givecord: {
        title: 'GiveCord',
        content: `
            <h3>Overview</h3>
            <p>GiveCord was a feature-rich giveaway bot that made it easy for server administrators to run engaging giveaways and contests for their community members.</p>
            
            <h3>Key Features</h3>
            <ul>
                <li><strong>Easy Giveaway Creation:</strong> Simple commands to create and manage giveaways</li>
                <li><strong>Multiple Entry Methods:</strong> Support for reaction-based and button-based entries</li>
                <li><strong>Role Requirements:</strong> Restrict giveaways to specific roles</li>
                <li><strong>Automatic Winner Selection:</strong> Fair and random winner selection</li>
                <li><strong>Reroll Functionality:</strong> Ability to reroll winners if needed</li>
                <li><strong>Giveaway Scheduling:</strong> Schedule giveaways to start at specific times</li>
                <li><strong>Multi-Winner Support:</strong> Run giveaways with multiple winners</li>
            </ul>
            
            <h3>Why It Was Discontinued</h3>
            <p>GiveCord was discontinued in 2025 as the giveaway bot market became highly saturated. The decision was made to focus on more unique and innovative bot concepts.</p>
            
            <h3>Success</h3>
            <p>During its active period, GiveCord facilitated over 100 giveaways across Discord servers, bringing excitement and engagement to the community.</p>
        `
    },
    embedbuilder: {
        title: 'Embed Builder',
        content: `
            <h3>Overview</h3>
            <p>Embed Builder was an intuitive Discord bot that allowed users to create beautiful, customized embed messages without needing to know any code or JSON formatting.</p>
            
            <h3>Key Features</h3>
            <ul>
                <li><strong>Interactive Builder:</strong> Step-by-step embed creation process</li>
                <li><strong>Full Customization:</strong> Control over colors, titles, descriptions, fields, footers, and images</li>
                <li><strong>Template System:</strong> Save and reuse embed templates</li>
                <li><strong>Preview Function:</strong> See embeds before sending them</li>
                <li><strong>JSON Import/Export:</strong> Import existing embeds or export for use elsewhere</li>
                <li><strong>Webhook Support:</strong> Send embeds through webhooks for custom names and avatars</li>
            </ul>
            
            <h3>Why It Was Discontinued</h3>
            <p>Embed Builder was discontinued in 2024 as Discord improved its native embed support and many similar tools became available. The bot had successfully demonstrated the demand for user-friendly embed creation tools.</p>
            
            <h3>Achievement</h3>
            <p>Embed Builder helped thousands of users create professional-looking announcements, rules pages, and informational messages, making Discord servers more visually appealing and organized.</p>
        `
    }
};

const modal = document.getElementById('botModal');
const modalTitle = document.querySelector('.modal-title');
const modalBody = document.querySelector('.modal-body');
const modalClose = document.querySelector('.modal-close');

document.querySelectorAll('.read-more-btn').forEach(button => {
    button.addEventListener('click', function() {
        const botName = this.getAttribute('data-bot');
        const bot = botInfo[botName];
        
        if (bot) {
            modalTitle.textContent = bot.title;
            modalBody.innerHTML = bot.content;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

modalClose.addEventListener('click', function() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
});

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

