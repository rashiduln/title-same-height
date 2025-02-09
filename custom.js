 
      class TitleHeightEqualizer {
          constructor(parentSelector, itemSelector, titleSelector, breakpoints, requireTitle = false) {
              this.parentSelector = parentSelector; // The main container that holds items
              this.itemSelector = itemSelector; // The individual items inside the parent
              this.titleSelector = titleSelector; // The title inside each item
              this.breakpoints = breakpoints; // Custom breakpoints for responsiveness
              this.requireTitle = requireTitle; // If true, only applies if titles exist
              this.minHeight = 1 * 1.2 * parseFloat(getComputedStyle(document.documentElement).fontSize);
  
              this.init();
          }
  
          init() {
              const parent = document.querySelector(this.parentSelector);
              if (!parent) return; // If the parent container doesn't exist, stop execution
  
              let items = [...parent.querySelectorAll(this.itemSelector)];
  
              // If requireTitle is enabled, filter out items without a title
              if (this.requireTitle) {
                  items = items.filter(item => item.querySelector(this.titleSelector));
              }
  
              if (items.length) {
                  this.equalizeHeights(items);
                  window.addEventListener('resize', () => this.equalizeHeights(items));
              }
          }
  
          equalizeHeights(items) {
              let currentRowItems = [];
              const itemsPerRow = this.getItemsPerRow();
  
              items.forEach((item, index) => {
                  const title = item.querySelector(this.titleSelector);
                  if (!title) return;
                  title.style.minHeight = 'auto'; // Reset for recalculation
  
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
                  const height = title.clientHeight;
                  if (height > maxHeight) {
                      maxHeight = height;
                  }
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
      }
  
      // Example Usage
      new TitleHeightEqualizer(
          '.product-grid', // Parent container
          '.grid__item', // Individual items inside the parent
          '.cstm-card-product-title', // Title inside each item
          { 1400: 4, 900: 3, 600: 2 }, // Responsive breakpoints
          true // Only apply if titles exist
      ); 
