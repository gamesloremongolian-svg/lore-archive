import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'mn.loreverse.app',
  appName: 'LOREVERSE',
  webDir: 'www',
  bundledWebRuntime: false,
  backgroundColor: '#ffffff',
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile'
  },
  android: {
    allowMixedContent: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#101827',
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#101827'
    },
    Keyboard: {
      resize: 'native',
      style: 'light'
    }
  }
};

export default config;
