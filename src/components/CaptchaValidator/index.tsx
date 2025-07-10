import Image from "next/image";

import { useCaptcha } from "./use-captcha.hook";

export const CaptchaValidator = () => {
  const { SECTION_LENGTH, getShapeForSection, getImageSrc } = useCaptcha();

  return (
    <div className="grid grid-rows-5 grid-cols-5">
      {Array.from({ length: SECTION_LENGTH }, (_, index) => {
        const shape = getShapeForSection(index);
        const imageSrc = getImageSrc(shape);

        return (
          <div
            className="p-6 flex justify-center border-2 border-gray-300 bg-gray-500/25"
            key={index}
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
  );
};
