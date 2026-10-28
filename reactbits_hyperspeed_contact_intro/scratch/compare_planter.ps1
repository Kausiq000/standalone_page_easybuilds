Add-Type -AssemblyName System.Drawing

$origPath = "public/assets/LEFT SIDE.png"
$genPath  = "C:\Users\Kausiq\.gemini\antigravity-ide\brain\70ef9b1b-1e4e-47c8-bbea-7c8eb325c88b\left_side_clean_1793098271076.jpg"

$origBmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $origPath))
$genBmp  = [System.Drawing.Bitmap]::FromFile($genPath)

$w = $origBmp.Width  # 1672
$h = $origBmp.Height # 941

# Save scaled clean image
$scaledGen = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gs = [System.Drawing.Graphics]::FromImage($scaledGen)
$gs.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gs.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gs.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gs.DrawImage($genBmp, (New-Object System.Drawing.Rectangle 0, 0, $w, $h))
$gs.Dispose()

$scaledGen.Save("scratch/LEFT_SIDE_FULL_CLEAN.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Make a side-by-side comparison:
# Left half of comparison = Left 500px of scaledGen (clean, no planter)
# Right half of comparison = Original Left 500px (with planter)
$comp = New-Object System.Drawing.Bitmap 1000, $h
$gc = [System.Drawing.Graphics]::FromImage($comp)
$gc.DrawImage($scaledGen, (New-Object System.Drawing.Rectangle 0, 0, 500, $h), (New-Object System.Drawing.Rectangle 0, 0, 500, $h), [System.Drawing.GraphicsUnit]::Pixel)
$gc.DrawImage($origBmp, (New-Object System.Drawing.Rectangle 500, 0, 500, $h), (New-Object System.Drawing.Rectangle 0, 0, 500, $h), [System.Drawing.GraphicsUnit]::Pixel)

$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Yellow), 2
$gc.DrawLine($pen, 500, 0, 500, $h)
$pen.Dispose()
$gc.Dispose()

$comp.Save("scratch/planter_before_after.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$comp.Dispose()
$scaledGen.Dispose()
$origBmp.Dispose()
$genBmp.Dispose()

Write-Host "Saved scratch/planter_before_after.jpg"
