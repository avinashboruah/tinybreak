export class CrazyGamesSDK {
  constructor() {
    this.sdk = null;
    this.initialized = false;
    this.audioInstance = null;
  }

  async init(audioInstance) {
    this.audioInstance = audioInstance;
    if (window.CrazyGames && window.CrazyGames.SDK) {
      try {
        this.sdk = window.CrazyGames.SDK;
        await this.sdk.init();
        this.initialized = true;
        console.log("CrazyGames SDK Initialized successfully");

        // Set up mute listener
        if (this.audioInstance) {
          const initialMute = this.sdk.game?.settings?.muteAudio;
          if (initialMute) {
            this.audioInstance.setMute(true);
          }
          this.sdk.game?.addSettingsChangeListener((newSettings) => {
            this.audioInstance.setMute(newSettings.muteAudio);
          });
        }
      } catch (e) {
        console.warn("Failed to initialize CrazyGames SDK", e);
      }
    } else {
      console.log("CrazyGames SDK not detected. Running in standard local fallback mode.");
    }
  }

  getItem(key) {
    if (this.initialized && this.sdk?.data) {
      try {
        const val = this.sdk.data.getItem(key);
        // SDK data.getItem might return null or a string
        return val;
      } catch (e) {
        console.warn("CrazyGames SDK data.getItem failed, falling back to localStorage", e);
      }
    }
    return localStorage.getItem(key);
  }

  setItem(key, value) {
    if (this.initialized && this.sdk?.data) {
      try {
        this.sdk.data.setItem(key, String(value));
        return;
      } catch (e) {
        console.warn("CrazyGames SDK data.setItem failed, falling back to localStorage", e);
      }
    }
    localStorage.setItem(key, String(value));
  }

  gameplayStart() {
    if (this.initialized && this.sdk?.game) {
      this.sdk.game.gameplayStart();
    }
  }

  gameplayStop() {
    if (this.initialized && this.sdk?.game) {
      this.sdk.game.gameplayStop();
    }
  }

  requestAd(type, callbacks) {
    if (this.initialized && this.sdk?.ad) {
      this.sdk.ad.requestAd(type, callbacks);
    } else {
      console.log(`Fallback: Ad of type ${type} requested.`);
      if (callbacks.adStarted) callbacks.adStarted();
      setTimeout(() => {
        if (callbacks.adFinished) callbacks.adFinished();
      }, 1000);
    }
  }
}

export const sdk = new CrazyGamesSDK();
