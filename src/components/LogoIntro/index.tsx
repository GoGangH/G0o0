"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface LogoIntroProps {
  onComplete?: () => void;
  onStarsActivate?: () => void;
}

export default function LogoIntro({ onComplete, onStarsActivate }: LogoIntroProps) {
  const gRef = useRef<HTMLDivElement>(null);
  const oRef = useRef<HTMLDivElement>(null);
  const firstOUpperRef = useRef<HTMLSpanElement>(null);
  const firstOLowerRef = useRef<HTMLSpanElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const eyesClosedRef = useRef<HTMLDivElement>(null);
  const eyesOpenRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const finalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    const handleStarsActivate = onStarsActivate;

    // Get responsive values based on container size
    const isMobile = window.innerWidth < 640;
    const moveX = isMobile ? -45 : -95;
    const moveY = isMobile ? 45 : 90;

    // ① 정지 상태 (0.5초) - 미세한 호흡 애니메이션
    tl.to(gRef.current, {
      scale: 1.02,
      duration: 0.25,
      ease: "sine.inOut",
      yoyo: true,
      repeat: 1,
    });

    // ② 모자 떨어지기 직전 - 흔들림 (0.2초)
    tl.to(gRef.current, {
      rotation: 93,
      duration: 0.1,
      ease: "power1.inOut",
    }).to(gRef.current, {
      rotation: 87,
      duration: 0.1,
      ease: "power1.inOut",
    });

    // ③ G 낙하 (0.4초) - 중력감 있게
    tl.to(gRef.current, {
      x: moveX,
      y: moveY,
      rotation: 0,
      duration: 0.4,
      ease: "power2.in",
    });

    // ④ 놀라는 표정 (0.2초) - 눈 ㅡㅡ → oo (떨어지는 동시에)
    tl.to(
      eyesClosedRef.current,
      {
        opacity: 0,
        duration: 0.1,
      },
      "-=0.2"
    ).to(
      eyesOpenRef.current,
      {
        opacity: 1,
        duration: 0.1,
      },
      "<"
    );

    // ⑤ 최종 로고 정착 (0.5초) - 바운스
    tl.to(containerRef.current, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.out",
    }).to(containerRef.current, {
      scale: 1.0,
      duration: 0.3,
      ease: "bounce.out",
    });

    // ⑥ G0o0 잠깐 유지 (0.5초)
    tl.to({}, { duration: 0.5 });

    // ⑦ oO 부분 사라지기 (0.3초)
    tl.to(oRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
    });

    // ⑧ Gang Hyun 나타남 (0.6초) - 자연스럽게 GO가 왼쪽으로 밀림
    tl.to(nameRef.current, {
      opacity: 1,
      width: "auto",
      duration: 0.6,
      ease: "power2.out",
      onStart: () => {
        handleStarsActivate?.();
      },
    });

    // ⑨ 완성된 로고 유지 (1.5초)
    tl.to({}, {
      duration: 1.5,
      onComplete: () => {
        onComplete?.();
      },
    });

    return () => {
      tl.kill();
    };
  }, [onComplete, onStarsActivate]);

  return (
    <div className="relative flex items-center justify-center overflow-hidden w-full h-full">
      <div
        ref={containerRef}
        className="relative z-10 flex items-center justify-center scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100"
        style={{ transform: "translateY(-20px)" }}
      >
        <div ref={finalContainerRef} className="flex items-baseline gap-1">
          {/* G0o0 로고 */}
          <div
            ref={logoContainerRef}
            className="relative"
            style={{
              fontSize: "60px",
              fontWeight: "bold",
              fontFamily: "monospace",
              lineHeight: 1,
            }}
          >
            {/* G 부분 - 모자 */}
            <div
              ref={gRef}
              className="absolute text-white"
              style={{
                fontSize: "70px",
                left: "50px",
                top: "-45px",
                transform: "rotate(90deg)",
                transformOrigin: "center center",
              }}
            >
              G
            </div>

            {/* OoO 부분 */}
            <div
              className="relative text-white flex"
              style={{ letterSpacing: "0px" }}
            >
              {/* 빈 공간 (G가 들어갈 자리) */}
              <div style={{ width: "42px", visibility: "hidden" }}>G</div>

              {/* 실제 OoO */}
              <div className="relative">
                {/* 눈 감은 상태 (ㅡoㅡ) - 처음에 보임 */}
                <div
                  ref={eyesClosedRef}
                  style={{
                    opacity: 1,
                  }}
                >
                  <span style={{ fontSize: "20px" }}>-</span>
                  <span>o</span>
                  <span style={{ fontSize: "20px" }}>-</span>
                </div>

                {/* 눈 뜬 상태 (OoO) - 처음엔 숨김 */}
                <div
                  ref={eyesOpenRef}
                  className="absolute inset-0"
                  style={{
                    opacity: 0,
                  }}
                >
                  <span className="relative">
                    <span ref={firstOUpperRef}>O</span>
                    <span
                      ref={firstOLowerRef}
                      className="absolute inset-0"
                      style={{ opacity: 0 }}
                    >
                      o
                    </span>
                  </span>
                  <span ref={oRef}>oO</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gang Hyun 텍스트 */}
          <div
            ref={nameRef}
            className="text-white font-bold"
            style={{
              opacity: 0,
              fontSize: "60px",
              width: 0,
              overflow: "hidden",
              whiteSpace: "nowrap",
              fontFamily: "monospace",
            }}
          >
            Gang Hyun
          </div>
        </div>
      </div>
    </div>
  );
}
