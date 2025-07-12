import { act, renderHook } from "@testing-library/react";

import { useCaptcha } from "../components/CaptchaValidator/use-captcha.hook";
import {
  WATERMARKS,
  MAX_ATTEMPT_TOLERANCE,
  SECTION_LENGTH,
} from "../components/CaptchaValidator/captcha.constants";
import { WatermarkTypes } from "../components/CaptchaValidator/captcha.types";

describe("useCaptcha hook", () => {
  beforeEach(() => {
    let currentKeyIndex = 0;

    jest.spyOn(global.Math, "random").mockImplementation(() => {
      const value = (currentKeyIndex % SECTION_LENGTH) / SECTION_LENGTH + 0.001;
      currentKeyIndex++;
      return value;
    });
  });

  afterEach(() => {
    jest.spyOn(global.Math, "random").mockRestore();
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  it("should initialize with correct default states", () => {
    const { result } = renderHook(() => useCaptcha());

    expect(result.current.captchaConfig).toBeNull();
    expect(result.current.selectedSections).toEqual([]);
    expect(result.current.attemptCount).toBe(MAX_ATTEMPT_TOLERANCE);
    expect(result.current.SECTION_LENGTH).toBe(SECTION_LENGTH);
  });

  test("generateWatermarks should create a captcha data with 16 unique sections and 4 of each watermark", () => {
    const { result } = renderHook(() => useCaptcha());
    const captchaData = result.current.generateWatermarks();

    expect(Object.keys(captchaData).length).toBe(12); // Ensure 12 sections
    expect(
      Object.keys(captchaData).every(
        (key) => parseInt(key) >= 0 && parseInt(key) < SECTION_LENGTH
      )
    ).toBe(true); // Ensure keys are valid indexes

    const watermarkCounts: { [key in WatermarkTypes]: number } = {
      circle: 0,
      square: 0,
      triangle: 0,
    };

    for (const key in captchaData) {
      watermarkCounts[captchaData[key]]++;
    }

    // Each watermark should appear exactly 4 times
    expect(watermarkCounts.circle).toBe(4);
    expect(watermarkCounts.square).toBe(4);
    expect(watermarkCounts.triangle).toBe(4);
  });

  test("getShapeForSection should return the correct shape for a given index", () => {
    const { result, rerender } = renderHook(() => useCaptcha());

    // Override captchaConfig for deterministic testing
    act(() => {
      (result.current as any).setCaptchaConfig({
        isCaptchaValid: false,
        captchaData: {
          "0": "circle",
          "1": "square",
          "2": "triangle",
          "3": "circle",
          "4": "square",
          "5": "triangle",
          "6": "circle",
          "7": "square",
          "8": "triangle",
          "9": "circle",
          "10": "square",
          "11": "triangle",
          "12": "circle",
          "13": "square",
          "14": "triangle",
          "15": "circle",
        },
        watermarkReference: "circle",
      });
    });

    rerender(); // Rerender to ensure the state update is applied

    expect(result.current.getShapeForSection(0)).toBe("circle");
    expect(result.current.getShapeForSection(1)).toBe("square");
    expect(result.current.getShapeForSection(15)).toBe("circle");
    expect(result.current.getShapeForSection(99)).toBeNull(); // Index out of bounds
  });

  it("getImageSrc should return the correct SVG path for each watermark type", () => {
    const { result } = renderHook(() => useCaptcha());

    expect(result.current.getImageSrc("circle")).toBe("circle.svg");
    expect(result.current.getImageSrc("square")).toBe("square.svg");
    expect(result.current.getImageSrc("triangle")).toBe("triangle.svg");
    expect(result.current.getImageSrc(null)).toBeNull();
    expect(result.current.getImageSrc("invalid" as WatermarkTypes)).toBeNull();
  });

  describe("generateCaptchaConfig", () => {
    it("should generate a new captchaConfig and reset selectedSections", () => {
      const { result } = renderHook(() => useCaptcha());

      act(() => {
        result.current.generateCaptchaConfig();
      });

      const { captchaConfig, selectedSections } = result.current;

      expect(captchaConfig).not.toBeNull();
      expect(captchaConfig?.isCaptchaValid).toBe(false);
      expect(captchaConfig?.watermarkReference).toBeDefined();
      expect(WATERMARKS).toContain(captchaConfig?.watermarkReference);
      expect(
        Object.keys(captchaConfig?.captchaData || {}).length
      ).toBeGreaterThan(0);
      expect(selectedSections).toEqual([]);
    });

    it("should reset attemptCount when resetAttemptCount is true", () => {
      const { result } = renderHook(() => useCaptcha());

      // simulate change in attempt count
      act(() => {
        result.current.setAttemptCount(1);
      });

      expect(result.current.attemptCount).toBe(1);

      // call with resetAttemptCount = true
      act(() => {
        result.current.generateCaptchaConfig(true);
      });

      expect(result.current.attemptCount).toBe(MAX_ATTEMPT_TOLERANCE);
    });

    it("should not reset attemptCount when resetAttemptCount is false", () => {
      const { result } = renderHook(() => useCaptcha());

      act(() => {
        result.current.setAttemptCount(2);
      });

      act(() => {
        result.current.generateCaptchaConfig(false);
      });

      expect(result.current.attemptCount).toBe(2);
    });
  });

  it("handleSectionClick should add and remove sections from selectedSections", () => {
    const { result } = renderHook(() => useCaptcha());

    // Add a section
    act(() => {
      result.current.handleSectionClick(5);
    });
    expect(result.current.selectedSections).toEqual([5]);
    ``;

    // Add another section
    act(() => {
      result.current.handleSectionClick(10);
    });
    expect(result.current.selectedSections).toEqual([5, 10]);

    // Remove an existing section
    act(() => {
      result.current.handleSectionClick(5);
    });
    expect(result.current.selectedSections).toEqual([10]);

    // Click a non-existent section (should not be in selectedSections)
    act(() => {
      result.current.handleSectionClick(99);
    });
    expect(result.current.selectedSections).toEqual([10, 99]); // It adds if not present
  });

  it("getSectionBackgroundColor should return correct class based on selection", () => {
    const { result } = renderHook(() => useCaptcha());

    // Initially, no sections selected
    expect(result.current.getSectionBackgroundColor(0)).toBe("bg-gray-500/25");

    // Select a section
    act(() => {
      result.current.handleSectionClick(0);
    });
    expect(result.current.getSectionBackgroundColor(0)).toBe("bg-blue-500");
    expect(result.current.getSectionBackgroundColor(1)).toBe("bg-gray-500/25");
  });
});
