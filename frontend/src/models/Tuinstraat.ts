export type TuinstraatId = string;

export interface Tuinstraat {
  id: TuinstraatId;
  name: string;
  status: string;
  type: string | null;
  eligibleType1: boolean | null;
  eligibleType2: boolean | null;
  eligibleType3: boolean | null;
  benefitsType1: number;
  benefitsType2: number;
  benefitsType3: number;
  costsType1: number;
  costsType2: number;
  costsType3: number;
  profitsType1: number;
  profitsType2: number;
  profitsType3: number;
  evaluation: string | null;
  remarks: string | null;
  area: number;
  geometry: object;
}

export type FormGardenStreet = Pick<
  Tuinstraat,
  | 'name'
  | 'status'
  | 'type'
  | 'eligibleType1'
  | 'eligibleType2'
  | 'eligibleType3'
  | 'evaluation'
  | 'remarks'
> & { geometry: object | null };
