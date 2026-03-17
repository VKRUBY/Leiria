/**
 * LEIRIA Engenharia - Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // 2. Sticky Header on Scroll
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Scroll Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('[data-animate]');

    const fadeOptions = {
        root: null,
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px"
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, fadeOptions);

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // 4. Portfolio Carousel - Infinito com loop real (clone first/last)
    (function initPortfolioCarousel() {
        const track = document.getElementById('portfolio-track-new');
        const dotsContainer = document.getElementById('portfolio-dots');
        if (!track) return;

        const origItems = Array.from(track.querySelectorAll('.portfolio-slide-item'));
        const total = origItems.length;
        if (total === 0) return;

        // Clonar primeiro e último para o loop infinito
        const firstClone = origItems[0].cloneNode(true);
        const lastClone = origItems[total - 1].cloneNode(true);
        firstClone.setAttribute('aria-hidden', 'true');
        lastClone.setAttribute('aria-hidden', 'true');
        track.appendChild(firstClone);      // clone do primeiro no final
        track.insertBefore(lastClone, origItems[0]); // clone do último no início

        const allItems = Array.from(track.querySelectorAll('.portfolio-slide-item'));
        // Índice real no array allItems = current + 1 (por causa do lastClone no início)
        let current = 0; // lógico (0..total-1)
        let cardW = 0;
        const gap = 20;
        let paused = false;
        let autoTimer = null;

        // Dots (apenas para os originais)
        origItems.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'w-2 h-2 rounded-full transition-all duration-300 ' + (i === 0 ? 'bg-yellow-400 w-5' : 'bg-gray-300');
            dot.addEventListener('click', () => { goTo(i); resetTimer(); });
            dotsContainer.appendChild(dot);
        });

        function updateDots() {
            dotsContainer.querySelectorAll('button').forEach((d, i) => {
                d.className = 'w-2 h-2 rounded-full transition-all duration-300 ' + (i === current ? 'bg-yellow-400 w-5' : 'bg-gray-300');
            });
        }

        function getCardWidth() {
            const wrap = document.getElementById('portfolio-carousel-wrap');
            const wrapW = wrap ? wrap.offsetWidth : window.innerWidth;
            if (window.innerWidth < 768) return wrapW;
            return wrapW * 0.52;
        }

        function setTransition(enabled) {
            track.style.transition = enabled
                ? 'transform 0.7s cubic-bezier(0.4,0,0.2,1)'
                : 'none';
        }

        // Ir para índice lógico (0..total-1), com animação
        function goTo(index) {
            current = ((index % total) + total) % total;
            const realIdx = current + 1; // +1 por causa do lastClone no início
            const wrapW = document.getElementById('portfolio-carousel-wrap').offsetWidth;
            cardW = getCardWidth();
            const offset = realIdx * (cardW + gap) - (wrapW / 2 - cardW / 2);
            setTransition(true);
            track.style.transform = `translateX(-${Math.max(0, offset)}px)`;

            allItems.forEach((item, i) => {
                item.style.transform = (i === realIdx) ? 'scale(1)' : 'scale(0.93)';
                item.style.opacity = (i === realIdx) ? '1' : '0.7';
            });

            updateDots();
        }

        // Após transição, verifica se precisa pular silenciosamente para o clone oposto
        track.addEventListener('transitionend', () => {
            const realIdx = current + 1;
            const wrapW = document.getElementById('portfolio-carousel-wrap').offsetWidth;
            cardW = getCardWidth();

            if (realIdx === allItems.length - 1) {
                // Chegou no clone do primeiro → pular para real first (índice 1)
                setTransition(false);
                const offset = 1 * (cardW + gap) - (wrapW / 2 - cardW / 2);
                track.style.transform = `translateX(-${Math.max(0, offset)}px)`;
                current = 0;
            } else if (realIdx === 0) {
                // Chegou no clone do último → pular para real last
                setTransition(false);
                const lastReal = total; // índice real do último original
                const offset = lastReal * (cardW + gap) - (wrapW / 2 - cardW / 2);
                track.style.transform = `translateX(-${Math.max(0, offset)}px)`;
                current = total - 1;
            }
        });

        function setWidths() {
            cardW = getCardWidth();
            allItems.forEach(item => {
                item.style.width = cardW + 'px';
                item.style.minWidth = cardW + 'px';
            });
            goTo(current);
        }

        function startTimer() {
            autoTimer = setInterval(() => {
                if (!paused) goTo(current + 1);
            }, 2000);
        }

        function resetTimer() {
            clearInterval(autoTimer);
            startTimer();
        }

        const wrap2 = document.getElementById('portfolio-carousel-wrap');
        wrap2.addEventListener('mouseenter', () => { paused = true; });
        wrap2.addEventListener('mouseleave', () => { paused = false; });

        window.addEventListener('resize', setWidths);
        setWidths();
        startTimer();
    })();


    // 5. Set Current Year in Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 6. Canal de Ética - Modal Logic
    const denunciaFormContainer = document.getElementById('denuncia-form-container');
    const denunciaOverlay = document.getElementById('denuncia-overlay');
    const closeDenunciaBtn = document.getElementById('close-denuncia');
    const denunciaForm = document.getElementById('denuncia-form');
    const denunciaMessage = document.getElementById('denuncia-message');
    const btnSubmitDenuncia = document.getElementById('btn-submit-denuncia');
    const footerEticaLink = document.getElementById('footer-etica-link');

    function openEticaModal() {
        denunciaFormContainer.classList.add('show');
        denunciaOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeEticaModal() {
        denunciaFormContainer.classList.remove('show');
        denunciaOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (footerEticaLink) {
        footerEticaLink.addEventListener('click', (e) => {
            e.preventDefault();
            openEticaModal();
        });
    }

    if (denunciaFormContainer && closeDenunciaBtn && denunciaForm) {

        // Close when clicking X
        closeDenunciaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeEticaModal();
        });

        // Close when clicking the overlay
        if (denunciaOverlay) {
            denunciaOverlay.addEventListener('click', closeEticaModal);
        }

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeEticaModal();
        });

        // Prevent closing when clicking inside the modal
        denunciaFormContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Form Submission (AJAX Fetch mapped to n8n Webhook)
        denunciaForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Disable button
            const originalBtnText = btnSubmitDenuncia.innerText;
            btnSubmitDenuncia.innerText = "Enviando...";
            btnSubmitDenuncia.disabled = true;
            denunciaMessage.textContent = "";
            denunciaMessage.className = "form-message";

            const formData = new URLSearchParams();
            formData.append('empresa', payload.empresa);
            formData.append('nome', payload.nome);
            formData.append('cnpj', payload.cnpj);
            formData.append('relato', payload.relato);
            formData.append('data_envio', payload.data_envio);

            // n8n Webhook Target Endpoint Placeholder
            const webhookUrl = "https://site-leiria-n8n-leiria.kk7xlj.easypanel.host/webhook/denuncias-recebidas";

            try {
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    body: formData
                    // Ao não enviar headers explicitamente como application/json, 
                    // evitamos a requisição de Preflight (OPTIONS) do CORS.
                });

                if (response.ok) {
                    denunciaMessage.textContent = "Sua denúncia foi enviada com sucesso! Obrigado.";
                    denunciaMessage.classList.add("success");
                    denunciaForm.reset();
                    // Close the form after a delay
                    setTimeout(() => {
                        closeEticaModal();
                        denunciaMessage.textContent = "";
                        denunciaMessage.className = "form-message";
                    }, 4000);
                } else {
                    throw new Error('Erro na resposta do servidor.');
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                denunciaMessage.textContent = "Ocorreu um erro ao enviar. Tente novamente mais tarde.";
                denunciaMessage.classList.add("error");
            } finally {
                btnSubmitDenuncia.innerText = originalBtnText;
                btnSubmitDenuncia.disabled = false;
            }
        });
    }
});

/**
 * Global function to copy email to clipboard as a fallback for mailto
 */
window.copyEmail = function (text, element) {
    navigator.clipboard.writeText(text).then(() => {
        const feedback = element.querySelector('.copy-feedback');
        if (feedback) {
            feedback.classList.add('show');
            setTimeout(() => {
                feedback.classList.remove('show');
            }, 2000);
        }
    }).catch(err => {
        console.error('Falha ao copiar:', err);
    });
};

