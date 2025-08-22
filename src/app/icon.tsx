import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: '#EDF2E8', // A background color matching the theme
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px', // Rounded corners for the background
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#70964F" // Primary color
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
            <path d="M7 20h10" />
            <path d="M10 20c0-3.3 1-6.5 3-8a5 5 0 0 1 5-8" />
            <path d="M14 20c0-3.3-1-6.5-3-8a5 5 0 0 0-5-8" />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  )
}
