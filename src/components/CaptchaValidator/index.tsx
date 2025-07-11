import React from "react";
import Image from "next/image";

import { Button } from "@components";
import { EntryComponent } from "./entry.component";
import { useCaptcha } from "./use-captcha.hook";
import { MAX_ATTEMPT_TOLERANCE } from "./captcha.constants";

export const CaptchaValidator = () => {
  const {
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
  } = useCaptcha();

  const canValidate = React.useMemo(() => attemptCount > 0, [attemptCount]);
  const onError = React.useMemo(
    () => attemptCount < MAX_ATTEMPT_TOLERANCE,
    [attemptCount]
  );

  // return <EntryComponent onContinue={() => generateCaptchaConfig(true)} />;

  if (captchaConfig?.isCaptchaValid) {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-center text-4xl font-semibold capitalize">
          Well done!
        </h1>

        <p className="text-center text-2xl font-semibold">
          You have proven your humanity.
        </p>

        <Button onClick={() => generateCaptchaConfig(true)}>reCAPTCHA</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {canValidate && (
        <>
          <h1 className="text-center text-4xl font-semibold capitalize">
            Select {captchaConfig?.watermarkReference + "s"}
          </h1>

          {onError && (
            <p className="text-center text-xl font-semibold bg-red-200 text-red-500 border-red-500 border-1 p-2 rounded-md">
              Invalid selection, "human". Please try again
            </p>
          )}
        </>
      )}

      {canValidate ? (
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
      ) : (
        <Image
          src="/recaptcha-meme.png"
          width={600}
          height={600}
          alt="im-a-robot"
        />
      )}

      <div className="flex flex-col gap-3 justify-center">
        {canValidate ? (
          <>
            <p className="text-center">
              Validation attempts left: {attemptCount}
            </p>
            <Button onClick={handleValidateButton}>Validate</Button>
          </>
        ) : (
          <>
            <p className="text-center">
              You have reached the maximum validation attempts!
            </p>

            <button
              className="text-center hover:cursor-pointer hover:underline text-2xl"
              onClick={() => generateCaptchaConfig(true)}
            >
              Prove that I'm a human 😤
            </button>
          </>
        )}
      </div>
    </div>
  );
};
