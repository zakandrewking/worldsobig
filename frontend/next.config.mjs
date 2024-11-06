/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, {}) => {
    config.module.rules.push({
      test: /\.(frag|vert|glsl)$/,
      use: [
        {
          loader: "glsl-shader-loader",
          options: {},
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
