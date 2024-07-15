document.addEventListener("DOMContentLoaded", function() {
    const minHeight = 1 * 1.2 * parseFloat(getComputedStyle(document.documentElement).fontSize); // 3 lines * line-height of 1.2em

    function equalizeTitleHeights() {
        const containers = document.querySelectorAll('.product-card-container'); // Select all containers

        containers.forEach(container => {
            const items = container.querySelectorAll('.product-card'); 
            const titleClass = '.product-title';
            let currentRowItems = [];
            const itemsPerRow = getItemsPerRow();

            items.forEach((item, index) => {
                const title = item.querySelector(titleClass);
                title.style.minHeight = 'auto'; // Reset minHeight to auto to recompute heights

                currentRowItems.push(item);

                if ((index + 1) % itemsPerRow === 0 || index === items.length - 1) {
                    setMaxMinHeight(currentRowItems, titleClass);
                    currentRowItems = [];
                }
            });
        });
    }

    function setMaxMinHeight(items, titleSelector) {
        let maxHeight = minHeight;

        items.forEach(item => {
            const title = item.querySelector(titleSelector);
            const height = title.clientHeight;
            if (height > maxHeight) {
                maxHeight = height;
            }
        });

        items.forEach(item => {
            const title = item.querySelector(titleSelector);
            title.style.minHeight = `${maxHeight}px`;
        });
    }

    function getItemsPerRow() { 
        const width = window.innerWidth;
        if (width > 1400) {
            return 4;
        } else if (width > 700) {
            return 3;
        } else {
            return 3;
        }
    }

    window.addEventListener('resize', equalizeTitleHeights);

    equalizeTitleHeights(); // Initial call
});
