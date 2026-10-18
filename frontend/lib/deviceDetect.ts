// Device & In-App Browser Detection Utility
// Optimizes memory allocation, WebGL canvas buffers, and animation frame-rates
// for Android Chromium WebViews (Meta/Instagram, Facebook, TikTok)

export function isAndroid(): boolean {
  if (typeof window === "undefined" || !navigator.userAgent) return false;
  return /Android/i.test(navigator.userAgent);
}

export function isInAppBrowser(): boolean {
  if (typeof window === "undefined" || !navigator.userAgent) return false;
  const ua = navigator.userAgent;
  // Instagram, Facebook, Meta IAB, TikTok, Twitter/X
  return /(Instagram|FBAN|FBAV|FB_IAB|FBSS|TikTok|Twitter|Snapchat)/i.test(ua);
}

export function isRestrictedMobileWebView(): boolean {
  return isAndroid() && isInAppBrowser();
}

export function getRecommendedDpr(): number {
  if (typeof window === "undefined") return 1;
  const nativeDpr = window.devicePixelRatio || 1;
  // In Android or In-App WebViews, capping DPR at 1.0 - 1.25 prevents 90MB+ canvas memory spikes
  if (isAndroid() || isInAppBrowser()) {
    return Math.min(nativeDpr, 1.25);
  }
  return Math.min(nativeDpr, 2.0);
}
