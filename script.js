// AI编程工具大全 - 交互功能脚本

// 全局变量
let isLoading = true;
let particlesArray = [];
let animationId;

// DOM元素
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const backToTopButton = document.getElementById('backToTop');
const loadingScreen = document.getElementById('loadingScreen');
const particlesBackground = document.getElementById('particles-background');

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initializeParticles();
    initializeScrollEffects();
    initializeNavigation();
    initializeAnimations();
    initializeLoadingScreen();
    initializeToolCards();
    initializeKeyboardShortcuts();
    
    // 添加页面交互增强
    enhancePageInteractions();

    // 平滑滚动导航
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 主页按钮平滑滚动
    const heroButtons = document.querySelectorAll('.hero-buttons a');
    heroButtons.forEach(button => {
        if (button.getAttribute('href').startsWith('#')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });

    // 移动端菜单切换
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 点击菜单项时关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 滚动效果
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 卡片动画
    const cards = document.querySelectorAll('.tool-card, .tutorial-card, .news-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // 活跃导航链接高亮
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 搜索功能（模拟）
    function initSearch() {
        const searchInput = document.createElement('div');
        searchInput.innerHTML = `
            <div class="search-container" style="position: fixed; top: 80px; right: 20px; z-index: 999; display: none;">
                <input type="text" id="searchInput" placeholder="搜索工具或教程..." 
                       style="padding: 10px; border: 1px solid #ddd; border-radius: 6px; width: 250px;">
                <div id="searchResults" style="background: white; border: 1px solid #ddd; border-top: none; 
                     border-radius: 0 0 6px 6px; max-height: 300px; overflow-y: auto; display: none;"></div>
            </div>
        `;
        document.body.appendChild(searchInput);
    }

    // 动态更新时间
    function updateTimeStamps() {
        const timeElements = document.querySelectorAll('.news-time');
        timeElements.forEach(element => {
            const originalTime = element.textContent;
            // 这里可以添加实际的时间更新逻辑
        });
    }

    // 工具状态更新
    function updateToolStatus() {
        const statusElements = document.querySelectorAll('.tool-status');
        statusElements.forEach(status => {
            // 模拟随机状态更新
            if (Math.random() > 0.9) {
                status.textContent = '刚刚更新';
                status.style.backgroundColor = '#fef3c7';
                status.style.color = '#92400e';
            }
        });
    }

    // 添加回到顶部按钮
    const backToTop = document.createElement('div');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #2563eb;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    `;
    
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.transform = 'translateY(0)';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.transform = 'translateY(10px)';
        }
    });

    // 添加加载动画
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-robot fa-spin" style="font-size: 2rem; color: #2563eb;"></i>
            <p style="margin-top: 1rem; color: #666;">加载中...</p>
        </div>
    `;
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 1;
        transition: opacity 0.5s ease;
    `;

    document.body.appendChild(loadingOverlay);

    // 页面加载完成后隐藏加载动画
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.remove();
            }, 500);
        }, 1000);
    });

    // 工具卡片点击效果
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.tool-actions')) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });

    // 每日资讯自动刷新提示
    function showNewsUpdateNotification() {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="background: #dcfce7; color: #166534; padding: 12px 20px; border-radius: 8px; 
                        position: fixed; top: 80px; left: 50%; transform: translateX(-50%); 
                        z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <i class="fas fa-bell"></i> 发现新的AI编程资讯更新！
                <button onclick="this.parentElement.remove()" 
                        style="background: none; border: none; color: #166534; margin-left: 10px; cursor: pointer;">
                    ✕
                </button>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // 模拟定期更新通知
    setTimeout(showNewsUpdateNotification, 10000);

    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        // 按 'S' 键聚焦搜索（如果存在）
        if (e.key === 's' || e.key === 'S') {
            const searchInput = document.getElementById('searchInput');
            if (searchInput && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                searchInput.focus();
            }
        }
        
        // 按 ESC 键关闭移动端菜单
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // 初始化完成
    console.log('网站功能加载完成');
});

