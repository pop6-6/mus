document.addEventListener('DOMContentLoaded', () => {
    // 獲取您原有的 DOM 元素
    const moodButtons = document.querySelectorAll('.mood-btn');
    const recommendationSection = document.getElementById('recommendationSection');
    const recommendationText = document.getElementById('recommendationText');
    const videoPlayerContainer = document.getElementById('videoPlayerContainer');
    const feedbackSection = document.getElementById('feedbackSection');
    const likeBtn = document.getElementById('likeBtn');
    const dislikeBtn = document.getElementById('dislikeBtn');
    const resetBtn = document.getElementById('resetBtn');

    const songControls = document.querySelector('.song-controls');
    const prevSongBtn = document.getElementById('prevSongBtn');
    const nextSongBtn = document.getElementById('nextSongBtn');

    let currentMoodData = null;
    let currentSongIndex = 0;

    // 音樂風格與推薦資料庫 (保持您原有的連結，新增「我的音樂庫」佔位)
    const moodRecommendations = {
        '流行樂': {
            text: '流行音樂以其抓耳的旋律和豐富的節奏引人入勝。',
            songs: [
                { title: '周杰倫Jay Chou X aMEI【不該 Shouldn\'t Be】', url: 'https://www.youtube.com/embed/_VxLOj3TB5k?si=_YqM6psMp6aSDUS4' },
                { title: 'tuki.『晩餐歌』', url: 'https://www.youtube.com/embed/oZpYEEcvu5I?si=qrwZULR0JC2HVwiN' },
                { title: 'Justin Bieber - Yummy', url: 'https://www.youtube.com/embed/8EJ3zbKTWQ8?si=fMXJK7eWLUnebr0H' }
            ]
        },
        'R&B': {
            text: 'R&B 融合了節奏藍調、靈魂樂和放克元素，帶來流暢的律動和深情的人聲。',
            songs: [
                { title: 'JENNIE & Dua Lipa - Handlebars', url: 'https://www.youtube.com/embed/seARsMwjbEU?si=AsbQODnmqgug_f-P' },
                { title: '陶喆 David Tao - 流沙', url: 'https://www.youtube.com/embed/2xAmQ4y44eo?si=at8Q1WSeP4ODeVkr' },
                { title: '宇多田ヒカル - First Love', url: 'https://www.youtube.com/embed/o1sUaVJUeB0?si=pSAjwky3Vzhfuae3' }
            ]
        },
        '嘻哈音樂': {
            text: '嘻哈音樂以其獨特的饒舌韻律和強烈的節奏感，展現街頭文化與表達。',
            songs: [
                { title: 'G-DRAGON - POWER', url: 'https://www.youtube.com/embed/NMjhjrBIrG8?si=gL_T3lp9JLS2wGMs' },
                { title: '熊仔 Kumachan -【88BARS】', url: 'https://www.youtube.com/embed/B1tArM5XYuc?si=8Ctdjp3UtINAVL8K' },
                { title: 'Kendrick Lamar - Not Like Us', url: 'https://www.youtube.com/embed/T6eK-2OQtew?si=DWCRC2naJnAJ2nkJ' }
            ]
        },
        '鄉村音樂': {
            text: '鄉村音樂以其敘事性的歌詞、民謠風格和溫暖的旋律，講述生活故事與情感。',
            songs: [
                { title: 'Shaboozey - A Bar Song (Tipsy)', url: 'https://www.youtube.com/embed/t7bQwwqW-Hc?si=1Zp17LYGIpw8g9-e' },
                { title: 'Taylor Swift - Love Story', url: 'https://www.youtube.com/embed/8xg3vE8Ie_E?si=FnFK5gn56EANjFMU' },
                { title: 'John Denver - Take Me Home, Country Roads', url: 'https://www.youtube.com/embed/1vrEljMfXYo?si=Lgd4CJsCSf77eE_6' }
            ]
        },
        // 為「我的音樂庫」預留空間，歌曲會從 localStorage 動態載入
        '我的音樂庫': {
            text: '這是您專屬的音樂庫，快來新增您喜歡的歌曲吧！',
            songs: [] // 這個陣列會在載入時被 populate
        }
    };

    // 您原有的 loadAndPlaySong 函式 (未修改)
    function loadAndPlaySong(moodData, index) {
        if (!moodData || !moodData.songs || moodData.songs.length === 0) {
            recommendationText.innerHTML = '抱歉，該風格沒有可播放的音樂。';
            videoPlayerContainer.style.display = 'none';
            songControls.style.display = 'none';
            return;
        }

        currentMoodData = moodData;
        currentSongIndex = index;

        const selectedSong = moodData.songs[index];

        // 將文字分成兩行：風格介紹 + 歌名
        recommendationText.innerHTML = `${moodData.text}<br><span class="recommendation-song-title">播放曲目：${selectedSong.title}</span>`;

        videoPlayerContainer.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', selectedSong.url);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', '');

        videoPlayerContainer.appendChild(iframe);
        videoPlayerContainer.style.display = 'block';
        songControls.style.display = 'flex';

        updateSongControls();
    }

    // 您原有的 updateSongControls 函式 (未修改)
    function updateSongControls() {
        if (!currentMoodData || currentMoodData.songs.length <= 1) {
            prevSongBtn.disabled = true;
            nextSongBtn.disabled = true;
            return;
        }

        prevSongBtn.disabled = (currentSongIndex === 0);
        nextSongBtn.disabled = (currentSongIndex === currentMoodData.songs.length - 1);
    }

    // 輔助函式：隱藏所有主要內容區塊 (新增，因為現在有「我的音樂庫」區塊)
    function hideAllSections() {
        recommendationSection.style.display = 'none';
        feedbackSection.style.display = 'none';
        const myMusicLibrarySection = document.getElementById('myMusicLibrarySection');
        if (myMusicLibrarySection) {
            myMusicLibrarySection.style.display = 'none';
        }
        videoPlayerContainer.innerHTML = ''; // 清空影片播放器
        songControls.style.display = 'none'; // 隱藏歌曲控制
    }

    // **** 這裡開始是修改過的 moodButtons 事件監聽器 ****
    // 它將能夠切換到「我的音樂庫」
    moodButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedMood = event.target.dataset.mood;
            hideAllSections(); // 隱藏所有內容區塊

            if (selectedMood === '我的音樂庫') {
                const myMusicLibrarySection = document.getElementById('myMusicLibrarySection');
                if (myMusicLibrarySection) {
                    myMusicLibrarySection.style.display = 'block'; // 顯示我的音樂庫
                    loadMyMusicLibrary(); // 載入我的音樂庫內容
                }
            } else {
                recommendationSection.style.display = 'block'; // 顯示推薦區
                feedbackSection.style.display = 'block'; // 顯示回饋區

                const moodData = moodRecommendations[selectedMood];
                if (moodData && moodData.songs && moodData.songs.length > 0) {
                    loadAndPlaySong(moodData, 0); // 點擊風格時，從第一首開始播放
                } else {
                    recommendationText.innerHTML = '抱歉，該風格暫時沒有可播放的音樂。';
                    videoPlayerContainer.style.display = 'none';
                    songControls.style.display = 'none';
                }
            }
        });
    });

    // 您原有的 上一首/下一首 按鈕事件監聽器 (未修改)
    prevSongBtn.addEventListener('click', () => {
        if (currentMoodData && currentSongIndex > 0) {
            loadAndPlaySong(currentMoodData, currentSongIndex - 1);
        }
    });

    nextSongBtn.addEventListener('click', () => {
        if (currentMoodData && currentSongIndex < currentMoodData.songs.length - 1) {
            loadAndPlaySong(currentMoodData, currentSongIndex + 1);
        }
    });

    // 您原有的回饋和重置按鈕邏輯 (已修改 resetUI 以包含隱藏「我的音樂庫」的邏輯)
    likeBtn.addEventListener('click', () => {
        alert('感謝您的喜歡！我們會記下您的偏好。');
        resetUI();
    });

    dislikeBtn.addEventListener('click', () => {
        alert('很抱歉沒有符合您的期待。我們會努力改進！');
        resetUI();
    });

    resetBtn.addEventListener('click', () => {
        resetUI();
    });

    // 您原有的 resetUI 函式 (已修改以包含「我的音樂庫」隱藏邏輯)
    function resetUI() {
        recommendationText.innerHTML = '';
        videoPlayerContainer.innerHTML = '';
        videoPlayerContainer.style.display = 'none';
        songControls.style.display = 'none';
        feedbackSection.style.display = 'none';
        const myMusicLibrarySection = document.getElementById('myMusicLibrarySection');
        if (myMusicLibrarySection) {
            myMusicLibrarySection.style.display = 'none';
        }
        currentMoodData = null;
        currentSongIndex = 0;

        // 預設回到風格選擇區
        recommendationSection.style.display = 'block';
        recommendationText.innerHTML = '<p>您想聽哪種音樂風格？請點選：</p>';
    }

    // **** 新增「我的音樂庫」相關 DOM 元素獲取 (包含新增的下拉選單元素) ****
    const myMusicLibrarySection = document.getElementById('myMusicLibrarySection');
    const songTitleInput = document.getElementById('songTitleInput');
    const songUrlInput = document.getElementById('songUrlInput');
    const addSongBtn = document.getElementById('addSongBtn');
    const mySongsList = document.getElementById('mySongsList');
    const backToMoodsBtn = document.getElementById('backToMoodsBtn');

    // 新增下拉選單相關 DOM 元素
    const myMusicSearchDiv = document.querySelector('.my-music-search');
    const songDropdown = document.getElementById('songDropdown');
    const playSelectedSongBtn = document.getElementById('playSelectedSongBtn');

    // **** 新增 convertToEmbedUrl 函式 (用於處理使用者新增的 YouTube 連結) ****
    function convertToEmbedUrl(url) {
        let videoId = '';
        const watchMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (watchMatch && watchMatch[1]) {
            videoId = watchMatch[1];
        } else {
            const embedMatch = url.match(/youtube\.com\/embed\/([^"&?\/\s]{11})/);
            if (embedMatch && embedMatch[1]) {
                videoId = embedMatch[1];
            }
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
    }


    // **** 新增「我的音樂庫」功能實現 ****

    // 載入並顯示「我的音樂庫」中的歌曲
    function loadMyMusicLibrary() {
        mySongsList.innerHTML = ''; // 清空現有列表
        songDropdown.innerHTML = ''; // 清空下拉選單

        const storedSongs = JSON.parse(localStorage.getItem('myMusicLibrarySongs')) || [];

        // 更新 moodRecommendations 中「我的音樂庫」的歌曲列表
        moodRecommendations['我的音樂庫'].songs = storedSongs;

        if (storedSongs.length === 0) {
            mySongsList.innerHTML = '<p class="placeholder-text">目前沒有歌曲，快來新增吧！</p>';
            myMusicSearchDiv.style.display = 'none'; // 隱藏下拉選單
        } else {
            // 填充歌曲列表
            storedSongs.forEach((song, index) => {
                const songItem = document.createElement('div');
                songItem.className = 'my-song-item';
                songItem.innerHTML = `
                    <span>${song.title}</span>
                    <div class="actions">
                        <button class="play-my-song-btn" data-index="${index}">播放</button>
                        <button class="delete-btn" data-index="${index}">刪除</button>
                    </div>
                `;
                mySongsList.appendChild(songItem);

                // 填充下拉選單
                const option = document.createElement('option');
                option.value = index; // 將索引作為值
                option.textContent = song.title;
                songDropdown.appendChild(option);
            });

            // 判斷是否顯示下拉選單 (例如，歌曲數量超過 5 首時顯示)
            if (storedSongs.length >= 5) { // 您可以調整這個數字
                myMusicSearchDiv.style.display = 'flex'; // 顯示下拉選單
            } else {
                myMusicSearchDiv.style.display = 'none'; // 隱藏下拉選單
            }


            // 為新增的播放按鈕添加事件監聽器 (列表中的播放按鈕)
            mySongsList.querySelectorAll('.play-my-song-btn').forEach(btn => {
                btn.addEventListener('click', (event) => {
                    const index = parseInt(event.target.dataset.index);
                    hideAllSections();
                    recommendationSection.style.display = 'block';
                    feedbackSection.style.display = 'block';
                    loadAndPlaySong(moodRecommendations['我的音樂庫'], index);
                });
            });

            // 為新增的刪除按鈕添加事件監聽器
            mySongsList.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (event) => {
                    const indexToDelete = parseInt(event.target.dataset.index);
                    deleteSongFromLibrary(indexToDelete);
                });
            });
        }
    }

    // 添加歌曲到「我的音樂庫」
    addSongBtn.addEventListener('click', () => {
        const title = songTitleInput.value.trim();
        const url = songUrlInput.value.trim();

        if (title && url) {
            const embedUrl = convertToEmbedUrl(url);

            if (!embedUrl || !embedUrl.includes('youtube.com/embed/') || !embedUrl.includes('/embed/')) {
                 alert('請輸入有效的 YouTube 影片連結！例如：https://www.youtube.com/embed/NMjhjrBIrG8?si=gL_T3lp9JLS2wGMs5 或 https://www.youtube.com/embed/NMjhjrBIrG8?si=gL_T3lp9JLS2wGMs6');
                return;
            }

            const storedSongs = JSON.parse(localStorage.getItem('myMusicLibrarySongs')) || [];
            // **** 關鍵改動：使用 unshift 將新歌曲添加到陣列開頭 ****
            storedSongs.unshift({ title: title, url: embedUrl });
            localStorage.setItem('myMusicLibrarySongs', JSON.stringify(storedSongs));

            songTitleInput.value = '';
            songUrlInput.value = '';
            alert('歌曲已成功加入您的音樂庫！');
            loadMyMusicLibrary(); // 重新載入列表以顯示新加入的歌曲 (也會更新下拉選單)
        } else {
            alert('請輸入歌曲名稱和影片連結！');
        }
    });

    // 從「我的音樂庫」刪除歌曲
    function deleteSongFromLibrary(index) {
        if (confirm('確定要從音樂庫中刪除這首歌曲嗎？')) {
            const storedSongs = JSON.parse(localStorage.getItem('myMusicLibrarySongs')) || [];
            storedSongs.splice(index, 1);
            localStorage.setItem('myMusicLibrarySongs', JSON.stringify(storedSongs));
            alert('歌曲已成功刪除！');
            loadMyMusicLibrary(); // 重新載入列表以更新顯示 (也會更新下拉選單)
        }
    }

    // 「返回風格選擇」按鈕的事件監聽器
    backToMoodsBtn.addEventListener('click', () => {
        resetUI();
    });

    // **** 新增下拉選單的播放按鈕事件監聽器 ****
    playSelectedSongBtn.addEventListener('click', () => {
        const selectedIndex = parseInt(songDropdown.value);
        if (selectedIndex >= 0) {
            hideAllSections();
            recommendationSection.style.display = 'block';
            feedbackSection.style.display = 'block';
            loadAndPlaySong(moodRecommendations['我的音樂庫'], selectedIndex);
        } else {
            alert('請從下拉選單中選擇一首歌曲。');
        }
    });

}); // DOMContentLoaded 結束