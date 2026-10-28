Add-Type -AssemblyName System.Drawing

$srcDir = "public/assets"

$frontImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/FRONT VIEW.png"))
$leftImg  = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/LEFT SIDE.png"))
$rightImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/RIGHT SIDE.png"))
$backImg  = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/BACK SIDE.png"))

$panoW = 4096
$panoH = 2048
$targetH = 941
$targetY = 460

$pano = New-Object System.Drawing.Bitmap $panoW, $panoH, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($pano)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Clear with dark obsidian
$g.Clear([System.Drawing.Color]::FromArgb(255, 8, 9, 12))

# Ceiling gradient
$ceilBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
    (New-Object System.Drawing.Point 0, 0),
    (New-Object System.Drawing.Point 0, 480),
    ([System.Drawing.Color]::FromArgb(255, 10, 9, 8)),
    ([System.Drawing.Color]::FromArgb(255, 22, 17, 13))
)
$g.FillRectangle($ceilBrush, 0, 0, $panoW, 480)
$ceilBrush.Dispose()

# Floor gradient
$floorBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
    (New-Object System.Drawing.Point 0, 1380),
    (New-Object System.Drawing.Point 0, 2048),
    ([System.Drawing.Color]::FromArgb(255, 18, 14, 12)),
    ([System.Drawing.Color]::FromArgb(255, 6, 7, 9))
)
$g.FillRectangle($floorBrush, 0, 1380, $panoW, (2048 - 1380))
$floorBrush.Dispose()

# Clean Feathered view helper
function CreateFeatheredBlock($srcBmp, $srcX, $srcW, $fL, $fR, $fTop = 30, $fBot = 0) {
    $h = $targetH
    $w = $srcW
    $bmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gr = [System.Drawing.Graphics]::FromImage($bmp)
    $gr.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gr.DrawImage($srcBmp, (New-Object System.Drawing.Rectangle 0, 0, $w, $h), (New-Object System.Drawing.Rectangle $srcX, 0, $w, $h), [System.Drawing.GraphicsUnit]::Pixel)
    $gr.Dispose()

    $rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
    $data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $ptr = $data.Scan0
    $bytes = [Math]::Abs($data.Stride) * $h
    $rgbValues = New-Object byte[] $bytes
    [System.Runtime.InteropServices.Marshal]::Copy($ptr, $rgbValues, 0, $bytes)
    $stride = $data.Stride

    for ($y = 0; $y -lt $h; $y++) {
        $vertFactor = 1.0
        if ($fTop -gt 0 -and $y -lt $fTop) {
            $vertFactor = [Math]::Sin(($y / $fTop) * [Math]::PI / 2.0)
        } elseif ($fBot -gt 0 -and $y -gt ($h - $fBot)) {
            $vertFactor = [Math]::Sin((($h - 1 - $y) / $fBot) * [Math]::PI / 2.0)
        }

        for ($x = 0; $x -lt $w; $x++) {
            $horizFactor = 1.0
            if ($fL -gt 0 -and $x -lt $fL) {
                $horizFactor = 0.5 * (1.0 - [Math]::Cos(($x / $fL) * [Math]::PI))
            } elseif ($fR -gt 0 -and $x -gt ($w - $fR)) {
                $horizFactor = 0.5 * (1.0 + [Math]::Cos((($x - ($w - $fR)) / $fR) * [Math]::PI))
            }

            $idx = $y * $stride + $x * 4
            $origA = $rgbValues[$idx + 3]
            $alpha = [int]($origA * $horizFactor * $vertFactor)
            if ($alpha -gt 255) { $alpha = 255 }
            if ($alpha -lt 0) { $alpha = 0 }
            $rgbValues[$idx + 3] = [byte]$alpha
        }
    }

    [System.Runtime.InteropServices.Marshal]::Copy($rgbValues, 0, $ptr, $bytes)
    $bmp.UnlockBits($data)
    return $bmp
}

