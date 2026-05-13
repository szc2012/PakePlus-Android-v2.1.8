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
    let skillBar = null;
    let bossDamageInterval = null;
    let playerAttackInterval = null;
    let playerBossHP = null;
    let playerBossMaxHP = null;
    let cooldowns = {};
    let bossSkillBar = null;
    
    function init(bossConfig, callbacks) {
        currentBoss = {
            ...bossConfig,
            currentHp: bossConfig.hp,
            maxHp: bossConfig.hp,
            attackPattern: bossConfig.attackPattern || 'gun',
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
                👹 ${currentBoss.name} - ❤️ <span id="boss-hp-text">${currentBoss.hp}</span>
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
            right: 150px;
            bottom: 80px;
            width: 80px;
            height: 100px;
            z-index: 150;
        `;
        
        const bossEmojis = {
            '韩聪聪': '👩‍🔫',
            '张馨': '🧛‍♀️',
            '马明诗': '👹'
        };
        
        bossElement.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #8B0000 0%, #FF0000 100%);
                border: 3px solid #FFD700;
                border-radius: 10px;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 40px;
            ">
                ${bossEmojis[currentBoss.name] || '👹'}
            </div>
        `;
        
        container.appendChild(bossElement);
        
        createSkillBar();
    }
    
    function createSkillBar() {
        const container = document.getElementById('game-container');
        
        bossSkillBar = document.createElement('div');
        bossSkillBar.id = 'boss-skill-bar';
        bossSkillBar.style.cssText = `
            position: absolute;
            top: 100px;
            left: 20px;
            display: flex;
            gap: 10px;
            z-index: 300;
            background: rgba(0,0,0,0.8);
            padding: 12px;
            border-radius: 12px;
            border: 2px solid #FFD700;
        `;
        
        const skills = [
            { id: 'attack', icon: '⚔️', name: '普通攻击', color: '#fff', cooldown: 3000 },
            { id: 'heavy', icon: '💥', name: '重击', color: '#ff6b6b', cooldown: 6000 },
            { id: 'heal', icon: '💚', name: '治疗', color: '#2ecc71', cooldown: 10000 },
            { id: 'dodge', icon: '💨', name: '闪避', color: '#3498db', cooldown: 8000 },
            { id: 'ultimate', icon: '🔥', name: '大招', color: '#e74c3c', cooldown: 15000 }
        ];
        
        skills.forEach(skill => {
            const btn = document.createElement('button');
            btn.id = `boss-skill-${skill.id}`;
            btn.style.cssText = `
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
                border: 3px solid ${skill.color};
                border-radius: 12px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                position: relative;
                color: #fff;
                font-weight: bold;
            `;
            btn.innerHTML = `
                <div style="font-size: 24px;">${skill.icon}</div>
                <div style="font-size: 10px; margin-top: 2px;">${skill.name}</div>
                ${skill.cooldown > 0 ? '<div class="boss-skill-cd" id="boss-skill-' + skill.id + '-cd"></div>' : ''}
            `;
            
            btn.onmouseover = () => {
                if (!btn.classList.contains('cooldown')) {
                    btn.style.transform = 'scale(1.1)';
                }
            };
            btn.onmouseout = () => {
                btn.style.transform = 'scale(1)';
            };
            btn.onclick = () => useBossSkill(skill.id, skill.cooldown);
            
            bossSkillBar.appendChild(btn);
        });
        
        container.appendChild(bossSkillBar);
    }
    
    function useBossSkill(skillId, cooldown) {
        if (cooldowns[skillId] && cooldowns[skillId] > Date.now()) return;
        
        const btn = document.getElementById(`boss-skill-${skillId}`);
        if (!btn) return;
        
        switch (skillId) {
            case 'attack':
                showSkillEffect('attack', '⚔️');
                damageBoss(10);
                break;
            case 'heavy':
                showSkillEffect('heavy', '💥');
                damageBoss(25);
                startSkillCooldown(skillId, cooldown);
                break;
            case 'heal':
                showSkillEffect('heal', '💚');
                if (onBossHeal) onBossHeal(30);
                startSkillCooldown(skillId, cooldown);
                break;
            case 'dodge':
                showSkillEffect('dodge', '💨');
                if (onBossDodge) onBossDodge(2000);
                startSkillCooldown(skillId, cooldown);
                break;
            case 'ultimate':
                showSkillEffect('ultimate', '🔥');
                damageBoss(50);
                startSkillCooldown(skillId, cooldown);
                break;
        }
    }
    
    function showSkillEffect(skillId, emoji) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 80px;
            z-index: 500;
            pointer-events: none;
            animation: skillEffectAnim 0.8s ease-out forwards;
        `;
        effect.textContent = emoji;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes skillEffectAnim {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
            }
        `;
        document.head.appendChild(style);
        
        document.getElementById('game-container').appendChild(effect);
        setTimeout(() => {
            effect.remove();
            style.remove();
        }, 800);
    }
    
    function startSkillCooldown(skillId, duration) {
        cooldowns[skillId] = Date.now() + duration;
        const btn = document.getElementById(`boss-skill-${skillId}`);
        const cdDisplay = document.getElementById(`boss-skill-${skillId}-cd`);
        
        btn.classList.add('cooldown');
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        
        const updateCd = setInterval(() => {
            const remaining = Math.ceil((cooldowns[skillId] - Date.now()) / 1000);
            if (remaining <= 0) {
                clearInterval(updateCd);
                btn.classList.remove('cooldown');
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                if (cdDisplay) cdDisplay.textContent = '';
                delete cooldowns[skillId];
            } else {
                if (cdDisplay) cdDisplay.textContent = remaining + 's';
            }
        }, 100);
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
            case 'gun':
            case 'gun_mixed':
                attackType = 'bullet';
                break;
            case 'mixed':
                const types = ['tennis-net', 'candy', 'ball', 'knife'];
                attackType = types[Math.floor(Math.random() * types.length)];
                break;
            default:
                attackType = 'bullet';
        }
        
        if (pattern === 'gun_mixed') {
            // 混合攻击：有时发射多发子弹
            if (Math.random() > 0.5) {
                shootProjectile(attackType, -20);
                setTimeout(() => shootProjectile(attackType, 20), 100);
            } else {
                shootProjectile(attackType, 0);
            }
        } else {
            shootProjectile(attackType, 0);
        }
        
        if (onBossAttack) {
            onBossAttack(attackType);
        }
    }
    
    function shootProjectile(type, yOffset) {
        const container = document.getElementById('game-container');
        const projectile = document.createElement('div');
        
        projectile.className = 'obstacle bullet';
        projectile.style.left = (window.innerWidth - 200) + 'px';
        projectile.style.bottom = (100 + (yOffset || 0)) + 'px';
        projectile.style.position = 'absolute';
        
        projectile.innerHTML = `<div style="font-size: 24px;">🔥</div>`;
        
        container.appendChild(projectile);
        
        const projectileData = {
            element: projectile,
            type: type,
            width: 24,
            height: 24,
            hit: false
        };
        
        projectiles.push(projectileData);
        
        gsap.to(projectile, {
            left: 50,
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
        
        projectiles.forEach(proj => {
            proj.element.remove();
        });
        projectiles = [];
        
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
        
        if (bossSkillBar) {
            bossSkillBar.remove();
            bossSkillBar = null;
        }
        
        cooldowns = {};
        
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
