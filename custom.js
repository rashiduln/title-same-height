class TitleHeightEqualizer {
    constructor(parentSelector, itemSelector, titleSelector, breakpoints, requireTitle = false) {
        this.parentSelector = parentSelector;
        this.itemSelector = itemSelector;
        this.titleSelector = titleSelector;
        this.breakpoints = breakpoints;
        this.requireTitle = requireTitle;
        this.minHeight = 1.2 * parseFloat(getComputedStyle(document.documentElement).fontSize);
        this.resizeTimeout = null;

        this.init();
        window.addEventListener('resize', () => this.debounceResize());
    }

    init() {
        document.querySelectorAll(this.parentSelector).forEach(parent => {
            let items = [...parent.querySelectorAll(this.itemSelector)];
            
            if (this.requireTitle) {
                items = items.filter(item => item.querySelector(this.titleSelector));
            }

            if (items.length) {
                this.equalizeHeights(items);
            }
        });
    }

    equalizeHeights(items) {
        let currentRowItems = [];
        const itemsPerRow = this.getItemsPerRow();

        items.forEach((item, index) => {
            const title = item.querySelector(this.titleSelector);
            if (!title) return;
            title.style.minHeight = 'auto'; // Reset height

            currentRowItems.push(item);

            if ((index + 1) % itemsPerRow === 0 || index === items.length - 1) {
                this.setMaxMinHeight(currentRowItems);
                currentRowItems = [];
            }
        });
    }

    setMaxMinHeight(items) {
        let maxHeight = this.minHeight;

        items.forEach(item => {
            const title = item.querySelector(this.titleSelector);
            if (!title) return;
            maxHeight = Math.max(maxHeight, title.clientHeight);
        });

        items.forEach(item => {
            const title = item.querySelector(this.titleSelector);
            if (!title) return;
            title.style.minHeight = `${maxHeight}px`;
        });
    }

    getItemsPerRow() {
        const width = window.innerWidth;
        let itemsPerRow = 1;

        Object.keys(this.breakpoints)
            .sort((a, b) => b - a) // Sort descending
            .some(breakpoint => {
                if (width > breakpoint) {
                    itemsPerRow = this.breakpoints[breakpoint];
                    return true;
                }
                return false;
            });

        return itemsPerRow;
    }

    debounceResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => this.init(), 100);
    }
}

// Usage Example
new TitleHeightEqualizer(
    '.product-grid', 
    '.grid__item', 
    '.cstm-card-product-title', 
    { 1400: 4, 900: 2, 600: 2 }, 
    true
);
