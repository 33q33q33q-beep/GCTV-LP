export interface TokuhainMapPinRow {
  id: string;
  place_title: string;
  reporter_name: string;
  image_url: string;
  link_url: string;
  description: string;
  pin_x_percent: number;
  pin_y_percent: number;
  sort_order: number;
  published: boolean;
}

/** TravelMapSection 用（従来の locations 形） */
export interface TravelMapLocationVm {
  id: string | number;
  name: string;
  reporter: string;
  image: string;
  position: { top: string; left: string };
  youtube: string;
  description: string;
}

export function pinRowToTravelVm(row: TokuhainMapPinRow): TravelMapLocationVm {
  return {
    id: row.id,
    name: row.place_title,
    reporter: row.reporter_name,
    image: row.image_url,
    position: {
      left: `${row.pin_x_percent}%`,
      top: `${row.pin_y_percent}%`,
    },
    youtube: row.link_url,
    description: row.description,
  };
}
