// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 复制服务器IP到剪贴板
    window.copyToClipboard = function(elementId) {
        const element = document.getElementById(elementId);
        const text = element.textContent;
        
        navigator.clipboard.writeText(text).then(function() {
            const button = element.nextElementSibling;
            const originalText = button.textContent;
            
            button.textContent = '已复制!';
            button.style.backgroundColor = '#28a745';
            
            setTimeout(function() {
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 2000);
        }).catch(function(err) {
            console.error('无法复制文本: ', err);
        });
    };

    // 获取真实的服务器状态
    async function fetchServerStatus() {
        const serverAddress = 'play.simpfun.cn';
        const serverPort = '13915';
        const playerCountElement = document.getElementById('player-count');
        const uptimeElement = document.getElementById('uptime');
        const serverIpElement = document.getElementById('server-ip');
        
        // 更新显示的服务器地址
        if (serverIpElement) {
            serverIpElement.textContent = `${serverAddress}:${serverPort}`;
        }
        
        try {
            // 使用CORS代理来访问Minecraft服务器API
            const response = await fetch(`https://api.mcsrvstat.us/2/${serverAddress}:${serverPort}`);
            const data = await response.json();
            
            if (data.online) {
                // 服务器在线
                if (playerCountElement) {
                    playerCountElement.textContent = `${data.players.online}/${data.players.max}`;
                }
                
                if (uptimeElement) {
                    uptimeElement.textContent = '在线';
                    uptimeElement.style.color = '#28a745';
                }
            } else {
                // 服务器离线
                if (playerCountElement) {
                    playerCountElement.textContent = '0/0';
                }
                
                if (uptimeElement) {
                    uptimeElement.textContent = '离线';
                    uptimeElement.style.color = '#dc3545';
                }
            }
        } catch (error) {
            console.error('获取服务器状态失败:', error);
            
            // 如果API请求失败，显示默认值
            if (playerCountElement) {
                playerCountElement.textContent = '获取中...';
            }
            
            if (uptimeElement) {
                uptimeElement.textContent = '未知';
                uptimeElement.style.color = '#ffc107';
            }
        }
        
        // 每60秒刷新一次服务器状态
        setTimeout(fetchServerStatus, 60000);
    }
    
    // 初始调用获取服务器状态
    fetchServerStatus();

    // 添加视差滚动效果
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        // 英雄区域视差效果
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            // 调整这个值可以改变视差效果的强度
            heroSection.style.backgroundPositionY = -(scrollPosition * 0.2) + 'px';
        }
    });

    // 图片加载动画
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transition = 'opacity 0.5s ease';
        observer.observe(item);
    });

    // 模组卡片动画
    const modCards = document.querySelectorAll('.mod-card');
    
    const modObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                modObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    modCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        modObserver.observe(card);
    });
    
    // 强制显示所有模组卡片
    document.querySelectorAll('.mod-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
    
    // 添加服务器Logo旋转动画
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('mouseover', function() {
            this.style.transition = 'transform 0.5s ease';
            this.style.transform = 'rotate(360deg)';
        });
        
        logo.addEventListener('mouseout', function() {
            this.style.transition = 'transform 0.5s ease';
            this.style.transform = 'rotate(0deg)';
        });
    }
    
    // 添加特色卡片悬停效果
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#f9f9f9';
            const icon = this.querySelector('.feature-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'white';
            const icon = this.querySelector('.feature-icon i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
    
    // 添加响应式导航菜单
    const createMobileMenu = () => {
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        
        // 如果已经存在移动菜单按钮，则不再创建
        if (document.querySelector('.mobile-menu-btn')) {
            return;
        }
        
        // 创建汉堡菜单按钮
        const mobileMenuBtn = document.createElement('div');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        header.appendChild(mobileMenuBtn);
        
        // 添加点击事件
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // 切换图标
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // 点击导航链接后关闭菜单
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    nav.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    };
    
    // 检查窗口大小，添加移动菜单
    if (window.innerWidth <= 768) {
        createMobileMenu();
    }
    
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            createMobileMenu();
        }
    });
    
    // 添加页面加载动画
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // 添加滚动到顶部按钮
    const createScrollTopButton = () => {
        // 如果已经存在滚动按钮，则不再创建
        if (document.querySelector('.scroll-top-btn')) {
            return;
        }
        
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-top-btn';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(scrollBtn);
        
        // 显示/隐藏按钮
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });
        
        // 点击滚动到顶部
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };
    
    createScrollTopButton();
});