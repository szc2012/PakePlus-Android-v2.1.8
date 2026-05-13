// Save/Load system with localStorage and Cookie support
const SaveSystem = (function() {
    const STORAGE_KEY = 'qiqin_paopao_save';
    
    function getDefaultSaveData() {
        return {
            currentMainLevel: 1,
            currentSubLevel: 1,
            isBossLevel: false,
            highestScore: 0,
            totalDistance: 0,
            unlockedLevels: [{ main: 1, sub: 1, isBoss: false }],
            bossDefeated: [],
            totalPlayTime: 0,
            lastPlayDate: null,
            settings: {
                musicVolume: 0.5,
                sfxVolume: 0.5
            }
        };
    }
    
    function saveGame(data) {
        try {
            const saveData = {
                currentMainLevel: data.currentMainLevel || 1,
                currentSubLevel: data.currentSubLevel || 1,
                isBossLevel: data.isBossLevel || false,
                highestScore: data.highestScore || 0,
                totalDistance: data.totalDistance || 0,
                unlockedLevels: data.unlockedLevels || [{ main: 1, sub: 1, isBoss: false }],
                bossDefeated: data.bossDefeated || [],
                totalPlayTime: data.totalPlayTime || 0,
                lastPlayDate: new Date().toISOString(),
                settings: data.settings || { musicVolume: 0.5, sfxVolume: 0.5 }
            };
            
            // 优先使用localStorage
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
            }
            
            // 同时保存到cookie作为备选
            try {
                const jsonData = JSON.stringify(saveData);
                const encodedData = encodeURIComponent(jsonData);
                
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 365);
                const expires = 'expires=' + expiryDate.toUTCString();
                
                document.cookie = STORAGE_KEY + '=' + encodedData + ';' + expires + ';path=/;SameSite=Lax';
            } catch (e) {
                console.warn('Cookie save failed:', e);
            }
            
            return true;
        } catch (e) {
            console.error('Save game failed:', e);
            return false;
        }
    }
    
    function loadGame() {
        try {
            // 优先从localStorage读取
            if (typeof localStorage !== 'undefined') {
                const data = localStorage.getItem(STORAGE_KEY);
                if (data) {
                    const saveData = JSON.parse(data);
                    return {
                        ...getDefaultSaveData(),
                        ...saveData
                    };
                }
            }
            
            // 从cookie读取作为备选
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(STORAGE_KEY + '=')) {
                    const saveCookie = cookie.substring(STORAGE_KEY.length + 1);
                    const decodedData = decodeURIComponent(saveCookie);
                    const saveData = JSON.parse(decodedData);
                    return {
                        ...getDefaultSaveData(),
                        ...saveData
                    };
                }
            }
            
            return getDefaultSaveData();
        } catch (e) {
            console.error('Load game failed:', e);
            return getDefaultSaveData();
        }
    }
    
    function deleteSave() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
        document.cookie = STORAGE_KEY + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    }
    
    function updateProgress(data) {
        const currentSave = loadGame();
        
        if (data.highestScore !== undefined) {
            currentSave.highestScore = Math.max(currentSave.highestScore, data.highestScore);
        }
        
        if (data.totalDistance !== undefined) {
            currentSave.totalDistance += data.totalDistance;
        }
        
        if (data.currentMainLevel !== undefined) {
            currentSave.currentMainLevel = data.currentMainLevel;
        }
        
        if (data.currentSubLevel !== undefined) {
            currentSave.currentSubLevel = data.currentSubLevel;
        }
        
        if (data.isBossLevel !== undefined) {
            currentSave.isBossLevel = data.isBossLevel;
        }
        
        if (data.totalPlayTime !== undefined) {
            currentSave.totalPlayTime += data.totalPlayTime;
        }
        
        if (data.unlockedLevel) {
            const newLevel = data.unlockedLevel;
            const alreadyUnlocked = currentSave.unlockedLevels.some(
                level => level.main === newLevel.main && 
                         level.sub === newLevel.sub && 
                         level.isBoss === newLevel.isBoss
            );
            
            if (!alreadyUnlocked) {
                currentSave.unlockedLevels.push(newLevel);
            }
        }
        
        if (data.bossDefeated) {
            const bossId = data.bossDefeated;
            if (!currentSave.bossDefeated.includes(bossId)) {
                currentSave.bossDefeated.push(bossId);
            }
        }
        
        return saveGame(currentSave);
    }
    
    function getUnlockedLevels() {
        const saveData = loadGame();
        return saveData.unlockedLevels;
    }
    
    function isLevelUnlocked(mainLevel, subLevel, isBoss) {
        const saveData = loadGame();
        
        if (mainLevel === 1 && subLevel === 1 && !isBoss) {
            return true;
        }
        
        return saveData.unlockedLevels.some(
            level => level.main === mainLevel && 
                     level.sub === subLevel && 
                     level.isBoss === isBoss
        );
    }
    
    function hasBossDefeated(bossId) {
        const saveData = loadGame();
        return saveData.bossDefeated.includes(bossId);
    }
    
    function getHighestScore() {
        const saveData = loadGame();
        return saveData.highestScore;
    }
    
    function getSettings() {
        const saveData = loadGame();
        return saveData.settings;
    }
    
    function updateSettings(newSettings) {
        const currentSave = loadGame();
        currentSave.settings = { ...currentSave.settings, ...newSettings };
        return saveGame(currentSave);
    }
    
    function resetProgress() {
        deleteSave();
        return getDefaultSaveData();
    }
    
    return {
        saveGame,
        loadGame,
        deleteSave,
        updateProgress,
        getUnlockedLevels,
        isLevelUnlocked,
        hasBossDefeated,
        getHighestScore,
        getSettings,
        updateSettings,
        resetProgress
    };
})();
