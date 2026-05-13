// 游戏配置常量
const CONFIG = {
    // 基础设置
    PLAYER_START_X: 100,
    PLAYER_START_Y: 80,
    PLAYER_WIDTH: 67,
    PLAYER_HEIGHT: 93,
    
    // 角色状态
    MAX_HEALTH: 100,
    MAX_TEETH: 8,
    
    // 游戏速度
    INITIAL_GAME_SPEED: 5.75,
    SPEED_INCREMENT: 0.5,
    MAX_GAME_SPEED: 15,
    
    // 障碍物配置
    MIN_OBSTACLE_INTERVAL: 750,
    MAX_OBSTACLE_INTERVAL: 1500,
    OBSTACLE_BASE_INTERVAL: 1000,
    
    // 碰撞检测
    PLAYER_HITBOX_PADDING: 10,
    
    // 跳跃配置
    JUMP_HEIGHT: 150,
    JUMP_DURATION_UP: 0.5,
    JUMP_DURATION_DOWN: 0.4,
    
    // 障碍物类型定义
    OBSTACLE_TYPES: [
        { type: 'tennis-net', class: 'tennis-net', name: '网球网', width: 20, height: 100 },
        { type: 'candy', class: 'candy', name: '糖果', width: 50, height: 50 },
        { type: 'wang-jiuxiao', class: 'wang-jiuxiao', name: '王九骁', width: 50, height: 60 },
        { type: 'ball', class: 'ball', name: '球', width: 50, height: 50 },
        { type: 'knife', class: 'knife', name: '刀子', width: 50, height: 50 },
        { type: 'bandage', class: 'bandage', name: '绷带', width: 50, height: 50 }
    ],
    
    // 障碍物基础权重（用于随机生成）
    OBSTACLE_WEIGHTS: {
        'tennis-net': 15,
        'candy': 15,
        'wang-jiuxiao': 15,
        'ball': 15,
        'knife': 15,
        'bandage': 15
    },
    
    // 伤害配置
    NET_DAMAGE: 20,
    NET_TOOTH_LOSS: 1,
    CHOKING_DAMAGE_INTERVAL: 100,
    CHOKING_DAMAGE_PER_TICK: 1,
    BLEEDING_DAMAGE_INTERVAL: 100,
    BLEEDING_DAMAGE_PER_TICK: 1,
    
    // 治疗配置
    WANG_HEAL_AMOUNT: 30,
    BANDAGE_HEAL_AMOUNT: 25,
    
    // 状态持续时间
    DIZZY_DURATION: 1500,
    
    // 动画配置
    BACKGROUND_SCROLL_DURATION: 20,
    GROUND_SCROLL_DURATION: 5,
    
    // Logo展示时间
    LOGO_DISPLAY_DURATION: 2000,
    
    // 难度等级配置
    DIFFICULTY_CONFIG: {
        1: {
            speedMultiplier: 1.0,
            obstacleIntervalMultiplier: 1.0,
            damageMultiplier: 1.0
        },
        2: {
            speedMultiplier: 1.3,
            obstacleIntervalMultiplier: 0.8,
            damageMultiplier: 1.2
        },
        3: {
            speedMultiplier: 1.6,
            obstacleIntervalMultiplier: 0.6,
            damageMultiplier: 1.5
        }
    },
    
    // 关卡配置
    TOTAL_MAIN_LEVELS: 3,
    SUB_LEVELS_PER_MAIN: 5,
    BOSS_PER_MAIN_LEVEL: 1
};
