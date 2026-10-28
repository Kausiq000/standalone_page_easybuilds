Add-Type -AssemblyName System.Drawing

$srcDir = "c:\Users\Kausiq\Downloads\reactbits_hyperspeed_contact_intro\reactbits_hyperspeed_contact_intro\public\assets"
$outPath = Join-Path $srcDir "easybuilds_office_360.jpg"

$frontImg = [System.Drawing.Bitmap]::FromFile((Join-Path $srcDir "FRONT VIEW.png"))
$leftImg  = [System.Drawing.Bitmap]::FromFile((Join-Path $srcDir "LEFT SIDE.png"))
$rightImg = [System.Drawing.Bitmap]::FromFile((Join-Path $srcDir "RIGHT SIDE.png"))
$backImg  = [System.Drawing.Bitmap]::FromFile((Join-Path $srcDir "BACK SIDE.png"))

Write-Host "Loaded all 4 source images at native 1672x941."

$panoW = 4096
$panoH = 2048

# Use 100% NATIVE resolution: 1672 x 941
# ZERO stretching, ZERO scaling distortion!
$targetW = 1672
$targetH = 941
# Vertical placement: Y = 460 to Y = 1401 (leaves 460px ceiling headroom and 647px marble floor footroom)
$targetY = 460

Write-Host "Target view dimensions: ${targetW}x${targetH} at Y=$targetY (Exact 1:1 native pixels)"

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

function CreateNativeFeatheredView($srcBmp, $w, $h, $featherLeft, $featherRight, $featherTop, $featherBot) {
    $bmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gr = [System.Drawing.Graphics]::FromImage($bmp)
    $gr.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gr.DrawImage($srcBmp, 0, 0, $w, $h)
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
        if ($featherTop -gt 0 -and $y -lt $featherTop) {
            $vertFactor = [Math]::Sin(($y / $featherTop) * [Math]::PI / 2.0)
        } elseif ($featherBot -gt 0 -and $y -gt ($h - $featherBot)) {
            $vertFactor = [Math]::Sin((($h - 1 - $y) / $featherBot) * [Math]::PI / 2.0)
        }

        for ($x = 0; $x -lt $w; $x++) {
            $horizFactor = 1.0
            if ($featherLeft -gt 0 -and $x -lt $featherLeft) {
                $horizFactor = 0.5 * (1.0 - [Math]::Cos(($x / $featherLeft) * [Math]::PI))
            } elseif ($featherRight -gt 0 -and $x -gt ($w - $featherRight)) {
                $horizFactor = 0.5 * (1.0 + [Math]::Cos((($x - ($w - $featherRight)) / $featherRight) * [Math]::PI))
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

# 1. BACK SIDE: Center is at x = 0 and x = 4096 (180 degrees from front)
Write-Host "Rendering BACK SIDE..."
$backF = CreateNativeFeatheredView $backImg $targetW $targetH 280 280 40 50
$g.DrawImage($backF, (4096 - [int]($targetW / 2)), $targetY)
$g.DrawImage($backF, (- [int]($targetW / 2)), $targetY)
$backF.Dispose()

# 2. LEFT SIDE: Center is at x = 1024 (270 degrees)
Write-Host "Rendering LEFT SIDE..."
$leftF = CreateNativeFeatheredView $leftImg $targetW $targetH 280 180 40 50
$g.DrawImage($leftF, (1024 - [int]($targetW / 2)), $targetY)
$leftF.Dispose()

# 3. RIGHT SIDE: Center is at x = 3072 (90 degrees)
Write-Host "Rendering RIGHT SIDE..."
$rightF = CreateNativeFeatheredView $rightImg $targetW $targetH 180 280 40 50
$g.DrawImage($rightF, (3072 - [int]($targetW / 2)), $targetY)
$rightF.Dispose()

# 4. FRONT VIEW: Center is at x = 2048 (0 degrees - master view)
# Feather only outer 100px: preserves all 4 framed boards, EasyBuilds wordmark, laptop, 3 monitors, keyboard, mugs 100% solid!
Write-Host "Rendering FRONT VIEW with clean, unclipped, native 1:1 workstation..."
$frontF = CreateNativeFeatheredView $frontImg $targetW $targetH 100 100 35 45
$g.DrawImage($frontF, (2048 - [int]($targetW / 2)), $targetY)
$frontF.Dispose()

# Polish subtle cove warm glow line across ceiling
$covePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(60, 235, 180, 115)), 2.0
$g.DrawLine($covePen, 0, ($targetY + 8), $panoW, ($targetY + 8))
$covePen.Dispose()

# Floor base trim warm reflection line across entire 360 panorama
$floorPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(35, 218, 180, 124)), 1.8
$g.DrawLine($floorPen, 0, ($targetY + $targetH - 8), $panoW, ($targetY + $targetH - 8))
$floorPen.Dispose()

$g.Dispose()

# Save final high-quality JPEG (quality 95)
Write-Host "Saving $outPath..."
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 95L

$pano.Save($outPath, $codec, $encParams)
$pano.Dispose()

$frontImg.Dispose()
$leftImg.Dispose()
$rightImg.Dispose()
$backImg.Dispose()

$fi = Get-Item $outPath
Write-Host "Success! Native 1:1 panorama generated: $($fi.Length) bytes ($([math]::Round($fi.Length / 1MB, 2)) MB)"
