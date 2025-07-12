import { WatermarkTypes } from "./captcha.types";

export const WATERMARKS: WatermarkTypes[] = ["circle", "square", "triangle"];
export const ENTITY_PER_WATERMARK = 4;

export const SECTION_LENGTH = 25;
export const MINIMUM_SECTION_LENGTH = WATERMARKS.length * ENTITY_PER_WATERMARK; // should be 12 or higher
export const MAX_ATTEMPT_TOLERANCE = 5;
