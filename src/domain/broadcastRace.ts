/** DB row */
export interface BroadcastRaceRow {
  id: string;
  race_date: string;
  title: string;
  subtitle: string;
  note: string;
  live_url: string;
  archive_url: string;
  published: boolean;
  sort_order: number;
}

/** 画面表示用（日付バッジの文言など込み） */
export interface BroadcastRaceVm {
  id?: string;
  race_date: string;
  /** 画面上部のバッジ例: 7月5日（日） */
  dateLabel: string;
  title: string;
  subtitle: string;
  /** 備考・アスタ調整など */
  note: string;
  live_url: string;
  archive_url: string;
  published?: boolean;
  sort_order?: number;
}
