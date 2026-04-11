import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors:{
            "primary-white": "#ffffff",
            "primary-black":"#000000",
            "primary-gray":{
                "100":"#FAFAFA",
                "200":"#F6F6F6",
                "300":"#EDEDED"
            }
        }
    },
  },
  plugins: [],
}

export default config