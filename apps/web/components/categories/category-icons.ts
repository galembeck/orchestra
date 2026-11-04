import type { CategoryKey } from "@orchestra/shared/constants/categories";
import {
  AirVentIcon,
  HammerIcon,
  type LucideIcon,
  PaintRollerIcon,
  ShieldCheckIcon,
  ShowerHeadIcon,
  SproutIcon,
  TruckIcon,
  ZapIcon,
} from "lucide-react";

export const CATEGORY_ICONS = {
  airConditioning: AirVentIcon,
  carpentry: HammerIcon,
  electrician: ZapIcon,
  gardening: SproutIcon,
  moving: TruckIcon,
  painter: PaintRollerIcon,
  pestControl: ShieldCheckIcon,
  plumber: ShowerHeadIcon,
} as const satisfies Record<CategoryKey, LucideIcon>;
