Add-Type -AssemblyName System.Drawing

$origPath = "public/assets/LEFT SIDE.png"
$genPath  = "C:\Users\Kausiq\.gemini\antigravity-ide\brain\70ef9b1b-1e4e-47c8-bbea-7c8eb325c88b\left_side_clean_1793098271076.jpg"

$origBmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $origPath))
$genBmp  = [System.Drawing.Bitmap]::FromFile($genPath)

$w = $origBmp.Width  # 1672
$h = $origBmp.Height # 941

# 1. Scale genBmp to exact 1672 x 941 using high-quality bicubic
$scaledGen = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gs = [System.Drawing.Graphics]::FromImage($scaledGen)
$gs.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gs.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gs.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gs.DrawImage($genBmp, (New-Object System.Drawing.Rectangle 0, 0, $w, $h))
$gs.Dispose()

# 2. Composite: from x = 0 to 200, take scaledGen; from x = 200 to 260, smooth cosine blend into origBmp; from x = 260 to 1672, keep 100% origBmp!
$blendStart = 200
$blendEnd   = 260
$blendW     = $blendEnd - $blendStart

$outBmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
$outData = $outBmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$genData = $scaledGen.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$origData = $origBmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$bytes = [Math]::Abs($outData.Stride) * $h
$outBytes = New-Object byte[] $bytes
$genBytes = New-Object byte[] $bytes
$origBytes = New-Object byte[] $bytes

[System.Runtime.InteropServices.Marshal]::Copy($genData.Scan0, $genBytes, 0, $bytes)
[System.Runtime.InteropServices.Marshal]::Copy($origData.Scan0, $origBytes, 0, $bytes)

$stride = $outData.Stride

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $idx = $y * $stride + $x * 4

        if ($x -lt $blendStart) {
            # 100% Clean Generated (no planter)
            $outBytes[$idx]     = $genBytes[$idx]
            $outBytes[$idx + 1] = $genBytes[$idx + 1]
            $outBytes[$idx + 2] = $genBytes[$idx + 2]
            $outBytes[$idx + 3] = 255
        } elseif ($x -lt $blendEnd) {
            # Smooth S-curve blend from Clean to Original
            $t = ($x - $blendStart) / $blendW
            $wOrig = 0.5 * (1.0 - [Math]::Cos($t * [Math]::PI))
            $wGen  = 1.0 - $wOrig

            $b = [int]($genBytes[$idx] * $wGen + $origBytes[$idx] * $wOrig)
            $g = [int]($genBytes[$idx + 1] * $wGen + $origBytes[$idx + 1] * $wOrig)
            $r = [int]($genBytes[$idx + 2] * $wGen + $origBytes[$idx + 2] * $wOrig)

            $outBytes[$idx]     = [byte][Math]::Min(255, [Math]::Max(0, $b))
            $outBytes[$idx + 1] = [byte][Math]::Min(255, [Math]::Max(0, $g))
            $outBytes[$idx + 2] = [byte][Math]::Min(255, [Math]::Max(0, $r))
            $outBytes[$idx + 3] = 255
        } else {
            # 100% Original
            $outBytes[$idx]     = $origBytes[$idx]
            $outBytes[$idx + 1] = $origBytes[$idx + 1]
            $outBytes[$idx + 2] = $origBytes[$idx + 2]
            $outBytes[$idx + 3] = 255
        }
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($outBytes, 0, $outData.Scan0, $bytes)

$outBmp.UnlockBits($outData)
$scaledGen.UnlockBits($genData)
$origBmp.UnlockBits($origData)

# Save test output
$outBmp.Save("scratch/LEFT_SIDE_PERFECT.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Save inspection crop of the cleaned corner x: 0..450
$crop = New-Object System.Drawing.Bitmap 450, $h
$gc = [System.Drawing.Graphics]::FromImage($crop)
$gc.DrawImage($outBmp, (New-Object System.Drawing.Rectangle 0, 0, 450, $h), (New-Object System.Drawing.Rectangle 0, 0, 450, $h), [System.Drawing.GraphicsUnit]::Pixel)
$gc.Dispose()
$crop.Save("scratch/left_side_perfect_inspect.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()

$scaledGen.Dispose()
$outBmp.Dispose()
$origBmp.Dispose()
$genBmp.Dispose()

Write-Host "Completed blend and saved scratch/left_side_perfect_inspect.jpg"
