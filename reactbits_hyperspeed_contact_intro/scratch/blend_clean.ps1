Add-Type -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public class ImageBlender
{
    public static void BlendInpaint(string origPath, string inpaintPath, string outPath, string previewPath)
    {
        using (Bitmap orig = new Bitmap(origPath))
        using (Bitmap inpaintGen = new Bitmap(inpaintPath))
        {
            int cropX = 100;
            int cropY = 350;
            int cropW = 550;
            int cropH = 591;

            // Inpaint source resized to 550x591 in 32bpp Argb
            using (Bitmap inpaint32 = new Bitmap(cropW, cropH, PixelFormat.Format32bppArgb))
            using (Graphics gIn = Graphics.FromImage(inpaint32))
            {
                gIn.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                gIn.DrawImage(inpaintGen, new Rectangle(0, 0, cropW, cropH), new Rectangle(0, 0, inpaintGen.Width, inpaintGen.Height), GraphicsUnit.Pixel);

                // Clone orig in 32bpp Argb
                using (Bitmap result = new Bitmap(orig.Width, orig.Height, PixelFormat.Format32bppArgb))
                using (Graphics gRes = Graphics.FromImage(result))
                {
                    gRes.DrawImage(orig, 0, 0, orig.Width, orig.Height);

                    // Lock bits for both in Format32bppArgb
                    Rectangle targetRect = new Rectangle(cropX, cropY, cropW, cropH);
                    BitmapData dataRes = result.LockBits(targetRect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
                    BitmapData dataIn = inpaint32.LockBits(new Rectangle(0, 0, cropW, cropH), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);

                    int strideRes = dataRes.Stride;
                    int strideIn = dataIn.Stride;

                    byte[] bufRes = new byte[Math.Abs(strideRes) * cropH];
                    byte[] bufIn = new byte[Math.Abs(strideIn) * cropH];

                    Marshal.Copy(dataRes.Scan0, bufRes, 0, bufRes.Length);
                    Marshal.Copy(dataIn.Scan0, bufIn, 0, bufIn.Length);

                    for (int y = 0; y < cropH; y++)
                    {
                        for (int x = 0; x < cropW; x++)
                        {
                            int idxRes = y * strideRes + x * 4;
                            int idxIn = y * strideIn + x * 4;

                            // The laptop was located in x: [0..290], y: [130..430]
                            double weight = 0.0;

                            if (x <= 285 && y >= 125 && y <= 435)
                            {
                                weight = 1.0;

                                // Top feathering near plant leaves (y: 125..155)
                                if (y < 155)
                                    weight *= (y - 125.0) / 30.0;

                                // Bottom feathering near desk front bevel (y: 415..435)
                                if (y > 415)
                                    weight *= (435.0 - y) / 20.0;

                                // Right feathering near monitor bezel (y < 280) and mug (y >= 280)
                                if (x > 225)
                                {
                                    double rightLim = (y < 280) ? 245.0 : 285.0;
                                    double rightStart = (y < 280) ? 220.0 : 255.0;

                                    if (x >= rightLim)
                                        weight = 0.0;
                                    else if (x > rightStart)
                                        weight *= (rightLim - x) / (rightLim - rightStart);
                                }

                                // Left feathering near window mullion (x: 0..20)
                                if (x < 20)
                                    weight *= x / 20.0;
                            }

                            if (weight > 0.0)
                            {
                                if (weight > 1.0) weight = 1.0;
                                double wOrig = 1.0 - weight;

                                byte b = (byte)Math.Round(bufRes[idxRes + 0] * wOrig + bufIn[idxIn + 0] * weight);
                                byte g = (byte)Math.Round(bufRes[idxRes + 1] * wOrig + bufIn[idxIn + 1] * weight);
                                byte r = (byte)Math.Round(bufRes[idxRes + 2] * wOrig + bufIn[idxIn + 2] * weight);

                                bufRes[idxRes + 0] = b;
                                bufRes[idxRes + 1] = g;
                                bufRes[idxRes + 2] = r;
                            }
                        }
                    }

                    Marshal.Copy(bufRes, 0, dataRes.Scan0, bufRes.Length);
                    result.UnlockBits(dataRes);
                    inpaint32.UnlockBits(dataIn);

                    // Save result image
                    result.Save(outPath, ImageFormat.Png);

                    // Save cropped preview for visual inspection
                    using (Bitmap prev = new Bitmap(750, 600, PixelFormat.Format32bppArgb))
                    using (Graphics gp = Graphics.FromImage(prev))
                    {
                        gp.DrawImage(result, new Rectangle(0, 0, 750, 600), new Rectangle(50, 300, 750, 600), GraphicsUnit.Pixel);
                        prev.Save(previewPath, ImageFormat.Jpeg);
                    }
                }
            }
        }
    }
}
"@ -ReferencedAssemblies System.Drawing

$scratchDir = (Resolve-Path "scratch").Path
$frontSrc = (Resolve-Path "public/assets/FRONT VIEW.png").Path
$inpaintSrc = "C:\Users\Kausiq\.gemini\antigravity-ide\brain\70ef9b1b-1e4e-47c8-bbea-7c8eb325c88b\desk_no_laptop_1793092811654.jpg"

[ImageBlender]::BlendInpaint(
    $frontSrc,
    $inpaintSrc,
    "$scratchDir\FRONT_VIEW_CLEAN.png",
    "$scratchDir\front_clean_preview2.jpg"
)

Write-Host "ImageBlender completed successfully!"
