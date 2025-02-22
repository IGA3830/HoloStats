import type { Translations } from "./data";

import locale from "@angular/common/locales/zh-Hant";
import dateFnsLocale from "date-fns/locale/zh-TW";

const translations: Translations = {
  // UI
  updatedAt: "更新于 {$INTERPOLATION}",
  name: "名稱",
  total: "總計",
  subscribers: "訂閱",
  views: "觀看",
  lastDay: "日增",
  last7Days: "週增",
  last30Days: "月增",
  youtubeChannel: "YouTube 頻道",
  bilibiliChannel: "Bilibili 頻道",
  youtubeStream: "YouTube 直播",
  youtubeSchedule: "YouTube 預定直播",
  settings: "設置",
  toggleDarkMode: "切換夜間模式",
  averageViewers: "平均同接",
  maximumViewers: "最高同接",
  streamHasEnded: "直播結束",
  streaming: "正在直播",
  streamStartTime: "開始時間",
  streamDuration: "持續時間",
  youtubeSubscribers: "YouTube 訂閱",
  bilibiliSubscribers: "Bilibili 訂閱",
  youtubeViews: "YouTube 播放",
  bilibiliViews: "Bilibili 播放",
  vtuberSelected: "已選取的 VTuber",
  selectLanguage: "選擇語言",
  recentStreams: "最近直播",
  streamViewers: "直播同接",
  selectDate: "選擇日期",
  noStream: "{$INTERPOLATION}: 无直播",
  streamTimeOn: "{$INTERPOLATION_1}: 直播時間 {$INTERPOLATION}",
  streamTimes: "直播時間",

  // VTubers
  hololive: "ホロライブ公式",
  yagoo: "YAGOO",
  sora: "ときのそら",
  roboco: "ロボ子さん",
  miko: "さくらみこ",
  suisei: "星街すいせい",
  fubuki: "白上フブキ",
  matsuri: "夏色まつり",
  haato: "赤井はあと",
  aki: "アキロゼ",
  mel: "夜空メル",
  choco: "癒月ちょこ",
  choco_alt: "癒月ちょこ Sub",
  shion: "紫咲シオン",
  aqua: "湊あくあ",
  subaru: "大空スバル",
  ayame: "百鬼あやめ",
  pekora: "兎田ぺこら",
  rushia: "潤羽るしあ",
  flare: "不知火フレア",
  marine: "宝鐘マリン",
  noel: "白銀ノエル",
  kanata: "天音かなた",
  coco: "桐生ココ",
  watame: "角巻わため",
  towa: "常闇トワ",
  himemoriluna: "姫森ルーナ",
  lamy: "雪花ラミィ",
  nene: "桃鈴ねね",
  botan: "獅白ぼたん",
  polka: "尾丸ポルカ",
  chloe: "沙花叉クロヱ",
  iroha: "風真いろは",
  koyori: "博衣こより",
  laplus: "ラプラス・ダークネス",
  lui: "鷹嶺ルイ",
  mio: "大神ミオ",
  okayu: "猫又おかゆ",
  korone: "戌神ころね",
  azki: "AZKi",
  risu: "Ayunda Risu",
  moona: "Moona Hoshinova",
  iofi: "Airani Iofifteen",
  ollie: "Kureiji Ollie",
  melfissa: "Anya Melfissa",
  reine: "Pavolia Reine",
  amelia: "Watson Amelia",
  calliope: "Mori Calliope",
  gura: "Gawr Gura",
  inanis: "Ninomae Ina'nis",
  kiara: "Takanashi Kiara",
  irys: "IRyS",
  sana: "Tsukumo Sana",
  ceres: "Ceres Fauna",
  ouro: "Ouro Kronii",
  mumei: "Nanashi Mumei",
  hakos: "Hakos Baelz",
  luna: "輝夜月",
  nekomiya: "猫宮ひなた",
  tamaki: "犬山たまき",
  ayamy: "あやみ",
  nabi: "蒼彩なび",
  pochimaru: "ぽちまる",
  nana: "カグラナナ",
  ui: "しぐれうい",
  miyabi: "花咲みやび",
  izuru: "奏手イヅル",
  aruran: "アルランディス",
  rikka: "律可",
  astel: "アステル・レダ",
  temma: "岸堂天真",
  roberu: "夕刻ロベル",
  shien: "影山シエン",
  oga: "荒咬オウガ",

  // Batches
  hololive_og: "ホロライブ無印",
  hololive_1st: "ホロライブ1期生",
  hololive_2nd: "ホロライブ2期生",
  hololive_3rd: "ホロライブ3期生",
  hololive_4th: "ホロライブ4期生",
  hololive_5th: "ホロライブ5期生",
  hololive_6th: "ホロライブ6期生",
  hololive_gamers: "ホロライブゲーマーズ",
  innk_music: "イノナカミュージック",
  hololive_id_1st: "ホロライブインドネシア1期生",
  hololive_id_2nd: "ホロライブインドネシア2期生",
  hololive_en_myth: "ホロライブEnglish -Myth-",
  hololive_en_vsinger: "ホロライブ English VSinger",
  hololive_en_council: "ホロライブEnglish -議会-",
  holostars_1st: "ホロスターズ1期生",
  holostars_2nd: "ホロスターズ2期生",
  holostars_3rd: "ホロスターズ3期生",
  others: "その他",
};

export default translations;

export { locale, dateFnsLocale, translations };
