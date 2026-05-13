// 障碍物生成和碰撞检测系统
const ObstacleSystem = (function() {
    let obstacles = [];
    let lastObstacleTime = 0;
    let obstacleInterval = CONFIG.OBSTACLE_BASE_INTERVAL;
    let currentGameSpeed = CONFIG.INITIAL_GAME_SPEED;
    let obstacleWeights = { ...CONFIG.OBSTACLE_WEIGHTS };
    let obstaclesContainer = null;
    let onCollision = null;
    let onObstacleCreated = null;
    
    function init(callbacks) {
        obstacles = [];
        lastObstacleTime = Date.now();
        obstacleInterval = CONFIG.OBSTACLE_BASE_INTERVAL;
        currentGameSpeed = CONFIG.INITIAL_GAME_SPEED;
        obstacleWeights = { ...CONFIG.OBSTACLE_WEIGHTS };
        
        obstaclesContainer = document.getElementById('obstacles');
        if (!obstaclesContainer) {
            obstaclesContainer = document.createElement('div');
            obstaclesContainer.id = 'obstacles';
            document.getElementById('game-container').appendChild(obstaclesContainer);
        }
        
        onCollision = callbacks.onCollision || function() {};
        onObstacleCreated = callbacks.onObstacleCreated || function() {};
        
        return this;
    }
    
    function setConfig(speed, interval, weights) {
        if (speed !== undefined) {
            currentGameSpeed = speed;
        }
        if (interval !== undefined) {
            obstacleInterval = interval;
        }
        if (weights !== undefined) {
            obstacleWeights = { ...weights };
        }
    }
    
    function getWeightedObstacleType(healthPercent) {
        let weights = {};
        
        for (let key in CONFIG.OBSTACLE_WEIGHTS) {
            weights[key] = CONFIG.OBSTACLE_WEIGHTS[key];
        }
        
        if (obstacleWeights) {
            weights = { ...obstacleWeights };
        }
        
        if (healthPercent !== undefined && healthPercent !== null) {
            if (healthPercent <= 0.2) {
                weights['wang-jiuxiao'] = 40;
                weights['bandage'] = 40;
                weights['knife'] = 3;
                weights['candy'] = 3;
            } else if (healthPercent <= 0.4) {
                weights['wang-jiuxiao'] = 25;
                weights['bandage'] = 25;
                weights['knife'] = 10;
                weights['candy'] = 10;
            } else {
                weights['wang-jiuxiao'] = 15;
                weights['bandage'] = 15;
                weights['knife'] = 30;
                weights['candy'] = 30;
            }
        }
        
        const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
        let random = Math.random() * totalWeight;
        
        for (const type in weights) {
            random -= weights[type];
            if (random <= 0) {
                return CONFIG.OBSTACLE_TYPES.find(o => o.type === type);
            }
        }
        
        return CONFIG.OBSTACLE_TYPES[0];
    }
    
    function createObstacle() {
        const healthPercent = typeof getGameState === 'function' ? 
            getGameState().health / CONFIG.MAX_HEALTH : 1;
        
        const obstacleType = getWeightedObstacleType(healthPercent);
        
        const obstacle = document.createElement('div');
        obstacle.className = `obstacle ${obstacleType.class}`;
        obstacle.dataset.type = obstacleType.type;
        obstacle.style.left = window.innerWidth + 'px';
        
        if (obstacleType.type === 'wang-jiuxiao') {
            obstacle.innerHTML = `
                <div class="wjx-name">王九骁</div>
                <div class="wjx-body">
                    <div class="wjx-eye left"></div>
                    <div class="wjx-eye right"></div>
                    <div class="wjx-mouth"></div>
                </div>
                <div class="wjx-legs">
                    <div class="wjx-leg"></div>
                    <div class="wjx-leg"></div>
                </div>
            `;
        }
        
        obstaclesContainer.appendChild(obstacle);
        
        const obstacleData = {
            element: obstacle,
            type: obstacleType.type,
            width: obstacleType.width,
            height: obstacleType.height,
            hit: false
        };
        
        obstacles.push(obstacleData);
        
        const speedMultiplier = obstacleType.type === 'wang-jiuxiao' ? 0.5 : 1;
        gsap.to(obstacle, {
            left: -150,
            duration: (window.innerWidth + 150) / (currentGameSpeed * 100 * speedMultiplier),
            ease: 'none',
            onComplete: () => {
                obstacle.remove();
                obstacles = obstacles.filter(o => o !== obstacleData);
            }
        });
        
        if (obstacleType.type === 'wang-jiuxiao') {
            gsap.to(obstacle.querySelectorAll('.wjx-leg'), {
                y: -3,
                duration: 0.15,
                yoyo: true,
                repeat: -1,
                stagger: 0.075
            });
        }
        
        if (onObstacleCreated) {
            onObstacleCreated(obstacleData);
        }
        
        return obstacleData;
    }
    
    function spawnIfNeeded() {
        const now = Date.now();
        if (now - lastObstacleTime > obstacleInterval) {
            createObstacle();
            lastObstacleTime = now;
            obstacleInterval = CONFIG.MIN_OBSTACLE_INTERVAL + 
                Math.random() * (CONFIG.MAX_OBSTACLE_INTERVAL - CONFIG.MIN_OBSTACLE_INTERVAL);
        }
    }
    
    function checkCollision(playerElement) {
        const playerRect = playerElement.getBoundingClientRect();
        const padding = CONFIG.PLAYER_HITBOX_PADDING;
        const playerHitbox = {
            left: playerRect.left + padding,
            right: playerRect.right - padding,
            top: playerRect.top + padding,
            bottom: playerRect.bottom - padding
        };
        
        const hitObstacles = [];
        
        obstacles.forEach(obstacle => {
            if (obstacle.hit) return;
            
            const obstacleRect = obstacle.element.getBoundingClientRect();
            
            if (playerHitbox.left < obstacleRect.right &&
                playerHitbox.right > obstacleRect.left &&
                playerHitbox.top < obstacleRect.bottom &&
                playerHitbox.bottom > obstacleRect.top) {
                
                obstacle.hit = true;
                hitObstacles.push(obstacle);
            }
        });
        
        return hitObstacles;
    }
    
    function handleCollisions(hitObstacles) {
        hitObstacles.forEach(obstacle => {
            if (onCollision) {
                onCollision(obstacle.type, obstacle.element);
            }
            
            gsap.to(obstacle.element, {
                opacity: 0,
                scale: 0,
                duration: 0.3,
                onComplete: () => {
                    obstacle.element.remove();
                    obstacles = obstacles.filter(o => o !== obstacle);
                }
            });
        });
    }
    
    function updateAndCheckCollisions(playerElement) {
        spawnIfNeeded();
        
        const hitObstacles = checkCollision(playerElement);
        
        if (hitObstacles.length > 0) {
            handleCollisions(hitObstacles);
        }
    }
    
    function clearAll() {
        obstacles.forEach(obstacle => {
            if (obstacle.element) {
                gsap.killTweensOf(obstacle.element);
                obstacle.element.remove();
            }
        });
        obstacles = [];
        lastObstacleTime = Date.now();
    }
    
    function getObstacles() {
        return obstacles;
    }
    
    function getObstacleCount() {
        return obstacles.length;
    }
    
    function cleanup() {
        clearAll();
        onCollision = null;
        onObstacleCreated = null;
    }
    
    return {
        init,
        setConfig,
        createObstacle,
        spawnIfNeeded,
        checkCollision,
        handleCollisions,
        updateAndCheckCollisions,
        clearAll,
        getObstacles,
        getObstacleCount,
        cleanup
    };
})();
