function ua(): string {
  return typeof navigator === 'undefined' ? '' : navigator.userAgent;
}

/** Mengembalikan nama aplikasi jika halaman dibuka di browser bawaan aplikasi (sering memblokir kamera). */
export function detectInAppBrowser(): string | null {
  const s = ua();
  if (/Instagram/i.test(s)) return 'Instagram';
  if (/FBAN|FBAV|FB_IAB/i.test(s)) return 'Facebook';
  if (/TikTok|musical_ly|BytedanceWebview/i.test(s)) return 'TikTok';
  if (/Line\//i.test(s)) return 'LINE';
  if (/MicroMessenger/i.test(s)) return 'WeChat';
  if (/Snapchat/i.test(s)) return 'Snapchat';
  if (/Twitter/i.test(s)) return 'X (Twitter)';
  return null;
}

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(ua()) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(ua()) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function hasCameraSupport(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function';
}
