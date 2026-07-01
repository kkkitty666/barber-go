"use client";

import ShapeGrid from "./ShapeGrid";

export function BackgroundGrid() {
  return (
    <>
      <div className="shapegrid-container" aria-hidden>
        <ShapeGrid
          speed={0.2}
          squareSize={58}
          direction="diagonal"
          borderColor="#2a2a2a"
          hoverFillColor="#5a5a5a"
          shape="square"
          hoverTrailAmount={0}
        />
      </div>
      <div className="shapegrid-overlay" aria-hidden />
    </>
  );
}
