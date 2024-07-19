import sharp from "sharp";

export class BadgeService {

    // To determine if a color is "happy" based on its RGB values
    async isHappyColor(r: number, g: number, b: number): Promise<Boolean> {
        return (r > 200 && g > 200) || (r > 200 && b > 200) || (g > 200 && b > 200);
    }

    // To verify if the badge image meets the specified criteria
    async verifyBadge(imagePath: string): Promise<[Boolean, String]> {

        // Get image metadata
        const {width, height, channels} = await sharp(imagePath).metadata();

        // Check if image size is 512x512 pixels
        if (width !== 512 || height !== 512) {
            return [false, "Size is not 512x512."];
        }

        // Create a circular mask
        const circleMask = await sharp({
            create: {
                width: 512,
                height: 512,
                channels: 4,
                background: {r: 0, g: 0, b: 0, alpha: 0}
            }
        })
            .composite([{
                input: Buffer.from(
                    `<svg><circle cx="256" cy="256" r="256" fill="white"/></svg>`
                ),
                blend: 'over'
            }])
            .raw()
            .toBuffer();

        // Read and resize the input image
        const img = await sharp(imagePath)
            .resize(512, 512)
            .raw()
            .toBuffer();

        // Check that pixels outside the circle are transparent
        for (let y = 0; y < 512; y++) {
            for (let x = 0; x < 512; x++) {
                const dx = x - 256;
                const dy = y - 256;
                const distanceSquared = dx * dx + dy * dy;
                // @ts-ignore
                const index = (y * 512 + x) * channels;

                if (distanceSquared > 256 * 256) {
                    if (img[index + 3] !== 0) {
                        console.log(`Non-transparent pixel found at x=${x}, y=${y}, index=${index}, alpha=${img[index + 3]}`);
                        return [false, "Non-transparent pixels found outside the circle."];
                    }
                }
            }
        }

        // Check for at least one "happy" color within the circle
        const colors = new Set<string>();
        // @ts-ignore
        for (let i = 0; i < img.length; i += channels) {
            const [r, g, b, a] = img.slice(i, i + 4);
            if (a !== 0 && await this.isHappyColor(r, g, b)) {
                colors.add(`${r},${g},${b}`);
            }
        }

        if (colors.size === 0) {
            return [false, "The badge colors do not give a 'happy' feeling."];
        }

        return [true, "The badge is valid."];
    }

    // Function to convert any image to the specified circular badge format
    async convertImageToBadge(imagePath: string, outputPath: string) {
        const circleMask = await sharp({
            create: {
                width: 512,
                height: 512,
                channels: 4,
                background: {r: 0, g: 0, b: 0, alpha: 0}
            }
        })
            .composite([{
                input: Buffer.from(
                    `<svg><circle cx="256" cy="256" r="256" fill="white"/></svg>`
                ),
                blend: 'over'
            }])
            .png()
            .toBuffer();

        await sharp(imagePath)
            .resize(512, 512)
            .composite([{input: circleMask, blend: 'dest-in'}])
            .toFile(outputPath);
    }
}