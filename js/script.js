$(document).ready(function() {

    // ========================================
    // 1. 오디오 요소 및 전역 변수 설정
    // ========================================
    const sfxBoom = $('#sfx-boom')[0];
    const bgmFight = $('#bgm-fight')[0];
    const bgmSlideshow = $('#bgm-slideshow')[0];
    const bgmQuestion = $('#bgm-question')[0];
    const sfxBomb = $('#sfx-bomb')[0];

    let lastParticleTime = 0;
    const minParticleInterval = 10;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const slideshowImages = [
        'asset/1.png', 'asset/2.png', 'asset/3.png', 'asset/4.png',
        'asset/5.png', 'asset/6.png', 'asset/7.png', 'asset/8.png'
    ];
    let currentSlide = 0;
    let slideshowTimeout;

    // ========================================
    // 2. 이벤트 리스너 (마우스, 클릭)
    // ========================================

    $(document).on('mousemove', function(e) {
        const currentTime = new Date().getTime();
        const mouseX = e.pageX;
        const mouseY = e.pageY;

        if (currentTime - lastParticleTime < minParticleInterval) {
            lastMouseX = mouseX;
            lastMouseY = mouseY;
            return;
        }
        lastParticleTime = currentTime;

        if ($('#scene-cafe').is(':visible')) {
            createHeartParticle(mouseX, mouseY);
        } else if ($('#scene-fight').is(':visible')) {
            createChainsawScratch(mouseX, mouseY);
        }

        lastMouseX = mouseX;
        lastMouseY = mouseY;
    });

    $(document).on('click', function(e) {
        if ($('#scene-fight').is(':visible')) {
            createBombExplosion(e.pageX, e.pageY);
            triggerExplosionShock();
        }
    });

    $('#start-boom').on('click', function() {
        startSlideshowScene();
    });

    // ========================================
    // 3. 장면 전환 및 효과 함수
    // ========================================

    $('.title-overlay').addClass('visible');

    function createHeartParticle(x, y) {
        const particle = $('<div class="heart-particle"></div>');
        particle.css({ top: y + 'px', left: x + 'px' });
        $('#particle-container').append(particle);

        setTimeout(function() {
            const moveX = (Math.random() - 0.5) * 100;
            const moveY = (Math.random() - 0.5) * 100;
            const rotate = Math.random() * 360;
            particle.css({
                'transform': `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`,
                'opacity': 0
            });
            setTimeout(function() { particle.remove(); }, 1000);
        }, Math.random() * 150);
    }

    function createChainsawScratch(x, y) {
        const distance = Math.hypot(x - lastMouseX, y - lastMouseY);

        if (distance > 10) {
            const scratch = $('<div class="chainsaw-scratch"></div>');
            const width = distance * 2;
            const angle = Math.atan2(y - lastMouseY, x - lastMouseX);

            scratch.css({
                'top': y + 'px',
                'left': x + 'px',
                'width': width + 'px',
                'transform': `rotate(${angle}rad)`
            });
            $('#effect-container').append(scratch);

            setTimeout(function() {
                scratch.css('opacity', 0);
                setTimeout(function() { scratch.remove(); }, 1000);
            }, 10);
        }
    }

    function createBombExplosion(x, y) {
        const bombEffect = $('<div class="bomb-explosion-effect"></div>');
        bombEffect.css({ top: y + 'px', left: x + 'px' });
        $('#effect-container').append(bombEffect);
        try { sfxBomb.play(); } catch (error) {}
        setTimeout(function() { bombEffect.remove(); }, 500);
    }

    function triggerExplosionShock() {
        $('body').addClass('explosion-shock');
        setTimeout(function() {
            $('body').removeClass('explosion-shock');
        }, 300);
    }

    function startSlideshowScene() {
        $('body').addClass('cinematic');
        $('#start-boom').prop('disabled', true);
        $('.title-overlay').removeClass('visible');

        $('#scene-cafe').fadeOut(500, function() {
            $('#scene-slideshow').fadeIn(500);
            try { bgmSlideshow.play(); } catch (e) {}
            showNextSlide();
        });
    }

    function showNextSlide() {
        if (currentSlide < slideshowImages.length) {
            $('#slideshow-img').attr('src', slideshowImages[currentSlide]);
            setTimeout(function() { $('#slideshow-img').css('opacity', 1); }, 50);

            slideshowTimeout = setTimeout(function() {
                $('#slideshow-img').css('opacity', 0);
                setTimeout(function() {
                    currentSlide++;
                    showNextSlide();
                }, 1000);
            }, 1125 + 50);
        } else {
            startQuestionScene();
        }
    }

    function startQuestionScene() {
        clearTimeout(slideshowTimeout);
        $('#scene-slideshow').fadeOut();
        try { bgmSlideshow.pause(); bgmSlideshow.currentTime = 0; } catch (e) {}

        $('#scene-question').fadeIn();
        try { bgmQuestion.play(); } catch (e) {}

        $('#denji-text').css('opacity', 1).addClass('glitch-active');
        setTimeout(function() {
            $('#denji-text').css('opacity', 0).removeClass('glitch-active');
            $('#question-text').css('opacity', 1).addClass('glitch-active');
        }, 1500);

        setTimeout(function() {
            $('#question-text').css('opacity', 0).removeClass('glitch-active');
            try { bgmQuestion.pause(); } catch (e) {}
            $('#scene-question').fadeOut(0, function() {
                triggerExplosion();
            });
        }, 6000);
    }

    function triggerExplosion() {
        $('#scene-explosion').show().addClass('is-exploding').addClass('is-shaking');
        $('#scene-explosion').css({
            'background-image': 'url(asset/9.png)',
            'background-size': 'cover'
        });
        try { sfxBoom.play(); } catch (e) {}

        setTimeout(function() {
            $('#scene-explosion').removeClass('is-shaking');
            $('#scene-explosion').fadeOut(0, function() {
                $('#scene-fight').fadeIn();
                try { bgmFight.play(); } catch (e) {}
            });
        }, 4000);
    }
});