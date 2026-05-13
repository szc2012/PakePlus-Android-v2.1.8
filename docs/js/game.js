// Main game loop and state management
const GameManager = (function() {
    let gameState = {
        isRunning: false,
        isPaused: false,
        health: CONFIG.MAX_HEALTH,
        maxHealth: CONFIG.MAX_HEALTH,
        teeth: CONFIG.MAX_TEETH,
        maxTeeth: CONFIG.MAX_TEETH,
        score: 0,
        distance: 0,
        isJumping: false,
        isChoking: false,
        isDizzy: false,
        isBleeding: false,
        chokingDamageInterval: null,
        chokingTimeout: null,
        bleedingDamageInterval: null,
        gameSpeed: CONFIG.INITIAL_GAME_SPEED,
        lastObstacleTime: 0,
        obstacleInterval: CONFIG.OBSTACLE_BASE_INTERVAL,
        currentMainLevel: 1,
        currentSubLevel: 1,
        isBossLevel: false,
        levelProgress: 0,
        targetDistance: 1000
    };
    
    let playerElement = null;
    let bgMusic = null;
    let gameLoopId = null;
    let currentLevelConfig = null;
    
    // Load save data
    const saveData = SaveSystem.loadGame();
    if (saveData) {
        gameState.currentMainLevel = saveData.currentMainLevel || 1;
        gameState.currentSubLevel = saveData.currentSubLevel || 1;
    }
    
    function init() {
        playerElement = document.getElementById('player');
        
        UISystem.init();
        ObstacleSystem.init({
            onCollision: handleCollision,
            onObstacleCreated: onObstacleCreated
        });
        
        setupEventListeners();
        
        UISystem.hideLogoScreen(() => {
            UISystem.showStartScreen();
        });
        
        return this;
    }
    
    function setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                jump();
            }
        });
        
        document.addEventListener('touchstart', (e) => {
            if (gameState.isRunning) {
                e.preventDefault();
                jump();
            }
        });
        
        window.restartGame = function() {
            restartGame();
        };
        
        window.startGame = function() {
            startGame();
        };
    }
    
    function getGameState() {
        return gameState;
    }
    
    function jump() {
        if (gameState.isJumping || gameState.isDizzy || !gameState.isRunning) return;
        
        gameState.isJumping = true;
        
        gsap.to(playerElement, {
            y: -CONFIG.JUMP_HEIGHT,
            duration: CONFIG.JUMP_DURATION_UP,
            ease: 'power2.out',
            onComplete: () => {
                gsap.to(playerElement, {
                    y: 0,
                    duration: CONFIG.JUMP_DURATION_DOWN,
                    ease: 'power2.in',
                    onComplete: () => {
                        gameState.isJumping = false;
                    }
                });
            }
        });
    }
    
    function startBackgroundScroll() {
        const bgLayer = document.getElementById('bg-layer');
        const ground = document.getElementById('ground');
        
        gsap.to(bgLayer, {
            x: '-50%',
            duration: CONFIG.BACKGROUND_SCROLL_DURATION,
            ease: 'none',
            repeat: -1
        });
        
        gsap.to(ground, {
            x: '-50%',
            duration: CONFIG.GROUND_SCROLL_DURATION,
            ease: 'none',
            repeat: -1
        });
    }
    
    function playBackgroundMusic() {
        if (!bgMusic) {
            bgMusic = new Audio('back.mp3');
            bgMusic.loop = true;
            bgMusic.volume = 0.5;
        }
        bgMusic.play().catch(e => console.log('Audio playback requires user interaction'));
    }
    
    function stopBackgroundMusic() {
        if (bgMusic) {
            bgMusic.pause();
            bgMusic.currentTime = 0;
        }
    }
    
    function loadLevel(mainLevel, subLevel, isBoss) {
        gameState.currentMainLevel = mainLevel;
        gameState.currentSubLevel = subLevel;
        gameState.isBossLevel = isBoss;
        
        const levelConfig = getLevel(mainLevel, subLevel, isBoss ? 'boss' : undefined);
        currentLevelConfig = levelConfig;
        
        gameState.gameSpeed = levelConfig.gameSpeed || levelConfig.speed || CONFIG.INITIAL_GAME_SPEED;
        gameState.targetDistance = levelConfig.targetDistance || 1000;
        gameState.distance = 0;
        gameState.levelProgress = 0;
        
        if (!isBoss) {
            ObstacleSystem.setConfig(
                levelConfig.gameSpeed,
                levelConfig.obstacleInterval,
                levelConfig.obstacleWeights
            );
        }
        
        const theme = LEVELS[mainLevel].theme;
        if (theme) {
            document.body.style.background = theme.background;
        }
        
        UISystem.updateLevel(mainLevel, subLevel, isBoss, levelConfig.name);
        
        return levelConfig;
    }
    
    function startLevelTransition(mainLevel, subLevel, isBoss, callback) {
        const levelConfig = getLevel(mainLevel, subLevel, isBoss ? 'boss' : undefined);
        
        UISystem.showLevelTransition(mainLevel, subLevel, isBoss, levelConfig.name, () => {
            if (callback) callback();
        });
    }
    
    function startGame() {
        UISystem.hideStartScreen();
        playBackgroundMusic();
        
        resetGameState();
        UISystem.resetAll();
        startBackgroundScroll();
        
        startLevelTransition(
            gameState.currentMainLevel,
            gameState.currentSubLevel,
            gameState.isBossLevel,
            () => {
                if (gameState.isBossLevel) {
                    startBossBattle();
                } else {
                    gameState.isRunning = true;
                    gameState.lastObstacleTime = Date.now();
                    gameLoop();
                }
            }
        );
    }
    
    function startSpecificLevel(main, sub, isBoss) {
        UISystem.hideStartScreen();
        playBackgroundMusic();
        
        resetGameState();
        UISystem.resetAll();
        startBackgroundScroll();
        
        loadLevel(main, sub, isBoss);
        
        startLevelTransition(main, sub, isBoss, () => {
            if (isBoss) {
                startBossBattle();
            } else {
                gameState.isRunning = true;
                gameState.lastObstacleTime = Date.now();
                gameLoop();
            }
        });
    }
    
    function startBossBattle() {
        const levelConfig = currentLevelConfig;
        
        ObstacleSystem.clearAll();
        
        BossSystem.init(levelConfig, {
            onBossDefeated: (boss) => {
                handleBossDefeated(boss);
            },
            onBossAttack: (attackType) => {
                // Boss attack notification
            },
            onPlayerDamaged: (attackType) => {
                handleBossAttackDamage(attackType);
            }
        });
        
        gameState.isRunning = true;
        gameLoop();
    }
    
    function handleBossDefeated(boss) {
        gameState.isRunning = false;
        stopBackgroundMusic();
        
        const rewards = boss.rewards;
        gameState.health = Math.min(CONFIG.MAX_HEALTH, gameState.health + rewards.health);
        gameState.teeth = Math.min(CONFIG.MAX_TEETH, gameState.teeth + rewards.teeth);
        gameState.score += rewards.score;
        
        UISystem.updateHealth(gameState.health, CONFIG.MAX_HEALTH);
        UISystem.updateTeeth(gameState.teeth, CONFIG.MAX_TEETH);
        UISystem.updateScore(gameState.score);
        
        UISystem.showNotification(`Boss defeated! +${rewards.score} points`);
        
        const nextLevel = getNextLevel(gameState.currentMainLevel, gameState.currentSubLevel);
        
        const unlockedLevel = nextLevel ? {
            main: nextLevel.main,
            sub: typeof nextLevel.sub === 'number' ? nextLevel.sub : 1,
            isBoss: nextLevel.sub === 'boss'
        } : null;
        
        SaveSystem.updateProgress({
            bossDefeated: boss.id,
            highestScore: gameState.score,
            totalDistance: gameState.distance,
            totalPlayTime: Date.now(),
            currentMainLevel: nextLevel ? nextLevel.main : gameState.currentMainLevel,
            currentSubLevel: nextLevel ? (typeof nextLevel.sub === 'number' ? nextLevel.sub : 1) : gameState.currentSubLevel,
            isBossLevel: nextLevel ? (nextLevel.sub === 'boss') : true,
            unlockedLevel: unlockedLevel
        });
        
        setTimeout(() => {
            startNextLevel();
        }, 3000);
    }
    
    function handleBossAttackDamage(attackType) {
        switch (attackType) {
            case 'tennis-net':
                hitByNet();
                break;
            case 'candy':
                hitByCandy();
                break;
            case 'wang-jiuxiao':
                hitByWangJiuxiao();
                break;
            case 'ball':
                hitByBall();
                break;
            case 'knife':
                hitByKnife();
                break;
            case 'bandage':
                hitByBandage();
                break;
            case 'bullet':
                hitByBullet();
                break;
        }
    }
    
    function resetGameState() {
        gameState.isRunning = false;
        gameState.isPaused = false;
        gameState.health = CONFIG.MAX_HEALTH;
        gameState.teeth = CONFIG.MAX_TEETH;
        gameState.score = 0;
        gameState.distance = 0;
        gameState.isJumping = false;
        gameState.isChoking = false;
        gameState.isDizzy = false;
        gameState.isBleeding = false;
        
        clearTimers();
    }
    
    function clearTimers() {
        if (gameState.chokingDamageInterval) {
            clearInterval(gameState.chokingDamageInterval);
            gameState.chokingDamageInterval = null;
        }
        if (gameState.chokingTimeout) {
            clearTimeout(gameState.chokingTimeout);
            gameState.chokingTimeout = null;
        }
        if (gameState.bleedingDamageInterval) {
            clearInterval(gameState.bleedingDamageInterval);
            gameState.bleedingDamageInterval = null;
        }
    }
    
    function gameLoop() {
        if (!gameState.isRunning) return;
        
        gameState.distance += gameState.gameSpeed * 0.05;
        gameState.score = Math.floor(gameState.distance * 10);
        
        UISystem.updateScore(gameState.score);
        UISystem.updateDistance(gameState.distance);
        
        if (!gameState.isBossLevel) {
            ObstacleSystem.updateAndCheckCollisions(playerElement);
            
            if (gameState.distance >= gameState.targetDistance) {
                completeLevel();
                return;
            }
        } else {
            BossSystem.checkProjectileCollision(playerElement);
        }
        
        gameLoopId = requestAnimationFrame(gameLoop);
    }
    
    function completeLevel() {
        gameState.isRunning = false;
        
        const nextLevel = getNextLevel(gameState.currentMainLevel, gameState.currentSubLevel);
        
        const unlockedLevel = nextLevel ? {
            main: nextLevel.main,
            sub: typeof nextLevel.sub === 'number' ? nextLevel.sub : 1,
            isBoss: nextLevel.sub === 'boss'
        } : null;
        
        const saveData = {
            highestScore: gameState.score,
            totalDistance: gameState.distance,
            totalPlayTime: Date.now(),
            currentMainLevel: nextLevel ? nextLevel.main : gameState.currentMainLevel,
            currentSubLevel: nextLevel ? (typeof nextLevel.sub === 'number' ? nextLevel.sub : 1) : gameState.currentSubLevel,
            isBossLevel: nextLevel ? (nextLevel.sub === 'boss') : true,
            unlockedLevel: unlockedLevel
        };
        
        SaveSystem.updateProgress(saveData);
        UISystem.showNotification('Level Complete!', 2000);
        
        setTimeout(() => {
            startNextLevel();
        }, 2500);
    }
    
    function startNextLevel() {
        const nextLevel = getNextLevel(gameState.currentMainLevel, gameState.currentSubLevel);
        
        if (!nextLevel) {
            // Game completed!
            endGame();
            UISystem.showNotification('Congratulations! You completed all levels!', 5000);
            return;
        }
        
        gameState.currentMainLevel = nextLevel.main;
        gameState.currentSubLevel = nextLevel.sub;
        gameState.isBossLevel = nextLevel.sub === 'boss';
        
        resetGameState();
        UISystem.resetAll();
        ObstacleSystem.clearAll();
        BossSystem.cleanup();
        UISystem.clearPlayerEffects();
        
        if (!gameState.isBossLevel) {
            startBackgroundScroll();
        }
        
        startLevelTransition(
            gameState.currentMainLevel,
            gameState.currentSubLevel,
            gameState.isBossLevel,
            () => {
                if (gameState.isBossLevel) {
                    startBossBattle();
                } else {
                    gameState.isRunning = true;
                    gameState.lastObstacleTime = Date.now();
                    gameLoop();
                }
            }
        );
    }
    
    function handleCollision(type, element) {
        switch (type) {
            case 'tennis-net':
                hitByNet();
                break;
            case 'candy':
                hitByCandy();
                break;
            case 'wang-jiuxiao':
                hitByWangJiuxiao();
                break;
            case 'ball':
                hitByBall();
                break;
            case 'knife':
                hitByKnife();
                break;
            case 'bandage':
                hitByBandage();
                break;
        }
    }
    
    function onObstacleCreated(obstacle) {
        // Callback for obstacle creation
    }
    
    function hitByNet() {
        if (gameState.teeth > 0) {
            gameState.teeth--;
            UISystem.updateTeeth(gameState.teeth, CONFIG.MAX_TEETH);
            UISystem.showFallingTooth();
        }
        
        gameState.health -= CONFIG.NET_DAMAGE;
        UISystem.updateHealth(gameState.health, CONFIG.MAX_HEALTH);
        
        UISystem.setPlayerEffect('hurt');
        UISystem.animatePlayerHurt();
        
        setTimeout(() => {
            UISystem.setPlayerEffect(null);
        }, 500);
        
        checkGameOver();
    }
    
    function hitByCandy() {
        if (gameState.isChoking) return;
        
        gameState.isChoking = true;
        UISystem.setPlayerEffect('choking');
        UISystem.showChokingEffect(true);
        UISystem.animatePlayerChoking();
        
        gameState.chokingDamageInterval = setInterval(() => {
            if (!gameState.isRunning) return;
            gameState.health -= 1;
            UISystem.updateHealth(gameState.health, CONFIG.MAX_HEALTH);
            checkGameOver();
        }, CONFIG.CHOKING_DAMAGE_INTERVAL);
    }
    
    function hitByWangJiuxiao() {
        if (gameState.chokingDamageInterval) {
            clearInterval(gameState.chokingDamageInterval);
            gameState.chokingDamageInterval = null;
        }
        if (gameState.chokingTimeout) {
            clearTimeout(gameState.chokingTimeout);
            gameState.chokingTimeout = null;
        }
        
        gameState.isChoking = false;
        UISystem.setPlayerEffect(null);
        UISystem.showChokingEffect(false);
        UISystem.clearPlayerEffects();
        
        gameState.health = Math.min(CONFIG.MAX_HEALTH, gameState.health + CONFIG.WANG_HEAL_AMOUNT);
        UISystem.updateHealth(gameState.health, CONFIG.MAX_HEALTH);
        
        UISystem.setPlayerEffect('healing');
        UISystem.showHealEffect();
        UISystem.animatePlayerHealing();
        
        setTimeout(() => {
            UISystem.setPlayerEffect(null);
        }, 1000);
    }
    
    function hitByBall() {
        if (gameState.isDizzy) return;
        
        gameState.isDizzy = true;
        UISystem.setPlayerEffect('dizzy');
        UISystem.showDizzyStars(true);
        UISystem.animatePlayerDizzy(true);
        
        setTimeout(() => {
            gameState.isDizzy = false;
            UISystem.setPlayerEffect(null);
            UISystem.showDizzyStars(false);
            UISystem.animatePlayerDizzy(false);
        }, CONFIG.DIZZY_DURATION);
    }
    
    function hitByKnife() {
        if (gameState.isBleeding) return;
        
        gameState.isBleeding = true;
        UISystem.setPlayerEffect('hurt');
        UISystem.showBleedingEffect(true);
        
        gameState.bleedingDamageInterval = setInterval(() => {
            if (!gameState.isRunning) return;
            gameState.health -= 1;
            UISystem.updateHealth(gameState.health, CONFIG.MAX_HEALTH);
            checkGameOver();
        }, CONFIG.BLEEDING_DAMAGE_INTERVAL);
    }
    
    function hitByBandage() {
        if (gameState.bleedingDamageInterval) {
            clearInterval(gameState.bleedingDamageInterval);
            gameState.bleedingDamageInterval = null;
        }
        
        gameState.isBleeding = false;
        UISystem.setPlayerEffect(null);
        UISystem.showBleedingEffect(false);
        
        gameState.health = Math.min(CONFIG.MAX_HEALTH, gameState.health + CONFIG.BANDAGE_HEAL_AMOUNT);
        UISystem.updateHealth(gameState.health, CONFIG.MAX_HEALTH);
        
        UISystem.setPlayerEffect('healing');
        UISystem.showHealEffect();
        UISystem.animatePlayerHealing();
        
        setTimeout(() => {
            UISystem.setPlayerEffect(null);
        }, 1000);
    }
    
    function hitByBullet() {
        gameState.health -= CONFIG.BULLET_DAMAGE;
        UISystem.updateHealth(gameState.health, CONFIG.MAX_HEALTH);
        
        UISystem.setPlayerEffect('hurt');
        UISystem.animatePlayerHurt();
        
        setTimeout(() => {
            UISystem.setPlayerEffect(null);
        }, 500);
        
        checkGameOver();
    }
    
    function checkGameOver() {
        if (gameState.health <= 0 || gameState.teeth <= 0) {
            endGame();
        }
    }
    
    function endGame() {
        gameState.isRunning = false;
        stopBackgroundMusic();
        
        clearTimers();
        
        UISystem.showGameOver(gameState.score, gameState.distance);
        
        gsap.killTweensOf('*');
        
        SaveSystem.updateProgress({
            highestScore: gameState.score,
            totalDistance: gameState.distance,
            totalPlayTime: Date.now(),
            currentMainLevel: gameState.currentMainLevel,
            currentSubLevel: gameState.currentSubLevel,
            isBossLevel: gameState.isBossLevel
        });
    }
    
    function restartGame() {
        UISystem.hideGameOver();
        
        clearTimers();
        
        gameState.isChoking = false;
        gameState.isDizzy = false;
        gameState.isBleeding = false;
        gameState.isJumping = false;
        
        gsap.killTweensOf('*');
        UISystem.clearPlayerEffects();
        
        ObstacleSystem.clearAll();
        BossSystem.cleanup();
        
        startGame();
    }
    
    function createClouds() {
        const cloudsContainer = document.getElementById('clouds');
        for (let i = 0; i < 5; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.left = (Math.random() * 100) + '%';
            cloud.style.top = (50 + Math.random() * 100) + 'px';
            cloudsContainer.appendChild(cloud);
        }
    }
    
    function cleanup() {
        gameState.isRunning = false;
        stopBackgroundMusic();
        clearTimers();
        gsap.killTweensOf('*');
        ObstacleSystem.cleanup();
        BossSystem.cleanup();
        UISystem.cleanup();
    }
    
    return {
        init,
        startGame,
        startSpecificLevel,
        restartGame,
        endGame,
        jump,
        getGameState
    };
})();

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    GameManager.init();
    GameManager.createClouds();
});
