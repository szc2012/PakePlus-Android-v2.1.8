// UI rendering and updates system
const UISystem = (function() {
    let healthBar = null;
    let scoreDisplay = null;
    let distanceDisplay = null;
    let teethIconsContainer = null;
    let gameOverScreen = null;
    let startScreen = null;
    let logoScreen = null;
    let playerElement = null;
    let levelDisplay = null;
    
    let teethIcons = [];
    
    function init() {
        healthBar = document.getElementById('health-bar');
        scoreDisplay = document.getElementById('score');
        distanceDisplay = document.getElementById('distance');
        teethIconsContainer = document.getElementById('teeth-icons');
        gameOverScreen = document.getElementById('game-over');
        startScreen = document.getElementById('start-screen');
        logoScreen = document.getElementById('logo-screen');
        playerElement = document.getElementById('player');
        
        if (!levelDisplay) {
            levelDisplay = document.createElement('div');
            levelDisplay.id = 'level-display';
            levelDisplay.className = 'ui-panel';
            levelDisplay.style.cssText = `
                position: absolute;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
                z-index: 200;
            `;
            const uiContainer = document.getElementById('ui-container');
            if (uiContainer) {
                uiContainer.parentNode.insertBefore(levelDisplay, uiContainer);
            }
        }
        
        initTeethIcons();
        
        return this;
    }
    
    function initTeethIcons() {
        teethIconsContainer.innerHTML = '';
        teethIcons = [];
        
        for (let i = 0; i < CONFIG.MAX_TEETH; i++) {
            const toothIcon = document.createElement('div');
            toothIcon.className = 'tooth-icon';
            toothIcon.id = `tooth-icon-${i}`;
            teethIconsContainer.appendChild(toothIcon);
            teethIcons.push(toothIcon);
        }
    }
    
    function updateHealth(health, maxHealth) {
        const healthPercent = (health / maxHealth) * 100;
        gsap.to(healthBar, {
            width: healthPercent + '%',
            duration: 0.3
        });
    }
    
    function updateTeeth(teeth, maxTeeth) {
        for (let i = 0; i < maxTeeth; i++) {
            if (teethIcons[i]) {
                if (i >= teeth) {
                    teethIcons[i].classList.add('lost');
                } else {
                    teethIcons[i].classList.remove('lost');
                }
            }
        }
    }
    
    function updateScore(score) {
        if (scoreDisplay) {
            scoreDisplay.textContent = score;
        }
    }
    
    function updateDistance(distance) {
        if (distanceDisplay) {
            distanceDisplay.textContent = Math.floor(distance);
        }
    }
    
    function updateLevel(mainLevel, subLevel, isBoss, levelName) {
        if (!levelDisplay) return;
        
        let text;
        if (isBoss) {
            text = `👹 Boss: ${levelName}`;
        } else {
            text = `关卡 ${mainLevel}-${subLevel}: ${levelName}`;
        }
        
        levelDisplay.innerHTML = `
            <div style="font-size: 14px; color: #FFD700; font-weight: bold;">
                ${text}
            </div>
        `;
    }
    
    function showLevelTransition(mainLevel, subLevel, isBoss, levelName, callback) {
        const overlay = document.createElement('div');
        overlay.id = 'level-transition';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 350;
        `;
        
        let titleText;
        if (isBoss) {
            titleText = `⚠️ Boss 关卡 ⚠️`;
        } else {
            titleText = `关卡 ${mainLevel}-${subLevel}`;
        }
        
        overlay.innerHTML = `
            <div style="text-align: center; color: white;">
                <div style="font-size: 48px; color: #FFD700; margin-bottom: 20px; text-shadow: 3px 3px 0 #FF1493;">
                    ${titleText}
                </div>
                <div style="font-size: 24px; margin-bottom: 10px;">
                    ${levelName}
                </div>
                <div style="font-size: 16px; color: #ccc;">
                    准备开始...
                </div>
            </div>
        `;
        
        document.getElementById('game-container').appendChild(overlay);
        
        gsap.fromTo(overlay, 
            { opacity: 0 },
            { 
                opacity: 1, 
                duration: 0.3,
                onComplete: () => {
                    setTimeout(() => {
                        gsap.to(overlay, {
                            opacity: 0,
                            duration: 0.5,
                            onComplete: () => {
                                overlay.remove();
                                if (callback) callback();
                            }
                        });
                    }, 1500);
                }
            }
        );
    }
    
    function showGameOver(score, distance) {
        const finalScoreElement = document.getElementById('final-score');
        const finalDistanceElement = document.getElementById('final-distance');
        
        if (finalScoreElement) {
            finalScoreElement.textContent = score;
        }
        if (finalDistanceElement) {
            finalDistanceElement.textContent = Math.floor(distance);
        }
        
        if (gameOverScreen) {
            gameOverScreen.style.display = 'flex';
        }
    }
    
    function hideGameOver() {
        if (gameOverScreen) {
            gameOverScreen.style.display = 'none';
        }
    }
    
    function hideStartScreen() {
        if (startScreen) {
            startScreen.style.display = 'none';
        }
    }
    
    function showStartScreen() {
        if (startScreen) {
            startScreen.style.display = 'flex';
        }
    }
    
    function showLevelSelectScreen() {
        const existingLevelSelect = document.getElementById('level-select-screen');
        if (existingLevelSelect) {
            existingLevelSelect.remove();
        }
        
        const saveData = SaveSystem.loadGame();
        const gameContainer = document.getElementById('game-container');
        
        const levelSelectScreen = document.createElement('div');
        levelSelectScreen.id = 'level-select-screen';
        levelSelectScreen.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 20px;
            z-index: 450;
            overflow-y: auto;
        `;
        
        const title = document.createElement('h2');
        title.textContent = '选择关卡';
        title.style.cssText = `
            color: #FFD700;
            font-size: 42px;
            margin-bottom: 30px;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.8);
        `;
        levelSelectScreen.appendChild(title);
        
        const levelsGrid = document.createElement('div');
        levelsGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            max-width: 800px;
            width: 100%;
        `;
        
        const mainLevelNames = ['第一关', '第二关', '第三关'];
        const bossNames = ['韩聪聪', '张馨', '马明诗'];
        const unlockedLevels = saveData.unlockedLevels || [{ main: 1, sub: 1, isBoss: false }];
        const bossDefeated = saveData.bossDefeated || [];
        
        const nextMain = saveData.currentMainLevel || 1;
        const nextSub = saveData.currentSubLevel || 1;
        const nextIsBoss = saveData.isBossLevel || false;
        
        let currentNextSub = nextSub;
        let currentNextIsBoss = nextIsBoss;
        let currentNextMain = nextMain;
        
        for (let main = 1; main <= 3; main++) {
            for (let sub = 1; sub <= 5; sub++) {
                const isUnlocked = unlockedLevels.some(
                    level => level.main === main && level.sub === sub && !level.isBoss
                );
                const isPassed = main < currentNextMain || (main === currentNextMain && sub < currentNextSub);
                const isNextLevel = main === currentNextMain && sub === currentNextSub && !currentNextIsBoss;
                
                const btn = createLevelButton(main, sub, false, isUnlocked, isPassed, isNextLevel);
                levelsGrid.appendChild(btn);
            }
            
            const isBossUnlocked = unlockedLevels.some(
                level => level.main === main && level.sub === 'boss' && level.isBoss
            ) || unlockedLevels.some(
                level => level.main === main && level.sub === 1 && !level.isBoss && !bossDefeated.includes(`boss-${main}`)
            ) || bossDefeated.includes(`boss-${main}`);
            
            const isBossPassed = bossDefeated.includes(`boss-${main}`);
            const canSelectBoss = main === currentNextMain && currentNextIsBoss;
            
            const bossBtn = createLevelButton(main, 'boss', true, isBossUnlocked || canSelectBoss, isBossPassed, canSelectBoss);
            bossBtn.textContent = `Boss ${bossNames[main-1]}`;
            levelsGrid.appendChild(bossBtn);
        }
        
        levelSelectScreen.appendChild(levelsGrid);
        
        const backBtn = document.createElement('button');
        backBtn.textContent = '返回';
        backBtn.style.cssText = `
            margin-top: 30px;
            padding: 12px 40px;
            font-size: 20px;
            background: linear-gradient(180deg, #666 0%, #444 100%);
            border: 3px solid #888;
            border-radius: 8px;
            cursor: pointer;
            color: #fff;
            font-weight: bold;
            transition: transform 0.2s;
        `;
        backBtn.onmouseover = () => backBtn.style.transform = 'scale(1.05)';
        backBtn.onmouseout = () => backBtn.style.transform = 'scale(1)';
        backBtn.onclick = () => levelSelectScreen.remove();
        levelSelectScreen.appendChild(backBtn);
        
        gameContainer.appendChild(levelSelectScreen);
    }
    
    function createLevelButton(main, sub, isBoss, isUnlocked, isPassed, isNext) {
        const btn = document.createElement('button');
        
        if (isBoss) {
            btn.textContent = `Boss ${['韩聪聪', '张馨', '马明诗'][main-1]}`;
        } else {
            const distances = [200, 400, 800, 1000, 1500];
            const distance = distances[sub-1] || 200;
            btn.textContent = `${main}-${sub} (${distance}m)`;
        }
        
        if (isPassed) {
            btn.textContent = '✓ ' + btn.textContent;
        }
        
        const canClick = isNext;
        
        btn.style.cssText = `
            padding: 15px 20px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 10px;
            cursor: ${canClick ? 'pointer' : 'not-allowed'};
            transition: all 0.2s;
            opacity: ${canClick ? 1 : 0.6};
            background: ${canClick ? 
                'linear-gradient(180deg, #ffd700 0%, #ffa500 100%)' : 
                'linear-gradient(180deg, #555 0%, #333 100%)'};
            border: 3px solid ${canClick ? '#fff' : '#666'};
            color: ${canClick ? '#000' : '#999'};
            box-shadow: ${canClick ? '0 4px 8px rgba(255,215,0,0.5)' : 'none'};
            pointer-events: ${canClick ? 'auto' : 'none'};
        `;
        
        if (canClick) {
            btn.onmouseover = () => btn.style.transform = 'scale(1.1)';
            btn.onmouseout = () => btn.style.transform = 'scale(1)';
            btn.onclick = () => {
                document.getElementById('level-select-screen').remove();
                GameManager.startSpecificLevel(main, sub, isBoss);
            };
        }
        
        return btn;
    }

    
    function hideLogoScreen(callback) {
        if (logoScreen) {
            gsap.to(logoScreen, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    logoScreen.style.display = 'none';
                    if (callback) callback();
                }
            });
        }
    }
    
    function setPlayerEffect(effectClass) {
        if (playerElement) {
            playerElement.classList.remove('hurt', 'choking', 'healing', 'dizzy');
            if (effectClass) {
                playerElement.classList.add(effectClass);
            }
        }
    }
    
    function showFallingTooth() {
        const gameContainer = document.getElementById('game-container');
        const fallingTooth = document.createElement('div');
        fallingTooth.className = 'falling-tooth';
        fallingTooth.style.left = (playerElement.offsetLeft + 25) + 'px';
        fallingTooth.style.top = (playerElement.offsetTop + 20) + 'px';
        gameContainer.appendChild(fallingTooth);
        
        gsap.to(fallingTooth, {
            y: 100,
            x: 50,
            rotation: 360,
            opacity: 0,
            duration: 1,
            ease: 'power1.in',
            onComplete: () => fallingTooth.remove()
        });
    }
    
    function showDizzyStars(show) {
        const dizzyStars = playerElement.querySelector('.dizzy-stars');
        if (dizzyStars) {
            dizzyStars.style.display = show ? 'block' : 'none';
        }
    }
    
    function showChokingEffect(show) {
        const chokingEffect = playerElement.querySelector('.choking-effect');
        if (chokingEffect) {
            chokingEffect.style.display = show ? 'block' : 'none';
        }
    }
    
    function showHealEffect() {
        const healEffect = playerElement.querySelector('.heal-effect');
        if (healEffect) {
            healEffect.style.display = 'block';
            
            gsap.fromTo(healEffect, 
                { y: 0, opacity: 1 },
                { y: -30, opacity: 0, duration: 1 }
            );
            
            setTimeout(() => {
                healEffect.style.display = 'none';
            }, 1000);
        }
    }
    
    function showBleedingEffect(show) {
        const bleedingEffect = playerElement.querySelector('.bleeding-effect');
        if (bleedingEffect) {
            bleedingEffect.style.display = show ? 'block' : 'none';
        }
    }
    
    function animatePlayerHurt() {
        gsap.to(playerElement, {
            x: -20,
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                gsap.set(playerElement, { x: 0 });
            }
        });
    }
    
    function animatePlayerHealing() {
        gsap.to(playerElement, {
            scale: 1.1,
            duration: 0.2,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                gsap.set(playerElement, { scale: 1 });
            }
        });
    }
    
    function animatePlayerDizzy(isDizzy) {
        if (isDizzy) {
            gsap.to(playerElement, {
                rotation: 10,
                y: 10,
                duration: 0.2,
                yoyo: true,
                repeat: -1,
                ease: 'power1.inOut'
            });
            
            gsap.to('.star', {
                rotation: 360,
                duration: 0.5,
                repeat: -1,
                ease: 'none',
                stagger: 0.1
            });
        } else {
            gsap.killTweensOf(playerElement);
            gsap.killTweensOf('.star');
            gsap.set(playerElement, { rotation: 0, y: 0 });
            gsap.set('.star', { rotation: 0 });
        }
    }
    
    function animatePlayerChoking() {
        gsap.to(playerElement, {
            x: 5,
            duration: 0.05,
            yoyo: true,
            repeat: 20
        });
    }
    
    function clearPlayerEffects() {
        gsap.killTweensOf(playerElement);
        gsap.set(playerElement, { y: 0, x: 0, rotation: 0, clearProps: 'all' });
        setPlayerEffect(null);
    }
    
    function showNotification(message, duration = 2000) {
        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: #FFD700;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            z-index: 300;
            border: 2px solid #FFD700;
        `;
        notification.textContent = message;
        
        document.getElementById('game-container').appendChild(notification);
        
        gsap.fromTo(notification,
            { opacity: 0, scale: 0.5 },
            { 
                opacity: 1, 
                scale: 1, 
                duration: 0.3,
                onComplete: () => {
                    setTimeout(() => {
                        gsap.to(notification, {
                            opacity: 0,
                            duration: 0.5,
                            onComplete: () => notification.remove()
                        });
                    }, duration);
                }
            }
        );
    }
    
    function resetAll() {
        updateHealth(CONFIG.MAX_HEALTH, CONFIG.MAX_HEALTH);
        updateTeeth(CONFIG.MAX_TEETH, CONFIG.MAX_TEETH);
        updateScore(0);
        updateDistance(0);
        clearPlayerEffects();
        hideGameOver();
        showDizzyStars(false);
        showChokingEffect(false);
        showBleedingEffect(false);
    }
    
    function cleanup() {
        if (levelDisplay) {
            levelDisplay.remove();
            levelDisplay = null;
        }
    }
    
    return {
        init,
        updateHealth,
        updateTeeth,
        updateScore,
        updateDistance,
        updateLevel,
        showLevelTransition,
        showGameOver,
        hideGameOver,
        hideStartScreen,
        showStartScreen,
        showLevelSelectScreen,
        hideLogoScreen,
        setPlayerEffect,
        showFallingTooth,
        showDizzyStars,
        showChokingEffect,
        showHealEffect,
        showBleedingEffect,
        animatePlayerHurt,
        animatePlayerHealing,
        animatePlayerDizzy,
        animatePlayerChoking,
        clearPlayerEffects,
        showNotification,
        resetAll,
        cleanup
    };
})();
