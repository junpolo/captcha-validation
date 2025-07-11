import Image from "next/image";

import { Button } from "@components";
import { useCaptcha } from "./use-captcha.hook";

export const CaptchaValidator = () => {
  const {
    SECTION_LENGTH,
    getShapeForSection,
    getImageSrc,
    watermarkReference,
    handleSectionClick,
    selectedSections,
    getSectionBackgroundColor,
    handleValidateButton,
    attemptCount,
  } = useCaptcha();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-rows-5 grid-cols-5">
        {Array.from({ length: SECTION_LENGTH }, (_, index) => {
          const shape = getShapeForSection(index);
          const imageSrc = getImageSrc(shape);

          return (
            <div
              key={index}
              className={`p-6 flex justify-center border-2 border-gray-300 ${getSectionBackgroundColor(
                index
              )} cursor-pointer`}
              onClick={() => handleSectionClick(index)}
            >
              {imageSrc && (
                <Image
                  src={imageSrc}
                  width={50}
                  height={50}
                  alt={`shape-${index}`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 justify-center">
        <p className="text-center">Validation attempt left: {attemptCount}</p>

        {attemptCount > 0 && (
          <Button onClick={handleValidateButton}>Validate</Button>
        )}
      </div>
    </div>
  );
};
