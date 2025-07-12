import { WatermarkTypes } from "./captcha.types";

export const WATERMARKS: WatermarkTypes[] = ["circle", "square", "triangle"];
export const ENTITY_PER_WATERMARK = 4;

export const SECTION_LENGTH = 25; // Total section length of the captcha puzzle
export const MAX_ATTEMPT_TOLERANCE = 5; // Maximum number of attempts
