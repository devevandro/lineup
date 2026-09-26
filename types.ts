export type RosterCategory = "futsal" | "campo";

export type PlayerRow = {
  id: string;
  name: string;
  nickname: string;
  number_campo: string | null;
  number_futsal: string | null;
  position_futsal: string | null;
  position_campo: string | null;
  modality: RosterCategory[] | string | null;
  birthday: string | Date | null;
  dominant_foot: string | null;
  quote: string | null;
  social_media?: string | null;
  image: string | null;
};