# 1. BACK SIDE: Center is at x = 0 / 4096 (Whiteboard wall)
$backW = 1100
$halfBackW = [int]($backW / 2)
$backView = CreateFeatheredBlock $backImg 286 $backW 40 40 30 20
$g.DrawImage($backView, (4096 - $halfBackW), $targetY)
$g.DrawImage($backView, (-$halfBackW), $targetY)
$backView.Dispose()

# 2. LEFT SIDE (Lounge / Window wall):
# In LEFT SIDE, from x = 286 to x = 1040 is the lounge and window up to the mullion
$leftCropX = 286
$leftW = 1040 - 286 # 754
$leftView = CreateFeatheredBlock $leftImg $leftCropX $leftW 35 3 30 20
$leftPanoX = 515
$g.DrawImage($leftView, $leftPanoX, $targetY)
$leftView.Dispose()
$leftEndPanoX = $leftPanoX + $leftW # 515 + 754 = 1269

# 3. FRONT VIEW (Master Workstation):
# Starts at x = 75 in FRONT VIEW (the exact vertical black window mullion)
# Ends at x = 1660 in FRONT VIEW (the exact right vertical bookcase upright)
# Front width = 1660 - 75 = 1585
$frontCropX = 75
$frontW = 1660 - 75 # 1585
$frontView = CreateFeatheredBlock $frontImg $frontCropX $frontW 3 3 30 0
$frontPanoX = $leftEndPanoX # 1269
$g.DrawImage($frontView, $frontPanoX, $targetY)
$frontView.Dispose()
$frontEndPanoX = $frontPanoX + $frontW # 1269 + 1585 = 2854

# 4. RIGHT SIDE (Conference Room & Hallway):
# Starts at x = 398 in RIGHT SIDE (the fluted column and glass conference partition)
# Ends at x = 1386 (width 988)
# Drawn starting at x = 2854
$rightCropX = 398
$rightW = 1386 - 398 # 988
$rightView = CreateFeatheredBlock $rightImg $rightCropX $rightW 3 35 30 20
$rightPanoX = $frontEndPanoX # 2854
$g.DrawImage($rightView, $rightPanoX, $targetY)
$rightView.Dispose()
$rightEndPanoX = $rightPanoX + $rightW # 2854 + 988 = 3842

# Polish cove lines
$covePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(60, 235, 180, 115)), 2.0
$g.DrawLine($covePen, 0, ($targetY + 8), $panoW, ($targetY + 8))
$covePen.Dispose()

$floorPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(35, 218, 180, 124)), 1.8
$g.DrawLine($floorPen, 0, ($targetY + $targetH - 8), $panoW, ($targetY + $targetH - 8))
$floorPen.Dispose()

$g.Dispose()

# Save final panorama
$outPanoPath = "public/assets/easybuilds_office_360.jpg"
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 96L
$pano.Save($outPanoPath, $codec, $encParams)
Write-Host "Saved panorama to $outPanoPath successfully!"

# Save inspection crops
$s1 = New-Object System.Drawing.Bitmap 600, 500
$g1 = [System.Drawing.Graphics]::FromImage($s1)
$g1.DrawImage($pano, (New-Object System.Drawing.Rectangle 0, 0, 600, 500), (New-Object System.Drawing.Rectangle 1000, 500, 600, 500), [System.Drawing.GraphicsUnit]::Pixel)
$g1.Dispose()
$s1.Save("scratch/final_seam1.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$s1.Dispose()

$s2 = New-Object System.Drawing.Bitmap 600, 500
$g2 = [System.Drawing.Graphics]::FromImage($s2)
$g2.DrawImage($pano, (New-Object System.Drawing.Rectangle 0, 0, 600, 500), (New-Object System.Drawing.Rectangle 2600, 500, 600, 500), [System.Drawing.GraphicsUnit]::Pixel)
$g2.Dispose()
$s2.Save("scratch/final_seam2.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$s2.Dispose()

$pano.Dispose()
$frontImg.Dispose()
$leftImg.Dispose()
$rightImg.Dispose()
$backImg.Dispose()
Write-Host "Completed panorama creation!"
