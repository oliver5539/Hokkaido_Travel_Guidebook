/* ===================================
   北海道旅遊小書 - 雙頁攤開式 JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', function () {
    initFlipbook();
    initChecklist();
    initPdfDownload();

    // 5秒後隱藏翻頁提示
    setTimeout(() => {
        const hint = document.getElementById('flipHint');
        if (hint) hint.style.opacity = '0';
    }, 5000);
});

/**
 * 雙頁攤開式翻頁功能
 */
function initFlipbook() {
    const spreads = document.querySelectorAll('.spread');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageIndicator = document.getElementById('pageIndicator');
    const book = document.getElementById('book');

    let currentSpread = 0;
    const totalSpreads = spreads.length;

    // 更新顯示
    function updateSpread() {
        spreads.forEach((spread, index) => {
            spread.classList.toggle('active', index === currentSpread);
        });

        // 更新導航按鈕
        prevBtn.disabled = currentSpread === 0;
        nextBtn.disabled = currentSpread === totalSpreads - 1;

        // 更新頁碼
        const pageNames = ['封面', '行前準備', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
        pageIndicator.textContent = pageNames[currentSpread] || `${currentSpread + 1}`;
    }

    // 下一個 spread
    function nextSpread() {
        if (currentSpread < totalSpreads - 1) {
            currentSpread++;
            updateSpread();
        }
    }

    // 上一個 spread
    function prevSpread() {
        if (currentSpread > 0) {
            currentSpread--;
            updateSpread();
        }
    }

    // 按鈕事件
    prevBtn.addEventListener('click', prevSpread);
    nextBtn.addEventListener('click', nextSpread);

    // 鍵盤導航
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSpread();
        } else if (e.key === 'ArrowRight') {
            nextSpread();
        }
    });

    // 觸控滑動（手機版）
    let touchStartX = 0;
    let touchEndX = 0;

    book.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    book.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (diff > swipeThreshold) {
            // 左滑 -> 下一頁
            nextSpread();
        } else if (diff < -swipeThreshold) {
            // 右滑 -> 上一頁
            prevSpread();
        }
    }

    // 初始化
    updateSpread();
}

/**
 * 行前準備清單 - 本地儲存
 */
function initChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-box input[type="checkbox"]');
    const STORAGE_KEY = 'hokkaido_checklist_2026';

    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    checkboxes.forEach(checkbox => {
        if (savedState[checkbox.id]) {
            checkbox.checked = true;
        }

        checkbox.addEventListener('change', function () {
            const currentState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            currentState[this.id] = this.checked;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
        });
    });
}

/**
 * PDF 下載 - 使用瀏覽器列印
 */
function initPdfDownload() {
    const downloadBtn = document.getElementById('downloadPdf');

    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', function () {
        window.print();
    });
}
