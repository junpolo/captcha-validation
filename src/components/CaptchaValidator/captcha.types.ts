export type WatermarkTypes = "circle" | "square" | "triangle";

export type CaptchaSection = {
  [key: string]: WatermarkTypes;
};

export type CaptchaConfig = {
  isCaptchaValid: boolean;
  watermarkReference: WatermarkTypes;
  captchaData: CaptchaSection;
};
