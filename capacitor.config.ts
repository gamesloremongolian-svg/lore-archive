import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'mn.loreverse.app',
  appName: 'LOREVERSE',
  webDir: 'www',
  bundledWebRuntime: false,
  backgroundColor: '#101827',
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
      style: 'LIGHT',
      backgroundColor: '#101827'
    },
    Keyboard: {
      resize: 'native',
      style: 'dark'
    }
  }
};

export default config;
