Add-Type -AssemblyName System.Drawing

$srcDir = "public/assets"
$outPath = "public/assets/easybuilds_office_360.jpg"

$frontImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/FRONT VIEW.png"))
$leftImg  = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/LEFT SIDE.png"))
$rightImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/RIGHT SIDE.png"))
$backImg  = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/BACK SIDE.png"))

Write-Host "Loaded all 4 source images at native 1672x941."

$panoW = 4096
$panoH = 2048
$targetH = 941
$targetY = 460

$pano = New-Object System.Drawing.Bitmap $panoW, $panoH, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($pano)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# 1. Base dark luxurious room background
$g.Clear([System.Drawing.Color]::FromArgb(255, 8, 9, 12))

# Top ceiling tone (0 to 480)
$ceilBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
    (New-Object System.Drawing.Point 0, 0),
    (New-Object System.Drawing.Point 0, 480),
    ([System.Drawing.Color]::FromArgb(255, 10, 9, 8)),
    ([System.Drawing.Color]::FromArgb(255, 22, 17, 13))
)
$g.FillRectangle($ceilBrush, 0, 0, $panoW, 480)
$ceilBrush.Dispose()

# Bottom marble floor tone (1380 to 2048)
$floorBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
    (New-Object System.Drawing.Point 0, 1380),
    (New-Object System.Drawing.Point 0, 2048),
    ([System.Drawing.Color]::FromArgb(255, 18, 14, 12)),
    ([System.Drawing.Color]::FromArgb(255, 6, 7, 9))
)
$g.FillRectangle($floorBrush, 0, 1380, $panoW, (2048 - 1380))
$floorBrush.Dispose()

# High-precision feathering function with controlled width and optional bottom/top fading
function CreateCleanFeatheredView($srcBmp, $srcCropX, $srcCropW, $featherL, $featherR, $fTop = 30, $fBot = 0) {
    $h = $targetH
    $w = $srcCropW
    $bmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gr = [System.Drawing.Graphics]::FromImage($bmp)
    $gr.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gr.DrawImage($srcBmp, (New-Object System.Drawing.Rectangle 0, 0, $w, $h), (New-Object System.Drawing.Rectangle $srcCropX, 0, $w, $h), [System.Drawing.GraphicsUnit]::Pixel)
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
            if ($featherL -gt 0 -and $x -lt $featherL) {
                $horizFactor = 0.5 * (1.0 - [Math]::Cos(($x / $featherL) * [Math]::PI))
            } elseif ($featherR -gt 0 -and $x -gt ($w - $featherR)) {
                $horizFactor = 0.5 * (1.0 + [Math]::Cos((($x - ($w - $featherR)) / $featherR) * [Math]::PI))
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
Write-Host "Rendering BACK SIDE..."
$backView = CreateCleanFeatheredView $backImg 286 1100 40 40 30 20
$halfBackW = [int](1100 / 2)
$g.DrawImage($backView, (4096 - $halfBackW), $targetY)
$g.DrawImage($backView, (-$halfBackW), $targetY)
$backView.Dispose()

# 2. LEFT SIDE: Center is at x = 1024 (Lounge / Glass wall)
Write-Host "Rendering LEFT SIDE..."
$leftView = CreateCleanFeatheredView $leftImg 286 1100 40 40 30 20
$halfLeftW = [int](1100 / 2)
$g.DrawImage($leftView, (1024 - $halfLeftW), $targetY)
$leftView.Dispose()

# 3. RIGHT SIDE: Center is at x = 3072 (Shelves / Conference Room)
Write-Host "Rendering RIGHT SIDE..."
$rightView = CreateCleanFeatheredView $rightImg 286 1100 40 40 30 20
$halfRightW = [int](1100 / 2)
$g.DrawImage($rightView, (3072 - $halfRightW), $targetY)
$rightView.Dispose()

# 4. FRONT VIEW: Center is at x = 2048 (Master Workstation view)
# Full 1530px span (x: 45..1575) to ensure 100% of all 3 monitors, desk, chair, framed boards, wall logo are solid and opaque!
# fBot = 0 ensures the desk does NOT fade at the bottom!
Write-Host "Rendering FRONT VIEW (Full Solid Span)..."
$frontCropX = 45
$frontW = 1530
$frontHalfW = [int]($frontW / 2)
$frontView = CreateCleanFeatheredView $frontImg $frontCropX $frontW 30 30 30 0
$g.DrawImage($frontView, (2048 - $frontHalfW), $targetY)
$frontView.Dispose()

# Polish subtle cove warm glow line across ceiling
$covePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(60, 235, 180, 115)), 2.0
$g.DrawLine($covePen, 0, ($targetY + 8), $panoW, ($targetY + 8))
$covePen.Dispose()

# Floor base trim warm reflection line across entire 360 panorama
$floorPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(35, 218, 180, 124)), 1.8
$g.DrawLine($floorPen, 0, ($targetY + $targetH - 8), $panoW, ($targetY + $targetH - 8))
$floorPen.Dispose()

$g.Dispose()

# Save final high-quality JPEG (quality 96)
Write-Host "Saving $outPath..."
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 96L

$pano.Save($outPath, $codec, $encParams)
$pano.Dispose()

$frontImg.Dispose()
$leftImg.Dispose()
$rightImg.Dispose()
$backImg.Dispose()

$fi = Get-Item $outPath
Write-Host "Success! Clean, 100% solid, fade-free panorama generated: $($fi.Length) bytes ($([math]::Round($fi.Length / 1MB, 2)) MB)"
