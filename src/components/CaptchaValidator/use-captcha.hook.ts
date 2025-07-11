import React from "react";

type WatermarkTypes = "circle" | "square" | "triangle";

type CaptchaSection = {
  [key: string]: WatermarkTypes;
};

const SECTION_LENGTH = 25;
const MAX_ATTEMPT_TOLERANCE = 5;
const watermarks: WatermarkTypes[] = ["circle", "square", "triangle"];

export const useCaptcha = () => {
  const [captchaData, setCaptchaData] = React.useState<CaptchaSection>({});
  const [watermarkReference, setWatermarkReference] =
    React.useState<WatermarkTypes | null>("square");

  const [selectedSections, setSelectedSections] = React.useState<number[]>([]);

  const [attemptCount, setAttemptCount] = React.useState(MAX_ATTEMPT_TOLERANCE);

  // Generate watermarks
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

  // Handle section actions
  const handleSectionClick = (index: number) => {
    setSelectedSections((prevSelected) => {
      // Remove from array if index is already selected
      if (prevSelected.includes(index)) {
        return prevSelected.filter((item) => item !== index);
      }

      return [...prevSelected, index];
    });
  };

  const getSectionBackgroundColor = (index: number) =>
    selectedSections.includes(index) ? "bg-blue-500" : "bg-gray-500/25";

  // Handle captcha validations
  const handleValidateButton = () => {
    const isValid = validateCaptcha();

    if (isValid) {
      setAttemptCount(MAX_ATTEMPT_TOLERANCE);
    } else {
      setAttemptCount((prevCount) => prevCount - 1);
    }
  };

  const validateCaptcha = React.useCallback(() => {
    if (!watermarkReference) {
      console.warn("There is no watermark reference.");
      return false;
    }

    // Get all correct indexes based on the watermarkReference
    const correctIndexes: number[] = [];
    for (const key in captchaData) {
      if (captchaData[key] === watermarkReference) {
        correctIndexes.push(parseInt(key));
      }
    }

    // Sort both arrays for consistent comparison
    const sortSelected = [...selectedSections].sort((a, b) => a - b);
    const sortCorrect = [...correctIndexes].sort((a, b) => a - b);

    // Check if the selected sections has the same length as the correct indexes
    if (sortSelected.length !== sortCorrect.length) {
      console.log("Validation Failed: Incorrect number of sections");
      return false;
    }

    // Check if every selected section is the same as the correct indexes
    const isValid = sortSelected.every((selectedIndex, index) => {
      return selectedIndex === sortCorrect[index];
    });

    // Add to attempt to attemptCount state
    if (!isValid) {
      console.log("Validation Failed: Incorrect sections");
    }

    return isValid;
  }, [captchaData, selectedSections, watermarkReference]);

  // TODO: Remove after button init
  React.useEffect(() => {
    setCaptchaData(generateWatermarks());
  }, [generateWatermarks]);

  return {
    SECTION_LENGTH,
    captchaData,
    getShapeForSection,
    getImageSrc,
    watermarkReference,
    handleSectionClick,
    selectedSections,
    getSectionBackgroundColor,
    handleValidateButton,
    attemptCount,
  };
};
