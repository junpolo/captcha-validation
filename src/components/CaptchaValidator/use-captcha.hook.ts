import React from "react";

type WatermarkTypes = "circle" | "square" | "triangle";

type CaptchaSection = {
  [key: string]: WatermarkTypes;
};

export const useCaptcha = () => {
  const SECTION_LENGTH = 25;
  const watermarks: WatermarkTypes[] = ["circle", "square", "triangle"];

  const [captchaData, setCaptchaData] = React.useState<CaptchaSection>({});

  const generateWatermarks = React.useCallback(() => {
    const captcha: CaptchaSection = {};

    watermarks.forEach((watermark) => {
      let count = 0;

      while (count < 4) {
        const randomKey = Math.floor(
          Math.random() * (SECTION_LENGTH + 1)
        ).toString();

        if (!captcha.hasOwnProperty(randomKey)) {
          captcha[randomKey] = watermark;
          count++;
        }
      }
    });

    return captcha;
  }, []);

  const getShapeForSection = (index: number) => {
    const key = index.toString();
    return captchaData[key] || null;
  };
  const getImageSrc = (shape: WatermarkTypes | null) => {
    switch (shape) {
      case "circle":
        return "circle.svg";
      case "square":
        return "square.svg";
      case "triangle":
        return "triangle.svg";
      default:
        return null;
    }
  };

  React.useEffect(() => {
    setCaptchaData(generateWatermarks());
  }, [generateWatermarks]);

  return {
    SECTION_LENGTH,
    captchaData,
    getShapeForSection,
    getImageSrc,
  };
};
