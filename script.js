document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const guard = document.getElementById('guard');
    const library = document.getElementById('library');
    const treasure = document.getElementById('treasure');
    const key = document.getElementById('key');

    let playerPosition = { x: 0, y: 0 };
    let hasKey = false;
    let guardPosition = { x: 0, y: 0 };

    const playerInfo = JSON.parse(localStorage.getItem('playerInfo')) || {};
    hasKey = playerInfo.hasKey || false;

    fetch('assets/data.txt')
        .then(response => response.text())
        .then(data => {
            const gameData = JSON.parse(data);
            player.style.left = gameData.player.x + 'px';
            player.style.top = gameData.player.y + 'px';
            guardPosition.x = gameData.guard.x;
            guardPosition.y = gameData.guard.y;
            guard.style.left = guardPosition.x + 'px';
            guard.style.top = guardPosition.y + 'px';
            guard.style.display = gameData.guard.alive ? 'block' : 'none';

            // 初始化钥匙位置与守卫同步（但隐藏）
            key.style.left = guardPosition.x + 'px';
            key.style.top = guardPosition.y + 'px';
            key.style.display = 'none';

            library.style.left = gameData.library.x + 'px';
            library.style.top = gameData.library.y + 'px';
            treasure.style.left = gameData.treasure.x + 'px';
            treasure.style.top = gameData.treasure.y + 'px';
        })
        .catch(error => console.error('Error:', error));

    document.addEventListener('keydown', (event) => {
        switch(event.key) {
            case 'a':
                playerPosition.x -= 10;
                break;
            case 'd':
                playerPosition.x += 10;
                break;
            case 'w':
                playerPosition.y -= 10;
                break;
            case 's':
                playerPosition.y += 10;
                break;
        }
        player.style.left = playerPosition.x + 'px';
        player.style.top = playerPosition.y + 'px';

        if (isColliding(player, library)) {
            alert('玩家获得一个关键线索，通往神庙！');
        }

        if (isColliding(player, guard)) {
            if (confirm('是否使用大招击杀守卫？')) {
                guard.style.display = 'none';
                // 显示钥匙并设置玩家已拥有钥匙
                key.style.display = 'block';
                setTimeout(() => {
                    // 稍微延迟后隐藏钥匙，模拟玩家拾取动作
                    key.style.display = 'none';
                    hasKey = true;
                    localStorage.setItem('playerInfo', JSON.stringify({ hasKey: hasKey }));
                    alert('你获得了一把神秘的钥匙！');
                }, 500); // 延迟时间可以根据需要调整
            } else {
                alert('玩家游戏结束！');
                resetPlayerPosition();
            }
        }

        // 注意：移除与钥匙的直接碰撞检测，因为钥匙会在被“拾取”后立即隐藏

        if (isColliding(player, treasure)) {
            if (hasKey) {
                alert('恭喜你获得了宝藏！游戏结束。');
                // 可以添加游戏结束的逻辑，比如显示胜利画面或重置游戏
            } else {
                alert('你需要一个钥匙来打开宝箱！');
            }
        }
    });

    function isColliding(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
        return !(rect1.right < rect2.left || 
                 rect1.left > rect2.right || 
                 rect1.bottom < rect2.top || 
                 rect1.top > rect2.bottom);
    }

    function resetPlayerPosition() {
        // 重新加载初始位置或其他逻辑
        fetch('assets/data.txt')
            .then(response => response.text())
            .then(data => {
                const gameData = JSON.parse(data);
                player.style.left = gameData.player.x + 'px';
                player.style.top = gameData.player.y + 'px';
            })
            .catch(error => console.error('Error resetting player position:', error));
    }
});