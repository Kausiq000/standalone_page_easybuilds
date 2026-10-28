Add-Type -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public class FrontViewPatcher
{
    public static void PatchFrontView(string frontOrigPath, string inpaintGenPath, string backupPath, string outPath, string previewPath)
    {
        // 1. Backup original front view
        if (!System.IO.File.Exists(backupPath))
        {
            System.IO.File.Copy(frontOrigPath, backupPath, true);
        }

        using (Bitmap frontOrig = new Bitmap(frontOrigPath))
        using (Bitmap inpaintGen = new Bitmap(inpaintGenPath))
        {
            int cropX = 60;
            int cropY = 340;
            int cropW = 660;
            int cropH = 600;

            // Inpaint source resized to 660x600 in 32bpp Argb
            using (Bitmap inpaintResized = new Bitmap(cropW, cropH, PixelFormat.Format32bppArgb))
            using (Graphics gIn = Graphics.FromImage(inpaintResized))
            {
                gIn.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                gIn.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                gIn.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
                gIn.DrawImage(inpaintGen, new Rectangle(0, 0, cropW, cropH), new Rectangle(0, 0, inpaintGen.Width, inpaintGen.Height), GraphicsUnit.Pixel);

                // Clone frontOrig in 32bpp Argb
                using (Bitmap result = new Bitmap(frontOrig.Width, frontOrig.Height, PixelFormat.Format32bppArgb))
                using (Graphics gRes = Graphics.FromImage(result))
                {
                    gRes.DrawImage(frontOrig, 0, 0, frontOrig.Width, frontOrig.Height);

                    Rectangle targetRect = new Rectangle(cropX, cropY, cropW, cropH);
                    BitmapData dataRes = result.LockBits(targetRect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
                    BitmapData dataIn = inpaintResized.LockBits(new Rectangle(0, 0, cropW, cropH), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);

                    int strideRes = dataRes.Stride;
                    int strideIn = dataIn.Stride;

                    byte[] bufRes = new byte[Math.Abs(strideRes) * cropH];
                    byte[] bufIn = new byte[Math.Abs(strideIn) * cropH];

                    Marshal.Copy(dataRes.Scan0, bufRes, 0, bufRes.Length);
                    Marshal.Copy(dataIn.Scan0, bufIn, 0, bufIn.Length);

                    // Blend mask:
                    // In the 660x600 crop:
                    // Laptop was located at:
                    // X in crop: ~15 to ~380
                    // Y in crop: ~120 to ~430
                    // Beyond x=380 is the mug (x~385), notepad (x~370, y~380..), monitor (x~280..).
                    // Left edge x: 0..15 is the plant pot rim and credenza edge.
                    for (int y = 0; y < cropH; y++)
                    {
                        for (int x = 0; x < cropW; x++)
                        {
                            int idxRes = y * strideRes + x * 4;
                            int idxIn = y * strideIn + x * 4;

                            double weight = 0.0;

                            // Bounding region around laptop
                            if (x >= 0 && x <= 440 && y >= 110 && y <= 450)
                            {
                                weight = 1.0;

                                // Top feathering (y: 110..150)
                                if (y < 150)
                                    weight *= (y - 110.0) / 40.0;

                                // Bottom feathering (y: 425..450)
                                if (y > 425)
                                    weight *= (450.0 - y) / 25.0;

                                // Left feathering (x: 0..25) near plant pot rim
                                if (x < 25)
                                    weight *= x / 25.0;

                                // Right feathering:
                                // Above desk (y < 280), laptop screen overlaps monitor up to x=295.
                                // Blend smoothly from x=285 to x=302 onto monitor bezel.
                                if (y < 280)
                                {
                                    if (x >= 302) weight = 0.0;
                                    else if (x > 285) weight *= (302.0 - x) / 17.0;
                                }
                                else
                                {
                                    // On the desk (y >= 280 in crop, i.e. y_front >= 620)
                                    // Between mug (ends y_crop=330) and notepad (starts y_crop=380),
                                    // the laptop right corner extends to x_front=470 (x_crop=410).
                                    double rightLim;
                                    double rightStart;

                                    if (y >= 330 && y <= 385)
                                    {
                                        // Between mug and notepad: empty desk to right of corner
                                        rightLim = 428.0;
                                        rightStart = 412.0;
                                    }
                                    else
                                    {
                                        // Below mug or above notepad: stops cleanly before them
                                        rightLim = 350.0;
                                        rightStart = 330.0;
                                    }

                                    if (x >= rightLim) weight = 0.0;
                                    else if (x > rightStart) weight *= (rightLim - x) / (rightLim - rightStart);
                                }
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
                    inpaintResized.UnlockBits(dataIn);

                    // Save result image to outPath
                    result.Save(outPath, ImageFormat.Png);

                    // Save preview for visual inspection
                    using (Bitmap prev = new Bitmap(800, 650, PixelFormat.Format32bppArgb))
                    using (Graphics gp = Graphics.FromImage(prev))
                    {
                        gp.DrawImage(result, new Rectangle(0, 0, 800, 650), new Rectangle(40, 310, 800, 650), GraphicsUnit.Pixel);
                        prev.Save(previewPath, ImageFormat.Jpeg);
                    }
                }
            }
        }
    }
}
"@ -ReferencedAssemblies System.Drawing

$frontSrc = (Resolve-Path "public/assets/FRONT VIEW.png").Path
$backupPath = "$PSScriptRoot\FRONT_VIEW_ORIGINAL_BACKUP.png"
$inpaintGen = "C:\Users\Kausiq\.gemini\antigravity-ide\brain\70ef9b1b-1e4e-47c8-bbea-7c8eb325c88b\desk_no_laptop_full_1793093205889.jpg"
$outClean = "$PSScriptRoot\FRONT_VIEW_NO_LAPTOP.png"
$previewPath = "$PSScriptRoot\front_view_no_laptop_preview.jpg"

[FrontViewPatcher]::PatchFrontView($frontSrc, $inpaintGen, $backupPath, $outClean, $previewPath)

Write-Host "FrontViewPatcher completed successfully!"
