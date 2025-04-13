document.addEventListener('DOMContentLoaded', () => {

    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const header = document.getElementById('main-header');
    const headerHeight = header.offsetHeight;
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (scrollTop > lastScrollTop && scrollTop > headerHeight * 1.5){
            header.classList.add('nav-hidden');
        } else {
             if(scrollTop < lastScrollTop || scrollTop < headerHeight) {
                header.classList.remove('nav-hidden');
            }
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

    }, false);

    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const desktopNav = document.querySelector('#main-header nav');
    const mobileNavLinksContainer = document.querySelector('.nav-links-mobile');
    const icon = mobileToggle ? mobileToggle.querySelector('i') : null;

    if (desktopNav && mobileNavLinksContainer && mobileNavLinksContainer.children.length === 0) {
        const links = desktopNav.querySelectorAll('a.nav-link');
        links.forEach(link => {
            mobileNavLinksContainer.appendChild(link.cloneNode(true));
        });
    }

    if (mobileToggle && mobileNavLinksContainer && icon) {
        mobileToggle.addEventListener('click', () => {
            mobileNavLinksContainer.classList.toggle('active');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
            document.body.style.overflow = mobileNavLinksContainer.classList.contains('active') ? 'hidden' : '';
        });

        mobileNavLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNavLinksContainer.classList.remove('active');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            });
        });
    }

    const sections = document.querySelectorAll('main section[id]');
    const desktopNavLinksAnchors = document.querySelectorAll('#main-header nav a.nav-link');
    const mobileNavLinksAnchors = mobileNavLinksContainer ? mobileNavLinksContainer.querySelectorAll('a.nav-link') : [];
    const allNavLinks = [...desktopNavLinksAnchors, ...mobileNavLinksAnchors];
    const scrollOffset = headerHeight + 60;

    const activateNavLink = (linkToActivate) => {
        const href = linkToActivate.getAttribute('href');
        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    };

    const onScrollHighlight = () => {
        const scrollY = window.pageYOffset + scrollOffset;
        let currentSectionId = null;

        sections.forEach(current => {
            const sectionTop = current.offsetTop;
            const sectionHeight = current.offsetHeight;
             if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                 currentSectionId = current.getAttribute('id');
             }
        });

        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 50) {
             currentSectionId = sections[sections.length - 1].getAttribute('id');
        }
        else if (!currentSectionId && window.pageYOffset < sections[0].offsetTop * 0.5) {
             currentSectionId = 'home';
        }

        const targetHref = currentSectionId ? `#${currentSectionId}` : null;

        if (targetHref) {
            allNavLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === targetHref);
            });
        } else {
             allNavLinks.forEach(link => link.classList.remove('active'));
        }
    };

    window.addEventListener('scroll', onScrollHighlight);
    onScrollHighlight();

    desktopNavLinksAnchors.forEach(link => {
        link.addEventListener('click', function() {});
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                 let delay = 0;
                 if (entry.target.classList.contains('observe-me-child')) {
                     const parent = entry.target.closest('.observe-me');
                     if (parent) {
                        const children = Array.from(parent.querySelectorAll(':scope > .observe-me-child, :scope > *:not(.observe-me) > .observe-me-child, :scope > *:not(.observe-me) > *:not(.observe-me) > .observe-me-child'));
                         const childIndex = children.indexOf(entry.target);
                         if(childIndex !== -1) {
                             delay = childIndex * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--animation-delay') || '0.1');
                         }
                     }
                 }
                 entry.target.style.transitionDelay = `${delay}s`;
                 entry.target.classList.add('visible');
                 observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elementsToObserve = document.querySelectorAll('.observe-me, .observe-me-child');
    elementsToObserve.forEach(el => observer.observe(el));

    console.log("Final Portfolio script loaded.");
});