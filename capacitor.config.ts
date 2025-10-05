import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.krishgaur.romajichallenge',
  appName: 'Romaji Challenge',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    hostname: 'romaji-challenge.app',
    iosScheme: 'ionic'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ff87b2",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
      androidSplashResourceName: "splash",
      iosSplashResourceName: "splash"
    },
    StatusBar: {
      style: "light",
      backgroundColor: "#ff87b2",
      overlaysWebView: false
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true
    }
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#ff87b2",
    webContentsDebuggingEnabled: false,
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'APK'
    }
  },
  ios: {
    backgroundColor: "#ff87b2",
    contentInset: "automatic",
    scrollEnabled: true,
    webContentsDebuggingEnabled: false
  }
};

export default config;
