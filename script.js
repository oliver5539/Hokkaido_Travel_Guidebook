/* ===================================
   北海道旅遊小書 - 翻頁式 JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', function () {
    initFlipbook();
    initChecklist();
    initPdfDownload();

    // 3秒後隱藏翻頁提示
    setTimeout(() => {
        const hint = document.getElementById('flipHint');
        if (hint) hint.style.opacity = '0';
    }, 5000);
});

/**
 * 翻頁功能
 */
function initFlipbook() {
    const pages = document.querySelectorAll('.page');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageIndicator = document.getElementById('pageIndicator');

    let currentPage = 0;
    const totalPages = pages.length;

    // 更新頁面顯示
    function updatePage() {
        pages.forEach((page, index) => {
            page.classList.toggle('active', index === currentPage);
        });

        // 更新導航按鈕
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages - 1;

        // 更新頁碼
        pageIndicator.textContent = `${currentPage + 1} / ${totalPages}`;

        // 滾動到頁面頂部
        window.scrollTo(0, 0);
    }

    // 上一頁
    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updatePage();
        }
    });

    // 下一頁
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updatePage();
        }
    });

    // 鍵盤導航
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentPage > 0) {
            currentPage--;
            updatePage();
        } else if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
            currentPage++;
            updatePage();
        }
    });

    // 點擊書頁左右邊緣翻頁
    document.getElementById('book').addEventListener('click', (e) => {
        // 避免點擊 checkbox、label、button 時觸發翻頁
        if (e.target.closest('.checklist-box') ||
            e.target.closest('button') ||
            e.target.closest('label') ||
            e.target.closest('input')) {
            return;
        }

        const bookRect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - bookRect.left;
        const bookWidth = bookRect.width;

        // 點擊左側 20% 區域：上一頁
        if (clickX < bookWidth * 0.2 && currentPage > 0) {
            currentPage--;
            updatePage();
        }
        // 點擊右側 20% 區域：下一頁
        else if (clickX > bookWidth * 0.8 && currentPage < totalPages - 1) {
            currentPage++;
            updatePage();
        }
    });

    // 觸控滑動
    let touchStartX = 0;
    let touchEndX = 0;

    document.getElementById('book').addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.getElementById('book').addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (diff > swipeThreshold && currentPage < totalPages - 1) {
            // 左滑 -> 下一頁
            currentPage++;
            updatePage();
        } else if (diff < -swipeThreshold && currentPage > 0) {
            // 右滑 -> 上一頁
            currentPage--;
            updatePage();
        }
    }

    // 初始化
    updatePage();
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
