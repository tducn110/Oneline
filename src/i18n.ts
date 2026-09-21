import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const LANGUAGE_STORAGE_KEY = "12-oneline-language";
type SupportedLanguage = "vi" | "en";
const isSupportedLanguage = (value: string | null): value is SupportedLanguage => value === "vi" || value === "en";
const getInitialLanguage = (): SupportedLanguage => { if (typeof window === "undefined") return "en"; try { const value = window.localStorage.getItem(LANGUAGE_STORAGE_KEY); return isSupportedLanguage(value) ? value : "en"; } catch { return "en"; } };
const persistLanguage = (language: string): void => { const normalized = language.split("-")[0]; if (typeof window === "undefined" || !isSupportedLanguage(normalized)) return; try { window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized); } catch { /* Optional persistence. */ } };

export const formatNumber = (value: number, lang?: string): string => {
  const current = lang || i18n.resolvedLanguage || i18n.language || "en";
  return value.toLocaleString(current.startsWith("vi") ? "vi-VN" : "en-US");
};

const syncDocumentLang = (lang: string) => {
  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.lang = lang;
  }
};

const resources = {
  vi: {
    translation: {
      common: {
        play: "Chơi",
        playNow: "Chơi ngay",
        guest: "Khách",
        playGuest: "Chơi khách",
        pause: "Tạm dừng",
        resume: "Tiếp tục",
        back: "Quay lại",
        close: "Đóng",
        retry: "Chơi lại",
        next: "Màn tiếp",
        undo: "Lùi bước",
        hint: "Gợi ý",
      },
      settings: {
        title: "Cài đặt",
        language: "Ngôn ngữ",
        music: "Nhạc nền",
        sfx: "Hiệu ứng âm thanh",
        soundToggle: "Bật/Tắt âm thanh",
        on: "Bật",
        off: "Tắt",
      },
      game: {
        title: "Cầu Tre Một Nét",
        subtitle: "Đi qua mỗi cây cầu đúng 1 lần",
        level: "Màn {{level}}",
        levelLocked: "Màn {{level}} (khóa)",
        levelBoard: "Bảng màn",
        dashboard: "Bảng thành tích",
        leaderboard: "Bảng xếp hạng",
        chooseStart: "Chọn điểm bắt đầu",
        bridgesRemaining: "{{count}} cầu còn lại",
        bridgesLeft: "Cầu còn lại",
        best: "Tốt nhất",
        winTitle: "Qua cầu thành công!",
        winSubtitle: "Bạn hoàn thành Màn {{level}}",
        stuckTitle: "Kẹt đường rồi!",
        stuckSubtitle: "Bạn đã hết nước đi hợp lệ",
      },
      login: {
        prompt: "Nhập tên để lưu điểm\nhoặc chơi khách trên thiết bị này",
        placeholder: "Tên của bạn",
        note: "Điểm khách vẫn được lưu cục bộ trên thiết bị này.",
      },
      dashboard: {
        title: "Thành tích",
        highScore: "Điểm cao",
        totalStars: "Tổng sao",
        completed: "Hoàn thành",
        totalGames: "Số ván",
        recent: "Gần đây",
        noGames: "Chưa có ván nào. Chơi một màn để bắt đầu!",
        ranks: {
          master: "Lão Làng Cầu Tre",
          expert: "Thợ Cầu Tài Hoa",
          traveler: "Người Qua Sông",
          visitor: "Khách Đầu Làng",
          novice: "Tân Binh",
        },
      },
      leaderboard: {
        title: "Xếp hạng",
        empty: "Chưa có điểm nào. Chơi một ván để ghi tên lên bảng!",
        you: "(Bạn)",
      },
    },
  },
  en: {
    translation: {
      common: {
        play: "Play",
        playNow: "Play now",
        guest: "Guest",
        playGuest: "Play as guest",
        pause: "Pause",
        resume: "Resume",
        back: "Back",
        close: "Close",
        retry: "Play again",
        next: "Next",
        undo: "Undo",
        hint: "Hint",
      },
      settings: {
        title: "Settings",
        language: "Language",
        music: "Background music",
        sfx: "Sound effects",
        soundToggle: "Toggle sound",
        on: "On",
        off: "Off",
      },
      game: {
        title: "Single Stroke Bridge",
        subtitle: "Cross every bridge exactly once",
        level: "Level {{level}}",
        levelLocked: "Level {{level}} (locked)",
        levelBoard: "Level List",
        dashboard: "Achievements",
        leaderboard: "Leaderboards",
        chooseStart: "Choose starting point",
        bridgesRemaining: "{{count}} bridges remaining",
        bridgesLeft: "Bridges left",
        best: "Best",
        winTitle: "Bridge Crossed Successfully!",
        winSubtitle: "You cleared Level {{level}}",
        stuckTitle: "Stuck on the bridge!",
        stuckSubtitle: "No more valid moves available",
      },
      login: {
        prompt: "Enter name to save high scores\nor play as guest on this device",
        placeholder: "Your name",
        note: "Guest progress is still saved locally on this device.",
      },
      dashboard: {
        title: "Achievements",
        highScore: "High Score",
        totalStars: "Total Stars",
        completed: "Completed",
        totalGames: "Total Games",
        recent: "Recent",
        noGames: "No games played yet. Clear a level to start!",
        ranks: {
          master: "Bridge Master",
          expert: "Master Craftsman",
          traveler: "River Crosser",
          visitor: "Village Visitor",
          novice: "Novice",
        },
      },
      leaderboard: {
        title: "Leaderboards",
        empty: "No scores yet. Play a round to post your score!",
        you: "(You)",
      },
    },
  },
} as const;

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    supportedLngs: ["en", "vi"],
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
syncDocumentLang(i18n.language || "en");
i18n.on("languageChanged", (lng) => {
  persistLanguage(lng);
  syncDocumentLang(lng);
});

export default i18n;
