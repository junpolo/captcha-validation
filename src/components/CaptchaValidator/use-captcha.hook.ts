import React from "react";

import { CaptchaSection, WatermarkTypes, CaptchaConfig } from "./captcha.types";
import {
  MAX_ATTEMPT_TOLERANCE,
  SECTION_LENGTH,
  WATERMARKS,
} from "./captcha.constants";

export const useCaptcha = () => {
  // Captcha state
  const [captchaConfig, setCaptchaConfig] =
    React.useState<CaptchaConfig | null>(null);

  // User selection and attempt states
  const [selectedSections, setSelectedSections] = React.useState<number[]>([]);
  const [attemptCount, setAttemptCount] = React.useState(MAX_ATTEMPT_TOLERANCE);

  // Generate captcha configurations
  const randomizeWatermarkReference = React.useCallback(
    () => WATERMARKS[Math.floor(Math.random() * WATERMARKS.length)],
    []
  );

  const generateWatermarks = React.useCallback(() => {
    const captcha: CaptchaSection = {};

    WATERMARKS.forEach((watermark) => {
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
    return captchaConfig?.captchaData[key] || null;
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

  const generateCaptchaConfig = (resetAttemptCount = false) => {
    setCaptchaConfig({
      isCaptchaValid: false,
      captchaData: generateWatermarks(),
      watermarkReference: randomizeWatermarkReference(),
    });

    setSelectedSections([]);
    if (resetAttemptCount) setAttemptCount(MAX_ATTEMPT_TOLERANCE);
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
      // setIsCaptchaValid(true);
      setCaptchaConfig((prevConfig) => {
        return {
          ...prevConfig,
          isCaptchaValid: true,
        } as CaptchaConfig;
      });

      setAttemptCount(MAX_ATTEMPT_TOLERANCE);
    } else {
      generateCaptchaConfig();
      setAttemptCount((prevCount) => prevCount - 1);
    }
  };

  const validateCaptcha = React.useCallback(() => {
    if (!captchaConfig) {
      console.warn("There is no captcha configuration initialized");
      return false;
    }
    const { captchaData, watermarkReference } = captchaConfig;

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
  }, [captchaConfig, selectedSections]);

  // TODO: Remove after button init
  React.useEffect(() => {
    generateCaptchaConfig(true);
  }, []);

  return {
    SECTION_LENGTH,
    captchaConfig,
    getShapeForSection,
    getImageSrc,
    handleSectionClick,
    selectedSections,
    getSectionBackgroundColor,
    handleValidateButton,
    attemptCount,
    generateCaptchaConfig,
  };
};
