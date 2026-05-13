// Boss战斗系统
const BossSystem = (function() {
    let currentBoss = null;
    let bossElement = null;
    let healthBar = null;
    let attackInterval = null;
    let projectiles = [];
    let isFighting = false;
    let onBossDefeated = null;
    let onBossAttack = null;
    let onPlayerDamaged = null;
    
    function init(bossConfig, callbacks) {
        currentBoss = {
            ...bossConfig,
            currentHp: bossConfig.hp,
            maxHp: bossConfig.hp,
            attackPattern: bossConfig.attackPattern || 'mixed',
            attackInterval: bossConfig.attackInterval || 2000
        };
        
        isFighting = true;
        onBossDefeated = callbacks.onBossDefeated || function() {};
        onBossAttack = callbacks.onBossAttack || function() {};
        onPlayerDamaged = callbacks.onPlayerDamaged || function() {};
        
        createBossUI();
        startBossAttacks();
        
        return currentBoss;
    }
    
    function createBossUI() {
        const container = document.getElementById('game-container');
        
        // Boss血条
        healthBar = document.createElement('div');
        healthBar.id = 'boss-health-bar';
        healthBar.style.cssText = `
            position: absolute;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            background: rgba(0,0,0,0.7);
            padding: 10px;
            border-radius: 10px;
            border: 2px solid #FFD700;
            z-index: 250;
        `;
        healthBar.innerHTML = `
            <div style="color: #FFD700; font-size: 14px; margin-bottom: 5px; text-align: center;">
                ${currentBoss.name} - ❤️ <span id="boss-hp-text">${currentBoss.hp}</span>
            </div>
            <div style="width: 100%; height: 20px; background: #333; border-radius: 10px; overflow: hidden;">
                <div id="boss-hp-fill" style="width: 100%; height: 100%; background: linear-gradient(90deg, #FF0000, #FF6B6B); transition: width 0.3s;"></div>
            </div>
        `;
        container.appendChild(healthBar);
        
        // Boss角色
        bossElement = document.createElement('div');
        bossElement.id = 'boss';
        bossElement.style.cssText = `
            position: absolute;
            right: 100px;
            bottom: 80px;
            width: 100px;
            height: 120px;
            z-index: 150;
        `;
        
        bossElement.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #FF0000 0%, #8B0000 100%);
                border: 3px solid #FFD700;
                border-radius: 10px;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            ">
                <div style="font-size: 12px; color: #FFD700; font-weight: bold; margin-bottom: 5px;">
                    ${currentBoss.name}
                </div>
                <div style="font-size: 40px;">👹</div>
            </div>
        `;
        
        container.appendChild(bossElement);
    }
    
    function startBossAttacks() {
        if (attackInterval) {
            clearInterval(attackInterval);
        }
        
        attackInterval = setInterval(() => {
            if (!isFighting || !currentBoss) return;
            
            performAttack();
        }, currentBoss.attackInterval);
    }
    
    function performAttack() {
        const pattern = currentBoss.attackPattern;
        let attackType;
        
        switch (pattern) {
            case 'net':
                attackType = 'tennis-net';
                break;
            case 'knife':
                attackType = 'knife';
                break;
            case 'mixed':
                const types = ['tennis-net', 'candy', 'ball', 'knife'];
                attackType = types[Math.floor(Math.random() * types.length)];
                break;
            default:
                attackType = 'tennis-net';
        }
        
        shootProjectile(attackType);
        
        if (onBossAttack) {
            onBossAttack(attackType);
        }
    }
    
    function shootProjectile(type) {
        const container = document.getElementById('game-container');
        const projectile = document.createElement('div');
        projectile.className = `obstacle ${type}`;
        projectile.style.left = (window.innerWidth - 200) + 'px';
        projectile.style.bottom = (80 + Math.random() * 150) + 'px';
        
        projectile.innerHTML = `<div style="font-size: 30px;">💥</div>`;
        
        container.appendChild(projectile);
        
        const projectileData = {
            element: projectile,
            type: type,
            width: 30,
            height: 30,
            hit: false
        };
        
        projectiles.push(projectileData);
        
        // 向玩家移动
        gsap.to(projectile, {
            left: 100,
            duration: 2,
            ease: 'none',
            onComplete: () => {
                projectile.remove();
                projectiles = projectiles.filter(p => p !== projectileData);
            }
        });
    }
    
    function checkProjectileCollision(playerElement) {
        const playerRect = playerElement.getBoundingClientRect();
        const padding = CONFIG.PLAYER_HITBOX_PADDING;
        const playerHitbox = {
            left: playerRect.left + padding,
            right: playerRect.right - padding,
            top: playerRect.top + padding,
            bottom: playerRect.bottom - padding
        };
        
        projectiles.forEach(proj => {
            if (proj.hit) return;
            
            const projRect = proj.element.getBoundingClientRect();
            
            if (playerHitbox.left < projRect.right &&
                playerHitbox.right > projRect.left &&
                playerHitbox.top < projRect.bottom &&
                playerHitbox.bottom > projRect.top) {
                
                proj.hit = true;
                handleProjectileHit(proj);
            }
        });
    }
    
    function handleProjectileHit(projectile) {
        if (onPlayerDamaged) {
            onPlayerDamaged(projectile.type);
        }
        
        gsap.to(projectile.element, {
            opacity: 0,
            scale: 0,
            duration: 0.3,
            onComplete: () => projectile.element.remove()
        });
    }
    
    function damageBoss(amount) {
        if (!currentBoss || !isFighting) return;
        
        currentBoss.currentHp = Math.max(0, currentBoss.currentHp - amount);
        
        if (healthBar) {
            const hpText = document.getElementById('boss-hp-text');
            const hpFill = document.getElementById('boss-hp-fill');
            
            if (hpText) {
                hpText.textContent = currentBoss.currentHp;
            }
            
            if (hpFill) {
                const percent = (currentBoss.currentHp / currentBoss.maxHp) * 100;
                hpFill.style.width = percent + '%';
            }
        }
        
        // Boss受伤动画
        if (bossElement) {
            gsap.to(bossElement, {
                x: -10,
                duration: 0.1,
                yoyo: true,
                repeat: 2
            });
        }
        
        if (currentBoss.currentHp <= 0) {
            defeatBoss();
        }
    }
    
    function defeatBoss() {
        isFighting = false;
        
        if (attackInterval) {
            clearInterval(attackInterval);
            attackInterval = null;
        }
        
        // Boss死亡动画
        if (bossElement) {
            gsap.to(bossElement, {
                opacity: 0,
                scale: 0,
                rotation: 720,
                duration: 1,
                ease: 'power2.in',
                onComplete: () => {
                    bossElement.remove();
                    bossElement = null;
                }
            });
        }
        
        // 清除所有投射物
        projectiles.forEach(proj => {
            proj.element.remove();
        });
        projectiles = [];
        
        // 清除血条
        if (healthBar) {
            gsap.to(healthBar, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    healthBar.remove();
                    healthBar = null;
                }
            });
        }
        
        if (onBossDefeated) {
            onBossDefeated(currentBoss);
        }
        
        currentBoss = null;
    }
    
    function cleanup() {
        isFighting = false;
        
        if (attackInterval) {
            clearInterval(attackInterval);
            attackInterval = null;
        }
        
        if (bossElement) {
            bossElement.remove();
            bossElement = null;
        }
        
        if (healthBar) {
            healthBar.remove();
            healthBar = null;
        }
        
        projectiles.forEach(proj => {
            proj.element.remove();
        });
        projectiles = [];
        
        currentBoss = null;
    }
    
    function isBossActive() {
        return isFighting && currentBoss !== null;
    }
    
    function getBossState() {
        return {
            isActive: isFighting,
            boss: currentBoss,
            projectiles: projectiles
        };
    }
    
    return {
        init,
        damageBoss,
        checkProjectileCollision,
        cleanup,
        isBossActive,
        getBossState
    };
})();
