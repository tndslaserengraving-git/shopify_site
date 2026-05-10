export type ProductType =
  | 'cutting-board'
  | 'business-cards'
  | 'granite'
  | 'acrylic'
  | 'wine-caddy'
  | 'other';

export type Material = 'wood' | 'slate' | 'acrylic' | 'glass' | 'metal';
export type DesignStyle = 'text' | 'artwork' | 'upload';
export type ContactMethod = 'email' | 'phone';

export interface WizardState {
  step: 1 | 2 | 3 | 4;
  productType: ProductType | '';
  engraveText: string;
  size: string;
  quantity: number;
  material: Material | '';
  designStyle: DesignStyle | '';
  referenceImage: File | null;
  notes: string;
  name: string;
  email: string;
  phone: string;
  contactMethod: ContactMethod;
}

export const initialWizardState: WizardState = {
  step: 1,
  productType: '',
  engraveText: '',
  size: '',
  quantity: 1,
  material: '',
  designStyle: '',
  referenceImage: null,
  notes: '',
  name: '',
  email: '',
  phone: '',
  contactMethod: 'email',
};

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  'cutting-board': 'Cutting Board',
  'business-cards': 'Business Cards',
  granite: 'Granite Cutting Board',
  acrylic: 'Acrylic',
  'wine-caddy': 'Wine Caddy',
  other: 'Custom / Other',
};

export const MATERIAL_LABELS: Record<Material, string> = {
  wood: 'Wood',
  slate: 'Slate',
  acrylic: 'Acrylic',
  glass: 'Glass',
  metal: 'Metal',
};

export const SIZE_OPTIONS: Record<ProductType, string[]> = {
  'cutting-board': ['8×10"', '10×14"', '12×18"', '14×20"', 'Custom'],
  'business-cards': ['Standard 3.5×2"', 'Square 2.5×2.5"', 'Custom'],
  granite: ['8×10"', '12×16"', 'Custom'],
  acrylic: ['4×6"', '8×10"', '12×16"', 'Custom'],
  'wine-caddy': ['Single Bottle', '2-Bottle', '3-Bottle', 'Custom'],
  other: ['Custom'],
};
