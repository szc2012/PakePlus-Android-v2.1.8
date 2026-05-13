// 关卡定义系统
const LEVELS = {
    // 主关卡1: 齐秦的演唱会之路
    1: {
        name: '演唱会之路',
        description: '齐秦要赶去参加演唱会，路上充满障碍',
        theme: {
            background: '#5c94fc',
            groundColor: '#c84c0c'
        },
        // 5个子关卡
        subLevels: [
            {
                id: '1-1',
                name: '出发',
                description: '从家里出发前往演唱会',
                targetDistance: 1000,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.0,
                obstacleInterval: 1200,
                obstacleWeights: {
                    'tennis-net': 20,
                    'candy': 20,
                    'wang-jiuxiao': 20,
                    'ball': 20,
                    'knife': 10,
                    'bandage': 10
                }
            },
            {
                id: '1-2',
                name: '穿过公园',
                description: '公园里到处都是健身器材',
                targetDistance: 1500,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.1,
                obstacleInterval: 1100,
                obstacleWeights: {
                    'tennis-net': 25,
                    'candy': 15,
                    'wang-jiuxiao': 15,
                    'ball': 25,
                    'knife': 10,
                    'bandage': 10
                }
            },
            {
                id: '1-3',
                name: '街道狂奔',
                description: '城市街道车流不息',
                targetDistance: 2000,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.2,
                obstacleInterval: 1000,
                obstacleWeights: {
                    'tennis-net': 15,
                    'candy': 20,
                    'wang-jiuxiao': 15,
                    'ball': 20,
                    'knife': 15,
                    'bandage': 15
                }
            },
            {
                id: '1-4',
                name: '地铁通道',
                description: '穿过拥挤的地下通道',
                targetDistance: 2500,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.3,
                obstacleInterval: 900,
                obstacleWeights: {
                    'tennis-net': 15,
                    'candy': 25,
                    'wang-jiuxiao': 15,
                    'ball': 15,
                    'knife': 15,
                    'bandage': 15
                }
            },
            {
                id: '1-5',
                name: '场馆入口',
                description: '马上就到演唱会现场了！',
                targetDistance: 3000,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.4,
                obstacleInterval: 800,
                obstacleWeights: {
                    'tennis-net': 15,
                    'candy': 20,
                    'wang-jiuxiao': 10,
                    'ball': 20,
                    'knife': 20,
                    'bandage': 15
                }
            }
        ],
        // Boss关卡
        boss: {
            id: 'boss-1',
            name: '保安队长',
            description: '保安队长拦住去路，必须打败他才能进入演唱会现场',
            hp: 100,
            attackPattern: 'net',
            attackInterval: 2000,
            speed: CONFIG.INITIAL_GAME_SPEED * 0.8,
            rewards: {
                health: 50,
                teeth: 2,
                score: 1000
            }
        }
    },
    
    // 主关卡2: 寻找遗失的麦克风
    2: {
        name: '寻找遗失的麦克风',
        description: '麦克风被偷走了，齐秦必须追回',
        theme: {
            background: '#2c1810',
            groundColor: '#4a2c17'
        },
        subLevels: [
            {
                id: '2-1',
                name: '追踪线索',
                description: '沿着小偷的足迹追踪',
                targetDistance: 1500,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.3,
                obstacleInterval: 1000,
                obstacleWeights: {
                    'tennis-net': 15,
                    'candy': 20,
                    'wang-jiuxiao': 15,
                    'ball': 20,
                    'knife': 15,
                    'bandage': 15
                }
            },
            {
                id: '2-2',
                name: '小巷追逐',
                description: '小偷逃进了黑暗的小巷',
                targetDistance: 2000,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.4,
                obstacleInterval: 900,
                obstacleWeights: {
                    'tennis-net': 20,
                    'candy': 15,
                    'wang-jiuxiao': 10,
                    'ball': 15,
                    'knife': 25,
                    'bandage': 15
                }
            },
            {
                id: '2-3',
                name: '废弃工厂',
                description: '小偷躲进了废弃工厂',
                targetDistance: 2500,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.5,
                obstacleInterval: 850,
                obstacleWeights: {
                    'tennis-net': 15,
                    'candy': 15,
                    'wang-jiuxiao': 10,
                    'ball': 20,
                    'knife': 25,
                    'bandage': 15
                }
            },
            {
                id: '2-4',
                name: '屋顶追逐',
                description: '小偷爬上了屋顶',
                targetDistance: 3000,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.6,
                obstacleInterval: 800,
                obstacleWeights: {
                    'tennis-net': 20,
                    'candy': 20,
                    'wang-jiuxiao': 10,
                    'ball': 20,
                    'knife': 15,
                    'bandage': 15
                }
            },
            {
                id: '2-5',
                name: '黑市交易',
                description: '小偷准备把麦克风卖给黑市商人',
                targetDistance: 3500,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.7,
                obstacleInterval: 750,
                obstacleWeights: {
                    'tennis-net': 15,
                    'candy': 25,
                    'wang-jiuxiao': 10,
                    'ball': 15,
                    'knife': 20,
                    'bandage': 15
                }
            }
        ],
        boss: {
            id: 'boss-2',
            name: '黑市商人',
            description: '黑市商人要和你决一死战',
            hp: 150,
            attackPattern: 'knife',
            attackInterval: 1500,
            speed: CONFIG.INITIAL_GAME_SPEED * 1.0,
            rewards: {
                health: 60,
                teeth: 3,
                score: 2000
            }
        }
    },
    
    // 主关卡3: 终极音乐之战
    3: {
        name: '终极音乐之战',
        description: '最后的决战，证明谁才是真正的音乐之王',
        theme: {
            background: '#1a0a2e',
            groundColor: '#2d1b69'
        },
        subLevels: [
            {
                id: '3-1',
                name: '音乐迷宫',
                description: '进入神秘的音乐迷宫',
                targetDistance: 2000,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.5,
                obstacleInterval: 900,
                obstacleWeights: {
                    'tennis-net': 15,
                    'candy': 15,
                    'wang-jiuxiao': 10,
                    'ball': 20,
                    'knife': 25,
                    'bandage': 15
                }
            },
            {
                id: '3-2',
                name: '音波攻击',
                description: '敌人在用音波攻击你',
                targetDistance: 2500,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.6,
                obstacleInterval: 800,
                obstacleWeights: {
                    'tennis-net': 20,
                    'candy': 20,
                    'wang-jiuxiao': 10,
                    'ball': 20,
                    'knife': 15,
                    'bandage': 15
                }
            },
            {
                id: '3-3',
                name: '节奏挑战',
                description: '跟着节奏躲避障碍',
                targetDistance: 3000,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.7,
                obstacleInterval: 750,
                obstacleWeights: {
                    'tennis-net': 15,
                    'candy': 25,
                    'wang-jiuxiao': 10,
                    'ball': 20,
                    'knife': 15,
                    'bandage': 15
                }
            },
            {
                id: '3-4',
                name: '黑暗舞台',
                description: '在黑暗的舞台上战斗',
                targetDistance: 3500,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.8,
                obstacleInterval: 700,
                obstacleWeights: {
                    'tennis-net': 20,
                    'candy': 15,
                    'wang-jiuxiao': 10,
                    'ball': 25,
                    'knife': 15,
                    'bandage': 15
                }
            },
            {
                id: '3-5',
                name: '最终冲刺',
                description: '冲向最后的战场！',
                targetDistance: 4000,
                gameSpeed: CONFIG.INITIAL_GAME_SPEED * 1.9,
                obstacleInterval: 650,
                obstacleWeights: {
                    'tennis-net': 15,
                    'candy': 20,
                    'wang-jiuxiao': 10,
                    'ball': 20,
                    'knife': 20,
                    'bandage': 15
                }
            }
        ],
        boss: {
            id: 'boss-3',
            name: '假面歌手',
            description: '神秘的假面歌手，终极Boss',
            hp: 200,
            attackPattern: 'mixed',
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
function getLevel(mainLevel, subLevel) {
    if (subLevel === 'boss') {
        return LEVELS[mainLevel].boss;
    }
    return LEVELS[mainLevel].subLevels[subLevel - 1];
}

// 获取所有关卡列表
function getAllLevels() {
    const levels = [];
    for (let main = 1; main <= CONFIG.TOTAL_MAIN_LEVELS; main++) {
        for (let sub = 1; sub <= CONFIG.SUB_LEVELS_PER_MAIN; sub++) {
            levels.push(getLevel(main, sub));
        }
        levels.push(getLevel(main, 'boss'));
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
