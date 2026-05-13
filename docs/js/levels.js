// 关卡定义系统
const LEVELS = {
    // 主关卡1
    1: {
        name: '第一关',
        description: '齐秦的第一段冒险',
        theme: {
            background: '#5c94fc',
            groundColor: '#c84c0c'
        },
        // 5个子关卡（距离：200m → 400m → 800m → 1000m → 1500m）
        subLevels: [
            {
                id: '1-1',
                name: '出发',
                targetDistance: 200,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 0.8,
                obstacleInterval: 1500,
                obstacleWeights: {
                    'tennis-net': 15,
                    'candy': 15,
                    'wang-jiuxiao': 20,
                    'ball': 15,
                    'knife': 15,
                    'bandage': 20
                }
            },
            {
                id: '1-2',
                name: '穿过公园',
                targetDistance: 400,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.0,
                obstacleInterval: 1400,
                obstacleWeights: {
                    'tennis-net': 15,
                    'candy': 15,
                    'wang-jiuxiao': 20,
                    'ball': 15,
                    'knife': 15,
                    'bandage': 20
                }
            },
            {
                id: '1-3',
                name: '街道狂奔',
                targetDistance: 800,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.2,
                obstacleInterval: 1300,
                obstacleWeights: {
                    'tennis-net': 15,
                    'candy': 15,
                    'wang-jiuxiao': 20,
                    'ball': 15,
                    'knife': 15,
                    'bandage': 20
                }
            },
            {
                id: '1-4',
                name: '地铁通道',
                targetDistance: 1000,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.4,
                obstacleInterval: 1200,
                obstacleWeights: {
                    'tennis-net': 15,
                    'candy': 15,
                    'wang-jiuxiao': 20,
                    'ball': 15,
                    'knife': 15,
                    'bandage': 20
                }
            },
            {
                id: '1-5',
                name: '最终冲刺',
                targetDistance: 1500,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.6,
                obstacleInterval: 1100,
                obstacleWeights: {
                    'tennis-net': 15,
                    'candy': 15,
                    'wang-jiuxiao': 20,
                    'ball': 15,
                    'knife': 15,
                    'bandage': 20
                }
            }
        ],
        // Boss关卡 - 韩聪聪
        boss: {
            id: 'boss-1',
            name: '韩聪聪',
            description: '持有枪械的女主角打手',
            hp: 100,
            attackPattern: 'gun',
            attackInterval: 2000,
            speed: CONFIG.INITIAL_GAME_SPEED * 0.8,
            rewards: {
                health: 50,
                teeth: 2,
                score: 1000
            }
        }
    },
    
    // 主关卡2
    2: {
        name: '第二关',
        description: '更危险的冒险',
        theme: {
            background: '#2c3e50',
            groundColor: '#7f8c8d'
        },
        subLevels: [
            {
                id: '2-1',
                name: '追踪线索',
                targetDistance: 200,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 0.8,
                obstacleInterval: 1400,
                obstacleWeights: {
                    'tennis-net': 20,
                    'candy': 20,
                    'wang-jiuxiao': 15,
                    'ball': 15,
                    'knife': 15,
                    'bandage': 15
                }
            },
            {
                id: '2-2',
                name: '小巷追逐',
                targetDistance: 400,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.0,
                obstacleInterval: 1300,
                obstacleWeights: {
                    'tennis-net': 20,
                    'candy': 20,
                    'wang-jiuxiao': 15,
                    'ball': 15,
                    'knife': 15,
                    'bandage': 15
                }
            },
            {
                id: '2-3',
                name: '废弃工厂',
                targetDistance: 800,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.2,
                obstacleInterval: 1200,
                obstacleWeights: {
                    'tennis-net': 20,
                    'candy': 20,
                    'wang-jiuxiao': 15,
                    'ball': 15,
                    'knife': 15,
                    'bandage': 15
                }
            },
            {
                id: '2-4',
                name: '屋顶追逐',
                targetDistance: 1000,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.4,
                obstacleInterval: 1100,
                obstacleWeights: {
                    'tennis-net': 20,
                    'candy': 20,
                    'wang-jiuxiao': 15,
                    'ball': 15,
                    'knife': 15,
                    'bandage': 15
                }
            },
            {
                id: '2-5',
                name: '黑市交易',
                targetDistance: 1500,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.6,
                obstacleInterval: 1000,
                obstacleWeights: {
                    'tennis-net': 20,
                    'candy': 20,
                    'wang-jiuxiao': 15,
                    'ball': 15,
                    'knife': 15,
                    'bandage': 15
                }
            }
        ],
        // Boss关卡 - 张馨
        boss: {
            id: 'boss-2',
            name: '张馨',
            description: '张馨要和你决一死战',
            hp: 150,
            attackPattern: 'gun',
            attackInterval: 1500,
            speed: CONFIG.INITIAL_GAME_SPEED * 1.0,
            rewards: {
                health: 60,
                teeth: 3,
                score: 2000
            }
        }
    },
    
    // 主关卡3
    3: {
        name: '第三关',
        description: '终极挑战',
        theme: {
            background: '#1a0a2e',
            groundColor: '#2d1b69'
        },
        subLevels: [
            {
                id: '3-1',
                name: '音乐迷宫',
                targetDistance: 200,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 0.8,
                obstacleInterval: 1300,
                obstacleWeights: {
                    'tennis-net': 25,
                    'candy': 25,
                    'wang-jiuxiao': 10,
                    'ball': 15,
                    'knife': 15,
                    'bandage': 10
                }
            },
            {
                id: '3-2',
                name: '音波攻击',
                targetDistance: 400,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.0,
                obstacleInterval: 1200,
                obstacleWeights: {
                    'tennis-net': 25,
                    'candy': 25,
                    'wang-jiuxiao': 10,
                    'ball': 15,
                    'knife': 15,
                    'bandage': 10
                }
            },
            {
                id: '3-3',
                name: '节奏挑战',
                targetDistance: 800,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.2,
                obstacleInterval: 1100,
                obstacleWeights: {
                    'tennis-net': 25,
                    'candy': 25,
                    'wang-jiuxiao': 10,
                    'ball': 15,
                    'knife': 15,
                    'bandage': 10
                }
            },
            {
                id: '3-4',
                name: '黑暗舞台',
                targetDistance: 1000,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.4,
                obstacleInterval: 1000,
                obstacleWeights: {
                    'tennis-net': 25,
                    'candy': 25,
                    'wang-jiuxiao': 10,
                    'ball': 15,
                    'knife': 15,
                    'bandage': 10
                }
            },
            {
                id: '3-5',
                name: '最终冲刺',
                targetDistance: 1500,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.6,
                obstacleInterval: 900,
                obstacleWeights: {
                    'tennis-net': 25,
                    'candy': 25,
                    'wang-jiuxiao': 10,
                    'ball': 15,
                    'knife': 15,
                    'bandage': 10
                }
            }
        ],
        // Boss关卡 - 马明诗
        boss: {
            id: 'boss-3',
            name: '马明诗',
            description: '马明诗，终极Boss',
            hp: 200,
            attackPattern: 'gun_mixed',
            attackInterval: 1000,
            speed: CONFIG.INITIAL_GAME_SPEED * 1.2,
            rewards: {
                health: 100,
                teeth: 5,
                score: 5000
            }
        }
    }
};

// 获取指定关卡
function getLevel(mainLevel, subLevel, isBoss) {
    if (isBoss || subLevel === 'boss') {
        return LEVELS[mainLevel].boss;
    }
    return LEVELS[mainLevel].subLevels[subLevel - 1];
}

// 获取所有关卡列表
function getAllLevels() {
    const levels = [];
    for (let main = 1; main <= CONFIG.TOTAL_MAIN_LEVELS; main++) {
        for (let sub = 1; sub <= CONFIG.SUB_LEVELS_PER_MAIN; sub++) {
            levels.push({ main, sub, isBoss: false });
        }
        levels.push({ main, sub: 'boss', isBoss: true });
    }
    return levels;
}

// 获取下一关
function getNextLevel(currentMain, currentSub) {
    if (currentSub === 'boss') {
        if (currentMain < CONFIG.TOTAL_MAIN_LEVELS) {
            return { main: currentMain + 1, sub: 1 };
        }
        return null;
    }
    
    if (currentSub < CONFIG.SUB_LEVELS_PER_MAIN) {
        return { main: currentMain, sub: currentSub + 1 };
    }
    
    return { main: currentMain, sub: 'boss' };
}
