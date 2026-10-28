Add-Type -AssemblyName System.Drawing

$frontOriginal = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))
$genResized = [System.Drawing.Bitmap]::FromFile((Resolve-Path "scratch/gen_resized_550x591.jpg"))

# Create a copy of the front view
$w = $frontOriginal.Width
$h = $frontOriginal.Height
$frontClean = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($frontClean)
$g.DrawImage($frontOriginal, 0, 0, $w, $h)

# Coordinates of the crop in FRONT VIEW.png:
# $cropX = 100, $cropY = 350, $cropW = 550, $cropH = 591
$cropX = 100
$cropY = 350
$cropW = 550
$cropH = 591

# Lock bits on both to do precision pixel blending
$rectClean = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH
$dataClean = $frontClean.LockBits($rectClean, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$ptrClean = $dataClean.Scan0
$bytesClean = [Math]::Abs($dataClean.Stride) * $cropH
$rgbClean = New-Object byte[] $bytesClean
[System.Runtime.InteropServices.Marshal]::Copy($ptrClean, $rgbClean, 0, $bytesClean)

$rectGen = New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH
$dataGen = $genResized.LockBits($rectGen, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$ptrGen = $dataGen.Scan0
$bytesGen = [Math]::Abs($dataGen.Stride) * $cropH
$rgbGen = New-Object byte[] $bytesGen
[System.Runtime.InteropServices.Marshal]::Copy($ptrGen, $rgbGen, 0, $bytesGen)

$stride = $dataClean.Stride

# Compute blend mask (0.0 = original, 1.0 = generated inpaint without laptop)
for ($y = 0; $y -lt $cropH; $y++) {
    for ($x = 0; $x -lt $cropW; $x++) {
        $idx = $y * $stride + $x * 4

        # Determine weight for inpaint:
        # The laptop is located within x in [0..280], y in [130..430]
        $weight = 0.0

        if ($x -le 285 -and $y -ge 125 -and $y -le 435) {
            # Inside the laptop bounding region
            $weight = 1.0

            # Feather top boundary (y: 125..155) where plant leaves are
            if ($y -lt 155) {
                $weight *= ($y - 125) / 30.0
            }
            # Feather bottom boundary (y: 415..435) near desk front edge
            if ($y -gt 415) {
                $weight *= (435 - $y) / 20.0
            }
            # Feather right boundary (x: 235..285)
            # Above desk (y < 280), monitor is at x=235..245, so blend smoothly
            if ($x -gt 230) {
                $rightLimit = if ($y -lt 280) { 245 } else { 285 }
                $fadeStart = if ($y -lt 280) { 220 } else { 245 }
                if ($x -ge $rightLimit) {
                    $weight = 0.0
                } elseif ($x -gt $fadeStart) {
                    $weight *= ($rightLimit - $x) / ($rightLimit - $fadeStart)
                }
            }
            # Feather left boundary (x: 0..20) near window frame
            if ($x -lt 20) {
                $weight *= $x / 20.0
            }
        }

        if ($weight -gt 0.0) {
            if ($weight -gt 1.0) { $weight = 1.0 }
            $wGen = $weight
            $wOrig = 1.0 - $weight

            $b = [byte]([Math]::Round($rgbClean[$idx] * $wOrig + $rgbGen[$idx] * $wGen))
            $gCol = [byte]([Math]::Round($rgbClean[$idx + 1] * $wOrig + $rgbGen[$idx + 1] * $wGen))
            $r = [byte]([Math]::Round($rgbClean[$idx + 2] * $wOrig + $rgbGen[$idx + 2] * $wGen))

            $rgbClean[$idx] = $b
            $rgbClean[$idx + 1] = $gCol
            $rgbClean[$idx + 2] = $r
        }
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($rgbClean, 0, $ptrClean, $bytesClean)
$frontClean.UnlockBits($dataClean)
$genResized.UnlockBits($dataGen)

$g.Dispose()

# Save preview of the crop area
$preview = New-Object System.Drawing.Bitmap 700, 600
$gp = [System.Drawing.Graphics]::FromImage($preview)
$gp.DrawImage($frontClean, (New-Object System.Drawing.Rectangle 0, 0, 700, 600), (New-Object System.Drawing.Rectangle 50, 300, 700, 600), [System.Drawing.GraphicsUnit]::Pixel)
$gp.Dispose()
$preview.Save("scratch/front_clean_preview.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$preview.Dispose()

# Save updated full front view PNG
$frontClean.Save("scratch/FRONT_VIEW_CLEAN.png", [System.Drawing.Imaging.ImageFormat]::Png)

$frontClean.Dispose()
$frontOriginal.Dispose()
$genResized.Dispose()

Write-Host "Success! Created scratch/front_clean_preview.jpg and scratch/FRONT_VIEW_CLEAN.png"