// 添加移动端菜单样式
const mobileMenuStyles = document.createElement('style');
mobileMenuStyles.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            padding: 2rem 0;
            gap: 0;
        }

        .nav-menu.active {
            left: 0;
        }

        .nav-menu li {
            margin: 1rem 0;
        }

        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }

        .hamburger.active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }

        .hamburger.active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    }

    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }

    .nav-link.active {
        color: #2563eb !important;
        font-weight: 600;
    }
`;
document.head.appendChild(mobileMenuStyles);

// 粒子系统
function initializeParticles() {
    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * window.innerHeight;
            this.fadeDelay = Math.random() * 600;
            this.fadeStart = Date.now() + this.fadeDelay;
            this.fadingIn = true;
        }

        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = window.innerHeight + 100;
            this.z = Math.random() * 20;
            this.speed = 2 + Math.random() * 5;
            this.opacity = 0;
            this.scale = 0.5 + Math.random() * 0.5;
            this.color = Math.random() > 0.5 ? '#00f2fe' : '#f093fb';
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            this.rotation = 0;
            this.fadeDelay = 0;
            this.fadeStart = Date.now();
            this.fadingIn = true;
        }

        update() {
            this.y -= this.speed;
            this.rotation += this.rotationSpeed;
            
            // 处理透明度动画
            if (this.fadingIn) {
                if (Date.now() > this.fadeStart) {
                    this.opacity += 0.005;
                    if (this.opacity >= 1) {
                        this.opacity = 1;
                        this.fadingIn = false;
                    }
                }
            } else {
                if (this.y < -100) {
                    this.reset();
                }
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.opacity * 0.6;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(this.scale, this.scale);
            
            // 创建发光效果
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 4);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }

    // 创建canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    particlesBackground.appendChild(canvas);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particlesArray = [];
        const numberOfParticles = Math.min(50, Math.floor(window.innerWidth / 20));
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });
        
        animationId = requestAnimationFrame(animateParticles);
    }

    // 初始化粒子系统
    resizeCanvas();
    createParticles();
    animateParticles();

    // 窗口大小改变时重新计算
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });
}

// 加载屏幕
function initializeLoadingScreen() {
    const progressBar = document.querySelector('.progress-bar');
    const loadingText = document.querySelector('.loading-text');
    const loadingTexts = [
        '正在加载AI工具数据...',
        '初始化智能助手...',
        '准备炫酷界面...',
        '即将完成...'
    ];
    
    let progress = 0;
    let textIndex = 0;
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    document.body.classList.remove('loading');
                    isLoading = false;
                    
                    // 启动页面动画
                    startPageAnimations();
                }, 500);
            }, 200);
        }
        
        progressBar.style.width = `${progress}%`;
        
        // 更新加载文本
        if (progress > (textIndex + 1) * 25 && textIndex < loadingTexts.length - 1) {
            textIndex++;
            loadingText.textContent = loadingTexts[textIndex];
        }
    }, 100);
}

// 启动页面动画
function startPageAnimations() {
    // 动画序列
    const animations = [
        () => animateHeroContent(),
        () => animateToolCards(),
        () => animateNavbar()
    ];
    
    animations.forEach((animation, index) => {
        setTimeout(animation, index * 200);
    });
}

function animateHeroContent() {
    const heroContent = document.querySelector('.hero-content');
    const heroStats = document.querySelector('.hero-stats');
    const floatingCards = document.querySelectorAll('.card-float');
    
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        heroContent.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // 统计数字动画
    if (heroStats) {
        const statNumbers = heroStats.querySelectorAll('.stat-number');
        statNumbers.forEach((stat, index) => {
            const finalNumber = parseInt(stat.textContent.replace('+', ''));
            let currentNumber = 0;
            const increment = finalNumber / 30;
            
            setTimeout(() => {
                const counter = setInterval(() => {
                    currentNumber += increment;
                    if (currentNumber >= finalNumber) {
                        currentNumber = finalNumber;
                        clearInterval(counter);
                    }
                    stat.textContent = Math.floor(currentNumber) + '+';
                }, 50);
            }, index * 200);
        });
    }
    
    // 浮动卡片动画
    floatingCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(100px) scale(0.8)';
        card.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, 300 + index * 200);
    });
}

function animateToolCards() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(60px) rotateX(10deg)';
        card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) rotateX(0deg)';
        }, index * 100);
    });
}

function animateNavbar() {
    if (navbar) {
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            navbar.style.transform = 'translateY(0)';
        }, 100);
    }
}

// 滚动效果
function initializeScrollEffects() {
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateScrollEffects() {
        const scrollY = window.scrollY;
        const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
        
        // 导航栏效果
        if (navbar) {
            if (scrollY > 100) {
                navbar.classList.add('scrolled');
                if (scrollDirection === 'down' && scrollY > 300) {
                    navbar.style.transform = 'translateY(-100%)';
                } else if (scrollDirection === 'up') {
                    navbar.style.transform = 'translateY(0)';
                }
            } else {
                navbar.classList.remove('scrolled');
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        // 回到顶部按钮
        if (backToTopButton) {
            if (scrollY > 500) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
        
        // 视差效果
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual && scrollY < window.innerHeight) {
            const parallaxSpeed = scrollY * 0.5;
            heroVisual.style.transform = `translateY(${parallaxSpeed}px)`;
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // 特殊动画处理
                if (entry.target.classList.contains('tutorial-card')) {
                    animateTutorialCard(entry.target);
                } else if (entry.target.classList.contains('news-card')) {
                    animateNewsCard(entry.target);
                } else if (entry.target.classList.contains('update-item')) {
                    animateUpdateItem(entry.target);
                }
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animateElements = document.querySelectorAll(
        '.tool-card, .tutorial-card, .news-card, .update-item, .section-title'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// 特殊卡片动画
function animateTutorialCard(card) {
    const image = card.querySelector('.tutorial-image');
    const content = card.querySelector('.tutorial-content');
    
    if (image) {
        image.style.transform = 'scale(1.1) rotateY(-5deg)';
        setTimeout(() => {
            image.style.transform = 'scale(1) rotateY(0deg)';
        }, 600);
    }
    
    if (content) {
        const elements = content.querySelectorAll('*');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(20px)';
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }
}

function animateNewsCard(card) {
    const image = card.querySelector('.news-image');
    const content = card.querySelector('.news-content');
    
    if (image) {
        image.style.clipPath = 'polygon(0 0, 0 0, 0 100%, 0% 100%)';
        setTimeout(() => {
            image.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)';
        }, 200);
    }
    
    if (content) {
        content.style.transform = 'translateY(30px)';
        setTimeout(() => {
            content.style.transform = 'translateY(0)';
        }, 300);
    }
}

function animateUpdateItem(item) {
    const date = item.querySelector('.update-date');
    const content = item.querySelector('.update-content');
    
    if (date) {
        date.style.transform = 'translateX(-50px)';
        date.style.opacity = '0';
        setTimeout(() => {
            date.style.transform = 'translateX(0)';
            date.style.opacity = '1';
        }, 100);
    }
    
    if (content) {
        content.style.transform = 'translateX(50px)';
        content.style.opacity = '0';
        setTimeout(() => {
            content.style.transform = 'translateX(0)';
            content.style.opacity = '1';
        }, 200);
    }
}

// 导航功能
function initializeNavigation() {
    // 汉堡菜单
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // 关闭移动端菜单
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });

    // 回到顶部
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// 工具卡片3D效果
function initializeToolCards() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // 3D倾斜效果
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `
                translateY(-10px) 
                scale(1.02) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                perspective(1000px)
            `;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
        });
    });
}

// 动画增强
function initializeAnimations() {
    // 页面切换动画
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 页面隐藏时暂停动画
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        } else {
            // 页面显示时恢复动画
            if (particlesArray.length > 0) {
                animateParticles();
            }
        }
    });
    
    // 鼠标跟随效果
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseMoving = true;
        
        // 更新CSS变量用于某些动画
        document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
        
        // 鼠标停止移动后重置
        clearTimeout(isMouseMoving);
        isMouseMoving = setTimeout(() => {
            isMouseMoving = false;
        }, 100);
    });
    
    // 浮动卡片鼠标交互
    const floatingCards = document.querySelectorAll('.card-float');
    floatingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform += ' scale(1.1)';
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.1)', '');
            this.style.zIndex = '1';
        });
    });
}

// 键盘快捷键
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // ESC 关闭菜单
        if (e.key === 'Escape') {
            if (navMenu && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
        
        // Ctrl/Cmd + K 搜索功能（将来可以添加）
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // 这里可以添加搜索功能
            console.log('搜索功能（待实现）');
        }
        
        // 数字键快速导航
        if (e.key >= '1' && e.key <= '5') {
            const sections = ['#home', '#tools', '#tutorials', '#updates', '#news'];
            const target = document.querySelector(sections[parseInt(e.key) - 1]);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
}

// 页面交互增强
function enhancePageInteractions() {
    // 添加按钮点击波纹效果
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.height, rect.width);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // 添加涟漪动画CSS
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 添加卡片悬浮音效（可选）
    const cards = document.querySelectorAll('.tool-card, .tutorial-card, .news-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // 这里可以添加音效
            // playHoverSound();
        });
    });
    
    // 添加更多动态效果
    addDynamicEffects();
}

// 动态效果
function addDynamicEffects() {
    // 标题打字机效果
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle && !isLoading) {
        animateTypewriter(heroTitle);
    }
    
    // 进度条动画
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = bar.style.width || '0%';
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 200);
                }
            });
        });
        observer.observe(bar);
    });
    
    // 添加随机浮动动画到某些元素
    const floatElements = document.querySelectorAll('.tool-icon, .tutorial-image i');
    floatElements.forEach((element, index) => {
        element.style.animation = `float 3s ease-in-out infinite`;
        element.style.animationDelay = `${index * 0.2}s`;
    });
}

// 打字机效果
function animateTypewriter(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid #00f2fe';
    
    let i = 0;
    const speed = 100;
    
    function typeWriter() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            // 移除光标
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    setTimeout(typeWriter, 1000);
}

// 添加浮动动画CSS
const floatAnimationCSS = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
`;

if (!document.querySelector('#float-animation')) {
    const style = document.createElement('style');
    style.id = 'float-animation';
    style.textContent = floatAnimationCSS;
    document.head.appendChild(style);
}

// 性能优化
function optimizePerformance() {
    // 图片懒加载
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // 减少重绘重排
    let rafId;
    function optimizedResize() {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
        rafId = requestAnimationFrame(() => {
            // 处理窗口大小变化
            handleResize();
        });
    }
    
    window.addEventListener('resize', optimizedResize);
}

function handleResize() {
    // 重新计算粒子数量
    const numberOfParticles = Math.min(50, Math.floor(window.innerWidth / 20));
    if (particlesArray.length !== numberOfParticles) {
        // 重新创建粒子（如果需要的话）
        // createParticles();
    }
}

// 错误处理
window.addEventListener('error', function(e) {
    console.error('JavaScript错误:', e.error);
    // 可以在这里添加错误报告功能
});

// 初始化性能优化
document.addEventListener('DOMContentLoaded', optimizePerformance);

// 导出函数供其他脚本使用
window.AIToolsHub = {
    initializeParticles,
    animateTypewriter,
    addDynamicEffects
}; 