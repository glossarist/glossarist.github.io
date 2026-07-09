<template>
  <div class="logo-merge">
    <svg viewBox="0 0 920 260" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ml" gradientUnits="userSpaceOnUse" x1="205" y1="0" x2="370" y2="0">
          <stop offset="0%" stop-color="#456399"/>
          <stop offset="60%" stop-color="#34798a"/>
          <stop offset="100%" stop-color="#3fb6b0"/>
        </linearGradient>
        <linearGradient id="mr" gradientUnits="userSpaceOnUse" x1="545" y1="0" x2="710" y2="0">
          <stop offset="0%" stop-color="#3a5c80"/>
          <stop offset="40%" stop-color="#34798a"/>
          <stop offset="100%" stop-color="#7ee0d4"/>
        </linearGradient>
        <marker id="ah-l" viewBox="0 0 10 8" refX="9" refY="4" markerWidth="9" markerHeight="7" orient="auto">
          <path d="M0,0.5 L9,4 L0,7.5z" fill="#3fb6b0"/>
        </marker>
        <marker id="ah-r" viewBox="0 0 10 8" refX="9" refY="4" markerWidth="9" markerHeight="7" orient="auto">
          <path d="M0,0.5 L9,4 L0,7.5z" fill="#3a5c80"/>
        </marker>
      </defs>

      <!-- Left: Han icon (文) -->
      <image class="merge-img-han" href="/logo-glossarist_icon-han.svg" x="20" y="20" width="150" height="142"/>

      <!-- Left curved arrow -->
      <path d="M195,100 C255,40 325,40 375,100" class="merge-arrow" stroke="url(#ml)" stroke-width="2.5" fill="none" marker-end="url(#ah-l)"/>

      <!-- Center: Full Glossarist logo -->
      <image href="/logo-glossarist.svg" x="390" y="10" width="155" height="146"/>

      <!-- Right curved arrow -->
      <path d="M720,100 C660,40 590,40 540,100" class="merge-arrow" stroke="url(#mr)" stroke-width="2.5" fill="none" marker-end="url(#ah-r)"/>

      <!-- Right: Greek icon (ΓΛ) -->
      <image class="merge-img-greek" href="/logo-glossarist_icon-greek.svg" x="740" y="20" width="150" height="142"/>

      <!-- Labels -->
      <text x="95" y="200" text-anchor="middle" class="merge-lbl-wen" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" fill="#2d4164">文</text>
      <text x="95" y="220" text-anchor="middle" class="merge-sub-wen" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="500" fill="#4977a4">Pattern · Culture · Writing</text>

      <text x="467" y="196" text-anchor="middle" class="merge-lbl-logo" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" letter-spacing="0.08em" fill="#97a4b7">ONE MARK</text>

      <text x="815" y="200" text-anchor="middle" class="merge-lbl-gl" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" fill="#3fb6b0">ΓΛ</text>
      <text x="815" y="220" text-anchor="middle" class="merge-sub-gl" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="500" fill="#60abbc">Greek letters · γλωσσάριον</text>
    </svg>
  </div>
</template>
