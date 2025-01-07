// By default, the global Window interface does not include a toggleDevtools
// method which added by ClientQueryProvider. To make TypeScript recognize
// window.toggleDevtools as a valid property, we extend the Window interface
// inside the declare global block.
declare global {
  interface Window {
    toggleDevtools: () => void;
    FB: any;
    instgrm: any;
  }
}

export {}; // Ensures the file is treated as a module.
